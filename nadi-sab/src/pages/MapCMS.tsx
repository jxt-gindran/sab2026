import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Map, Upload, Trash2, Plus, CheckCircle2 } from 'lucide-react';

export default function MapCMS() {
  // Routes State
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Markers State
  const [newMarker, setNewMarker] = useState({ name: '', lat: '', lng: '', desc: '', type: 'stop' });

  // Convex Hooks
  const activeRoute = useQuery(api.maps.getActiveRoute);
  const markers = useQuery(api.maps.getMarkers) || [];
  
  const generateUploadUrl = useMutation(api.maps.generateUploadUrl);
  const saveRouteFile = useMutation(api.maps.saveRouteFile);
  const addMarker = useMutation(api.maps.addMarker);
  const removeMarker = useMutation(api.maps.removeMarker);
  const updateMarkerOrder = useMutation(api.maps.updateMarkerOrder);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadSuccess(false);

      // 1. Get an upload URL from Convex
      const postUrl = await generateUploadUrl();

      // 2. Upload the file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Upload failed with status ${result.status}`);
      }
      
      const { storageId } = await result.json();

      // 3. Save the storage ID
      await saveRouteFile({ storageId, fileName: file.name });
      
      setFile(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload the file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMarker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMarker.name || !newMarker.lat || !newMarker.lng) return;

    await addMarker({
      name: newMarker.name,
      lat: parseFloat(newMarker.lat),
      lng: parseFloat(newMarker.lng),
      type: newMarker.type,
      description: newMarker.desc || undefined
    });

    setNewMarker({ name: '', lat: '', lng: '', desc: '', type: 'stop' });
  };

  const moveMarker = async (markerId: any, currentOrder: number, direction: 'up' | 'down') => {
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    const sibling = markers.find((m: any) => m.orderIndex === targetOrder);
    
    if (sibling) {
      await updateMarkerOrder({ markerId: sibling._id, newOrderIndex: currentOrder });
      await updateMarkerOrder({ markerId, newOrderIndex: targetOrder });
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl space-y-10">
      
      <div className="flex items-center gap-4 border-b border-brand-pale pb-6">
        <div className="bg-brand-orange p-3 rounded-2xl text-white">
          <Map className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black font-heading text-brand-navy">Route & Maps</h1>
          <p className="text-brand-slate font-medium">Upload GPX track files and configure your checkpoints here.</p>
        </div>
      </div>

      {/* UPLOADER */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-black font-heading text-brand-navy mb-4">Route File (.gpx / .csv)</h2>
        
        {activeRoute && (
          <div className="mb-6 p-4 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-brand-cyan uppercase tracking-widest mb-1">Active Route</div>
              <div className="font-bold text-brand-navy">{activeRoute.fileName}</div>
            </div>
            <a href={activeRoute.fileUrl} target="_blank" rel="noreferrer" className="text-brand-orange hover:underline text-sm font-bold">
              Download
            </a>
          </div>
        )}

        <form onSubmit={handleUpload} className="flex items-end gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-bold text-brand-slate mb-2">Upload New Map Data</label>
            <input 
              type="file" 
              accept=".csv,.gpx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-brand-navy focus:outline-none focus:border-brand-cyan"
            />
          </div>
          <button 
            type="submit" 
            disabled={!file || isUploading}
            className="flex items-center gap-2 bg-brand-navy text-white font-bold px-6 py-3.5 rounded-xl hover:bg-brand-cyan transition-colors disabled:opacity-50"
          >
            {isUploading ? <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin"/> : <Upload className="h-5 w-5" />}
            {isUploading ? 'Uploading...' : 'Save File'}
          </button>
        </form>
        {uploadSuccess && (
          <p className="text-emerald-500 font-bold text-sm mt-3 flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Successfully updated map data!</p>
        )}
      </section>

      {/* MARKERS */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-black font-heading text-brand-navy mb-6">Pit Stops & Checkpoints</h2>
        
        <form onSubmit={handleAddMarker} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Name</label>
            <input 
              placeholder="e.g. Ranau" 
              value={newMarker.name}
              onChange={e => setNewMarker({...newMarker, name: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-2" required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Latitude</label>
            <input 
              type="number" step="any" placeholder="5.951" 
              value={newMarker.lat}
              onChange={e => setNewMarker({...newMarker, lat: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-2" required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Longitude</label>
            <input 
              type="number" step="any" placeholder="116.662" 
              value={newMarker.lng}
              onChange={e => setNewMarker({...newMarker, lng: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-2" required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Type</label>
            <select 
              value={newMarker.type}
              onChange={e => setNewMarker({...newMarker, type: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white"
            >
              <option value="start">Start Flag</option>
              <option value="stop">Pit Stop</option>
              <option value="finish">Finish Line</option>
            </select>
          </div>
          <div className="col-span-1 md:col-span-6">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Description (Optional)</label>
             <div className="flex gap-4">
                <input 
                  placeholder="e.g. 115km marker" 
                  value={newMarker.desc}
                  onChange={e => setNewMarker({...newMarker, desc: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 flex-grow"
                />
                <button type="submit" className="shrink-0 flex items-center justify-center gap-1 bg-brand-orange text-white font-bold px-6 py-2 rounded-lg hover:bg-brand-navy transition-colors">
                  <Plus className="h-4 w-4" /> Add
                </button>
             </div>
          </div>
        </form>

        {/* Existing Markers */}
        <div className="space-y-3">
          {markers.sort((a: any, b: any) => a.orderIndex - b.orderIndex).map((m: any, index: number) => (
            <div key={m._id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:border-brand-cyan/30 transition-colors group">
              <div className="flex flex-col text-slate-300">
                <button onClick={() => moveMarker(m._id, m.orderIndex, 'up')} disabled={index === 0} className="hover:text-brand-navy disabled:invisible">▲</button>
                <button onClick={() => moveMarker(m._id, m.orderIndex, 'down')} disabled={index === markers.length - 1} className="hover:text-brand-navy disabled:invisible">▼</button>
              </div>
              
              <div className={`p-2 rounded-lg ${m.type === 'start' ? 'bg-brand-orange text-white' : m.type === 'finish' ? 'bg-brand-cyan text-brand-navy' : 'bg-brand-navy text-white'}`}>
                <Map className="h-5 w-5" />
              </div>
              
              <div className="flex-grow">
                <div className="font-bold text-brand-navy text-lg">{m.name}</div>
                <div className="text-xs text-brand-slate/70 font-mono">{m.lat}, {m.lng} • {m.description || 'No description'}</div>
              </div>
              
              <button 
                onClick={() => confirm('Delete marker?') && removeMarker({ markerId: m._id })}
                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          {markers.length === 0 && (
             <div className="text-center py-10 text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-2xl">
               No markers are currently configured.
             </div>
          )}
        </div>
      </section>

    </div>
  );
}
