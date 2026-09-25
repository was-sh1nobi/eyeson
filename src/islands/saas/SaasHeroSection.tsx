import { SmartImage } from "../../utils/SmartImage.tsx";

export const SaasHeroSection = () => {
  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden font-sans">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_rgba(0,169,189,0.15)_0%,_transparent_70%)] pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#00A9BD]/15 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000"></div>
      <div className="absolute -bottom-20 left-0 w-[400px] h-[400px] bg-[#42D1D1]/15 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#42D1D1] text-[11px] font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md shadow-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#42D1D1] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A9BD]"></span>
              </span>
              SaaS Creative Studio
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-white">
              Turn your product into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#42D1D1] to-[#00A9BD]">story people remember.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300/90 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              We help SaaS teams create compelling product narratives, launch campaigns, and demo content that clarify value, drive adoption, and fuel growth.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <a href="/contact" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00A9BD] to-[#008A9B] px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_-5px_rgba(0,169,189,0.5)] transition-[transform,box-shadow] hover:scale-105 hover:shadow-[0_0_40px_-5px_rgba(0,169,189,0.7)] focus:outline-none focus:ring-2 focus:ring-[#42D1D1] focus:ring-offset-2 focus:ring-offset-[#030B14]">
                Start a Project
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </a>
              <a href="#work" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 backdrop-blur-md hover:border-white/20">
                View Our Work
              </a>
            </div>
          </div>

          {/* Hero Image/Mockup area */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none mt-10 lg:mt-0 perspective-[1000px]">
            {/* Decorative glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00A9BD]/30 to-[#42D1D1]/10 rounded-3xl blur-3xl transform rotate-3 scale-105"></div>
            
            {/* Glassmorphic Image Container */}
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-3 backdrop-blur-xl shadow-2xl transform transition-transform duration-700 hover:rotate-y-[-5deg] hover:rotate-x-[5deg]">
              <div className="absolute top-6 right-6 flex gap-2 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
              </div>
              <div className="overflow-hidden rounded-2xl bg-[#0B1724] ">
                <SmartImage 
                  src="/saas/right-hero-c2.webp"
                  alt="SaaS product interface" 
                  width={800} 
                  height={600} 
                  className="w-full h-auto object-cover opacity-90 transition-opacity hover:opacity-100 mix-blend-lighten" 
                />
              </div>
              
              {/* Floating Badges */}
              <div className="absolute -bottom-6 -left-6 lg:-left-12 rounded-2xl border border-white/10 bg-[#07131C]/90 p-5 backdrop-blur-md shadow-2xl animate-[bounce_4s_infinite]">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A9BD]/20 text-[#42D1D1]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Conversion</p>
                    <p className="text-xl font-bold text-white">+48% Lift</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 rounded-2xl border border-white/10 bg-[#07131C]/90 p-4 backdrop-blur-md shadow-2xl animate-[bounce_5s_infinite_0.5s]">
                 <div className="flex items-center gap-3">
                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#42D1D1]/20 text-[#42D1D1]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <p className="text-sm font-bold text-white pr-2">Launch Ready</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
