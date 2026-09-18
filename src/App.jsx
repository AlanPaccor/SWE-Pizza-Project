import { useState } from 'react';

// --- DATA CONFIGURATIONS ---
const SIZES = [
  { id: 'small', label: 'Small (10")', price: 10.99 },
  { id: 'medium', label: 'Medium (12")', price: 13.99 },
  { id: 'large', label: 'Large (14")', price: 16.99 },
  { id: 'xlarge', label: 'X-Large (16")', price: 19.99 },
];

const CRUSTS = [
  { id: 'hand-tossed', label: 'Classic Hand-Tossed' },
  { id: 'thin-crispy', label: 'Thin & Crispy' },
  { id: 'stone-thick', label: 'Stone-Baked Thick' },
  { id: 'garlic-parm', label: 'Garlic Butter Herb' },
];

const SAUCE_LEVELS = [
  { id: 'light', label: 'Light Sauce' },
  { id: 'normal', label: 'Normal Sauce' },
  { id: 'extra', label: 'Extra Sauce' },
];

const VEGGIE_OPTIONS = [
  { id: 'mushrooms', name: 'Fresh Mushrooms', price: 1.25 },
  { id: 'red-onions', name: 'Caramelized Red Onion', price: 1.00 },
  { id: 'bell-peppers', name: 'Green Bell Peppers', price: 1.00 },
  { id: 'black-olives', name: 'Kalamata Black Olives', price: 1.25 },
  { id: 'spinach', name: 'Baby Spinach', price: 1.25 },
  { id: 'roma-tomatoes', name: 'Sliced Roma Tomatoes', price: 1.25 },
];

const MEAT_OPTIONS = [
  { id: 'pepperoni', name: 'Artisan Pepperoni', price: 1.75 },
  { id: 'italian-sausage', name: 'Spicy Italian Sausage', price: 1.75 },
  { id: 'bacon', name: 'Smoked Crispy Bacon', price: 2.00 },
  { id: 'grilled-chicken', name: 'Herbed Grilled Chicken', price: 2.00 },
  { id: 'prosciutto', name: 'Dry-Cured Prosciutto', price: 2.50 },
  { id: 'meatballs', name: 'Handcrafted Beef Meatballs', price: 2.00 },
];

const DEFAULT_PIZZA = {
  size: SIZES[1], // Medium default
  crust: CRUSTS[0],
  sauce: SAUCE_LEVELS[1],
  selectedVeggies: [],
  selectedMeats: [MEAT_OPTIONS[0]],
};

