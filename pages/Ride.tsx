import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Quote, UserPlus, User, Heart } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import RegistrationModal from '../components/RegistrationModal';
import { BorneoRouteMap } from '../components/BorneoRouteMap';
import RiderStoryModal from '../components/RiderStoryModal';
import { useTranslation } from '../lib/i18n';

const Ride: React.FC = () => {
  const { t } = useTranslation();
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Cyclist');

  const allCyclists = useQuery(api.cyclists.listAll) || [];
  const allSettings  = useQuery(api.admin.getPublicSettings) || [];
  const showProgressSetting = allSettings.find((s: any) => s.key === 'show_fundraising_progress');
  const showFundraisingProgress = showProgressSetting ? showProgressSetting.value !== 'false' : true;
  const cyclists = useMemo(
    () => allCyclists.filter((c: any) => !c.isArchived),
    [allCyclists]
  );

  // Derive unique roles
  const uniqueRoles = useMemo(
    () => Array.from(new Set(cyclists.map((c: any) => c.role || 'Cyclist'))),
    [cyclists]
  );
  const hasMultipleRoles = uniqueRoles.length > 1;

  // Sync activeTab if the default 'Cyclist' isn't available
  useEffect(() => {
    if (uniqueRoles.length > 0 && !uniqueRoles.includes(activeTab)) {
      setActiveTab(uniqueRoles[0]);
    }
  }, [uniqueRoles, activeTab]);

  const displayedCyclists = cyclists.filter((c: any) => (c.role || 'Cyclist') === activeTab);

  return (
    <div className="bg-white min-h-screen">

      {/* 1. EVENT HERO */}
      <section className="relative text-white overflow-hidden pt-32 pb-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/sabcyclist.jpg"
            alt="The Ride"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-brand-cyan text-[10px] font-black tracking-[0.3em] mb-8 uppercase backdrop-blur-md border border-white/10">
            {t('ride.event_date')}
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white font-heading leading-tight mb-8">
            {t('ride.hero_heading1')} <span className="text-brand-orange">{t('ride.hero_heading2')}</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-xl text-brand-pale font-medium mb-16">
            <MapPin className="h-5 w-5 text-brand-cyan" />
            <span>{t('ride.hero_location')}</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/10 pt-16">
            {[
              { label: t('ride.stat_days_label'), value: t('ride.stat_days_value') },
              { label: t('ride.stat_distance_label'), value: t('ride.stat_distance_value') },
              { label: t('ride.stat_territories_label'), value: t('ride.stat_territories_value') },
              { label: t('ride.stat_cyclists_label'), value: t('ride.stat_cyclists_value') },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-4xl md:text-5xl font-black text-white mb-2 font-heading">{stat.value}</div>
                <div className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY QUOTE */}
      <section className="py-24 bg-brand-pale">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="h-12 w-12 text-brand-cyan mx-auto mb-8 opacity-50" />
          <p className="text-2xl md:text-4xl font-black text-brand-navy leading-tight font-heading italic">
            {t('ride.quote')}
          </p>
        </div>
      </section>

      {/* 2.5 INTERACTIVE MAP */}
      {/* 2.5 INTERACTIVE MAP */}
      <div className="w-full max-w-7xl mx-auto px-6 -mt-12 relative z-20 mb-24">
        <BorneoRouteMap />
      </div>


      {/* 3. MEET THE CHAMPIONS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-brand-navy mb-4 font-heading">{t('ride.support_heading')}</h2>
            <p className="text-brand-slate font-medium">{t('ride.support_subheading')}</p>

            {hasMultipleRoles && (
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                {uniqueRoles.map(role => (
                  <button
                    key={role}
                    onClick={() => setActiveTab(role)}
                    className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
                      activeTab === role
                        ? 'bg-brand-orange text-white shadow-lg'
                        : 'bg-slate-100 text-brand-slate hover:bg-slate-200'
                    }`}
                  >
                    {role === 'Cyclist' ? 'Cyclists' : role}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedCyclists.map((rider: any) => (
              <div key={rider._id} className="group bg-white rounded-[2.5rem] p-6 border border-brand-grey/20 hover:border-brand-orange/50 hover:shadow-xl transition-all flex flex-col">
                <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative bg-slate-100 flex items-center justify-center">
                  {rider.profileUrl ? (
                    <img src={rider.profileUrl} alt={rider.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <User className="h-16 w-16 text-slate-300" />
                  )}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-brand-orange text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      {rider.role}
                    </span>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-2xl font-black text-brand-navy mb-2 font-heading leading-tight">{rider.name}</h3>
                </div>

                <div className="mt-4 mb-6">
                  {showFundraisingProgress && (
                    <>
                      <div className="flex justify-between text-[10px] font-bold text-brand-slate uppercase tracking-widest mb-1">
                        <span>{t('ride.rider_raised')} <span className="text-brand-navy font-black text-sm">RM {rider.raised.toLocaleString()}</span></span>
                        <span>{t('ride.rider_goal')} <span className="text-brand-cyan font-black text-sm">RM {rider.goal.toLocaleString()}</span></span>
                      </div>
                      <div className="w-full h-3 bg-brand-pale/50 rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-brand-orange rounded-full shadow-sm transition-all duration-1000" style={{ width: `${Math.min((rider.raised / rider.goal) * 100, 100)}%` }}></div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link to={`/riders/${encodeURIComponent(rider.shareSlug)}`} className="flex-grow text-center bg-brand-navy text-white font-black py-4 rounded-xl hover:bg-brand-cyan hover:text-brand-navy transition-all text-sm uppercase tracking-widest">
                    {t('ride.rider_view_profile')}
                  </Link>
                  <Link to={`/donate?cyclist=${encodeURIComponent(rider.shareSlug)}`} className="px-4 py-4 border-2 border-brand-orange bg-white text-brand-orange font-black rounded-xl hover:bg-brand-orange hover:text-white transition-all text-sm shrink-0">
                    <Heart className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
            
            {displayedCyclists.length === 0 && (
              <div className="md:col-span-2 lg:col-span-4 bg-white rounded-[2.5rem] p-12 text-center border border-slate-100">
                <div className="h-20 w-20 bg-brand-pale mx-auto rounded-full flex items-center justify-center mb-6">
                  <UserPlus className="h-10 w-10 text-brand-navy" />
                </div>
                <h3 className="text-3xl font-black text-brand-navy mb-4 font-heading">{t('ride.no_roster_heading')}</h3>
                <p className="text-brand-slate font-medium text-lg max-w-2xl mx-auto">{t('ride.no_roster_desc')}</p>
              </div>
            )}
          </div>
        </div>
      </section >

      {/* 3.5 FAQ SECTION */}


      {/* 4. REGISTRATION CTA */}
      <section className="py-24 bg-brand-navy text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#0cdfed 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <UserPlus className="h-16 w-16 text-brand-orange mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading">{t('ride.cta_heading')}</h2>
          <p className="text-xl text-brand-pale font-medium mb-12">
            {t('ride.cta_desc')} <br />
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest block mt-4">{t('ride.cta_min_donation')}</span>
          </p>
          <button
            onClick={() => setIsRegOpen(true)}
            className="inline-block bg-brand-orange text-white text-xl font-black px-12 py-5 rounded-full hover:bg-white hover:text-brand-orange transition-all shadow-xl hover:-translate-y-1"
          >
            {t('ride.cta_register')}
          </button>
          <p className="text-xs text-brand-pale/40 mt-6 max-w-sm mx-auto">
            {t('ride.cta_disclaimer')}
          </p>
        </div>
      </section>


      <RegistrationModal isOpen={isRegOpen} onClose={() => setIsRegOpen(false)} />
      <RiderStoryModal rider={selectedRider} onClose={() => setSelectedRider(null)} />

    </div >
  );
};

export default Ride;