import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../components/AuthContext';
import { Plus, Trash2, Edit2, Star, Target, Heart, Link as LinkIcon, Image as ImageIcon, Archive, ArchiveRestore, Upload, Bold, Italic, Underline, List } from 'lucide-react';
import type { Id } from '../../../convex/_generated/dataModel';

// ─── Lightweight Rich Text Editor ────────────────────────────────────────────
function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync initial value
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);  // eslint-disable-line

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || '');
  };

  const ToolBtn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200">
        <ToolBtn onClick={() => exec('bold')} title="Bold"><Bold className="h-4 w-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('italic')} title="Italic"><Italic className="h-4 w-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('underline')} title="Underline"><Underline className="h-4 w-4" /></ToolBtn>
        <div className="w-px h-5 bg-slate-300 mx-1" />
        <ToolBtn onClick={() => exec('insertUnorderedList')} title="Bullet List"><List className="h-4 w-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('insertOrderedList')} title="Numbered List">
          <span className="text-xs font-black">1.</span>
        </ToolBtn>
        <div className="w-px h-5 bg-slate-300 mx-1" />
        <ToolBtn onClick={() => exec('removeFormat')} title="Clear Formatting">
          <span className="text-xs font-black text-slate-400">T×</span>
        </ToolBtn>
      </div>
      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        className="min-h-[120px] max-h-64 overflow-y-auto px-4 py-3 text-sm text-brand-navy font-medium focus:outline-none bg-white prose prose-sm"
        style={{ lineHeight: 1.7 }}
        data-placeholder="Why are they riding? Tell their story..."
      />
      <style>{`[contenteditable]:empty:before { content: attr(data-placeholder); color: #94a3b8; }`}</style>
    </div>
  );
}

