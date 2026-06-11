import { useState, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  Plus, Trash2, Save, CheckCircle2, Newspaper,
  Upload, FileText, Eye, EyeOff, Calendar,
} from 'lucide-react';

interface ReleaseRow {
  _id?: string;
  title: string;
  description: string;
  year: number;
  imageStorageId?: string;
  pdfStorageId?: string;
  isPublished: boolean;
  publishedAt?: number;
  // resolved URLs from backend
  imageUrl?: string;
  pdfUrl?: string;
  _rawImageStorageId?: string;
  _rawPdfStorageId?: string;
  _isNew?: boolean;
}

const EMPTY_ROW = (): ReleaseRow => ({
  _id: 'new-' + Date.now(),
  title: '',
  description: '',
  year: new Date().getFullYear(),
  isPublished: false,
  _isNew: true,
});

export default function PressReleases() {
  const releases = (useQuery(api.pressReleases.listAll) ?? []) as ReleaseRow[];
  const upsert   = useMutation(api.pressReleases.upsert);
  const remove   = useMutation(api.pressReleases.remove);
  const genUrl   = useMutation(api.pressReleases.generateUploadUrl);

  const [editing,   setEditing]   = useState<ReleaseRow | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [imgPreview, setImgPreview] = useState<string>('');
  const [pdfName,    setPdfName]    = useState<string>('');

  const imgRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  // ── File upload helper ──────────────────────────────────────────────────
  async function uploadFile(file: File): Promise<string> {
    const uploadUrl = await genUrl();
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    const { storageId } = await res.json();
    return storageId;
  }

  // ── Open edit form ──────────────────────────────────────────────────────
  function openEdit(row: ReleaseRow) {
    setEditing({ ...row });
    setImgPreview(row.imageUrl ?? '');
    setPdfName(row.pdfUrl ? 'Existing PDF' : '');
  }

  function openNew() {
    const row = EMPTY_ROW();
    setEditing(row);
    setImgPreview('');
    setPdfName('');
  }

  // ── Handle image pick ────────────────────────────────────────────────────
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const previewUrl = URL.createObjectURL(file);
    setImgPreview(previewUrl);
    // Store the File object temporarily in a data attribute for saving later
    (imgRef.current as any)._pendingFile = file;
  }

  // ── Handle PDF pick ──────────────────────────────────────────────────────
  async function handlePdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setPdfName(file.name);
    (pdfRef.current as any)._pendingFile = file;
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      let imageStorageId = editing._rawImageStorageId ?? editing.imageStorageId;
      let pdfStorageId   = editing._rawPdfStorageId   ?? editing.pdfStorageId;

      const imgFile = (imgRef.current as any)?._pendingFile as File | undefined;
      const pdfFile = (pdfRef.current as any)?._pendingFile as File | undefined;

      if (imgFile) imageStorageId = await uploadFile(imgFile);
      if (pdfFile) pdfStorageId   = await uploadFile(pdfFile);

      await upsert({
        id:             editing._isNew ? undefined : editing._id as any,
        title:          editing.title,
        description:    editing.description,
        year:           editing.year,
        imageStorageId: imageStorageId as any,
        pdfStorageId:   pdfStorageId as any,
        isPublished:    editing.isPublished,
      });

      // Clear pending files
      if (imgRef.current) (imgRef.current as any)._pendingFile = undefined;
      if (pdfRef.current) (pdfRef.current as any)._pendingFile = undefined;

      setSaved(true);
      setTimeout(() => { setSaved(false); setEditing(null); }, 1500);
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('Delete this press release? This cannot be undone.')) return;
    await remove({ id: id as any });
    if (editing?._id === id) setEditing(null);
  }

  // ── Group releases by year for the table view ─────────────────────────────
  const byYear: Record<number, ReleaseRow[]> = {};
  for (const r of releases) {
    (byYear[r.year] = byYear[r.year] ?? []).push(r);
  }
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black font-heading text-brand-navy flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-brand-cyan" />
            Press Releases
          </h1>
          <p className="text-brand-slate mt-2">
            Manage media press releases. Published entries appear on the public <strong>/media</strong> page grouped by year.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-brand-cyan text-brand-navy px-5 py-2 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-brand-navy hover:text-white transition-all shadow-lg"
        >
          <Plus className="h-4 w-4" /> Add Release
        </button>
      </div>

      {/* Edit / Create Form */}
      {editing && (
        <div className="bg-white rounded-2xl border border-brand-cyan/30 shadow-xl p-6 mb-8">
          <h2 className="text-lg font-black text-brand-navy mb-6 flex items-center gap-2">
            {editing._isNew ? <Plus className="h-5 w-5 text-brand-cyan" /> : <Save className="h-5 w-5 text-brand-cyan" />}
            {editing._isNew ? 'New Press Release' : 'Editing Press Release'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Title *</label>
              <input
                type="text"
                value={editing.title}
                onChange={e => setEditing({ ...editing, title: e.target.value })}
                placeholder="e.g. SAB 2026 Kicks Off Registration"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-brand-navy outline-none focus:border-brand-cyan"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Description *</label>
              <textarea
                rows={3}
                value={editing.description}
                onChange={e => setEditing({ ...editing, description: e.target.value })}
                placeholder="Brief summary of the press release…"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-slate outline-none resize-none focus:border-brand-cyan"
              />
            </div>

            {/* Year */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                <Calendar className="inline h-3 w-3 mr-1" />Year *
              </label>
              <input
                type="number"
                value={editing.year}
                onChange={e => setEditing({ ...editing, year: parseInt(e.target.value) || new Date().getFullYear() })}
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-brand-navy outline-none focus:border-brand-cyan"
              />
            </div>

            {/* Published toggle */}
            <div className="flex items-end pb-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditing({ ...editing, isPublished: !editing.isPublished })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${editing.isPublished ? 'bg-brand-cyan' : 'bg-slate-200'}`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${editing.isPublished ? 'left-7' : 'left-1'}`} />
                </button>
                <span className="text-sm font-black text-brand-navy">
                  {editing.isPublished ? <Eye className="inline h-4 w-4 text-brand-cyan mr-1" /> : <EyeOff className="inline h-4 w-4 text-slate-400 mr-1" />}
                  {editing.isPublished ? 'Published (visible on site)' : 'Draft (hidden from public)'}
                </span>
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                <Upload className="inline h-3 w-3 mr-1" />Cover Image
              </label>
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-brand-cyan transition-colors"
                onClick={() => imgRef.current?.click()}
              >
                {imgPreview ? (
                  <img src={imgPreview} alt="Preview" className="h-28 mx-auto object-cover rounded-lg" />
                ) : (
                  <div className="text-slate-400 text-xs font-bold py-4">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-slate-300" />
                    Click to upload image<br />(JPG, PNG, WebP)
                  </div>
                )}
              </div>
              <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            {/* PDF upload */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                <FileText className="inline h-3 w-3 mr-1" />PDF Document
              </label>
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-brand-cyan transition-colors h-[calc(100%-1.5rem)]"
                onClick={() => pdfRef.current?.click()}
              >
                <div className="text-slate-400 text-xs font-bold py-4">
                  <FileText className={`h-6 w-6 mx-auto mb-2 ${pdfName ? 'text-brand-cyan' : 'text-slate-300'}`} />
                  {pdfName || 'Click to upload PDF'}
                </div>
              </div>
              <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfChange} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={saving || !editing.title || !editing.description}
              className="flex items-center gap-2 bg-brand-navy text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-brand-orange transition-all shadow-md disabled:opacity-40"
            >
              {saving ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Release'}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs text-slate-400 hover:text-brand-navy border border-slate-200 hover:border-brand-navy transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Release list grouped by year */}
      {releases.length === 0 && !editing && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center text-slate-300">
          <Newspaper className="h-12 w-12 mx-auto mb-4 text-slate-200" />
          <p className="font-bold text-sm">No press releases yet.</p>
          <p className="text-xs mt-1">Click "Add Release" to create your first one.</p>
        </div>
      )}

      {years.map(year => (
        <div key={year} className="mb-8">
          {/* Year separator */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-brand-cyan">{year}</span>
            <div className="flex-grow h-px bg-brand-pale" />
            <span className="text-xs text-slate-400 font-bold">{byYear[year].length} release{byYear[year].length !== 1 ? 's' : ''}</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-[80px_1fr_140px_80px_80px] text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-5 py-3 border-b border-slate-100 gap-3">
              <span>Image</span>
              <span>Title / Description</span>
              <span>PDF</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-slate-50">
              {byYear[year].map(r => (
                <div key={r._id} className="grid grid-cols-[80px_1fr_140px_80px_80px] gap-3 items-center px-5 py-4 hover:bg-slate-50/50">
                  {/* Cover image */}
                  <div>
                    {r.imageUrl ? (
                      <img src={r.imageUrl} alt={r.title} className="h-12 w-16 object-cover rounded-lg border border-slate-100" />
                    ) : (
                      <div className="h-12 w-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
                        <Upload className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {/* Title + description */}
                  <div className="min-w-0">
                    <div className="font-black text-brand-navy text-sm truncate">{r.title}</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-2">{r.description}</div>
                  </div>

                  {/* PDF */}
                  <div>
                    {r.pdfUrl ? (
                      <a
                        href={r.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-black text-brand-cyan hover:text-brand-orange transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" /> View PDF
                      </a>
                    ) : (
                      <span className="text-xs text-slate-300 font-bold">No PDF</span>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${r.isPublished ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${r.isPublished ? 'bg-green-500' : 'bg-slate-300'}`} />
                      {r.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(r)}
                      className="p-1.5 rounded-lg bg-brand-navy text-white hover:bg-brand-cyan hover:text-brand-navy transition-all"
                      title="Edit"
                    >
                      <Save className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(r._id!)}
                      className="p-1.5 rounded-lg text-red-300 hover:bg-red-50 hover:text-red-500 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <p className="text-xs text-slate-400 text-center mt-4 font-bold">
        Published releases appear immediately on the public /media page via Convex real-time sync.
      </p>
    </div>
  );
}
