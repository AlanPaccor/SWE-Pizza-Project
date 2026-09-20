// src/App.jsx
// src/App.jsx
import { useState } from 'react';
import HomeMenu from './HomeMenu';
import { SIZES, CRUSTS, SAUCE_LEVELS, VEGGIE_OPTIONS, MEAT_OPTIONS } from './menuData';

const DEFAULT_PIZZA = {
  size: SIZES[1], // Medium default
  crust: CRUSTS[0],
  sauce: SAUCE_LEVELS[1],
  selectedVeggies: [],
  selectedMeats: [MEAT_OPTIONS[0]],
};

export default function App() {
  // Navigation: 'landing' (Home/Menu showcase) vs 'order' (Customizer flow)
  const [currentView, setCurrentView] = useState('landing');
  const [activeStep, setActiveStep] = useState('details'); // 'details' | 'menu'

  // Customer State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    streetAddress: '',
    subdivision: '',
    nearestIntersection: '',
    orderType: 'delivery',
  });

  // Pizza State
  const [pizzaBuilder, setPizzaBuilder] = useState(DEFAULT_PIZZA);
  const [editingId, setEditingId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [lastAddedPrice, setLastAddedPrice] = useState(null);

  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Input change handler
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle Veggie selection
  const toggleVeggie = (veggie) => {
    setPizzaBuilder((prev) => {
      const exists = prev.selectedVeggies.some((item) => item.id === veggie.id);
      return {
        ...prev,
        selectedVeggies: exists
          ? prev.selectedVeggies.filter((item) => item.id !== veggie.id)
          : [...prev.selectedVeggies, veggie],
      };
    });
  };

  // Toggle Meat selection
  const toggleMeat = (meat) => {
    setPizzaBuilder((prev) => {
      const exists = prev.selectedMeats.some((item) => item.id === meat.id);
      return {
        ...prev,
        selectedMeats: exists
          ? prev.selectedMeats.filter((item) => item.id !== meat.id)
          : [...prev.selectedMeats, meat],
      };
    });
  };

  const currentPizzaPrice = (
    (pizzaBuilder.size?.price || 0) +
    pizzaBuilder.selectedVeggies.reduce((sum, v) => sum + (v.price || 0), 0) +
    pizzaBuilder.selectedMeats.reduce((sum, m) => sum + (m.price || 0), 0)
  ).toFixed(2);

  const handleSavePizza = () => {
    setLastAddedPrice(currentPizzaPrice);

    if (editingId) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...pizzaBuilder, id: editingId, price: currentPizzaPrice }
            : item
        )
      );
      setEditingId(null);
    } else {
      const newPizza = {
        ...pizzaBuilder,
        id: Date.now(),
        price: currentPizzaPrice,
      };
      setCart((prev) => [...prev, newPizza]);
    }
    setPizzaBuilder(DEFAULT_PIZZA);
  };

  const handleDeleteItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const handleEditItem = (pizza) => {
    setPizzaBuilder(pizza);
    setEditingId(pizza.id);
    setIsCartOpen(false);
    setActiveStep('menu');
  };

  const grandTotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

  // Smooth scroll helper for menu/about anchors
  const navigateToSection = (sectionId) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans antialiased selection:bg-amber-200 selection:text-stone-950 pb-16">
      
      {/* ================= FLOATING MODERN NAVBAR ================= */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-stone-950/80 border-b border-stone-800/80 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Left: Social Media Icons (Blended floating icons) */}
          <div className="flex items-center gap-5 z-10">
            {/* Instagram */}
            <a
              href="#instagram"
              aria-label="Instagram"
              className="text-stone-300 hover:text-amber-200 transition-all duration-300 hover:scale-125 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="#facebook"
              aria-label="Facebook"
              className="text-stone-300 hover:text-amber-200 transition-all duration-300 hover:scale-125 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>

          {/* Center: Brand Name (Click returns Home) */}
          <div
            onClick={() => setCurrentView('landing')}
            className="text-center cursor-pointer group select-none"
          >
            <span className="block font-serif text-xl sm:text-2xl tracking-[0.25em] text-stone-100 group-hover:text-amber-200 transition-colors uppercase font-bold">
              Mom & Pop
            </span>
            <span className="block text-[9px] uppercase tracking-[0.4em] text-stone-400 font-light">
              Pizzeria & Hearth
            </span>
          </div>

          {/* Right: Floating Navigation Links & Cart */}
          <div className="flex items-center gap-6 sm:gap-8">
            <button
              type="button"
              onClick={() => navigateToSection('about-section')}
              className="hidden sm:inline-block text-xs uppercase tracking-widest text-stone-300 hover:text-amber-200 transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              About
            </button>

            <button
              type="button"
              onClick={() => navigateToSection('menu-section')}
              className="text-xs uppercase tracking-widest text-stone-300 hover:text-amber-200 transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              Menu
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentView('order');
                setActiveStep('details');
              }}
              className="text-xs uppercase tracking-widest font-bold text-amber-200 hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              Order Now
            </button>

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative text-stone-300 hover:text-amber-200 transition-all duration-300 hover:scale-110 cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs font-mono font-bold">({cart.length})</span>
            </button>
          </div>

        </div>
      </nav>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* VIEW 1: HOME LANDING & MENU DISPLAY */}
        {currentView === 'landing' ? (
          <HomeMenu
            onOrderNow={() => {
              setCurrentView('order');
              setActiveStep('details');
            }}
          />
        ) : (
          /* VIEW 2: ORDER PROCESS (DETAILS -> BUILDER) */
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Sub-nav back to menu showcase */}
            <div className="flex justify-between items-center pb-2">
              <button
                type="button"
                onClick={() => setCurrentView('landing')}
                className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                ← Return to Overview
              </button>
              <span className="text-xs font-mono text-stone-500">
                Step {activeStep === 'details' ? '1 of 2: Details' : '2 of 2: Pizza Customizer'}
              </span>
            </div>

            {/* Sliding Container */}
            <div className="relative overflow-hidden w-full min-h-[640px]">
              <div
                className={`flex w-[200%] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  activeStep === 'details' ? 'translate-x-0' : '-translate-x-1/2'
                }`}
              >
                {/* SECTION 1: CUSTOMER DETAILS */}
                <div className="w-1/2 pr-4">
                  <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
                    <div className="border-b border-stone-800 pb-5 mb-6 flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-serif uppercase tracking-wider text-stone-100 flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200 text-stone-950 text-xs font-bold font-mono">
                            1
                          </span>
                          Delivery & Contact
                        </h2>
                        <p className="text-stone-400 text-xs mt-1">Please confirm where we are delivering.</p>
                      </div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setActiveStep('menu');
                      }}
                      className="space-y-5"
                    >
                      {/* Delivery vs Carryout Toggle */}
                      <div className="grid grid-cols-2 gap-2 p-1 bg-stone-950 border border-stone-800 rounded-2xl">
                        <button
                          type="button"
                          onClick={() => setCustomerInfo((prev) => ({ ...prev, orderType: 'delivery' }))}
                          className={`py-2.5 px-4 rounded-xl text-xs uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                            customerInfo.orderType === 'delivery'
                              ? 'bg-amber-200 text-stone-950 shadow-md scale-[1.01]'
                              : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerInfo((prev) => ({ ...prev, orderType: 'pickup' }))}
                          className={`py-2.5 px-4 rounded-xl text-xs uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                            customerInfo.orderType === 'pickup'
                              ? 'bg-amber-200 text-stone-950 shadow-md scale-[1.01]'
                              : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          Carryout
                        </button>
                      </div>

                      {/* Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs uppercase tracking-wider text-stone-300">
                            <span>Full Name *</span>
                            {customerInfo.name.trim().length > 1 && (
                              <span className="text-emerald-400 text-[11px] font-bold">✓ Done</span>
                            )}
                          </div>
                          <input
                            type="text"
                            name="name"
                            required
                            placeholder="Alex Morgan"
                            value={customerInfo.name}
                            onChange={handleCustomerChange}
                            className="w-full bg-stone-950/70 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 outline-none focus:border-amber-200/80 transition-all text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs uppercase tracking-wider text-stone-300">
                            <span>Phone Number *</span>
                            {customerInfo.phone.trim().length >= 7 && (
                              <span className="text-emerald-400 text-[11px] font-bold">✓ Done</span>
                            )}
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            required
                            placeholder="(555) 000-0000"
                            value={customerInfo.phone}
                            onChange={handleCustomerChange}
                            className="w-full bg-stone-950/70 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 outline-none focus:border-amber-200/80 transition-all text-sm"
                          />
                        </div>
                      </div>

                      {/* Street Address */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs uppercase tracking-wider text-stone-300">
                          <span>Street Address {customerInfo.orderType === 'delivery' && '*'}</span>
                          {customerInfo.streetAddress.trim().length > 3 && (
                            <span className="text-emerald-400 text-[11px] font-bold">✓ Done</span>
                          )}
                        </div>
                        <input
                          type="text"
                          name="streetAddress"
                          required={customerInfo.orderType === 'delivery'}
                          placeholder="123 Oak Hill Road"
                          value={customerInfo.streetAddress}
                          onChange={handleCustomerChange}
                          className="w-full bg-stone-950/70 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 outline-none focus:border-amber-200/80 transition-all text-sm"
                        />
                      </div>

                      {/* Sub-areas */}
                      <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-3">
                        <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                          Neighborhood & Landmarks
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="subdivision"
                            placeholder="Subdivision / Community"
                            value={customerInfo.subdivision}
                            onChange={handleCustomerChange}
                            className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 outline-none focus:border-amber-200 transition-all"
                          />
                          <input
                            type="text"
                            name="nearestIntersection"
                            placeholder="Nearest Intersection"
                            value={customerInfo.nearestIntersection}
                            onChange={handleCustomerChange}
                            className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 outline-none focus:border-amber-200 transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 px-6 rounded-xl font-bold tracking-wider text-xs uppercase text-stone-950 bg-amber-200 hover:bg-amber-100 shadow-lg shadow-amber-200/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Confirm & Build Pizza</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>

                {/* SECTION 2: PIZZA BUILDER */}
                <div className="w-1/2 pl-4">
                  <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-6">
                    
                    <div className="flex items-center justify-between border-b border-stone-800 pb-5">
                      <div>
                        <h2 className="text-2xl font-serif uppercase tracking-wider text-stone-100 flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200 text-stone-950 text-xs font-bold font-mono">
                            2
                          </span>
                          {editingId ? 'Edit Pizza' : 'Build Custom Pie'}
                        </h2>
                        <p className="text-stone-400 text-xs mt-1">Select crust, base, and toppings.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveStep('details')}
                        className="text-xs uppercase tracking-wider text-stone-400 hover:text-stone-100 border border-stone-800 hover:border-stone-600 rounded-xl px-3 py-1.5 transition-all cursor-pointer"
                      >
                        ← Edit Info
                      </button>
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Size */}
                      <div className="relative">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">1. Size</label>
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === 'size' ? null : 'size')}
                          className="w-full flex items-center justify-between bg-stone-950 border border-stone-800 hover:border-amber-200/60 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-stone-200 transition-all cursor-pointer"
                        >
                          <span className="truncate">{pizzaBuilder.size.label}</span>
                          <svg className={`w-3.5 h-3.5 text-stone-500 transition-transform ${activeDropdown === 'size' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {activeDropdown === 'size' && (
                          <div className="absolute z-30 mt-2 w-full bg-stone-900 border border-stone-800 rounded-xl shadow-2xl overflow-hidden">
                            {SIZES.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setPizzaBuilder((prev) => ({ ...prev, size: item }));
                                  setActiveDropdown(null);
                                }}
                                className={`px-3.5 py-2 text-xs cursor-pointer flex justify-between items-center transition-colors ${
                                  pizzaBuilder.size.id === item.id ? 'bg-amber-200/10 text-amber-200 font-bold' : 'hover:bg-stone-800 text-stone-300'
                                }`}
                              >
                                <span>{item.label}</span>
                                <span className="font-mono text-stone-400">${item.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Crust */}
                      <div className="relative">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">2. Crust</label>
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === 'crust' ? null : 'crust')}
                          className="w-full flex items-center justify-between bg-stone-950 border border-stone-800 hover:border-amber-200/60 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-stone-200 transition-all cursor-pointer"
                        >
                          <span className="truncate">{pizzaBuilder.crust.label}</span>
                          <svg className={`w-3.5 h-3.5 text-stone-500 transition-transform ${activeDropdown === 'crust' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {activeDropdown === 'crust' && (
                          <div className="absolute z-30 mt-2 w-full bg-stone-900 border border-stone-800 rounded-xl shadow-2xl overflow-hidden">
                            {CRUSTS.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setPizzaBuilder((prev) => ({ ...prev, crust: item }));
                                  setActiveDropdown(null);
                                }}
                                className={`px-3.5 py-2 text-xs cursor-pointer transition-colors ${
                                  pizzaBuilder.crust.id === item.id ? 'bg-amber-200/10 text-amber-200 font-bold' : 'hover:bg-stone-800 text-stone-300'
                                }`}
                              >
                                {item.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Sauce */}
                      <div className="relative">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">3. Sauce</label>
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === 'sauce' ? null : 'sauce')}
                          className="w-full flex items-center justify-between bg-stone-950 border border-stone-800 hover:border-amber-200/60 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-stone-200 transition-all cursor-pointer"
                        >
                          <span className="truncate">{pizzaBuilder.sauce.label}</span>
                          <svg className={`w-3.5 h-3.5 text-stone-500 transition-transform ${activeDropdown === 'sauce' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {activeDropdown === 'sauce' && (
                          <div className="absolute z-30 mt-2 w-full bg-stone-900 border border-stone-800 rounded-xl shadow-2xl overflow-hidden">
                            {SAUCE_LEVELS.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setPizzaBuilder((prev) => ({ ...prev, sauce: item }));
                                  setActiveDropdown(null);
                                }}
                                className={`px-3.5 py-2 text-xs cursor-pointer transition-colors ${
                                  pizzaBuilder.sauce.id === item.id ? 'bg-amber-200/10 text-amber-200 font-bold' : 'hover:bg-stone-800 text-stone-300'
                                }`}
                              >
                                {item.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Toppings Columns */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-300">4. Toppings Selection</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Veggies */}
                        <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
                          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Garden Veggies</div>
                          <div className="space-y-1.5">
                            {VEGGIE_OPTIONS.map((veggie) => {
                              const isSelected = pizzaBuilder.selectedVeggies.some((v) => v.id === veggie.id);
                              return (
                                <div
                                  key={veggie.id}
                                  onClick={() => toggleVeggie(veggie)}
                                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
                                      : 'bg-stone-900/50 border-stone-800/80 text-stone-300 hover:border-stone-700'
                                  }`}
                                >
                                  <span className="text-xs">{veggie.name}</span>
                                  <span className="text-[11px] font-mono text-stone-400">+${veggie.price.toFixed(2)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Meats */}
                        <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
                          <div className="text-[11px] font-bold text-rose-400 uppercase tracking-widest mb-2">Savory Meats</div>
                          <div className="space-y-1.5">
                            {MEAT_OPTIONS.map((meat) => {
                              const isSelected = pizzaBuilder.selectedMeats.some((m) => m.id === meat.id);
                              return (
                                <div
                                  key={meat.id}
                                  onClick={() => toggleMeat(meat)}
                                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-rose-950/40 border-rose-500/80 text-rose-200'
                                      : 'bg-stone-900/50 border-stone-800/80 text-stone-300 hover:border-stone-700'
                                  }`}
                                >
                                  <span className="text-xs">{meat.name}</span>
                                  <span className="text-[11px] font-mono text-stone-400">+${meat.price.toFixed(2)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Builder Footer */}
                    <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        {lastAddedPrice ? (
                          <div>
                            <span className="text-[11px] text-stone-400 uppercase tracking-widest block">Last Added Total</span>
                            <span className="text-2xl font-serif text-amber-200">${lastAddedPrice}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-stone-500 italic">Total calculates upon adding</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleSavePizza}
                        className="w-full sm:w-auto px-7 py-3 bg-amber-200 hover:bg-amber-100 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        {editingId ? 'Update Pizza in Order' : 'Add to Order'}
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* ================= CART POPUP DRAWER ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-stone-800 flex justify-between items-center bg-stone-950">
              <h3 className="text-base font-serif uppercase tracking-wider text-stone-100">Order Cart ({cart.length})</h3>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-stone-400 hover:text-white transition-colors cursor-pointer text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">Your cart is empty.</div>
              ) : (
                cart.map((pizza, index) => (
                  <div key={pizza.id} className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-stone-200">
                      <span>#{index + 1}: {pizza.size.label}</span>
                      <span className="font-mono text-amber-200">${pizza.price}</span>
                    </div>
                    <div className="text-[11px] text-stone-400">
                      <div>Crust: {pizza.crust.label} | Sauce: {pizza.sauce.label}</div>
                      {(pizza.selectedVeggies.length > 0 || pizza.selectedMeats.length > 0) && (
                        <div className="mt-0.5 text-stone-300">
                          {[...pizza.selectedMeats, ...pizza.selectedVeggies].map((t) => t.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-3 pt-1 text-[11px]">
                      <button type="button" onClick={() => handleEditItem(pizza)} className="text-stone-300 hover:text-amber-200 cursor-pointer">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDeleteItem(pizza.id)} className="text-rose-400 hover:text-rose-300 cursor-pointer">
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-stone-800 bg-stone-950 space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-stone-300">
                  <span>Grand Total:</span>
                  <span className="text-base font-mono text-amber-200">${grandTotal}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Proceeding to payment for $${grandTotal}`)}
                  className="w-full py-3 bg-amber-200 hover:bg-amber-100 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}