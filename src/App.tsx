import React, { useState, useEffect } from "react";
import { 
  LogOut, 
  User as UserIcon, 
  Sparkles, 
  Package, 
  ShoppingCart, 
  BookOpen, 
  Camera, 
  Menu, 
  X, 
  AlertTriangle,
  Info,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Dashboard from "./components/Dashboard";
import Pantry from "./components/Pantry";
import GroceryList from "./components/GroceryList";
import Recipes from "./components/Recipes";
import ReceiptScanner from "./components/ReceiptScanner";
import { User } from "./types";

export default function App() {
  // Session Authentication state
  const [token, setToken] = useState<string>(() => localStorage.getItem("gr_token") || "");
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem("gr_user");
    return cached ? JSON.parse(cached) : null;
  });

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync Trigger helper - increments to force reload sibling subcomponent API hooks
  const [syncTrigger, setSyncTrigger] = useState(0);

  // Sidebar stats for real-time item matching badges
  const [sidebarStats, setSidebarStats] = useState({
    totalUniqueItems: 0,
    activeLotsCount: 0,
    expiringSoonCount: 0,
    expiredCount: 0,
    lowStockAlarmCount: 0,
    shoppingListItemsCount: 0
  });

  // Authentication Onboarding Forms
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Global styled alert notification/toast state
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | null }>({ msg: "", type: null });

  const triggerToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast({ msg: "", type: null });
    }, 4500);
  };

  // Check active token on startup
  useEffect(() => {
    if (token) {
      fetch("/api/auth/current", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(u => {
          setUser(u);
          localStorage.setItem("gr_user", JSON.stringify(u));
        })
        .catch(() => {
          // Token expired or invalid session structure, signout
          handleLogout();
        });
    }
  }, [token]);

  // Fetch summary counters for real-time sidebar widgets
  const fetchSidebarStats = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/dashboard/summary", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSidebarStats(data);
      }
    } catch (e) {
      console.error("Sidebar stats update error", e);
    }
  };

  useEffect(() => {
    fetchSidebarStats();
  }, [token, syncTrigger]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      setAuthError("Please fill out all required fields.");
      return;
    }

    setAuthError("");
    setAuthLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister 
        ? { email, password, name, householdName }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // Store in memory & cache
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("gr_token", data.token);
      localStorage.setItem("gr_user", JSON.stringify(data.user));
      triggerToast(isRegister ? "Registration successful!" : "Logged in successfully!", "success");
      
      // Clean forms
      setEmail("");
      setPassword("");
      setName("");
      setHouseholdName("");
    } catch (e: any) {
      setAuthError(e.message || "Something went wrong.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    setToken("");
    setUser(null);
    localStorage.removeItem("gr_token");
    localStorage.removeItem("gr_user");
    triggerToast("Logged out of pantry control.", "success");
    setActiveTab("dashboard");
    setMobileMenuOpen(false);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleSyncNotification = () => {
    setSyncTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="app-container">
      
      {/* Toast Alert Notification */}
      <AnimatePresence>
        {toast.type && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg border text-sm font-semibold max-w-sm"
            style={{
              backgroundColor: toast.type === "success" ? "#f0fdf4" : "#fef2f2",
              borderColor: toast.type === "success" ? "#bbf7d0" : "#fecaca",
              color: toast.type === "success" ? "#166534" : "#991b1b"
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-4.5 w-4.5 shrink-0" />
            ) : (
              <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            )}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* AUTHENTICATION PORTAL (IF LOGGED OUT) */}
      {/* ==================================================== */}
      {!token ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 py-12 md:py-20 lg:p-8" id="auth-portal">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
            
            {/* Header banner - Clean light minimalist style */}
            <div className="bg-slate-50 p-8 text-center space-y-2 border-b border-slate-100 relative">
              {/* background sparkle graphics */}
              <div className="absolute top-3 right-3 text-teal-600">
                <Sparkles className="h-6 w-6 opacity-30 animate-pulse" />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-800 font-display">
                Smart Grocery & Pantry
              </h2>
              <p className="text-xs text-slate-500">
                Auto-generate list restocks, track expiries & scan receipt bills with Gemini.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-8 space-y-4">
              {authError && (
                <div className="p-3 border border-rose-100 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {isRegister && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Johnson"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-800 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Household Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Central Cabin (Optional)"
                      value={householdName}
                      onChange={e => setHouseholdName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-800 rounded-xl"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. demo@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-800 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Password *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 focus:outline-none focus:border-slate-800 rounded-xl"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  isRegister ? "Join Household" : "Sign In Securely"
                )}
              </button>

              {/* Quick Assessment hint block */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-[10px] text-slate-400 font-medium">
                <Info className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                <p className="leading-normal">
                  <span className="font-bold text-slate-600">Quick assessment hint:</span> For instant review, you can log in directly using email <span className="font-bold text-teal-600">demo@example.com</span> and password <span className="font-bold text-teal-600">demo</span> to explore custom loaded seed data.
                </p>
              </div>

              {/* Onboarding toggle */}
              <div className="text-center pt-2 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setAuthError("");
                  }}
                  className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer"
                >
                  {isRegister ? "Already registered? Sign In Now" : "Create new shared household"}
                </button>
              </div>

            </form>
          </div>
        </div>
      ) : (
        /* ==================================================== */
        /* MAIN APPLICATION WORKSPACE (IF AUTHORIZED) WITH SIDEBAR */
        /* ==================================================== */
        <div className="flex-grow flex flex-col md:flex-row min-h-0 bg-slate-50 md:h-screen md:overflow-hidden" id="main-application-frame">
          
          {/* DESKTOP SIDEBAR NAVIGATION - Modern Light Minimalist Style */}
          <aside className="hidden md:flex md:w-64 flex-col justify-between bg-white text-slate-700 border-r border-slate-150 shrink-0 z-45 shadow-xs p-5 select-none" id="desktop-sidebar">
            <div className="space-y-6">
              
              {/* Premium App Logo Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100" id="sidebar-logo-container">
                <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                  <Package className="h-5 w-5" />
                </span>
                <div>
                  <h1 className="font-extrabold text-sm tracking-tight text-slate-800 font-display leading-tight">
                    Smart Kitchen
                  </h1>
                  <span className="text-[10px] text-emerald-600 font-mono tracking-wider uppercase font-bold">Pantry Control</span>
                </div>
              </div>

              {/* Household Widget status indicator */}
              {user?.householdName && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between" id="sidebar-household-widget">
                  <div className="truncate">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Active Territory</span>
                    <span className="text-xs font-bold text-slate-700 truncate block">{user.householdName}</span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </div>
              )}

              {/* Navigation Group Items */}
              <div className="space-y-1.5" id="sidebar-nav-actions">
                <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 block pl-2 pb-1">Workspace Deck</span>
                
                {/* Dashboard button */}
                <button
                  onClick={() => handleNavigate("dashboard")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer group ${
                    activeTab === "dashboard"
                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/10"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                  id="tab-btn-dashboard"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className={`h-4.5 w-4.5 ${activeTab === "dashboard" ? "text-white" : "text-slate-400 group-hover:text-emerald-600 transition-colors"}`} />
                    <span>Dashboard</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === "dashboard" ? "text-white" : "text-slate-350 group-hover:translate-x-0.5"}`} />
                </button>

                {/* Inventory & Expiries button */}
                <button
                  onClick={() => handleNavigate("pantry")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer group ${
                    activeTab === "pantry"
                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/10"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                  id="tab-btn-pantry"
                >
                  <div className="flex items-center gap-3">
                    <Package className={`h-4.5 w-4.5 ${activeTab === "pantry" ? "text-white" : "text-slate-400 group-hover:text-emerald-600 transition-colors"}`} />
                    <span>Inventory & Expiries</span>
                  </div>
                  {sidebarStats.expiringSoonCount + sidebarStats.expiredCount > 0 ? (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${activeTab === "pantry" ? "bg-white text-emerald-650" : "bg-amber-100 text-amber-700"}`}>
                      {sidebarStats.expiringSoonCount + sidebarStats.expiredCount}
                    </span>
                  ) : (
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === "pantry" ? "text-white" : "text-slate-350 group-hover:translate-x-0.5"}`} />
                  )}
                </button>

                {/* Shopping List button */}
                <button
                  onClick={() => handleNavigate("grocery")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer group ${
                    activeTab === "grocery"
                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/10"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                  id="tab-btn-grocery"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className={`h-4.5 w-4.5 ${activeTab === "grocery" ? "text-white" : "text-slate-400 group-hover:text-emerald-600 transition-colors"}`} />
                    <span>Shopping List</span>
                  </div>
                  {sidebarStats.shoppingListItemsCount > 0 ? (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shadow-2xs ${activeTab === "grocery" ? "bg-white text-emerald-650" : "bg-emerald-100 text-emerald-700"}`}>
                      {sidebarStats.shoppingListItemsCount}
                    </span>
                  ) : (
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === "grocery" ? "text-white" : "text-slate-350 group-hover:translate-x-0.5"}`} />
                  )}
                </button>

                {/* Recipes Builder button */}
                <button
                  onClick={() => handleNavigate("recipes")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer group ${
                    activeTab === "recipes"
                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/10"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                  id="tab-btn-recipes"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className={`h-4.5 w-4.5 ${activeTab === "recipes" ? "text-white" : "text-slate-400 group-hover:text-emerald-600 transition-colors"}`} />
                    <span>Recipes Builder</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === "recipes" ? "text-white" : "text-slate-350 group-hover:translate-x-0.5"}`} />
                </button>

                {/* Invoices OCR button */}
                <button
                  onClick={() => handleNavigate("scanner")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer group ${
                    activeTab === "scanner"
                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/10"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                  id="tab-btn-scanner"
                >
                  <div className="flex items-center gap-3">
                    <Camera className={`h-4.5 w-4.5 ${activeTab === "scanner" ? "text-white" : "text-slate-400 group-hover:text-emerald-600 transition-colors"}`} />
                    <span>Invoices OCR</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === "scanner" ? "text-white" : "text-slate-350 group-hover:translate-x-0.5"}`} />
                </button>
              </div>

              {/* Real-time Diagnostics quick-card inside sidebar */}
              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5" id="pantry-mini-diagnostics">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Pantry Diagnostics</span>
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Unique Goods:</span>
                  <span className="font-mono font-bold text-slate-700">{sidebarStats.totalUniqueItems}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Active Stock Lots:</span>
                  <span className="font-mono font-bold text-slate-700">{sidebarStats.activeLotsCount}</span>
                </div>
                {sidebarStats.lowStockAlarmCount > 0 && (
                  <div className="text-[10px] bg-red-50 border border-red-150 text-red-650 px-2 py-1 rounded-md font-semibold flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3 text-red-500 shrink-0" />
                    <span>{sidebarStats.lowStockAlarmCount} items low stock!</span>
                  </div>
                )}
              </div>

            </div>

            {/* Profile greeting footer component at very bottom of sidebar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3" id="sidebar-foot-profile">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0" id="sidebar-user-avatar">
                  <span className="h-8 w-8 rounded-xl bg-slate-100 border border-slate-150 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 select-none">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                  </span>
                  <div className="truncate text-left">
                    <span className="text-xs font-bold text-slate-700 block truncate leading-tight">{user?.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate leading-none">System Operator</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 border border-slate-150 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all cursor-pointer active:scale-95"
                  title="Sign Out System"
                  id="btn-sidebar-logout"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                </button>
              </div>
            </div>
          </aside>

          {/* MOBILE NAVIGATION BAR (Desktop hidden) - Styled beautifully in light mode */}
          <header className="md:hidden bg-white border-b border-slate-150 sticky top-0 z-40 flex items-center justify-between h-16 px-4 shrink-0 shadow-3xs" id="mobile-header">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                <Package className="h-5 w-5" />
              </span>
              <span className="font-extrabold text-sm tracking-tight text-slate-800 font-display">
                Smart Grocery & Pantry
              </span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              id="mobile-menu-hamburger"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </header>

          {/* Mobile Drawer (Desktop hidden) */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-b border-slate-150 text-xs font-semibold px-4 py-3 space-y-1.5 absolute top-16 left-0 right-0 z-30 shadow-xl"
              >
                <button
                  onClick={() => handleNavigate("dashboard")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl block ${activeTab === "dashboard" ? "bg-emerald-600 text-white font-bold" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  Dashboard Overview
                </button>
                <button
                  onClick={() => handleNavigate("pantry")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl block ${activeTab === "pantry" ? "bg-emerald-600 text-white font-bold" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  Inventory & Expiries
                </button>
                <button
                  onClick={() => handleNavigate("grocery")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl block ${activeTab === "grocery" ? "bg-emerald-600 text-white font-bold" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  Shopping List
                </button>
                <button
                  onClick={() => handleNavigate("recipes")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl block ${activeTab === "recipes" ? "bg-emerald-600 text-white font-bold" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  Cook Recipes Builder
                </button>
                <button
                  onClick={() => handleNavigate("scanner")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl block ${activeTab === "scanner" ? "bg-emerald-600 text-white font-bold" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  Invoices OCR
                </button>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Member: {user?.name}</span>
                  <button onClick={handleLogout} className="text-rose-600 px-2.5 py-1 bg-rose-50 rounded-lg font-bold border border-rose-100">
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN CANVAS SCROLL VIEWPORT */}
          <div className="flex-1 flex flex-col min-h-0 md:h-screen md:overflow-y-auto bg-slate-50" id="main-scrollable-canvas">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full" id="workspace-viewport">
              {activeTab === "dashboard" && (
                <Dashboard 
                  token={token} 
                  onNavigate={handleNavigate} 
                  triggerToast={triggerToast} 
                  listsCount={syncTrigger}
                  triggerSync={handleSyncNotification}
                />
              )}
              {activeTab === "pantry" && (
                <Pantry 
                  token={token} 
                  triggerToast={triggerToast} 
                  triggerSync={handleSyncNotification}
                />
              )}
              {activeTab === "grocery" && (
                <GroceryList 
                  token={token} 
                  triggerToast={triggerToast} 
                  triggerSync={handleSyncNotification}
                  syncTriggerId={syncTrigger}
                />
              )}
              {activeTab === "recipes" && (
                <Recipes 
                  token={token} 
                  triggerToast={triggerToast} 
                  triggerSync={handleSyncNotification}
                />
              )}
              {activeTab === "scanner" && (
                <ReceiptScanner 
                  token={token} 
                  triggerToast={triggerToast} 
                  triggerSync={handleSyncNotification}
                />
              )}
            </main>

            {/* footer details nested locally */}
            <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 text-[10px] text-center py-4 font-mono font-medium mt-auto" id="applet-viewport-footer">
              <div className="max-w-7xl mx-auto px-4">
                <span>Smart Grocery List & Inventory Manager | Industry Portfolio Case</span>
                <span className="mx-2 text-slate-700">|</span>
                <span>Dual Stack Node ESM + Vite React Workspace Connected</span>
              </div>
            </footer>
          </div>

        </div>
      )}

      {/* footer details */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 text-[10px] text-center py-4 font-mono font-medium">
        <div className="max-w-7xl mx-auto px-4">
          <span>Smart Grocery List & Inventory Manager | Industry Portfolio Case</span>
          <span className="mx-2 text-slate-700">|</span>
          <span>Dual Stack Node ESM + Vite React Workspace Connected</span>
        </div>
      </footer>

    </div>
  );
}
