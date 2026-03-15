import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../components/AuthContext';
import { Image as ImageIcon, Type, Save, Plus, UploadCloud } from 'lucide-react';

export default function Content() {
  const { token } = useAuth();
  const content = useQuery(api.admin.getContent) || [];
  const updateContent = useMutation(api.admin.updateContent);
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);

  const [newPage, setNewPage] = useState('home');
  const [newSection, setNewSection] = useState('');
  const [newType, setNewType] = useState('text');
  const [newValue, setNewValue] = useState('');

  const [editingContent, setEditingContent] = useState<Record<string, string>>({});

  const handleUpdate = async (page: string, section: string, type: string, value: string) => {
    if (!token) return;
    try {
      await updateContent({ token, page, section, type, value });
      // clear local edit state
      const key = `${page}-${section}`;
      setEditingContent(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      alert('Content saved!');
    } catch (e) {
      alert('Failed to save content');
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newSection.trim()) return;
    try {
      await updateContent({ token, page: newPage.trim(), section: newSection.trim(), type: newType, value: newValue });
      setNewSection('');
      setNewValue('');
    } catch (e) {
      alert('Failed to add content block');
    }
  };

  const handleImageUpload = async (page: string, section: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    try {
      // 1. Get an upload URL
      const postUrl = await generateUploadUrl({ token });
      // 2. Upload the file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      // 3. Update the content block with the storageId
      await updateContent({ token, page, section, type: 'image', value: storageId });
      alert('Image uploaded and saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    }
  };

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-orange">
          <Type className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black font-heading text-brand-navy">Content CMS</h1>
          <p className="text-brand-slate font-medium text-sm">Manage website copy and imagery dynamically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Current Content List */}
        <div className="lg:col-span-2 space-y-6">
          {['home', 'mission', 'ride', 'general'].map(pageGroup => {
            const pageContent = content.filter(c => c.page === pageGroup);
            if (pageContent.length === 0) return null;

            return (
              <div key={pageGroup} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-sm font-black uppercase tracking-widest text-brand-navy">Page: {pageGroup}</h2>
                </div>
                <div className="p-6 divide-y divide-slate-100">
                  {pageContent.map(c => {
                    const key = `${c.page}-${c.section}`;
                    const isEditing = editingContent[key] !== undefined;
                    const currentValue = isEditing ? editingContent[key] : c.value;

                    return (
                      <div key={c._id} className="py-4 first:pt-0 last:pb-0 block">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-bold text-brand-navy text-sm">{c.section}</span>
                            <span className="ml-2 text-[10px] font-black bg-brand-pale text-brand-slate px-2 py-0.5 rounded uppercase tracking-widest">{c.type}</span>
                          </div>
                          {c.type === 'text' && (
                            <button
                              onClick={() => handleUpdate(c.page, c.section, c.type, currentValue)}
                              className={`h-8 px-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 ${
                                isEditing ? 'bg-brand-cyan text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-brand-cyan'
                              }`}
                            >
                              <Save className="h-4 w-4" /> Save
                            </button>
                          )}
                        </div>

                        {c.type === 'text' && (
                          <textarea
                            value={currentValue}
                            onChange={(e) => setEditingContent({ ...editingContent, [key]: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:border-brand-cyan outline-none transition-all min-h-[80px]"
                          />
                        )}

                        {c.type === 'image' && (
                          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <div className="h-16 w-16 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                              {/* We could use the getImage url here if we passed it down, for now icon */}
                              <ImageIcon className="h-6 w-6 text-slate-400" />
                            </div>
                            <div className="flex-grow">
                              <p className="text-xs text-slate-500 font-medium mb-2 truncate">Storage ID: {c.value || 'None'}</p>
                              <label className="inline-flex items-center gap-2 bg-white text-brand-navy border border-slate-200 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-50 cursor-pointer shadow-sm transition-all">
                                <UploadCloud className="h-4 w-4" />
                                {c.value ? 'Replace Image' : 'Upload Image'}
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => handleImageUpload(c.page, c.section, e)}
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Content Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-black uppercase tracking-widest text-brand-navy">Add Content Block</h2>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Group</label>
                <input
                  type="text"
                  value={newPage}
                  onChange={(e) => setNewPage(e.target.value)}
                  placeholder="e.g. home"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-cyan outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Key</label>
                <input
                  type="text"
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  placeholder="e.g. hero_subtitle"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-cyan outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-cyan outline-none transition-all cursor-pointer"
                >
                  <option value="text">Text / Copy</option>
                  <option value="image">Image</option>
                </select>
              </div>
              
              {newType === 'text' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Value</label>
                  <textarea
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Enter short text..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-cyan outline-none transition-all min-h-[80px]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-cyan hover:text-brand-navy transition-all shadow-md mt-4"
              >
                <Plus className="h-4 w-4" /> Create Block
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
