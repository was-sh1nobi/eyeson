const stats = [
  { value: "98%", label: "Client Retention" },
  { value: "2.5x", label: "Conversion Lift" },
  { value: "100+", label: "Brands Launched" },
  { value: "14 Days", label: "Avg Delivery" }
];

export const SaasServicesSection = () => {
  return (
    <div className="font-sans">
      {/* Stats Section */}
      <section className="py-16 lg:py-24 relative z-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-white/10">
            {stats.map(stat => (
              <div key={stat.label} className="text-center px-4 group">
                <h4 className="text-4xl md:text-5xl font-extrabold text-white mb-2 transition-transform group-hover:scale-105 group-hover:text-[#42D1D1] duration-300">{stat.value}</h4>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-[0.15em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(0,169,189,0.06)_0%,_transparent_70%)] pointer-events-none -translate-y-1/2"></div>
        
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <p className="text-xs font-bold tracking-[0.2em] text-[#42D1D1] uppercase mb-4">Built around your product</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">From feature list to a clear reason to care.</h2>
            <p className="text-lg text-slate-400 leading-relaxed">We turn product complexity into compelling visual narratives. Your audience doesn't need to know every feature — they need to understand why it matters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[minmax(320px,auto)]">
            {/* Big Bento Card */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:p-10 transition-colors hover:bg-white/[0.07] hover:border-white/20 backdrop-blur-md shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00A9BD]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-auto">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#00A9BD]/20 text-[#42D1D1] text-xs font-bold uppercase tracking-wider mb-5">High Impact</div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">Product Explainers & Demos</h3>
                  <p className="text-slate-400 max-w-lg leading-relaxed text-sm lg:text-base">Turn complex workflows into clear, engaging stories that users understand in seconds. We build demo content that breaks down barriers and drives adoption.</p>
                </div>
                <div className="relative h-56 lg:h-64 mt-10 rounded-2xl overflow-hidden border border-white/10 bg-[#0B1724]">
                  <div className="absolute inset-0 bg-[url('/pricing/svg/sto.svg')] bg-cover bg-center bg-no-repeat opacity-50 mix-blend-luminosity group-hover:mix-blend-normal transition-[transform,opacity,filter] duration-700 group-hover:scale-105 group-hover:opacity-80"></div>
                </div>
              </div>
            </div>

            {/* Small Bento Card 1 */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:p-10 transition-colors hover:bg-white/[0.07] hover:border-white/20 backdrop-blur-md shadow-lg flex flex-col">
              <div className="relative z-10 flex flex-col h-full">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#00A9BD]/20 to-[#42D1D1]/10 flex items-center justify-center text-[#42D1D1] mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">Launch Campaigns</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-auto">Every launch deserves visuals that cut through. We build campaign assets for ads, landing pages, and social media.</p>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <span className="text-[#42D1D1] text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-[gap,color]">Learn more <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></span>
                </div>
              </div>
            </div>

            {/* Small Bento Card 2 */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:p-10 transition-colors hover:bg-white/[0.07] hover:border-white/20 backdrop-blur-md shadow-lg flex flex-col">
               <div className="relative z-10 flex flex-col h-full">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#00A9BD]/20 to-[#42D1D1]/10 flex items-center justify-center text-[#42D1D1] mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">Paid Social & Ads</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-auto">Performance-driven creatives meticulously designed to stop the scroll and convert fleeting attention into action.</p>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <span className="text-[#42D1D1] text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-[gap,color]">Learn more <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></span>
                </div>
              </div>
            </div>

            {/* Medium Bento Card */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 via-[#00A9BD]/5 to-[#00A9BD]/20 p-8 lg:p-10 transition-colors hover:border-[#00A9BD]/40 backdrop-blur-md shadow-lg">
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between h-full gap-10">
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">Feature Announcements</h3>
                  <p className="text-slate-400 leading-relaxed max-w-lg mb-8">Keep your audience engaged with high-quality release content. We help you communicate new value fast and effectively across all channels.</p>
                  <a href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20">
                    Explore capabilities
                  </a>
                </div>
                <div className="w-48 h-48 lg:w-56 lg:h-56 relative rounded-full bg-gradient-to-tr from-[#00A9BD]/20 to-transparent flex-shrink-0 animate-[spin_12s_linear_infinite] border border-white/10">
                  <div className="absolute inset-3 rounded-full border border-dashed border-white/30"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#42D1D1]/30 blur-2xl"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#00A9BD] rounded-full shadow-[0_0_15px_#00A9BD]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