export default function App() {
  // Navigation State ('details' -> 'menu')
  const [activeStep, setActiveStep] = useState('details');

  // Customer State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    streetAddress: '',
    subdivision: '',
    nearestIntersection: '',
    orderType: 'delivery',
  });

  // Pizza Builder State
  const [pizzaBuilder, setPizzaBuilder] = useState(DEFAULT_PIZZA);
  const [editingId, setEditingId] = useState(null);

  // Dropdown Open Toggles
  const [activeDropdown, setActiveDropdown] = useState(null); // 'size' | 'crust' | 'sauce' | null

  // Order Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Form input change handler
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

  // Live calculation of current custom pizza
  const currentPizzaPrice = (
    (pizzaBuilder.size.price || 0) +
    pizzaBuilder.selectedVeggies.reduce((sum, v) => sum + (v.price || 0), 0) +
    pizzaBuilder.selectedMeats.reduce((sum, m) => sum + (m.price || 0), 0)
  ).toFixed(2);

  // Add or Save Edited Pizza
  const handleSavePizza = () => {
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
    setIsCartOpen(true);
  };

  // Delete Pizza from Cart
  const handleDeleteItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Edit Pizza: Load back into builder & navigate to menu view
  const handleEditItem = (pizza) => {
    setPizzaBuilder(pizza);
    setEditingId(pizza.id);
    setIsCartOpen(false);
    setActiveStep('menu');
  };

  // Total cart calculation
  const grandTotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased selection:bg-rose-700 selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[500px] bg-rose-200/40 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* --- TOP BAR / HEADER --- */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <span className="inline-block px-3 py-0.5 rounded-full border border-rose-200 bg-rose-50 text-rose-800 text-xs font-bold tracking-wider uppercase mb-1">
              Stone-Fired Goodness
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">
              Mom & Pop Pizza
            </h1>
          </div>

          {/* Cart Icon & Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 px-4 py-2.5 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-rose-400 hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <svg className="w-6 h-6 text-stone-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-700 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                  {cart.length}
                </span>
              )}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <div className="text-[11px] uppercase font-bold text-stone-400">Cart</div>
              <div className="text-xs font-black text-stone-900">${grandTotal}</div>
            </div>
          </button>
        </header>

        {/* --- CAROUSEL SLIDING CONTAINER --- */}
        <div className="relative overflow-hidden w-full min-h-[640px]">
          <div
            className={`flex w-[200%] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              activeStep === 'details' ? 'translate-x-0' : '-translate-x-1/2'
            }`}
          >
            {/* ================= SECTION 1: CUSTOMER DETAILS ================= */}
            <div className="w-1/2 pr-4">
              <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-xl shadow-stone-200/50">
                <div className="border-b border-stone-100 pb-5 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-stone-900 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-700 text-white text-sm font-bold shadow-xs">
                        1
                      </span>
                      Delivery & Contact
                    </h2>
                    <p className="text-stone-500 text-sm mt-1">Please confirm your contact details.</p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setActiveStep('menu');
                  }}
                  className="space-y-6"
                >
                  {/* Delivery vs Carryout Toggle */}
                  <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-stone-100 border border-stone-200 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setCustomerInfo((prev) => ({ ...prev, orderType: 'delivery' }))}
                      className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                        customerInfo.orderType === 'delivery'
                          ? 'bg-rose-700 text-white shadow-md shadow-rose-700/25'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                       Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerInfo((prev) => ({ ...prev, orderType: 'pickup' }))}
                      className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                        customerInfo.orderType === 'pickup'
                          ? 'bg-rose-700 text-white shadow-md shadow-rose-700/25'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                       Carryout
                    </button>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold uppercase text-stone-700">
                        <span>Full Name *</span>
                        {customerInfo.name.trim().length > 1 && (
                          <span className="text-emerald-700 text-[11px] font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            ✓ Done
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Alex Morgan"
                        value={customerInfo.name}
                        onChange={handleCustomerChange}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:bg-white focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10 transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold uppercase text-stone-700">
                        <span>Phone Number *</span>
                        {customerInfo.phone.trim().length >= 7 && (
                          <span className="text-emerald-700 text-[11px] font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            ✓ Done
                          </span>
                        )}
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="(555) 000-0000"
                        value={customerInfo.phone}
                        onChange={handleCustomerChange}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:bg-white focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold uppercase text-stone-700">
                      <span>Street Address {customerInfo.orderType === 'delivery' && '*'}</span>
                      {customerInfo.streetAddress.trim().length > 3 && (
                        <span className="text-emerald-700 text-[11px] font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          ✓ Done
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      name="streetAddress"
                      required={customerInfo.orderType === 'delivery'}
                      placeholder="123 Oak Hill Road"
                      value={customerInfo.streetAddress}
                      onChange={handleCustomerChange}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 outline-none focus:bg-white focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10 transition-all"
                    />
                  </div>

                  {/* Sub-areas */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                    <div className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                      Neighborhood & Landmarks
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          name="subdivision"
                          placeholder="Subdivision / Community"
                          value={customerInfo.subdivision}
                          onChange={handleCustomerChange}
                          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm text-stone-900 outline-none focus:border-rose-600 transition-all"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="nearestIntersection"
                          placeholder="Nearest Intersection"
                          value={customerInfo.nearestIntersection}
                          onChange={handleCustomerChange}
                          className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm text-stone-900 outline-none focus:border-rose-600 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl font-bold tracking-wide text-white bg-rose-700 hover:bg-rose-800 shadow-lg shadow-rose-700/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Confirm & Build Pizza
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            {/* ================= SECTION 2: PIZZA BUILDER MENU ================= */}
            <div className="w-1/2 pl-4">
              <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-xl shadow-stone-200/50 space-y-8">
                
                {/* Header & Back Action */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                  <div>
                    <h2 className="text-2xl font-black text-stone-900 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-700 text-white text-sm font-bold">
                        2
                      </span>
                      {editingId ? 'Edit Your Pizza' : 'Build Your Pizza'}
                    </h2>
                    <p className="text-stone-500 text-sm mt-1">Select your base, crust, sauce, and toppings.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveStep('details')}
                    className="text-xs font-bold text-stone-500 hover:text-stone-900 border border-stone-200 hover:border-stone-400 rounded-xl px-3 py-2 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    ← Edit Details
                  </button>
                </div>

                {/* DROPDOWN SELECTORS (Size, Crust, Sauce) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Size Dropdown */}
                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      1. Size
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === 'size' ? null : 'size')}
                      className="w-full flex items-center justify-between bg-stone-50 border border-stone-200 hover:border-rose-600 rounded-xl px-4 py-3 text-left font-semibold text-stone-900 transition-all cursor-pointer"
                    >
                      <span className="truncate">{pizzaBuilder.size.label}</span>
                      <svg className={`w-4 h-4 text-stone-400 transition-transform ${activeDropdown === 'size' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDropdown === 'size' && (
                      <div className="absolute z-30 mt-2 w-full bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {SIZES.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setPizzaBuilder((prev) => ({ ...prev, size: item }));
                              setActiveDropdown(null);
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer flex justify-between items-center transition-colors ${
                              pizzaBuilder.size.id === item.id
                                ? 'bg-rose-50 text-rose-800 font-bold'
                                : 'hover:bg-stone-50 text-stone-700'
                            }`}
                          >
                            <span>{item.label}</span>
                            <span className="text-xs text-stone-500">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Crust Dropdown */}
                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      2. Crust
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === 'crust' ? null : 'crust')}
                      className="w-full flex items-center justify-between bg-stone-50 border border-stone-200 hover:border-rose-600 rounded-xl px-4 py-3 text-left font-semibold text-stone-900 transition-all cursor-pointer"
                    >
                      <span className="truncate">{pizzaBuilder.crust.label}</span>
                      <svg className={`w-4 h-4 text-stone-400 transition-transform ${activeDropdown === 'crust' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDropdown === 'crust' && (
                      <div className="absolute z-30 mt-2 w-full bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {CRUSTS.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setPizzaBuilder((prev) => ({ ...prev, crust: item }));
                              setActiveDropdown(null);
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                              pizzaBuilder.crust.id === item.id
                                ? 'bg-rose-50 text-rose-800 font-bold'
                                : 'hover:bg-stone-50 text-stone-700'
                            }`}
                          >
                            {item.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sauce Dropdown */}
                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      3. Sauce
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === 'sauce' ? null : 'sauce')}
                      className="w-full flex items-center justify-between bg-stone-50 border border-stone-200 hover:border-rose-600 rounded-xl px-4 py-3 text-left font-semibold text-stone-900 transition-all cursor-pointer"
                    >
                      <span className="truncate">{pizzaBuilder.sauce.label}</span>
                      <svg className={`w-4 h-4 text-stone-400 transition-transform ${activeDropdown === 'sauce' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDropdown === 'sauce' && (
                      <div className="absolute z-30 mt-2 w-full bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {SAUCE_LEVELS.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setPizzaBuilder((prev) => ({ ...prev, sauce: item }));
                              setActiveDropdown(null);
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                              pizzaBuilder.sauce.id === item.id
                                ? 'bg-rose-50 text-rose-800 font-bold'
                                : 'hover:bg-stone-50 text-stone-700'
                            }`}
                          >
                            {item.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* TOPPINGS SECTIONS: VEGGIES (LEFT) & MEATS (RIGHT) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-stone-800 tracking-wider uppercase">
                    4. Choose Toppings
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* VEGGIES COLUMN */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                          Garden Veggies (+$1.00 - $1.25)
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {VEGGIE_OPTIONS.map((veggie) => {
                          const isSelected = pizzaBuilder.selectedVeggies.some((v) => v.id === veggie.id);
                          return (
                            <div
                              key={veggie.id}
                              onClick={() => toggleVeggie(veggie)}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer active:scale-98 ${
                                isSelected
                                  ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                                  : 'bg-white border-stone-200 hover:border-stone-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {/* Interactive Radio Check Indicator */}
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'border-emerald-600 bg-emerald-600 scale-105'
                                      : 'border-stone-300 bg-stone-100'
                                  }`}
                                >
                                  {isSelected && (
                                    <svg className="w-3.5 h-3.5 text-white stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  )}
                                </div>
                                <span className={`text-sm ${isSelected ? 'font-bold text-emerald-950' : 'text-stone-700'}`}>
                                  {veggie.name}
                                </span>
                              </div>
                              <span className="text-xs text-stone-500 font-semibold">
                                +${veggie.price.toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* MEATS COLUMN */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                          Savory Meats (+$1.75 - $2.50)
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {MEAT_OPTIONS.map((meat) => {
                          const isSelected = pizzaBuilder.selectedMeats.some((m) => m.id === meat.id);
                          return (
                            <div
                              key={meat.id}
                              onClick={() => toggleMeat(meat)}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer active:scale-98 ${
                                isSelected
                                  ? 'bg-rose-50/80 border-rose-600 shadow-xs'
                                  : 'bg-white border-stone-200 hover:border-stone-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {/* Interactive Radio Check Indicator */}
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'border-rose-600 bg-rose-600 scale-105'
                                      : 'border-stone-300 bg-stone-100'
                                  }`}
                                >
                                  {isSelected && (
                                    <svg className="w-3.5 h-3.5 text-white stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  )}
                                </div>
                                <span className={`text-sm ${isSelected ? 'font-bold text-rose-950' : 'text-stone-700'}`}>
                                  {meat.name}
                                </span>
                              </div>
                              <span className="text-xs text-stone-500 font-semibold">
                                +${meat.price.toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ADD TO ORDER FOOTER BUTTON */}
                <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-stone-500 uppercase font-semibold">Current Pie Total</span>
                    <div className="text-3xl font-black text-stone-900">${currentPizzaPrice}</div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSavePizza}
                    className="w-full sm:w-auto px-8 py-4 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold shadow-lg shadow-rose-700/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{editingId ? 'Update Pizza in Order' : 'Add to Order'}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ================= MODAL: SLIDE-OVER / POPUP CART ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <div>
                <h3 className="text-xl font-black text-stone-900">Your Order Cart</h3>
                <p className="text-xs text-stone-500">{cart.length} item(s) selected</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="h-8 w-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Items List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-stone-400">
                  <div className="text-4xl mb-2">🍕</div>
                  <p className="font-semibold">Your cart is empty.</p>
                  <p className="text-xs mt-1">Build your first customized stone-fired pizza!</p>
                </div>
              ) : (
                cart.map((pizza, index) => (
                  <div
                    key={pizza.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-stone-900">
                        #{index + 1}: {pizza.size.label} Pie
                      </div>
                      <span className="font-black text-rose-700">${pizza.price}</span>
                    </div>

                    <div className="text-xs text-stone-600 space-y-0.5">
                      <div><span className="font-semibold text-stone-800">Crust:</span> {pizza.crust.label}</div>
                      <div><span className="font-semibold text-stone-800">Sauce:</span> {pizza.sauce.label}</div>
                      {(pizza.selectedVeggies.length > 0 || pizza.selectedMeats.length > 0) && (
                        <div>
                          <span className="font-semibold text-stone-800">Toppings:</span>{' '}
                          {[...pizza.selectedMeats, ...pizza.selectedVeggies]
                            .map((t) => t.name)
                            .join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-stone-200/60 mt-3">
                      <button
                        type="button"
                        onClick={() => handleEditItem(pizza)}
                        className="text-xs font-bold text-stone-700 hover:text-stone-950 px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 transition-all cursor-pointer"
                      >
                        ✎ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(pizza.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Checkout Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-100 bg-stone-50 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-stone-800">
                  <span>Grand Total:</span>
                  <span className="text-2xl font-black text-stone-900">${grandTotal}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Order placed for ${customerInfo.name || 'Customer'}! Total: $${grandTotal}`)}
                  className="w-full py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl shadow-lg shadow-rose-700/25 active:scale-98 transition-all cursor-pointer text-center"
                >
                  Checkout Order
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}