export default function Cyclists() {
  const { token } = useAuth();
  const cyclists = useQuery(api.cyclists.listAll) || [];
  
  const addCyclist = useMutation(api.cyclists.add);
  const updateCyclist = useMutation(api.cyclists.update);
  const toggleFeatureCyclist = useMutation(api.cyclists.toggleFeatured);
  const toggleArchiveCyclist = useMutation(api.cyclists.toggleArchived);
  const removeCyclist = useMutation(api.cyclists.remove);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"cyclists"> | null>(null);
  
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);
  const getImageUrlMutation = useMutation(api.admin.getImageUrlMutation);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: 'Cyclist',
    story: '',
    goal: 5000,
    profileUrl: '',
    galleryUrls: ['', '', ''],
    isFeatured: false,
    isArchived: false,
    shareSlug: '',
    raised: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'Cyclist',
      story: '',
      goal: 5000,
      profileUrl: '',
      galleryUrls: ['', '', ''],
      isFeatured: false,
      isArchived: false,
      shareSlug: '',
      raised: 0
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (cyclist: any) => {
    setFormData({
      name: cyclist.name,
      role: cyclist.role || 'Cyclist',
      story: cyclist.story || '',
      goal: cyclist.goal || 5000,
      profileUrl: cyclist.profileUrl || '',
      galleryUrls: cyclist.galleryUrls ? [...cyclist.galleryUrls, '', '', ''].slice(0, 3) : ['', '', ''],
      isFeatured: cyclist.isFeatured || false,
      isArchived: cyclist.isArchived || false,
      shareSlug: cyclist.shareSlug || cyclist.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      raised: cyclist.raised || 0
    });
    setEditingId(cyclist._id);
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!token) return;
    try {
      const cleanData = {
        token,
        name: formData.name,
        role: formData.role,
        story: formData.story,
        goal: Number(formData.goal),
        profileUrl: formData.profileUrl,
        galleryUrls: formData.galleryUrls.filter(u => u.trim() !== ''),
        isFeatured: formData.isFeatured,
        isArchived: formData.isArchived,
        shareSlug: formData.shareSlug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        raised: Number(formData.raised) || 0
      };

      if (editingId) {
        await updateCyclist({ id: editingId, ...cleanData });
      } else {
        await addCyclist(cleanData);
      }
      resetForm();
    } catch (e: any) {
      alert(e.message || "Error saving cyclist");
      console.error(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'profile' | 'gallery', index?: number) => {
    if (!token) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl({ token });
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      const publicUrl = await getImageUrlMutation({ token, storageId });
      
      if (publicUrl) {
        if (field === 'profile') {
          setFormData(prev => ({ ...prev, profileUrl: publicUrl }));
        } else if (field === 'gallery' && typeof index === 'number') {
          setFormData(prev => {
            const newUrls = [...prev.galleryUrls];
            newUrls[index] = publicUrl;
            return { ...prev, galleryUrls: newUrls };
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
      e.target.value = ''; // reset input
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-heading text-brand-navy mb-2">Cyclist Profiles</h1>
          <p className="text-brand-slate">Manage participants, donation goals, and featured riders.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-brand-cyan text-brand-navy font-black px-6 py-3 rounded-2xl hover:bg-brand-orange hover:text-white transition-all uppercase tracking-widest text-sm flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Add Cyclist
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
          <h2 className="text-xl font-black text-brand-navy uppercase tracking-widest mb-6">
            {editingId ? 'Edit Cyclist' : 'New Cyclist'}
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value, shareSlug: formData.shareSlug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-brand-cyan"
                  placeholder="e.g. Dr. John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Role</label>
                <select 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-brand-cyan"
                >
                  <option value="Cyclist">Cyclist</option>
                  <option value="Medic">Medic</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Fundraising Goal (RM)</label>
                <input 
                  type="number" 
                  value={formData.goal}
                  onChange={e => setFormData({...formData, goal: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-brand-cyan"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Funds Raised Override (RM)</label>
                <input 
                  type="number" 
                  value={formData.raised}
                  onChange={e => setFormData({...formData, raised: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-brand-orange"
                  placeholder="Only if manual override needed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Share Slug</label>
                <input 
                  type="text" 
                  value={formData.shareSlug}
                  onChange={e => setFormData({...formData, shareSlug: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-brand-cyan"
                  placeholder="e.g. john-doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Backstory / Bio <span className="text-brand-cyan normal-case tracking-normal font-normal">(Rich Text supported)</span></label>
              <RichTextEditor
                value={formData.story}
                onChange={html => setFormData({...formData, story: html})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Profile Picture URL</label>
              <div className="flex gap-2 relative">
                <input 
                  type="url" 
                  value={formData.profileUrl}
                  onChange={e => setFormData({...formData, profileUrl: e.target.value})}
                  placeholder="https://..."
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm focus:border-brand-cyan"
                  disabled={isUploading}
                />
                <label className="flex items-center justify-center bg-brand-navy hover:bg-brand-orange text-white px-4 rounded-xl cursor-pointer transition-colors shadow-sm whitespace-nowrap">
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="text-xs font-black tracking-widest uppercase">{isUploading ? '...' : 'Upload'}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile')} disabled={isUploading} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => (
                <div key={i}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Gallery Image {i + 1}</label>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      value={formData.galleryUrls[i]}
                      onChange={e => {
                        const newUrls = [...formData.galleryUrls];
                        newUrls[i] = e.target.value;
                        setFormData({...formData, galleryUrls: newUrls});
                      }}
                      placeholder="https://..."
                      className="w-full min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm focus:border-brand-cyan"
                      disabled={isUploading}
                    />
                    <label className="flex items-center justify-center bg-slate-200 hover:bg-brand-cyan hover:text-white text-brand-navy px-3 rounded-xl cursor-pointer transition-colors shrink-0">
                      <Upload className="h-4 w-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery', i)} disabled={isUploading} />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="feat"
                  checked={formData.isFeatured}
                  onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                  className="w-5 h-5 accent-brand-orange rounded"
                />
                <label htmlFor="feat" className="font-bold text-brand-navy">Feature on Homepage</label>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <input 
                  type="checkbox" 
                  id="arch"
                  checked={formData.isArchived}
                  onChange={e => setFormData({...formData, isArchived: e.target.checked})}
                  className="w-5 h-5 accent-red-500 rounded"
                />
                <label htmlFor="arch" className="font-bold text-slate-500">Archive Cyclist</label>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button 
                onClick={handleSave}
                className="bg-brand-navy text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-brand-orange transition-colors"
              >
                Save Profile
              </button>
              <button 
                onClick={resetForm}
                className="bg-slate-100 text-slate-500 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cyclists List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cyclists.map((c: any) => (
          <div key={c._id} className={`bg-white rounded-3xl p-6 shadow-sm border ${c.isArchived ? 'border-dashed border-red-200 bg-red-50/20 grayscale-[50%]' : 'border-slate-200 hover:border-brand-cyan hover:shadow-xl'} transition-all group`}>
            {c.isArchived && <div className="text-center font-black text-[10px] text-red-500 tracking-widest uppercase mb-4 border-b border-red-100 pb-2">Archived</div>}
            <div className="flex gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                {c.profileUrl ? (
                  <img src={c.profileUrl} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                   <h3 className="font-black text-brand-navy font-heading text-lg leading-tight">{c.name}</h3>
                   <button 
                     onClick={() => { if(token) toggleFeatureCyclist({ token, id: c._id, isFeatured: !c.isFeatured })}}
                     className={`p-2 rounded-xl transition-colors ${c.isFeatured ? 'bg-brand-orange/10 text-brand-orange' : 'bg-slate-50 text-slate-300 hover:text-brand-orange'}`}
                   >
                     <Star className="h-5 w-5" fill={c.isFeatured ? "currentColor" : "none"} />
                   </button>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{c.role}</p>
                
              </div>
            </div>

            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2"><Target className="h-4 w-4"/> Goal</span>
                <span className="text-brand-navy">RM {c.goal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2"><Heart className="h-4 w-4"/> Raised</span>
                <span className="text-brand-orange">RM {c.raised.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
               <button 
                 onClick={() => {
                     const url = `${window.location.origin}/donate?cyclist=${encodeURIComponent(c.shareSlug)}`;
                     navigator.clipboard.writeText(url);
                     alert("Share link copied: " + url);
                 }}
                 className="flex-1 bg-slate-100 hover:bg-brand-cyan hover:text-brand-navy text-slate-500 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
               >
                 <LinkIcon className="h-4 w-4" /> Share
               </button>
               <button 
                 onClick={() => handleEdit(c)}
                 className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-brand-navy rounded-xl transition-colors"
               >
                 <Edit2 className="h-4 w-4" />
               </button>
               <button 
                 onClick={() => { if(token) toggleArchiveCyclist({ token, id: c._id, isArchived: !c.isArchived })}}
                 className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${c.isArchived ? 'bg-red-100 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-brand-navy'}`}
                 title={c.isArchived ? "Unarchive" : "Archive"}
               >
                 {c.isArchived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
               </button>
               <button 
                 onClick={async () => {
                   if(confirm("Delete cyclist?") && token) {
                     try {
                        await removeCyclist({ token, id: c._id })
                     } catch(err: any) {
                        alert(err.message || 'Error deleting');
                     }
                   }
                 }}
                 disabled={c.raised > 0}
                 className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${c.raised > 0 ? 'bg-slate-50 text-slate-300 cursor-not-allowed hidden' : 'bg-red-50 hover:bg-red-500 hover:text-white text-red-500'}`}
                 title={c.raised > 0 ? "Cannot delete if funds are raised" : "Delete"}
               >
                 <Trash2 className="h-4 w-4" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
