import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useTranslation } from '../lib/i18n';
import {
  Newspaper, Mail, ExternalLink, FileText, Calendar, AlertCircle,
} from 'lucide-react';

// ── Reusable Tax Receipt Info block ──────────────────────────────────────────
function TaxReceiptPanel() {
  const { t } = useTranslation();
  return (
    <div className="bg-brand-navy rounded-3xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="h-12 w-12 bg-brand-cyan rounded-2xl flex items-center justify-center shrink-0">
            <AlertCircle className="h-6 w-6 text-brand-navy" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-cyan mb-1">
              Tax Exemption
            </div>
            <h3 className="text-xl font-black leading-tight">
              {t('taxReceipt.heading')}
            </h3>
          </div>
        </div>

        <p className="text-sm text-white/80 font-medium leading-relaxed mb-5">
          {t('taxReceipt.intro')}
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          {[t('taxReceipt.email1'), t('taxReceipt.email2')].map(email => (
            <a
              key={email}
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 bg-brand-cyan/20 hover:bg-brand-cyan hover:text-brand-navy text-brand-cyan border border-brand-cyan/30 px-4 py-2 rounded-xl text-sm font-black transition-all"
            >
              <Mail className="h-4 w-4" />
              {email}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-cyan mb-2">
              {t('taxReceipt.individual_heading')}
            </div>
            <p className="text-xs text-white/80 font-medium leading-relaxed">
              {t('taxReceipt.individual_fields')}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-cyan mb-2">
              {t('taxReceipt.corporate_heading')}
            </div>
            <p className="text-xs text-white/80 font-medium leading-relaxed">
              {t('taxReceipt.corporate_fields')}
            </p>
          </div>
        </div>

        <p className="text-xs text-white/50 font-bold italic">
          ⚠ {t('taxReceipt.note')}
        </p>
      </div>
    </div>
  );
}

// ── Main Media Page ───────────────────────────────────────────────────────────
const Media: React.FC = () => {
  const { t } = useTranslation();
  const releases = (useQuery(api.pressReleases.list) ?? []) as any[];

  // Group releases by year, newest year first, newest date first within each year
  const byYear: Record<number, any[]> = {};
  for (const r of releases) {
    (byYear[r.year] = byYear[r.year] ?? []).push(r);
  }
  // Sort years descending
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);
  // Sort releases within each year newest first
  for (const y of years) {
    byYear[y].sort((a: any, b: any) => b.publishedAt - a.publishedAt);
  }

  return (
    <div className="min-h-screen bg-white font-sans text-brand-slate">

      {/* ── Hero & Contact Section (Merged) ───────────────────────────── */}
      <div className="bg-brand-navy pt-32 pb-24 px-6 relative overflow-hidden text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-cyan/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-brand-orange/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Heading */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-cyan mb-5 flex items-center gap-3">
              <Newspaper className="h-4 w-4" />
              {t('media.tag')}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight font-heading">
              {t('media.heading1')}{' '}
              <span className="text-brand-cyan">{t('media.heading2')}</span>
            </h1>
          </div>

          {/* Right Column: Get in Touch Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
            
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-orange mb-3 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              {t('media.contact_heading')}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tighter mb-3 font-heading">
              Get in Touch.
            </h2>
            <p className="text-sm text-white/70 font-medium leading-relaxed mb-6">
              {t('media.contact_note')}
            </p>

            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                {t('media.contact_email_label')}
              </div>
              <a
                href={`mailto:${t('media.contact_email')}`}
                className="flex items-center gap-3 bg-white/5 hover:bg-brand-cyan/20 border border-white/10 hover:border-brand-cyan/30 rounded-2xl px-5 py-4 transition-all group"
              >
                <div className="h-10 w-10 bg-brand-cyan rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-brand-navy" />
                </div>
                <div>
                  <div className="font-black text-white text-sm">{t('media.contact_email')}</div>
                  <div className="text-xs text-white/40 font-medium">Media Enquiries</div>
                </div>
                <ExternalLink className="h-4 w-4 text-white/30 ml-auto group-hover:text-brand-cyan transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body (Press Releases & Tax Info) ─────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">

        {/* ── Press Releases Section ───────────────────────────────────── */}
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-orange mb-3 flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" />
            {t('media.releases_heading')}
          </div>

          {/* Empty state */}
          {years.length === 0 && (
            <div className="mt-10 bg-brand-pale/30 rounded-3xl p-16 text-center border border-brand-pale">
              <Newspaper className="h-14 w-14 mx-auto mb-5 text-slate-300" />
              <h3 className="text-xl font-black text-brand-navy mb-2">
                {t('media.releases_empty_heading')}
              </h3>
              <p className="text-brand-slate font-medium max-w-sm mx-auto">
                {t('media.releases_empty_desc')}
              </p>
            </div>
          )}

          {/* Releases grouped by year */}
          {years.map(year => (
            <div key={year} className="mb-12 mt-10">
              {/* Year separator */}
              <div className="flex items-center gap-4 mb-7">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand-cyan" />
                  <span className="text-2xl font-black text-brand-navy font-heading">{year}</span>
                </div>
                <div className="flex-grow h-px bg-brand-pale" />
              </div>

              {/* Release list (full-width horizontal cards) */}
              <div className="space-y-6">
                {byYear[year].map((release: any) => (
                  <div
                    key={release._id}
                    className="bg-white rounded-3xl border border-brand-pale shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col md:flex-row group"
                  >
                    {/* Cover image */}
                    <div className="w-full md:w-64 lg:w-80 shrink-0 aspect-video md:aspect-auto md:min-h-[180px] bg-brand-pale/50 overflow-hidden relative">
                      {release.imageUrl ? (
                        <img
                          src={release.imageUrl}
                          alt={release.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full min-h-[160px] flex items-center justify-center">
                          <Newspaper className="h-10 w-10 text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="font-black text-brand-navy text-xl leading-snug mb-3 group-hover:text-brand-orange transition-colors">
                          {release.title}
                        </h3>
                        <p className="text-sm text-brand-slate font-medium leading-relaxed mb-6">
                          {release.description}
                        </p>
                      </div>

                      <div>
                        {release.pdfUrl ? (
                          <a
                            href={release.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-navy hover:text-brand-orange transition-colors border border-brand-pale hover:border-brand-orange rounded-xl px-5 py-3"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            {t('media.read_pdf')}
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 border border-slate-100 rounded-xl px-5 py-3">
                            <FileText className="h-3.5 w-3.5" /> PDF Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tax Exemption Panel (Moved to bottom) ────────────────────── */}
        <div className="pt-8 border-t border-brand-pale">
          <TaxReceiptPanel />
        </div>

      </div>
    </div>
  );
};

export default Media;
