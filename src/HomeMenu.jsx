// src/HomeMenu.jsx

import { SIZES, CRUSTS, VEGGIE_OPTIONS, MEAT_OPTIONS } from './menuData';
export default function HomeMenu({ onOrderNow }) {
  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative rounded-3xl overflow-hidden min-h-[460px] sm:min-h-[520px] flex items-center justify-center border border-stone-800/60 shadow-2xl bg-stone-950">
        
        {/* Background Image with Transparency & Vignette Blend */}
        <div className="absolute inset-0 z-0">
          <img
            src="/two-kind-pizza-table.jpg"
            alt="Local Handcrafted Pizzas"
            className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          {/* Gradients to blend smoothly into dark stone background */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/80" />
        </div>

        {/* Hero Copy (Bull & Last Inspired Serif + Impact Typography) */}
        <div className="relative z-10 text-center px-6 py-12 max-w-2xl mx-auto space-y-6">
          <div className="inline-block tracking-[0.3em] uppercase text-amber-200/90 text-xs font-semibold">
            Stone Oven Bakery & Craft Kitchen
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-serif tracking-tight text-stone-100 uppercase leading-none drop-shadow-md">
            Stone-Fired <br />
            <span className="italic font-normal lowercase tracking-normal text-amber-100/90">with</span> Soul
          </h2>

          <p className="text-stone-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed font-light">
            Slow-fermented dough, crushed Italian San Marzano tomatoes, and whole milk mozzarella baked over hickory embers.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOrderNow}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-amber-100/10 hover:bg-amber-100/20 text-amber-100 border border-amber-200/30 hover:border-amber-200/60 text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <span>Start Custom Order</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about-section" className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-y border-stone-800/80 text-stone-300">
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-200/80">01. 48-Hour Cold Ferment</h4>
          <p className="text-xs text-stone-400 leading-relaxed font-light">
            Our naturally leavened dough rests cold for two full days to build complex sourdough notes and airy, blistered crusts.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-200/80">02. Hand-Stretched & Fired</h4>
          <p className="text-xs text-stone-400 leading-relaxed font-light">
            Each pie is shaped by hand on marble slabs, topped with local produce, and baked at 800°F on stone hearths.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-200/80">03. Fast Local Delivery</h4>
          <p className="text-xs text-stone-400 leading-relaxed font-light">
            From oven to cardboard box to your front porch within minutes so you get that signature crackle on every bite.
          </p>
        </div>
      </section>

      {/* ================= MENU SHOWCASE ================= */}
      <section id="menu-section" className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Pies & Provisions</span>
          <h3 className="text-3xl font-serif uppercase tracking-wider text-stone-100">The Menu</h3>
        </div>

        {/* Sizes & Crusts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sizes */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h4 className="font-serif uppercase tracking-wider text-stone-200 text-sm">Base Sizes</h4>
              <span className="text-[11px] text-stone-500 uppercase tracking-widest">Pricing</span>
            </div>
            <div className="space-y-3">
              {SIZES.map((size) => (
                <div key={size.id} className="flex justify-between items-center text-sm py-1.5 border-b border-stone-800/40 last:border-0">
                  <div>
                    <span className="font-semibold text-stone-200">{size.label}</span>
                    <span className="text-xs text-stone-500 block font-light">{size.description}</span>
                  </div>
                  <span className="font-mono text-amber-200 text-xs">${size.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Crusts */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h4 className="font-serif uppercase tracking-wider text-stone-200 text-sm">Crust Options</h4>
              <span className="text-[11px] text-stone-500 uppercase tracking-widest">Style</span>
            </div>
            <div className="space-y-3">
              {CRUSTS.map((crust) => (
                <div key={crust.id} className="flex justify-between items-center text-sm py-1.5 border-b border-stone-800/40 last:border-0">
                  <span className="font-semibold text-stone-200">{crust.label}</span>
                  <span className="text-xs font-mono text-stone-400">{crust.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Toppings Grid */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-stone-800 pb-3">
            <h4 className="font-serif uppercase tracking-wider text-stone-200 text-sm">Fresh Toppings</h4>
            <span className="text-[11px] text-stone-500 uppercase tracking-widest">A La Carte</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Veggies */}
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-400/90 mb-3">Garden Produce</div>
              <div className="space-y-2">
                {VEGGIE_OPTIONS.map((veg) => (
                  <div key={veg.id} className="flex justify-between items-center text-xs py-1 border-b border-stone-800/30">
                    <span className="text-stone-300 font-light">{veg.name}</span>
                    <span className="font-mono text-stone-400">+${veg.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meats */}
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-widest font-bold text-rose-400/90 mb-3">Cured & Roasted Meats</div>
              <div className="space-y-2">
                {MEAT_OPTIONS.map((meat) => (
                  <div key={meat.id} className="flex justify-between items-center text-xs py-1 border-b border-stone-800/30">
                    <span className="text-stone-300 font-light">{meat.name}</span>
                    <span className="font-mono text-stone-400">+${meat.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}