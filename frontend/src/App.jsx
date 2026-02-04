import React, { Suspense, useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, useTexture, Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { 
  ShoppingCart, User, Search, ChevronLeft, ChevronRight, ChevronDown, Menu, X, Phone,
  Coffee, Sparkles, LayoutDashboard, Users, Package, Settings, 
  LogOut, CreditCard, MapPin, Bell, CheckCircle2, ArrowRight, ArrowUp,
  TrendingUp, DollarSign, Clock, Filter, Mail, Lock, Truck, Download
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { useScroll, useTransform } from 'framer-motion';

import coffeeImg from './assets/0a2e60c15f4dd0e82f6f58f42f913955-removebg-preview.png';
import coffeeImg2 from './assets/74e71e92a8e31370e2f794d6570fcf01.jpg';
import rashfaLogo from './assets/LR-removebg-preview.png';
import coffeeBlastImg from './assets/cofee.png';

const BUSINESS_RULES = {
  DELIVERY_FEE: 15,
  FREE_DELIVERY_THRESHOLD: 100,
  TVA: 0.20,
  OPENING_TIME: "07:00",
  CLOSING_TIME: "20:00",
  ORDER_ACCEPTANCE_START: "06:30",
  ORDER_ACCEPTANCE_END: "19:30",
  PEAK_HOURS: [
    { start: "12:00", end: "14:00" },
    { start: "17:00", end: "19:00" }
  ],
  MAX_DELIVERY_TIME: 75,
  BREAKFAST_PROMO: {
    PRICE: 25,
    ORIGINAL_PRICE: 30,
    DESCRIPTION: "Café + Croissant"
  },
  GROUP_ORDER_THRESHOLD: 10,
  GROUP_ORDER_NOTICE: "24h",
  CATERING_NOTICE: "72h",
  FIDELITY_FREE_COFFEE: 9,
  STUDENT_DISCOUNT: 0.10,
  VAT_RATE: "20%"
};

const POLICIES = [
  { 
    title: "Quality Guarantee", 
    icon: <CheckCircle2 size={24} />, 
    details: ["Coffee served at 65-70°C", "Isothermal packaging", "Free replacement for quality issues"] 
  },
  { 
    title: "Delivery Rules", 
    icon: <MapPin size={24} />, 
    details: ["15 MAD fee", "Free above 100 MAD", "5km radius", "No delivery during peak hours"] 
  },
  { 
    title: "Ordering", 
    icon: <Clock size={24} />, 
    details: ["Service: 7 AM - 8 PM", "Online: 6:30 AM - 7:30 PM", "Group orders (>10): 24h notice"] 
  }
];

const CATEGORIES = {
  COFFEE: 'COFFEE',
  CROISSANTS: 'CROISSANTS',
  PASTRY: 'PASTRY',
  DRINKS: 'DRINKS'
};

const CUSTOMIZATION_OPTIONS = {
  [CATEGORIES.COFFEE]: {
    milk: ["None", "Whole Milk", "Soy Milk", "Oat Milk", "Almond Milk"],
    sugar: ["No Sugar", "Light Sugar", "Normal", "Extra Sugar"]
  }
};

const PRODUCTS = {
  [CATEGORIES.COFFEE]: [
    { id: 'c1', name: "ESPRESSO", price: 15, img: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Intense and aromatic single shot", volume: "30ml", allergens: ["None"], nutrition: { cal: 5, caffeine: "63mg" } },
    { id: 'c2', name: "AMERICANO", price: 18, img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Smooth long black coffee", volume: "60ml", allergens: ["None"], nutrition: { cal: 5, caffeine: "80mg" } },
    { id: 'c3', name: "CAPPUCCINO", price: 25, img: "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Equal parts espresso, milk & foam", volume: "200ml", allergens: ["Lactose"], nutrition: { cal: 120, protein: "8g" } },
    { id: 'c4', name: "LATTE", price: 28, img: "https://images.pexels.com/photos/2156681/pexels-photo-2156681.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Espresso with steamed milk", volume: "250ml", allergens: ["Lactose"], nutrition: { cal: 150, protein: "9g" } },
    { id: 'c5', name: "ICED AMERICANO", price: 20, img: "https://images.pexels.com/photos/302904/pexels-photo-302904.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Espresso diluted with hot water", volume: "200ml", allergens: ["None"], nutrition: { cal: 10, caffeine: "120mg" } },
    { id: 'c6', name: "MOCHA", price: 30, img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Espresso with chocolate and milk", volume: "250ml", allergens: ["Lactose", "Cacao"], nutrition: { cal: 230, sugar: "25g" } }
  ],
  [CATEGORIES.CROISSANTS]: [
    { id: 'cr1', name: "CARAMEL LATTE", price: 32, img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Creamy espresso with caramel syrup", volume: "250ml", allergens: ["Lactose"], nutrition: { cal: 210, sugar: "22g" } },
    { id: 'cr2', name: "VANILLA LATTE", price: 30, img: "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Smooth vanilla infused milk and coffee", volume: "250ml", allergens: ["Lactose"], nutrition: { cal: 190, sugar: "18g" } },
    { id: 'cr3', name: "HAZELNUT LATTE", price: 35, img: "https://images.pexels.com/photos/2156681/pexels-photo-2156681.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Nutty hazelnut flavor with espresso", volume: "250ml", allergens: ["Lactose", "Nuts"], nutrition: { cal: 220, sugar: "20g" } },
    { id: 'cr4', name: "WHITE MOCHA", price: 38, img: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "White chocolate mocha with whipped cream", volume: "300ml", allergens: ["Lactose"], nutrition: { cal: 350, sugar: "35g" } }
  ],
  [CATEGORIES.PASTRY]: [
    { id: 'p1', name: "COLD BREW", price: 28, img: "https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Slow-steeped for 20 hours", volume: "350ml", allergens: ["None"], nutrition: { cal: 5, caffeine: "150mg" } },
    { id: 'p2', name: "NITRO COLD BREW", price: 35, img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Infused with nitrogen for a velvety finish", volume: "350ml", allergens: ["None"], nutrition: { cal: 5, caffeine: "180mg" } },
    { id: 'p3', name: "ICED AMERICANO", price: 22, img: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Classic Americano served over ice", volume: "350ml", allergens: ["None"], nutrition: { cal: 10, caffeine: "120mg" } }
  ],
  [CATEGORIES.DRINKS]: [
    { id: 'b1', name: "TEAS", price: 15, img: "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Premium green or black tea selection", volume: "250ml", allergens: ["None"], nutrition: { cal: 0, sugar: "0g" } },
    { id: 'b2', name: "JUICES", price: 25, img: "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Freshly squeezed seasonal fruits", volume: "330ml", allergens: ["None"], nutrition: { cal: 140, vitC: "80%" } },
    { id: 'b3', name: "MINERAL WATERS", price: 10, img: "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=400", desc: "Chilled natural mineral water", volume: "500ml", allergens: ["None"], nutrition: { cal: 0, ph: "7.2" } }
  ]
};

const BrandPreloader = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[10000] bg-[#001a13] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,208,132,0.1),transparent_70%)]" />
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#00d084]/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#00d084]/5 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Brand Identity */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-col items-center"
        >
          <div className="relative mb-8">
            <motion.div
              animate={{ 
                boxShadow: ["0 0 30px rgba(0,208,132,0.2)", "0 0 60px rgba(0,208,132,0.4)", "0 0 30px rgba(0,208,132,0.2)"],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full border border-[#00d084]/30 flex items-center justify-center bg-white/5 backdrop-blur-md p-5 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00d084]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src={rashfaLogo} 
                alt="RASHFA Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,208,132,0.6)] relative z-10"
              />
            </motion.div>
          </div>
          <h2 className="text-7xl font-black text-white tracking-[0.3em] flex items-center drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
            R<span className="text-[#00d084]">A</span>SHFA
          </h2>
          <div className="flex items-center gap-6 mt-4">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#00d084]/50 to-transparent" />
            <span className="text-[#00d084] text-[11px] font-black tracking-[0.8em] uppercase">Premium Coffee</span>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent via-[#00d084]/50 to-transparent" />
          </div>
        </motion.div>

        {/* Professional Moka Pot Animation */}
        <div className="relative mb-20 scale-125">
          <motion.div
            animate={{ 
              rotate: [0, 32, 32, 0],
              y: [0, -8, -8, 0],
              x: [0, 4, 4, 0]
            }}
            transition={{ 
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.8, 1]
            }}
            className="relative z-10"
            style={{ transformOrigin: "85% 90%" }}
          >
            <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_25px_40px_rgba(0,0,0,0.6)]">
              <defs>
                <linearGradient id="potGradientMain" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c0c0c0" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#a0a0a0" />
                </linearGradient>
                <linearGradient id="handleGradientMain" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2a2a2a" />
                  <stop offset="100%" stopColor="#0a0a0a" />
                </linearGradient>
              </defs>
              
              {/* Handle - More visible and stylized */}
              <path 
                d="M30 45C10 45 8 95 30 95" 
                stroke="url(#handleGradientMain)" 
                strokeWidth="14" 
                strokeLinecap="round" 
                fill="none"
              />
              <path 
                d="M30 45C12 45 10 95 30 95" 
                stroke="white" 
                strokeOpacity="0.15"
                strokeWidth="5" 
                strokeLinecap="round" 
                fill="none"
              />

              {/* Body Components */}
              <path d="M40 120L32 75L40 70L36 25H86L82 70L90 75L82 120H40Z" fill="#000" fillOpacity="0.3" />
              <path d="M45 120L37 75L45 70L41 25H81L77 70L85 75L77 120H45Z" fill="url(#potGradientMain)" />
              
              {/* Facet Detail Lines */}
              <path d="M53 25L57 70L57 120" stroke="white" strokeOpacity="0.4" strokeWidth="0.8" />
              <path d="M69 25L65 70L65 120" stroke="black" strokeOpacity="0.15" strokeWidth="0.8" />
              
              {/* Lid & Accents */}
              <path d="M41 25L46 10H76L81 25H41Z" fill="#f0f0f0" />
              <path d="M41 25L81 25" stroke="black" strokeOpacity="0.1" strokeWidth="1" />
              <rect x="37" y="70" width="48" height="10" fill="#888" rx="1.5" />
              
              {/* Spout */}
              <path d="M81 35L104 48L81 60V35Z" fill="url(#potGradientMain)" />
              
              {/* Knob */}
              <circle cx="61" cy="8" r="7" fill="#1a1a1a" />
              <circle cx="58" cy="5" r="2.5" fill="white" fillOpacity="0.4" />
            </svg>

            {/* Enhanced Realistic Coffee Stream */}
            <div className="absolute top-[48px] left-[98px] w-[10px] overflow-visible">
              <motion.div
                animate={{ 
                  height: [0, 0, 180, 180, 0],
                  opacity: [0, 0, 1, 1, 0],
                }}
                transition={{ 
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.38, 0.48, 0.8, 0.9]
                }}
                className="w-full bg-gradient-to-b from-[#00d084] via-[#00d084] to-[#008f5a] rounded-full relative"
                style={{ transformOrigin: "top center" }}
              >
                <div className="absolute inset-0 bg-[#00d084] blur-[6px] opacity-60" />
                <div className="absolute inset-x-[2px] inset-y-0 bg-white/20 blur-[1px] rounded-full" />
                
                {/* Flow Particles */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, 180],
                      opacity: [0, 1, 0],
                      scale: [1, 0.8]
                    }}
                    transition={{ 
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "linear"
                    }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-6 bg-white/50 rounded-full blur-[0.5px]"
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Steam/Aroma Effects */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -60],
                  x: [0, i === 0 ? -15 : i === 2 ? 15 : 0],
                  opacity: [0, 0.4, 0],
                  scale: [0.6, 2],
                  rotate: [0, i % 2 === 0 ? 45 : -45]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeOut"
                }}
                className="w-4 h-12 bg-gradient-to-t from-white/10 to-transparent rounded-full blur-md"
              />
            ))}
          </div>
        </div>

        {/* Progress Loading Bar */}
        <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00d084] to-[#05ffa3] shadow-[0_0_15px_rgba(0,208,132,0.5)]"
          />
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-[#00d084] text-[9px] font-black tracking-[0.5em] uppercase animate-pulse"
        >
          Brewing Excellence...
        </motion.p>
      </div>
    </motion.div>
  );
};

const PageLoader = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[10000] bg-[#001a13] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,208,132,0.05),transparent_70%)]" />
      
      <div className="relative flex flex-col items-center scale-75 md:scale-90">
        {/* Professional Moka Pot Animation */}
        <div className="relative mb-12">
          <motion.div
            animate={{ 
              rotate: [0, 35, 35, 0],
              y: [0, -5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.4, 0.8, 1]
            }}
            className="relative z-10"
            style={{ transformOrigin: "85% 90%" }}
          >
            <svg width="100" height="120" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]">
              <defs>
                <linearGradient id="pagePotGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d1d1d1" />
                  <stop offset="50%" stopColor="#f5f5f5" />
                  <stop offset="100%" stopColor="#b0b0b0" />
                </linearGradient>
                <linearGradient id="pageHandleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#333" />
                  <stop offset="100%" stopColor="#111" />
                </linearGradient>
              </defs>
              
              {/* Handle */}
              <path 
                d="M30 45C15 45 12 95 30 95" 
                stroke="url(#pageHandleGradient)" 
                strokeWidth="12" 
                strokeLinecap="round" 
                fill="none"
              />
              <path 
                d="M30 45C18 45 16 95 30 95" 
                stroke="white" 
                strokeOpacity="0.1"
                strokeWidth="4" 
                strokeLinecap="round" 
                fill="none"
              />

              {/* Body Shadow */}
              <path d="M40 120L32 75L40 70L36 25H86L82 70L90 75L82 120H40Z" fill="#000" fillOpacity="0.2" />
              
              {/* Main Body */}
              <path d="M45 120L37 75L45 70L41 25H81L77 70L85 75L77 120H45Z" fill="url(#pagePotGradient)" />
              
              {/* Facet Lines */}
              <path d="M53 25L57 70L57 120" stroke="white" strokeOpacity="0.3" strokeWidth="0.5" />
              <path d="M69 25L65 70L65 120" stroke="black" strokeOpacity="0.1" strokeWidth="0.5" />
              
              {/* Lid */}
              <path d="M41 25L46 10H76L81 25H41Z" fill="#e8e8e8" />
              <path d="M41 25L81 25" stroke="black" strokeOpacity="0.1" strokeWidth="1" />
              
              {/* Middle Ring */}
              <rect x="37" y="70" width="48" height="8" fill="#999" rx="1" />
              
              {/* Spout */}
              <path d="M81 35L102 48L81 58V35Z" fill="url(#pagePotGradient)" />
              
              {/* Knob */}
              <circle cx="61" cy="8" r="6" fill="#222" />
              <circle cx="59" cy="6" r="2" fill="white" fillOpacity="0.3" />
            </svg>

            {/* Realistic Coffee Stream */}
            <div className="absolute top-[40px] left-[84px] w-[6px] overflow-visible">
              <motion.div
                animate={{ 
                  height: [0, 0, 120, 120, 0],
                  opacity: [0, 0, 1, 1, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.38, 0.48, 0.8, 0.9]
                }}
                className="w-full bg-gradient-to-b from-[#00d084] via-[#00d084] to-[#00a368] rounded-full relative"
                style={{ transformOrigin: "top center" }}
              >
                <div className="absolute inset-0 bg-[#00d084] blur-[3px] opacity-40" />
                
                {/* Animated Particles */}
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, 120],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 0.4,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "linear"
                    }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/30 rounded-full"
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Steam Effects */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-3">
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -30],
                  x: [0, i % 2 === 0 ? 8 : -8],
                  opacity: [0, 0.2, 0],
                  scale: [0.5, 1.2]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: "easeOut"
                }}
                className="w-6 h-6 bg-white/20 rounded-full blur-lg"
              />
            ))}
          </div>
        </div>

        {/* Enhanced Loading Bar */}
        <div className="w-48 h-2 bg-white/5 rounded-full border border-white/10 overflow-hidden backdrop-blur-sm relative">
          <motion.div 
            animate={{ 
              width: ["0%", "0%", "100%", "100%", "0%"]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.38, 0.82, 0.92, 1]
            }}
            className="absolute inset-0 bg-gradient-to-r from-[#00d084]/40 via-[#00d084] to-[#00ff9d] shadow-[0_0_15px_rgba(0,208,132,0.4)]"
          >
            {/* Shine effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Marquee = ({ text, reverse = false, tilted = false, isStatic = false }) => {
  const content = (
    <div className="flex gap-8 items-center">
      {[...Array(10)].map((_, i) => (
        <span key={i} className={`text-2xl md:text-4xl font-black uppercase flex items-center gap-8 ${tilted ? 'text-[#001a13]' : 'text-[#00d084]/20'}`}>
          {text} <Sparkles className={`w-6 h-6 md:w-8 md:h-8 ${tilted ? 'text-[#001a13]' : 'text-[#00d084]/20'}`} />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`relative overflow-hidden whitespace-nowrap py-6 transition-all duration-700 ${
      tilted 
        ? 'bg-[#00d084] -rotate-3 scale-110 z-30 shadow-2xl my-24 border-none py-8' 
        : 'bg-[#00d084]/5 border-y border-[#00d084]/10'
    }`}>
      <div className="flex">
        {!isStatic ? (
          <>
            <motion.div
              initial={{ x: reverse ? "-100%" : "0" }}
              animate={{ x: reverse ? "0" : "-100%" }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {content}
            </motion.div>
            <motion.div
              initial={{ x: reverse ? "-100%" : "0" }}
              animate={{ x: reverse ? "0" : "-100%" }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {content}
            </motion.div>
          </>
        ) : (
          <div className="w-full flex justify-center overflow-hidden">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

const FloatingBeans = () => {
  const beans = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: 0.08 + Math.random() * 0.15,
      speed: 0.1 + Math.random() * 0.3
    }));
  }, []);

  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      const b = beans[i];
      child.position.y += Math.sin(t * b.speed + i) * 0.005;
      child.rotation.x += 0.005;
      child.rotation.y += 0.005;
    });
  });

  return (
    <group ref={ref}>
      {beans.map((b, i) => (
        <mesh key={i} position={b.position} rotation={b.rotation} scale={b.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#2d1b0f" roughness={0.4} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

const DrinkModel = ({ selectedImg }) => {
  const texture = useTexture(selectedImg);
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.12 - 0.2;
    }
  });
  
  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} key={selectedImg} castShadow position={[0, -0.2, 0]}>
          {/* Using CylinderGeometry to give it real 3D volume like a cup */}
          <cylinderGeometry args={[2.2, 1.6, 5.2, 64, 1, true]} />
          <meshStandardMaterial 
            map={texture} 
            transparent={true} 
            alphaTest={0.1}
            side={THREE.DoubleSide}
            roughness={0.2}
            metalness={0.1}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Top Liquid/Cap effect */}
        <mesh position={[0, 2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.2, 64]} />
          <meshStandardMaterial 
            color="#3d1f05" 
            transparent={true} 
            opacity={0.4}
            roughness={0.1}
          />
        </mesh>

        <pointLight position={[2, 2, 4]} intensity={5} color="#00d084" />
        <pointLight position={[-2, -2, 4]} intensity={3} color="#ffffff" />
      </Float>
    </group>
  );
};

const ThreeDDrink = ({ selectedImg }) => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={40} />
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        
        <Suspense fallback={null}>
          <DrinkModel selectedImg={selectedImg} />
          
          <ContactShadows 
            position={[0, -3.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4.5} 
          />
          
          <Environment preset="studio" />
          
          {/* OrbitControls allows full 3D rotation in all directions */}
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            makeDefault
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

const Logo = ({ className = "w-12 h-12" }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`relative flex items-center justify-center ${className}`}
  >
    <img 
      src={rashfaLogo} 
      alt="RASHFA Logo" 
      className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,208,132,0.2)]"
    />
  </motion.div>
);

const Navbar = ({ cart, cartTotal, cartCount, removeFromCart, user, logout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
          const [locationType, setLocationType] = useState('pickup'); // 'pickup' or 'delivery'
          const [selectedStore, setSelectedStore] = useState(null);

          const stores = [
            { id: 1, name: "Rashfa Casablanca", address: "123 Coffee Lane, Maarif", city: "Casablanca", lat: 33.588, lng: -7.611, zoom: 15 },
            { id: 2, name: "Rashfa Rabat", address: "45 Agdal Square, Rabat", city: "Rabat", lat: 34.000, lng: -6.850, zoom: 15 },
            { id: 3, name: "Rashfa Marrakech", address: "88 Guéliz Avenue, Marrakech", city: "Marrakech", lat: 31.630, lng: -8.010, zoom: 15 }
          ];
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsCartOpen(false);
    setIsLocationsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    ...(user?.is_admin === true ? [{ name: 'Dashboard', path: '/admin' }] : [])
  ];

  const isLightPage = location.pathname === '/about';

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <div className="absolute inset-x-0 top-0 z-[9998] pointer-events-none">
      <div className="px-4 py-6">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`mx-auto max-w-7xl pointer-events-auto relative py-4 px-10 rounded-[40px] transition-all duration-500 ${
            isScrolled 
              ? isLightPage 
                ? "bg-white/90 backdrop-blur-2xl shadow-2xl shadow-[#002118]/5 border border-[#002118]/5" 
                : "bg-[#001a13]/90 backdrop-blur-2xl shadow-2xl shadow-black/20 border border-white/5"
              : location.pathname === '/shop'
                ? "bg-[#001a13]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40"
                : "bg-transparent"
          }`}
        >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex items-center gap-4">
              <div className="relative">
                <Logo className="w-16 h-16 transition-transform duration-500 group-hover:rotate-[360deg]" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className={`absolute inset-0 blur-2xl rounded-full -z-10 ${isLightPage ? 'bg-[#00754a]/20' : 'bg-[#00d084]/30'}`}
                />
              </div>
              <span className={`text-4xl hidden lg:block ${isLightPage ? 'text-[#002118]' : 'text-white'}`} style={{ fontFamily: "'Great Vibes', cursive" }}>Rashfa</span>
            </Link>

            <div className={`hidden md:flex items-center gap-2 p-1.5 rounded-full border backdrop-blur-sm ${
              isLightPage ? 'bg-[#002118]/5 border-[#002118]/5' : 'bg-white/5 border-white/5'
            }`}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                    location.pathname === link.path 
                      ? "text-white" 
                      : isLightPage 
                        ? "text-[#002118]/60 hover:text-[#002118]" 
                        : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="navActive"
                      className={`absolute inset-0 rounded-full ${isLightPage ? 'bg-[#00754a]' : 'bg-[#00d084]'}`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {hoveredLink === link.name && location.pathname !== link.path && (
                    <motion.div 
                      layoutId="navHover"
                      className={`absolute inset-0 rounded-full ${isLightPage ? 'bg-[#002118]/10' : 'bg-white/10'}`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 md:gap-4 px-2 md:px-4 py-2 rounded-full border ${
              isLightPage ? 'bg-[#002118]/5 border-[#002118]/5' : 'bg-white/5 border-white/5'
            }`}>
              {[
                { icon: Search, label: 'Search', onClick: () => setIsSearchOpen(true), hideOnMobile: true },
                { icon: MapPin, label: 'Locations', onClick: () => setIsLocationsOpen(true), hideOnMobile: true },
                { icon: ShoppingCart, label: 'Cart', badge: cartCount > 0 ? cartCount.toString() : null, onClick: () => setIsCartOpen(true) },
                ...(user ? [{ icon: User, label: 'Profile', link: '/profile', hideOnMobile: true }] : [])
              ].map((item, i) => {
                const Icon = item.icon;
                const content = (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={item.onClick}
                    className={`relative p-2 cursor-pointer group ${item.hideOnMobile ? 'hidden md:block' : 'block'}`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${
                      isLightPage 
                        ? "text-[#002118]/60 group-hover:text-[#00754a]" 
                        : "text-white/60 group-hover:text-[#00d084]"
                    }`} />
                    {item.badge && (
                      <span className={`absolute top-0 right-0 text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 ${
                        isLightPage 
                          ? 'bg-[#00754a] text-white border-[#f2f0eb]' 
                          : 'bg-[#00d084] text-[#001a13] border-[#001a13]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                );
                return item.link ? <Link key={i} to={item.link} className={item.hideOnMobile ? 'hidden md:block' : 'block'}>{content}</Link> : content;
              })}
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => user ? logout() : navigate('/signup')}
                whileHover={{ scale: 1.05, boxShadow: isLightPage ? "0 0 20px rgba(0, 117, 74, 0.2)" : "0 0 20px rgba(0, 208, 132, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className={`hidden sm:flex items-center gap-2 px-8 py-3 rounded-full text-[10px] font-black tracking-widest transition-all ${
                  isLightPage ? 'bg-[#00754a] text-white' : 'bg-[#00d084] text-[#001a13]'
                }`}
              >
                {user ? 'LOGOUT' : 'JOIN NOW'}
                {user ? <LogOut size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
              </motion.button>
              
              <motion.div 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-3 rounded-2xl border cursor-pointer relative z-[60] ${
                  isLightPage ? 'bg-[#002118]/5 border-[#002118]/10' : 'bg-white/5 border-white/10'
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className={`w-5 h-5 ${isLightPage ? 'text-[#002118]' : 'text-white'}`} />
                ) : (
                  <Menu className={`w-5 h-5 ${isLightPage ? 'text-[#002118]' : 'text-white'}`} />
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden absolute top-[calc(100%+1rem)] left-0 right-0 overflow-hidden rounded-[32px] border shadow-2xl ${
                isLightPage 
                  ? 'bg-white/95 backdrop-blur-2xl border-[#002118]/5' 
                  : 'bg-[#001a13]/95 backdrop-blur-2xl border-white/5'
              }`}
            >
              <div className="p-6 flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        location.pathname === link.path
                          ? isLightPage ? 'bg-[#00754a] text-white' : 'bg-[#00d084] text-[#001a13]'
                          : isLightPage ? 'hover:bg-[#002118]/5 text-[#002118]' : 'hover:bg-white/5 text-white'
                      }`}
                    >
                      <span className="text-sm font-bold tracking-widest uppercase">{link.name}</span>
                      <ChevronRight size={16} />
                    </Link>
                  </motion.div>
                ))}
                
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  onClick={() => user ? logout() : navigate('/signup')}
                  className={`mt-4 w-full flex items-center justify-center gap-2 py-5 rounded-2xl text-xs font-black tracking-[0.2em] transition-all ${
                    isLightPage ? 'bg-[#00754a] text-white' : 'bg-[#00d084] text-[#001a13]'
                  }`}
                >
                  {user ? 'LOGOUT' : 'JOIN NOW'}
                  {user ? <LogOut size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#001a13]/95 backdrop-blur-2xl pointer-events-auto flex flex-col items-center justify-center px-8"
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-12 right-12 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00d084] hover:text-[#001a13] transition-all"
            >
              <X size={24} />
            </motion.button>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-3xl"
            >
              <div className="relative group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#00d084] w-6 h-6" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search for coffee, bakery..." 
                  className="w-full bg-white/5 border-b-2 border-white/10 px-20 py-10 text-4xl font-medium focus:outline-none focus:border-[#00d084] transition-all placeholder:text-white/10"
                />
              </div>
              <p className="mt-8 text-white/30 text-xs font-bold tracking-[0.3em] uppercase text-center">Press ESC to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md z-[2001] bg-[#001a13] border-l border-white/10 pointer-events-auto flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tighter flex items-center gap-3">
                  <ShoppingCart className="text-[#00d084]" /> Your Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <Coffee size={32} className="text-white/20" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Your tray is empty</h3>
                    <p className="text-white/40 text-sm mb-8">Ready to discover your next favorite blend?</p>
                    <button 
                      onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                      className="bg-[#00d084] text-[#001a13] px-10 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase"
                    >
                      Explore Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item, index) => (
                      <motion.div 
                        key={`${item.id}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate('/shop');
                          // Give a small delay for the shop page to load if necessary
                          setTimeout(() => {
                            const element = document.getElementById(item.id);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              // Add a temporary highlight effect
                              element.style.transition = 'all 0.5s ease';
                              element.style.boxShadow = '0 0 30px rgba(0, 208, 132, 0.5)';
                              element.style.transform = 'scale(1.02)';
                              setTimeout(() => {
                                element.style.boxShadow = '';
                                element.style.transform = '';
                              }, 2000);
                            }
                          }, 100);
                        }}
                        className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group relative cursor-pointer hover:bg-white/10 transition-all"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/20 flex-shrink-0">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-sm text-white/90">{item.name}</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.customizations && Object.entries(item.customizations).map(([type, val]) => (
                              <span key={type} className="text-[8px] font-bold text-[#00d084] uppercase tracking-tighter bg-[#00d084]/10 px-1.5 py-0.5 rounded">
                                {val}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs font-black text-[#00d084]">{item.price} MAD</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-white/40">QTY: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-white/5 bg-white/5">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Estimated Total</span>
                  <span className="text-xl font-black text-[#00d084]">{cartTotal.toFixed(2)} MAD</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  onClick={() => {
                    setIsCartOpen(false);
                    if (!user) {
                      navigate('/login');
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className={`w-full py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all border ${
                    cart.length > 0 
                      ? 'bg-[#00d084] text-[#001a13] border-[#00d084] hover:shadow-lg hover:shadow-[#00d084]/20' 
                      : 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed'
                  }`}
                >
                  Complete Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Locations Modal */}
      <AnimatePresence>
        {isLocationsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-6xl h-[90vh] rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
            >
              {/* Left Side: Controls & List */}
              <div className="w-full md:w-[400px] bg-white flex flex-col h-full border-r border-gray-100">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Find a store</h2>
                    <button 
                      onClick={() => setIsLocationsOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Pickup/Delivery Toggle */}
                  <div className="bg-gray-100 p-1 rounded-full flex relative">
                    <button 
                      onClick={() => setLocationType('pickup')}
                      className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 z-10 ${locationType === 'pickup' ? 'text-white' : 'text-gray-500'}`}
                    >
                      Pickup
                    </button>
                    <button 
                      onClick={() => setLocationType('delivery')}
                      className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 z-10 ${locationType === 'delivery' ? 'text-white' : 'text-gray-500'}`}
                    >
                      Delivery
                    </button>
                    <motion.div 
                      animate={{ x: locationType === 'pickup' ? 0 : '100%' }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-[#006241] rounded-full shadow-lg"
                    />
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Find a store" 
                      className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 pr-12 text-sm focus:outline-none focus:border-[#006241] focus:ring-1 focus:ring-[#006241] transition-all text-gray-900"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                {/* Dynamic Content based on Type */}
                <div className="flex-grow overflow-y-auto px-6 pb-6">
                  {locationType === 'pickup' ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {stores.map((store) => (
                          <motion.button
                            key={store.id}
                            whileHover={{ x: 4 }}
                            onClick={() => setSelectedStore(store)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedStore?.id === store.id ? 'border-[#006241] bg-[#006241]/5 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 p-2 rounded-full ${selectedStore?.id === store.id ? 'bg-[#006241] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <MapPin size={16} />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm">{store.name}</h4>
                                <p className="text-gray-500 text-xs mt-1">{store.address}</p>
                                <p className="text-[#006241] text-[10px] font-bold uppercase tracking-widest mt-2">Open until 10:00 PM</p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      
                      <div className="pt-6 border-t border-gray-100 space-y-3">
                        <a href="#" className="block text-[#006241] font-bold text-xs hover:underline">Privacy Notice</a>
                        <a href="#" className="block text-[#006241] font-bold text-xs hover:underline">Terms of Use</a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-gray-900 leading-tight">Today deserves delivery</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Enjoy Rashfa delivery powered by our partners. For additional help, visit our Delivery FAQs.
                      </p>
                      <button className="bg-[#006241] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#004d33] transition-all shadow-md">
                        Get started
                      </button>
                      <div className="pt-6 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider font-bold">
                          Menu limited. Menu pricing for delivery may be higher than posted in stores or as marked. Additional fees may apply.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Visual/Map Area */}
              <div className="flex-grow bg-[#f1f8f5] relative overflow-hidden">
                {locationType === 'pickup' ? (
                  /* Real Map Embed */
                  <div className="absolute inset-0 w-full h-full">
                    <iframe 
                      key={selectedStore ? selectedStore.id : 'default'}
                      title="Rashfa Locations Map"
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight="0" 
                      marginWidth="0" 
                      src={selectedStore 
                        ? `https://www.openstreetmap.org/export/embed.html?bbox=${selectedStore.lng-0.01},${selectedStore.lat-0.01},${selectedStore.lng+0.01},${selectedStore.lat+0.01}&layer=mapnik&marker=${selectedStore.lat},${selectedStore.lng}`
                        : "https://www.openstreetmap.org/export/embed.html?bbox=-7.700,33.550,-7.500,33.620&layer=mapnik&marker=33.588,-7.611"
                      }
                      className="grayscale-[0.2] contrast-[1.1] brightness-[1.05]"
                    ></iframe>
                    
                    {/* Custom Map Overlay for Branding */}
                    <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10" />
                  </div>
                ) : (
                  /* Delivery Illustration Style */
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-b from-[#006241] via-[#006241] to-[#f1f8f5]">
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="relative"
                    >
                      {/* Custom Delivery Illustration SVG - ENLARGED */}
                      <svg width="480" height="360" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] scale-125 md:scale-150">
                        {/* Shadow */}
                        <ellipse cx="160" cy="210" rx="100" ry="15" fill="black" fillOpacity="0.1" />
                        
                        {/* Delivery Bag */}
                        <motion.g
                          initial={{ rotate: -2 }}
                          animate={{ rotate: 2 }}
                          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatType: "mirror" }}
                        >
                          <path d="M80 80L90 60H150L160 80V200H80V80Z" fill="#d2b48c" /> {/* Paper bag color */}
                          <path d="M80 80L160 80L150 100L90 100L80 80Z" fill="#c1a37b" />
                          {/* Bag Handle */}
                          <path d="M105 60C105 45 135 45 135 60" stroke="#8b4513" strokeWidth="3" fill="none" />
                          {/* Rashfa Logo on Bag */}
                          <circle cx="120" cy="140" r="25" fill="#006241" />
                          <text x="120" y="145" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="serif">RASHFA</text>
                        </motion.g>

                        {/* Coffee Cups in Tray */}
                        <g transform="translate(140, 140)">
                          {/* Tray */}
                          <path d="M0 40H120L110 60H10L0 40Z" fill="#004d33" />
                          
                          {/* Cup 1 */}
                          <motion.g 
                            initial={{ y: 0 }}
                            animate={{ y: -5 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatType: "mirror" }}
                          >
                            <path d="M20 0L25 45H55L60 0H20Z" fill="white" />
                            <circle cx="40" cy="22" r="10" fill="#006241" />
                            <path d="M18 -5H62V5H18V-5Z" fill="#f3f3f3" rx="2" /> {/* Lid */}
                          </motion.g>

                          {/* Cup 2 (Smaller) */}
                          <motion.g
                            initial={{ y: 0 }}
                            animate={{ y: -3 }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatType: "mirror", delay: 0.5 }}
                            transform="translate(50, 15)"
                          >
                            <path d="M20 0L23 30H47L50 0H20Z" fill="white" />
                            <circle cx="35" cy="15" r="7" fill="#006241" />
                            <path d="M18 -5H52V3H18V-5Z" fill="#f3f3f3" rx="2" /> {/* Lid */}
                          </motion.g>
                        </g>
                      </svg>

                      {/* Animated Floating Coffee Beans */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-5 h-7 bg-[#3d1f05] rounded-full"
                          style={{ 
                            left: `${-20 + i * 80}px`,
                            top: `${20 + (i % 2) * 40}px`
                          }}
                          animate={{ 
                            y: [0, -40, 0],
                            rotate: [0, 90, 0],
                            opacity: [0, 0.8, 0]
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity, 
                            delay: i * 0.7,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                )}
                
                {/* Map Controls Mockup (only for pickup) */}
                {locationType === 'pickup' && (
                  <div className="absolute bottom-8 right-8 flex flex-col space-y-2">
                    <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-600 hover:text-[#006241] transition-colors font-bold text-xl">+</button>
                    <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-600 hover:text-[#006241] transition-colors font-bold text-xl">-</button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Hero = ({ addToCart }) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const heroImages = [
    { url: coffeeImg, name: "FRAPPUCCINO DELIGHT", price: "25", tags: ["BEST RATING"] },
    { url: "https://images.pexels.com/photos/2156681/pexels-photo-2156681.jpeg?auto=compress&cs=tinysrgb&w=800", name: "CARAMEL LATTE", price: "28", tags: ["POPULAR"] },
    { url: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800", name: "MOCHA FRAPP", price: "30", tags: ["TRENDING"] },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const selectedItem = heroImages[activeIndex];

  return (
    <section className="relative h-screen min-h-[900px] bg-[#001a13] flex flex-col md:flex-row items-center px-8 md:px-24 overflow-hidden pt-20 gap-12 md:gap-40">
      {/* Background Text */}
      <motion.div 
        style={{ opacity: 0.03 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <h1 className="text-[15vw] md:text-[20vw] font-black tracking-tighter">RASHFA</h1>
      </motion.div>

      {/* Left Side Content */}
      <div className="z-20 w-full md:w-[35%] mt-12 md:mt-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-[#00d084]" />
            <span className="text-[#00d084] text-xs font-black tracking-[0.4em] uppercase font-sans">
              WHERE EVERY CUP TELLS A STORY
            </span>
          </div>
          <h1 className="text-white text-5xl md:text-[85px] font-black leading-none tracking-tighter font-display mb-10 uppercase italic whitespace-nowrap">
            WHAT'S <span className="text-[#00d084]">YOURS?</span>
          </h1>
          <p className="text-white/60 max-w-md text-base font-serif italic leading-relaxed mb-8 border-l-2 border-[#00d084]/50 pl-6 py-1">
            Indulge in the perfect blend of coffee and art - the coffee moment with a passion for Frappuccino delight.
          </p>
          
          <div className="flex items-center gap-6 mb-10">
             <div className="bg-[#00d084]/10 text-[#00d084] text-[9px] font-black px-4 py-1.5 rounded-full border border-[#00d084]/20 tracking-[0.2em] uppercase">
               {selectedItem.tags[0]}
             </div>
             <div className="text-white text-3xl font-black tracking-tight">
               {selectedItem.price} <span className="text-[#00d084] text-lg ml-1 font-sans">MAD</span>
             </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <Magnetic>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#006241" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart({
                  id: `hero-${activeIndex}`,
                  name: selectedItem.name,
                  price: parseFloat(selectedItem.price),
                  img: selectedItem.url
                })}
                className="bg-[#00754a] text-white px-10 py-4 rounded-full font-black text-[10px] tracking-[0.3em] shadow-xl uppercase transition-colors"
              >
                ADD TO CART
              </motion.button>
            </Magnetic>
            <div className="flex gap-3">
              {heroImages.map((img, i) => (
                <motion.div
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-14 h-14 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-500 ${
                    activeIndex === i ? 'border-[#00d084] scale-105 shadow-lg shadow-[#00d084]/20' : 'border-white/5 opacity-30 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Breakfast Promo Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#00d084]/20 flex items-center justify-center text-[#00d084]">
            <Coffee size={24} />
          </div>
          <div>
            <h4 className="text-white font-bold text-[10px] tracking-widest uppercase">Breakfast Formula</h4>
            <p className="text-[#00d084] font-black text-lg">25 MAD <span className="text-white/20 text-xs line-through ml-2">30 MAD</span></p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - 3D/Image Display */}
      <div className="w-full md:w-[50%] h-[500px] md:h-full relative flex items-center justify-center">
        <TiltWrapper>
          <motion.div 
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            animate={{ 
              opacity: 1, 
              scale: [0.95, 1.05, 0.95],
              rotateY: [0, 15, -15, 0],
              rotateX: [0, 5, -5, 0]
            }}
            transition={{ 
              opacity: { duration: 0.8 },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative z-10 w-[280px] md:w-[380px]"
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-[#00d084]/20 blur-[120px] rounded-full" style={{ transform: "translateZ(-50px)" }}></div>
            <img 
              src={selectedItem.url} 
              alt={selectedItem.name} 
              className="relative w-full drop-shadow-[0_50px_100px_rgba(0,0,0,0.5)]" 
              style={{ transform: "translateZ(50px)" }}
            />
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-8 -right-8 bg-[#001a13] border border-white/10 p-3 rounded-2xl backdrop-blur-md shadow-2xl"
              style={{ transform: "translateZ(80px)" }}
            >
              <p className="text-[#00d084] font-black text-[10px] tracking-widest mb-1">FRAPPUCCINO</p>
              <p className="text-white font-bold text-[7px] tracking-widest opacity-40">COLD BREW BASE</p>
            </motion.div>
          </motion.div>
        </TiltWrapper>
      </div>
    </section>
  );
};

const Magnetic = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const TiltWrapper = ({ children }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

const CategorySection = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.COFFEE);
  const [selectedOptions, setSelectedOptions] = useState({});
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const scrollContainer = scrollRef.current;
      if (!scrollContainer) return;

      const totalWidth = scrollContainer.scrollWidth;
      const viewportWidth = window.innerWidth;
      
      if (totalWidth > viewportWidth) {
        gsap.to(scrollContainer, {
          x: () => -(totalWidth - viewportWidth + 64), // 64px for padding
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${totalWidth - viewportWidth}`,
            invalidateOnRefresh: true,
          }
        });
      }
    }, sectionRef);
    
    return () => ctx.revert();
  }, [activeCategory]);

  const handleOptionChange = (productId, type, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [type]: value
      }
    }));
  };

  return (
    <section ref={sectionRef} className="bg-[#001a13] py-24 min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-8 mb-12">
        <div className="flex overflow-x-auto justify-center md:justify-center gap-4 mb-20 pb-4 scrollbar-hide">
          <div className="flex gap-4 min-w-max">
            {Object.values(CATEGORIES).map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-10 py-3 rounded-full font-bold text-[10px] tracking-[0.2em] transition-all border-2 font-sans ${
                activeCategory === cat 
                  ? 'bg-[#00d084] text-[#001a13] border-[#00d084]' 
                  : 'text-white border-white/10 hover:border-white'
              }`}
            >
              {cat}
            </button>
          ))}
          </div>
        </div>
      </div>

      <div className="w-full relative">
        <div 
          ref={scrollRef} 
          className="flex gap-8 px-8 w-max"
        >
          {PRODUCTS[activeCategory].map((item, idx) => (
            <div key={item.id} className="flex-shrink-0 w-[420px]">
              <TiltWrapper>
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative p-10 rounded-[50px] border border-white/10 bg-white/5 hover:border-[#00d084]/50 transition-all cursor-pointer group flex flex-col items-center shadow-2xl overflow-hidden min-h-[650px]"
                >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00d084] to-[#00754a] rounded-[50px] blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                
                {/* Product Image */}
                <div className="relative mb-8">
                   <img src={item.img} alt={item.name} className="w-56 h-56 object-cover rounded-3xl shadow-2xl group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute -bottom-2 right-2 bg-[#00d084] text-[#001a13] text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg z-20">
                     {item.volume || item.weight}
                   </div>
                   {item.allergens && item.allergens[0] !== "None" && (
                     <div className="absolute top-2 right-2 bg-red-500/80 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm z-20">
                       ALLERGENS: {item.allergens.join(', ')}
                     </div>
                   )}
                </div>

                <h4 className="relative font-bold text-2xl mb-2 text-center tracking-tight font-serif text-[#d4e9e2] uppercase">{item.name}</h4>
                <p className="relative text-white/40 text-xs mb-6 text-center font-sans italic h-12 px-6 leading-relaxed">{item.desc}</p>
                
                {item.nutrition && (
                  <div className="relative flex gap-6 mb-8 px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                    {Object.entries(item.nutrition).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <p className="text-[8px] text-white/20 font-bold uppercase tracking-tighter">{key}</p>
                        <p className="text-xs text-[#00d084] font-black">{val}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="relative text-[#00d084] text-3xl font-black mb-1 font-sans">
                  {item.price} <span className="text-sm font-bold">MAD</span>
                </div>
                <div className="relative text-white/20 text-[10px] font-bold tracking-widest uppercase mb-8 font-sans">
                  Inc. {BUSINESS_RULES.VAT_RATE} VAT
                </div>
                
                {/* Customization Options for Cafes */}
                {activeCategory === CATEGORIES.COFFEE && CUSTOMIZATION_OPTIONS[activeCategory] && (
                  <div className="relative w-full space-y-5 mb-10">
                    {Object.entries(CUSTOMIZATION_OPTIONS[activeCategory]).map(([type, options]) => (
                      <div key={type} className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-sans px-2">
                          {type}
                        </label>
                        <select 
                          className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs font-bold focus:outline-none focus:border-[#00d084] transition-colors appearance-none cursor-pointer hover:bg-white/10"
                          value={selectedOptions[item.id]?.[type] || options[0]}
                          onChange={(e) => handleOptionChange(item.id, type, e.target.value)}
                        >
                          {options.map(opt => (
                            <option key={opt} value={opt} className="bg-[#001a13] text-white">{opt}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                {/* Info for other categories */}
                {!CUSTOMIZATION_OPTIONS[activeCategory] && (
                  <div className="flex-grow flex flex-col justify-center mb-10">
                    {item.weight && (
                      <div className="relative text-white/40 text-[10px] font-bold tracking-widest uppercase text-center">
                        WEIGHT: {item.weight}
                      </div>
                    )}
                    {item.volume && (
                      <div className="relative text-white/40 text-[10px] font-bold tracking-widest uppercase text-center">
                        VOLUME: {item.volume}
                      </div>
                    )}
                    {item.allergens && item.allergens[0] !== "None" && (
                      <div className="mt-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-center">
                        <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase">Contains Allergens</span>
                        <p className="text-xs text-white/40 mt-1">{item.allergens.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(item, selectedOptions[item.id] || {})}
                  className="relative w-full py-5 rounded-full font-bold text-xs tracking-[0.2em] transition-all font-sans bg-[#00754a] text-white hover:bg-[#00d084] hover:text-[#001a13] shadow-lg mt-auto uppercase"
                >
                  ADD TO CART
                </motion.button>
              </motion.div>
            </TiltWrapper>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HorizontalGallery = () => {
  const images = [
    "https://images.pexels.com/photos/2156681/pexels-photo-2156681.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/302904/pexels-photo-302904.jpeg?auto=compress&cs=tinysrgb&w=800",
  ];

  const ImageItem = ({ url, index, total }) => {
    const ref = useRef();
    const texture = useTexture(url);
    const { viewport } = useThree();
    const width = 4;
    const gap = 0.5;
    const totalWidth = (width + gap) * total;
    
    useFrame((state, delta) => {
      if (ref.current) {
        ref.current.position.x -= delta * 1.5;
        if (ref.current.position.x < -totalWidth / 2) {
          ref.current.position.x += totalWidth;
        }
      }
    });

    return (
      <mesh ref={ref} position={[(width + gap) * (index - total / 2), 0, 0]}>
        <planeGeometry args={[width, width * 1.4]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    );
  };

  return (
    <section className="h-[70vh] bg-[#001a13] relative overflow-hidden border-y border-white/5 my-32">
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 text-center w-full px-8">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[#00d084] font-bold tracking-[0.4em] text-[10px] uppercase block mb-4"
        >
          Visual Journey
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-white text-4xl md:text-6xl font-medium tracking-tighter uppercase font-display italic"
        >
          Our Atmosphere
        </motion.h2>
      </div>
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 35 }}>
          <Suspense fallback={null}>
            <group>
              {images.map((url, i) => (
                <ImageItem key={i} url={url} index={i} total={images.length} />
              ))}
            </group>
          </Suspense>
        </Canvas>
      </div>
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
        <div className="w-px h-24 bg-gradient-to-b from-[#00d084] to-transparent opacity-50" />
      </div>
    </section>
  );
};

const QualitySection = () => (
  <section className="bg-[#001a13] pt-40 pb-20 px-8 overflow-hidden relative">
    {/* Background Glows */}
    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00d084]/5 rounded-full blur-[120px]" />
    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#00d084]/5 rounded-full blur-[120px]" />

    <div className="max-w-7xl mx-auto relative flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <span className="text-[#00d084] font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">Quality & Passion</span>
        <h2 className="text-white text-6xl md:text-7xl font-bold tracking-tighter">
          RASHFA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d084] to-[#00f0a4]">EXCELLENCE</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full">
        {[
          {
            title: "Premium Beans",
            desc: "Sourced from the finest altitudes to ensure every sip is a masterpiece of flavor.",
            icon: "01"
          },
          {
            title: "Expert Roasting",
            desc: "A meticulous process that balances aroma and intensity for the perfect cup.",
            icon: "02"
          },
          {
            title: "Ethical Sourcing",
            desc: "Supporting farmers and sustainable practices for a better coffee future.",
            icon: "03"
          }
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            className="group relative p-10 bg-white/5 backdrop-blur-sm rounded-[40px] border border-white/5 hover:border-[#00d084]/30 transition-all duration-500"
          >
            <div className="text-[#00d084]/20 text-8xl font-black absolute -top-8 -left-4 group-hover:text-[#00d084]/40 transition-colors duration-500">{item.icon}</div>
            <h3 className="text-white text-2xl font-bold mb-4 relative z-10">{item.title}</h3>
            <p className="text-white/50 leading-relaxed relative z-10 group-hover:text-white/80 transition-colors duration-500">{item.desc}</p>
            <motion.div 
              whileHover={{ scaleX: 1 }}
              initial={{ scaleX: 0 }}
              className="absolute bottom-0 left-10 right-10 h-1 bg-[#00d084] origin-left rounded-full"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const PopularSection = () => {
  const blastRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const pieces = gsap.utils.toArray('.piece');
      
      gsap.to(pieces, {
        x: () => gsap.utils.random(-800, 800),
        y: () => gsap.utils.random(-500, 500),
        rotation: () => gsap.utils.random(-360, 360),
        scale: () => gsap.utils.random(0.5, 2.5),
        opacity: 0,
        scrollTrigger: {
          trigger: blastRef.current,
          start: "top center",
          end: "bottom top",
          scrub: 1.5,
        }
      });
    }, blastRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section className="pt-32 pb-64 px-8 bg-[#001a13] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-white/20 text-sm font-bold tracking-[0.5em] mb-4 uppercase">Explosive Flavor</div>
        <h2 className="text-white text-6xl md:text-8xl font-black mb-20 tracking-tighter text-center">
          DECONSTRUCTED <br/> <span className="text-[#00d084]">ARTISTRY</span>
        </h2>
        
        <div ref={blastRef} className="relative w-[300px] h-[400px] md:w-[500px] md:h-[600px] perspective-1000">
          {/* Grid of 25 pieces (5x5) */}
          {[...Array(25)].map((_, i) => {
            const x = i % 5;
            const y = Math.floor(i / 5);
            return (
              <div 
                key={i}
                className="piece absolute w-1/5 h-1/5"
                style={{
                  left: `${x * 20}%`,
                  top: `${y * 20}%`,
                  backgroundImage: `url(${coffeeBlastImg})`,
                  backgroundSize: '500% 500%',
                  backgroundPosition: `${x * 25}% ${y * 25}%`,
                  willChange: 'transform, opacity'
                }}
              />
            );
          })}
          
          {/* Glow effect behind the image */}
          <div className="absolute inset-0 bg-[#00d084]/20 blur-[120px] rounded-full -z-10 animate-pulse" />
        </div>

        <div className="mt-40 text-center">
          <p className="text-white/40 text-lg font-serif italic max-w-2xl mx-auto leading-relaxed">
            "Every sip is a reconstruction of tradition, a modern blast of premium essence that comes together in perfect harmony."
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 208, 132, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="mt-16 bg-[#00d084] text-[#001a13] px-12 py-5 rounded-full font-black tracking-[0.3em] uppercase text-xs"
          >
            Explore the Blend
          </motion.button>
        </div>
      </div>
    </section>
  );
};

const BranchesSection = () => (
  <section className="py-32 px-8 bg-[#001a13]">
    <div className="max-w-7xl mx-auto bg-white/5 rounded-[60px] p-12 md:p-20 border border-white/10 shadow-3xl">
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#00d084] font-display uppercase mb-4">OUR BRANCHES</h2>
        <div className="w-20 h-1 bg-[#00754a] rounded-full mb-6" />
        <p className="text-white/40 text-xs font-sans tracking-widest max-w-lg">
          Continuous Service: 7:00 AM - 8:00 PM | Delivery: 6:30 AM - 7:30 PM
          <br />
          <span className="text-[#00d084]">05XX-XXXXXX | customerservice@rashfa.ma</span>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full">
        {[
          { city: "CASABLANCA - ANFA", addr: "Anfa Place Shopping Center, Bd de la Corniche" },
          { city: "MARRAKECH - HIVERNAGE", addr: "M Avenue, Hivernage, Marrakech 40000" },
          { city: "RABAT - AGDAL", addr: "Arribat Center, Agdal, Rabat" },
          { city: "TANGER - CITY CENTER", addr: "Tanger City Center, Place du Maghreb" }
        ].map((branch, i) => (
          <div key={i} className="bg-[#00754a]/40 p-8 rounded-[40px] flex items-center gap-6 hover:bg-[#006241]/60 transition-all cursor-pointer shadow-xl group border border-white/5">
            <div className="w-20 h-20 bg-white/10 rounded-3xl overflow-hidden shadow-inner flex-shrink-0">
               <img src={`https://images.pexels.com/photos/2067561/pexels-photo-2067561.jpeg?auto=compress&cs=tinysrgb&w=150`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-bold text-xl tracking-tight font-serif text-white">{branch.city}</h4>
              <p className="text-[10px] font-bold text-white/50 tracking-[0.15em] leading-relaxed uppercase mt-1 font-sans">{branch.addr}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ImageTrail = () => {
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });
  
  const images = [
    "https://images.pexels.com/photos/2156681/pexels-photo-2156681.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/302904/pexels-photo-302904.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/414645/pexels-photo-414645.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/894612/pexels-photo-894612.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1235706/pexels-photo-1235706.jpeg?auto=compress&cs=tinysrgb&w=400"
  ];

  useEffect(() => {
    const handleMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;

      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        const dist = Math.hypot(clientX - lastPos.current.x, clientY - lastPos.current.y);
        
        if (dist > 80) {
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          
          const newItem = {
            id: Date.now(),
            x,
            y,
            url: images[Math.floor(Math.random() * images.length)],
            rotation: Math.random() * 30 - 15
          };
          
          setItems(prev => [...prev.slice(-12), newItem]);
          lastPos.current = { x: clientX, y: clientY };

          // Auto remove after 2.5s
          setTimeout(() => {
            setItems(prev => prev.filter(item => item.id !== newItem.id));
          }, 2500);
        }
      } else {
        // Clear everything when mouse leaves the area
        setItems([]);
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.2, rotate: item.rotation - 10 }}
            animate={{ opacity: 0.8, scale: 1, rotate: item.rotation }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)", rotate: item.rotation + 10 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="absolute w-40 h-52 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: item.x, top: item.y }}
          >
            <div className="w-full h-full rounded-[30px] overflow-hidden border-2 border-white/20 shadow-2xl relative">
              <img src={item.url} className="w-full h-full object-cover grayscale-[30%]" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const ContactFooter = () => (
  <footer className="py-32 px-8 md:px-24 bg-[#001a13] relative overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-white rounded-[60px] p-12 md:p-20 text-[#002118] shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-[#00d084] rounded-full" />
            <span className="text-xs font-black tracking-[0.4em] text-[#00d084] uppercase">Contact Us</span>
          </div>
          <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-12 leading-none">Let's <br /> <span className="text-[#00754a]">Connect.</span></h3>
          
          <form className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase ml-4">Name</label>
              <input type="text" placeholder="Your name..." className="bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-2 focus:ring-[#00d084]/20 text-sm font-bold transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase ml-4">Email</label>
              <input type="email" placeholder="Email address..." className="bg-gray-50 border-none rounded-3xl px-8 py-5 focus:ring-2 focus:ring-[#00d084]/20 text-sm font-bold transition-all" />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: "#006241" }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#00754a] text-white py-6 rounded-3xl font-black text-xs tracking-[0.4em] mt-4 shadow-xl transition-all"
            >
              SEND MESSAGE
            </motion.button>
          </form>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-[#00754a] rounded-[60px] p-16 md:p-20 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h2 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-none uppercase italic">
              TASTE <br /> THE <br /> <span className="text-[#00d084]">ART.</span>
            </h2>
            <p className="text-2xl font-medium tracking-tight opacity-70 max-w-xs font-serif italic">Join the elite circle of coffee connoisseurs.</p>
          </div>
          
          <div className="flex justify-between items-end relative z-10">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black tracking-[0.4em] opacity-50 uppercase">Follow us</span>
              <div className="flex gap-6">
                {['IG', 'FB', 'TW'].map(social => (
                  <span key={social} className="text-xs font-black cursor-pointer hover:text-[#00d084] transition-colors">{social}</span>
                ))}
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 90 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#00754a] cursor-pointer shadow-xl"
            >
              <ChevronRight size={40} strokeWidth={3} />
            </motion.div>
          </div>

          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-black/20 rounded-full blur-3xl" />
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center border-t border-white/10 pt-20 relative z-10 gap-12">
        <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
           <Logo className="w-24 h-24" />
           <div className="max-w-sm">
             <h4 className="text-white text-xl font-black mb-2 italic font-serif">Rashfa Coffee Roasters</h4>
             <p className="text-[10px] font-medium text-gray-400 tracking-widest leading-relaxed uppercase">Crafting moments of pure indulgence through the finest beans and traditional techniques.</p>
           </div>
        </div>
        
        <div className="flex flex-col gap-6 w-full lg:w-auto">
          <div className="flex flex-col gap-2 items-center lg:items-start">
            <span className="font-black text-[10px] tracking-[0.4em] text-[#00d084] uppercase">Newsletter</span>
            <h5 className="text-white text-2xl font-black italic tracking-tight uppercase">Join our world</h5>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 p-3 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-3xl shadow-2xl group/input">
            <input type="text" placeholder="ENTER YOUR EMAIL..." className="bg-transparent border-none px-10 py-5 w-full sm:w-80 text-[12px] font-black focus:ring-0 transition-all font-sans text-white placeholder:text-white/20" />
            <motion.button 
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "#00d084", 
                color: "#001a13", 
                boxShadow: "0 20px 50px rgba(0, 208, 132, 0.4)",
                x: 5
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#002118] px-12 py-5 rounded-[30px] shadow-2xl transition-all font-black text-[11px] tracking-[0.3em] uppercase"
            >
              JOIN NOW
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-60 text-[10vw] sm:text-[14vw] lg:text-[18vw] font-black select-none tracking-tighter leading-[0.7] font-display relative py-20 md:py-40 overflow-hidden group">
        <ImageTrail />
        <div className="relative z-10 opacity-[0.15] text-white italic transition-all duration-1000 group-hover:opacity-[0.3] group-hover:scale-105 whitespace-nowrap px-4">RASHFA EXPERIENCE</div>
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#00d084]/80 to-transparent -z-10" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-[#001a13] via-transparent to-[#001a13] z-20 pointer-events-none" />
      </div>
    </div>
  </footer>
);

const Footer = () => <ContactFooter />;

const RulesSection = () => (
  <section className="py-32 px-8 md:px-24 bg-[#001a13] relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00d084]/5 rounded-full blur-[120px] -z-10" />
    
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <span className="text-[#00d084] text-[10px] font-bold tracking-[0.5em] uppercase block mb-4">Service Excellence</span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">Our Service <br /> <span className="text-[#00d084]">Commitment</span></h2>
        </div>
        <p className="text-white/40 max-w-md text-sm font-medium leading-relaxed">We adhere to the highest standards of quality and efficiency to ensure your Rashfa experience is perfect every time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {POLICIES.map((policy, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className="bg-white/5 backdrop-blur-xl p-10 rounded-[50px] border border-white/10 group transition-all duration-500 hover:bg-white/10"
          >
            <div className="w-16 h-16 bg-[#00d084] text-[#001a13] rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-[#00d084]/20 group-hover:scale-110 transition-transform">
              {policy.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight italic">{policy.title}</h3>
            <ul className="space-y-4">
              {policy.details.map((detail, j) => (
                <li key={j} className="flex items-start gap-3 text-white/50 text-xs font-bold uppercase tracking-widest leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-[#00d084] rounded-full mt-1.5 shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Delivery Fee", value: "15 MAD" },
          { label: "Free Delivery", value: "> 100 MAD" },
          { label: "Opening Hours", value: "7:00 - 20:00" },
          { label: "TVA Rate", value: "20%" }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
            <p className="text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase mb-2">{stat.label}</p>
            <p className="text-xl font-black text-[#00d084] tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HomePage = ({ selectedImg, addToCart }) => (
  <>
    <Hero selectedImg={selectedImg} addToCart={addToCart} />
    <Marquee text="Premium Coffee Experience • Signature Blends • Freshly Roasted • Rashfa Experience" />
    <HorizontalGallery />
    <CategorySection addToCart={addToCart} />
    <Marquee text="Join our community • Special Offers • New Arrivals • Limited Edition" reverse={true} tilted={true} isStatic={true} />
    <QualitySection />
    <RulesSection />
    <PopularSection />
    <BranchesSection />
    <Footer />
  </>
);

const LoginPage = ({ login }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.data.user, data.data.access_token);
        navigate('/');
      } else {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          setError(firstError);
        } else {
          setError(data.message || 'Login failed. Please check your credentials.');
        }
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#001a13] flex items-center justify-center p-8 overflow-hidden font-sans relative"
    >
      {/* Platform Background Decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00d084]/10 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00d084]/5 rounded-full blur-[150px]" 
        />
      </div>

      {/* Back to Home Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-10 left-10 z-[100]"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white/40 hover:text-[#00d084] transition-colors group"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#00d084] group-hover:bg-[#00d084]/10 transition-all">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">Back to Home</span>
        </Link>
      </motion.div>

      <div className="relative w-full max-w-[450px] z-10">
        {/* Coffee Cup Character */}
        <div className="relative mx-auto w-64 h-72 mb-[-60px] z-0 flex items-center justify-center">
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotate: isPasswordFocused ? 0 : [0, 2, -2, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-48 h-64"
          >
            {/* Straw */}
            <div className="absolute top-[-35px] left-[55%] w-3 h-16 bg-black rounded-full z-0" />
            
            {/* Lid */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[105%] h-12 bg-white border-2 border-black rounded-t-2xl z-20 flex flex-col items-center overflow-hidden">
              <div className="w-full h-3 border-b-2 border-black bg-white" />
              <div className="flex w-full h-full">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-black/20" />
                ))}
              </div>
            </div>

            {/* Hair Bow */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-[-20px] left-[10%] w-24 h-16 z-[30] rotate-[-15deg]"
            >
              <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-xl">
                {/* Left wing */}
                <path d="M50 30 C30 10 10 10 10 30 C10 50 30 50 50 30" fill="#ff69b4" stroke="black" strokeWidth="3" />
                {/* Right wing */}
                <path d="M50 30 C70 10 90 10 90 30 C90 50 70 50 50 30" fill="#ff69b4" stroke="black" strokeWidth="3" />
                {/* Center knot */}
                <rect x="42" y="22" width="16" height="16" rx="4" fill="#ff1493" stroke="black" strokeWidth="3" />
                {/* Detail lines */}
                <path d="M35 25 Q40 30 35 35" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                {/* Highlight on center */}
                <rect x="45" y="25" width="4" height="4" rx="1" fill="white" opacity="0.6" />
              </svg>
            </motion.div>

            {/* Cup Body */}
            <div className="absolute inset-0 bg-[#b18a65] rounded-b-[45px] border-2 border-black z-10 overflow-hidden">
              {/* Face */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <div className="flex gap-14 mb-4 relative">
                  {[0, 1].map((i) => (
                    <div key={i} className="relative w-12 h-12">
                      {/* Eyelashes */}
                      <div className={`absolute -top-6 ${i === 0 ? '-left-6' : '-right-6'} w-16 h-10 pointer-events-none`}>
                        <svg viewBox="0 0 40 30" className="w-full h-full">
                          {i === 0 ? (
                            <g fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M 30 25 Q 20 10 5 18" />
                              <path d="M 32 20 Q 25 5 10 8" />
                              <path d="M 35 15 Q 30 0 20 5" />
                            </g>
                          ) : (
                            <g fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M 10 25 Q 20 10 35 18" />
                              <path d="M 8 20 Q 15 5 30 8" />
                              <path d="M 5 15 Q 10 0 20 5" />
                            </g>
                          )}
                        </svg>
                      </div>

                      {/* Eye Body */}
                      <motion.div 
                        animate={{ 
                          x: isEmailFocused ? 0 : mousePos.x * 12, 
                          y: isEmailFocused ? 8 : mousePos.y * 8,
                          scaleY: isPasswordFocused ? 0.1 : 1
                        }}
                        className="w-12 h-12 bg-black rounded-full relative overflow-hidden"
                      >
                        {/* Highlights */}
                        <div className="absolute top-[15%] left-[15%] w-[45%] h-[50%] bg-white rounded-full" />
                        <div className="absolute bottom-[20%] right-[20%] w-[15%] h-[15%] bg-white rounded-full" />
                      </motion.div>

                      {/* Pink Cheeks */}
                      <div className={`absolute -bottom-3 ${i === 0 ? '-left-6' : '-right-6'} w-10 h-6 bg-[#ffb7c5] rounded-full blur-[2px] opacity-90`} />
                    </div>
                  ))}
                </div>
                
                {/* Cute Smile */}
                <div className="w-10 h-5 border-b-4 border-black rounded-full -mt-2" />
              </div>

              {/* Shine */}
              <div className="absolute top-10 left-4 w-4 h-32 bg-white/10 rounded-full blur-sm" />
            </div>

            {/* Arms */}
            <motion.div 
              animate={{ rotate: isPasswordFocused ? -45 : -25 }}
              className="absolute top-36 -left-12 w-16 h-2 bg-black origin-right"
            >
              {/* Pointing Hand (Glove) */}
              <div className="absolute -left-6 -top-8 w-10 h-12">
                <div className="absolute bottom-0 left-2 w-8 h-8 bg-white border-2 border-black rounded-full" />
                <div className="absolute top-0 left-4 w-3 h-8 bg-white border-2 border-black rounded-full" /> {/* Index finger */}
                <div className="absolute top-3 left-7 w-3 h-5 bg-white border-2 border-black rounded-full rotate-[30deg]" /> {/* Thumb */}
              </div>
            </motion.div>

            <motion.div 
              animate={{ rotate: isPasswordFocused ? 45 : 25 }}
              className="absolute top-36 -right-12 w-16 h-2 bg-black origin-left"
            >
              {/* Fist Hand (Glove) */}
              <div className="absolute -right-4 -top-3 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
                <div className="w-full h-[2px] bg-black/10 rotate-45" />
              </div>
            </motion.div>

            {/* Legs */}
            <div className="absolute -bottom-10 left-[20%] w-2 h-12 bg-black" />
            <div className="absolute -bottom-10 right-[20%] w-2 h-12 bg-black" />
            
            {/* Shoes */}
            <div className="absolute -bottom-14 left-[5%] w-16 h-10 bg-[#b18a65] border-2 border-black rounded-[20px_20px_10px_10px]">
              <div className="absolute bottom-0 left-0 w-full h-2 border-t border-black/20" />
            </div>
            <div className="absolute -bottom-14 right-[5%] w-16 h-10 bg-[#b18a65] border-2 border-black rounded-[20px_20px_10px_10px]">
              <div className="absolute bottom-0 left-0 w-full h-2 border-t border-black/20" />
            </div>
          </motion.div>
        </div>

        {/* Form Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-3xl rounded-[40px] p-10 pt-16 border border-white/10 shadow-2xl relative z-10 overflow-hidden"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="relative group">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00d084] transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="w-full bg-transparent border-b-2 border-white/10 py-3 pl-8 focus:outline-none focus:border-[#00d084] transition-colors text-white placeholder:text-white/20 font-medium"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00d084] transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="w-full bg-transparent border-b-2 border-white/10 py-3 pl-8 focus:outline-none focus:border-[#00d084] transition-colors text-white placeholder:text-white/20 font-medium"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-[#00d084] text-[#001a13] py-5 rounded-2xl font-black text-xs tracking-[0.3em] shadow-lg hover:shadow-[#00d084]/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#001a13]/30 border-t-[#001a13] rounded-full animate-spin" />
              ) : (
                'Enter Rashfa'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm font-medium">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-[#00d084] hover:underline font-bold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Coffee Beans */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full flex justify-around px-16 pointer-events-none">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: isPasswordFocused ? [0, -5, 0] : 0,
                rotate: isPasswordFocused ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.5, repeat: isPasswordFocused ? Infinity : 0 }}
              className="w-12 h-8 bg-[#3d1f05] rounded-[50%_50%_40%_40%] shadow-lg border border-white/5 relative overflow-hidden"
            >
              {/* Bean Line */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-black/20 rotate-[10deg]" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SignUpPage = ({ login }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.data.user, data.data.access_token);
        navigate('/');
      } else {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          setError(firstError);
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#001a13] flex items-center justify-center p-8 overflow-hidden font-sans relative"
    >
      {/* Platform Background Decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00d084]/10 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00d084]/5 rounded-full blur-[150px]" 
        />
      </div>

      {/* Back to Home Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-10 left-10 z-[100]"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white/40 hover:text-[#00d084] transition-colors group"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#00d084] group-hover:bg-[#00d084]/10 transition-all">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">Back to Home</span>
        </Link>
      </motion.div>

      <div className="relative w-full max-w-[450px] z-10">
        {/* Coffee Cup Character */}
        <div className="relative mx-auto w-64 h-72 mb-[-60px] z-0 flex items-center justify-center">
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotate: isPasswordFocused ? 0 : [0, 2, -2, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-48 h-64"
          >
            {/* Straw */}
            <div className="absolute top-[-35px] left-[55%] w-3 h-16 bg-black rounded-full z-0" />
            
            {/* Lid */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[105%] h-12 bg-white border-2 border-black rounded-t-2xl z-20 flex flex-col items-center overflow-hidden">
              <div className="w-full h-3 border-b-2 border-black bg-white" />
              <div className="flex w-full h-full">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-black/20" />
                ))}
              </div>
            </div>

            {/* Hair Bow */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-[-20px] left-[10%] w-24 h-16 z-[30] rotate-[-15deg]"
            >
              <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-xl">
                {/* Left wing */}
                <path d="M50 30 C30 10 10 10 10 30 C10 50 30 50 50 30" fill="#ff69b4" stroke="black" strokeWidth="3" />
                {/* Right wing */}
                <path d="M50 30 C70 10 90 10 90 30 C90 50 70 50 50 30" fill="#ff69b4" stroke="black" strokeWidth="3" />
                {/* Center knot */}
                <rect x="42" y="22" width="16" height="16" rx="4" fill="#ff1493" stroke="black" strokeWidth="3" />
                {/* Detail lines */}
                <path d="M35 25 Q40 30 35 35" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                {/* Highlight on center */}
                <rect x="45" y="25" width="4" height="4" rx="1" fill="white" opacity="0.6" />
              </svg>
            </motion.div>

            {/* Cup Body */}
            <div className="absolute inset-0 bg-[#b18a65] rounded-b-[45px] border-2 border-black z-10 overflow-hidden">
              {/* Face */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <div className="flex gap-14 mb-4 relative">
                  {[0, 1].map((i) => (
                    <div key={i} className="relative w-12 h-12">
                      {/* Eyelashes */}
                      <div className={`absolute -top-6 ${i === 0 ? '-left-6' : '-right-6'} w-16 h-10 pointer-events-none`}>
                        <svg viewBox="0 0 40 30" className="w-full h-full">
                          {i === 0 ? (
                            <g fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M 30 25 Q 20 10 5 18" />
                              <path d="M 32 20 Q 25 5 10 8" />
                              <path d="M 35 15 Q 30 0 20 5" />
                            </g>
                          ) : (
                            <g fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M 10 25 Q 20 10 35 18" />
                              <path d="M 8 20 Q 15 5 30 8" />
                              <path d="M 5 15 Q 10 0 20 5" />
                            </g>
                          )}
                        </svg>
                      </div>

                      {/* Eye Body */}
                      <motion.div 
                        animate={{ 
                          x: (isEmailFocused || isNameFocused) ? 0 : mousePos.x * 12, 
                          y: (isEmailFocused || isNameFocused) ? 8 : mousePos.y * 8,
                          scaleY: isPasswordFocused ? 0.1 : 1
                        }}
                        className="w-12 h-12 bg-black rounded-full relative overflow-hidden"
                      >
                        {/* Highlights */}
                        <div className="absolute top-[15%] left-[15%] w-[45%] h-[50%] bg-white rounded-full" />
                        <div className="absolute bottom-[20%] right-[20%] w-[15%] h-[15%] bg-white rounded-full" />
                      </motion.div>

                      {/* Pink Cheeks */}
                      <div className={`absolute -bottom-3 ${i === 0 ? '-left-6' : '-right-6'} w-10 h-6 bg-[#ffb7c5] rounded-full blur-[2px] opacity-90`} />
                    </div>
                  ))}
                </div>
                
                {/* Cute Smile */}
                <div className="w-10 h-5 border-b-4 border-black rounded-full -mt-2" />
              </div>

              {/* Shine */}
              <div className="absolute top-10 left-4 w-4 h-32 bg-white/10 rounded-full blur-sm" />
            </div>

            {/* Arms */}
            <motion.div 
              animate={{ rotate: isPasswordFocused ? -45 : -25 }}
              className="absolute top-36 -left-12 w-16 h-2 bg-black origin-right"
            >
              {/* Pointing Hand (Glove) */}
              <div className="absolute -left-6 -top-8 w-10 h-12">
                <div className="absolute bottom-0 left-2 w-8 h-8 bg-white border-2 border-black rounded-full" />
                <div className="absolute top-0 left-4 w-3 h-8 bg-white border-2 border-black rounded-full" /> {/* Index finger */}
                <div className="absolute top-3 left-7 w-3 h-5 bg-white border-2 border-black rounded-full rotate-[30deg]" /> {/* Thumb */}
              </div>
            </motion.div>

            <motion.div 
              animate={{ rotate: isPasswordFocused ? 45 : 25 }}
              className="absolute top-36 -right-12 w-16 h-2 bg-black origin-left"
            >
              {/* Fist Hand (Glove) */}
              <div className="absolute -right-4 -top-3 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center">
                <div className="w-full h-[2px] bg-black/10 rotate-45" />
              </div>
            </motion.div>

            {/* Legs */}
            <div className="absolute -bottom-10 left-[20%] w-2 h-12 bg-black" />
            <div className="absolute -bottom-10 right-[20%] w-2 h-12 bg-black" />
            
            {/* Shoes */}
            <div className="absolute -bottom-14 left-[5%] w-16 h-10 bg-[#b18a65] border-2 border-black rounded-[20px_20px_10px_10px]">
              <div className="absolute bottom-0 left-0 w-full h-2 border-t border-black/20" />
            </div>
            <div className="absolute -bottom-14 right-[5%] w-16 h-10 bg-[#b18a65] border-2 border-black rounded-[20px_20px_10px_10px]">
              <div className="absolute bottom-0 left-0 w-full h-2 border-t border-black/20" />
            </div>
          </motion.div>
        </div>

        {/* Form Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-3xl rounded-[40px] p-10 pt-16 border border-white/10 shadow-2xl relative z-10 overflow-hidden"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative group">
              <User className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00d084] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
                className="w-full bg-transparent border-b-2 border-white/10 py-3 pl-8 focus:outline-none focus:border-[#00d084] transition-colors text-white placeholder:text-white/20 font-medium"
                required
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00d084] transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="w-full bg-transparent border-b-2 border-white/10 py-3 pl-8 focus:outline-none focus:border-[#00d084] transition-colors text-white placeholder:text-white/20 font-medium"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00d084] transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="w-full bg-transparent border-b-2 border-white/10 py-3 pl-8 focus:outline-none focus:border-[#00d084] transition-colors text-white placeholder:text-white/20 font-medium"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-[#00d084] text-[#001a13] py-5 rounded-2xl font-black text-xs tracking-[0.3em] shadow-lg hover:shadow-[#00d084]/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase mt-4 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#001a13]/30 border-t-[#001a13] rounded-full animate-spin" />
              ) : (
                'Join Rashfa'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm font-medium">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#00d084] hover:underline font-bold"
              >
                Log In
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Coffee Beans */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full flex justify-around px-16 pointer-events-none">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: isPasswordFocused ? [0, -5, 0] : 0,
                rotate: isPasswordFocused ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.5, repeat: isPasswordFocused ? Infinity : 0 }}
              className="w-12 h-8 bg-[#3d1f05] rounded-[50%_50%_40%_40%] shadow-lg border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-black/20 rotate-[10deg]" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ user, logout, token }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://localhost:8000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        if (response.ok) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error('Fetch orders error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#001a13] flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-white mb-6">You need to log in to view your profile.</h2>
        <Link to="/login" className="bg-[#00d084] text-[#001a13] px-8 py-4 rounded-2xl font-bold uppercase tracking-widest">Log In</Link>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
  const points = Math.floor(totalSpent / 10); // 1 point for every 10 MAD

  return (
    <div className="min-h-screen bg-[#001a13] pt-32 pb-20 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-10 border border-white/10">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-[#00d084] p-1">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#00754a] to-[#00d084] flex items-center justify-center">
                    <User size={60} className="text-[#001a13]" />
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 bg-[#00d084] p-3 rounded-full shadow-xl border-4 border-[#001a13]"
                >
                  <Settings size={16} className="text-[#001a13]" />
                </motion.button>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-[#00d084] text-[10px] font-bold tracking-widest uppercase mb-6">{user.email}</p>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-white/40 text-[9px] font-bold tracking-widest uppercase mb-1">Orders</p>
                  <p className="text-xl font-bold text-white">{orders.length}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-white/40 text-[9px] font-bold tracking-widest uppercase mb-1">Points</p>
                  <p className="text-xl font-bold text-[#00d084]">{points}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-2">
              {[
                { icon: <Package size={18} />, name: "My Orders", active: true },
                { icon: <CreditCard size={18} />, name: "Payment Methods", active: false },
                { icon: <MapPin size={18} />, name: "Addresses", active: false },
                { icon: <Bell size={18} />, name: "Notifications", active: false },
                ...(user?.is_admin === true ? [{ icon: <LayoutDashboard size={18} />, name: "Dashboard", action: () => navigate('/admin') }] : []),
                { icon: <LogOut size={18} />, name: "Sign Out", active: false, danger: true, action: handleLogout },
              ].map((item) => (
                <button 
                  key={item.name}
                  onClick={item.action}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                    item.active ? 'bg-[#00d084] text-[#001a13]' : item.danger ? 'text-red-400 hover:bg-red-400/10' : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs font-bold tracking-widest uppercase">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-10 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <Clock size={20} className="text-[#00d084]" /> Recent Orders
            </h3>
            
            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-[#00d084]/30 border-t-[#00d084] rounded-full animate-spin" />
                </div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="text-white/40 text-[9px] font-bold tracking-widest uppercase mb-1">{order.order_number}</p>
                      <h4 className="text-white font-bold">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</h4>
                      <p className="text-white/60 text-xs mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#00d084] font-black mb-1">{order.total_amount} MAD</p>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                        order.status === 'completed' ? 'bg-[#00d084]/10 text-[#00d084]' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-white/40 text-sm">No orders yet. Start ordering your favorite coffee!</p>
                </div>
              )}
            </div>

            <button className="w-full mt-10 py-4 border-2 border-white/5 rounded-2xl text-white/40 font-bold text-[10px] tracking-widest uppercase hover:bg-white/5 hover:text-white transition-all">
              View All Orders
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#f2f0eb] text-[#002118] font-sans selection:bg-[#00754a] selection:text-white">
      {/* 1. Overlap Hero Section */}
      <section className="pt-52 pb-32 px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative flex flex-col md:flex-row items-center justify-center min-h-[600px]">
          {/* Text Card - Overlaps Image */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 md:p-16 shadow-2xl z-20 w-full md:w-[550px] md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 border-t-8 border-[#00754a]"
          >
            <h2 className="text-3xl md:text-4xl font-medium leading-tight mb-8 tracking-tight text-[#002118] font-serif italic">
              In our coffee-growing regions around the globe, our story begins. It's a tale of dedication, passion, and a deep-rooted love for coffee.
            </h2>
            <div className="w-20 h-1 bg-[#00754a] mb-8" />
            <p className="text-sm font-bold text-[#002118]/60 uppercase tracking-widest leading-relaxed font-sans">
              Every bean tells a story of the soil it grew in and the hands that nurtured it. At Rashfa, we honor this journey from farm to cup.
            </p>
          </motion.div>

          {/* Image Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full md:w-[600px] h-[400px] md:h-[700px] mt-12 md:mt-0 md:ml-60 overflow-hidden shadow-2xl rounded-sm relative"
          >
            <img 
              src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
              alt="Coffee roasting process"
            />
            <div className="absolute inset-0 bg-[#00754a]/5 mix-blend-multiply" />
          </motion.div>
        </div>
      </section>

      {/* 2. New Arrival Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <span className="text-[#00754a] font-black text-xs tracking-[0.4em] uppercase mb-4 block">Seasonal Collection</span>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#002118] uppercase leading-[0.85]">
                New<br /><span className="text-[#00754a]">Arrival</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-8 border-b border-[#002118]/10 pb-4">
              {['All Coffee', 'Espresso', 'Cold Brew', 'Merchandise'].map((cat, i) => (
                <button key={i} className={`text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-[#00754a]' : 'text-[#002118]/40 hover:text-[#002118]'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[
              { name: "Winter Spice Latte", price: "35 MAD", img: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400" },
              { name: "Ethiopian Yirgacheffe", price: "45 MAD", img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400" },
              { name: "Caramel Macchiato", price: "32 MAD", img: "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=400" },
              { name: "Cold Foam Cold Brew", price: "28 MAD", img: "https://images.pexels.com/photos/2156681/pexels-photo-2156681.jpeg?auto=compress&cs=tinysrgb&w=400" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#f2f0eb] mb-6 relative">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[8px] font-black uppercase tracking-widest">New</div>
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight mb-1">{item.name}</h4>
                <p className="text-xs font-bold text-[#00754a]">{item.price}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-[#002118] text-[#002118] px-12 py-4 rounded-full font-black text-[10px] tracking-widest uppercase hover:bg-[#002118] hover:text-white transition-all"
            >
              View More Collection
            </motion.button>
          </div>
        </div>
      </section>

      {/* 3. Whole Beans Section */}
      <section className="py-32 bg-[#00754a] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-12 leading-none">
              Whole<br />Beans
            </h2>
            <div className="space-y-12">
              {[
                { title: "Roast Level", desc: "From light citrus notes to deep, dark chocolate finishes. Choose your intensity." },
                { title: "Flavor Profile", desc: "Discover hints of caramel, nuts, and berries in our carefully selected single-origin beans." },
                { title: "Brewing Guide", desc: "Master the art of the pour-over, French press, or espresso at home with our experts." }
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="flex items-center gap-6 mb-4">
                    <span className="text-2xl font-black text-white/20 group-hover:text-white transition-colors">0{i+1}</span>
                    <h4 className="text-xl font-black uppercase tracking-tight">{item.title}</h4>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed max-w-md ml-14">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-white/10 rounded-full absolute inset-0 blur-3xl animate-pulse" />
            <img 
              src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800" 
              className="relative z-10 w-full h-auto rounded-3xl shadow-3xl" 
              alt="Whole beans" 
            />
          </motion.div>
        </div>
      </section>

      {/* 4. Bottom Blocks */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        {[
          { title: "About Us", bg: "bg-[#f2f0eb]", text: "text-[#002118]", img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Order and Pick up", bg: "bg-[#d4e9e2]", text: "text-[#002118]", img: "https://images.pexels.com/photos/2156681/pexels-photo-2156681.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Business Partners", bg: "bg-[#1e3932]", text: "text-white", img: "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=600" }
        ].map((block, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className={`${block.bg} ${block.text} p-16 h-[500px] flex flex-col justify-between group cursor-pointer relative overflow-hidden`}
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 leading-none">{block.title}</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Discover More <ArrowRight className="inline-block ml-2 w-3 h-3" /></p>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 translate-x-12 translate-y-12 opacity-0 group-hover:opacity-100 transition-all duration-500">
               <img src={block.img} className="w-full h-full object-cover rounded-full grayscale" alt="" />
            </div>
          </motion.div>
        ))}
      </section>

      {/* 5. Big Footer Text */}
      <section className="py-40 bg-[#f2f0eb] flex items-center justify-center overflow-hidden">
        <h2 className="text-[15vw] font-black text-[#002118]/5 uppercase tracking-tighter whitespace-nowrap leading-none select-none">
          Rashfa Coffee Roasters
        </h2>
      </section>
      
      <Footer />
    </div>
  );
};

const ShopPage = ({ addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.COFFEE);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Grande');

  const shopCategories = [
    { id: CATEGORIES.COFFEE, name: 'Coffee', icon: <Coffee size={18} /> },
    { id: CATEGORIES.DRINKS, name: 'Cold', icon: <Sparkles size={18} /> },
    { id: 'TEAS', name: 'Teas', icon: <Coffee size={18} /> },
    { id: CATEGORIES.PASTRY, name: 'Bakery', icon: <Package size={18} /> },
  ];

  const currentProducts = PRODUCTS[selectedCategory] || PRODUCTS[CATEGORIES.COFFEE];

  return (
    <div className="min-h-screen bg-[#001a13] text-white font-sans pt-32 pb-32 relative overflow-x-hidden">
      {/* Hero Section - Clean & Green */}
      <div className="relative w-full h-[45vh] flex flex-col items-center justify-center text-center px-8 mb-4 bg-gradient-to-b from-[#001a13] to-[#002118]">
        <div className="relative z-10 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              textShadow: [
                "0 0 15px rgba(0,208,132,0.8), 8px 8px 0px rgba(0,0,0,1), 15px 15px 35px rgba(0,0,0,0.8)"
              ]
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-[120px] md:text-[180px] text-[#f8f7f5] drop-shadow-2xl leading-none"
            style={{ 
              fontFamily: "'Great Vibes', cursive",
              filter: "drop-shadow(0 0 10px rgba(0,208,132,0.5)) drop-shadow(10px 10px 20px rgba(0,0,0,1))"
            }}
          >
            Rashfa
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Simplified Category Selector */}
        <div className="flex justify-center gap-12 mb-24 border-b border-white/5 pb-8 overflow-x-auto no-scrollbar">
          {shopCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  isActive ? 'text-[#00d084]' : 'text-white/40 hover:text-white'
                }`}
              >
                {cat.name}
                {isActive && (
                  <motion.div 
                    layoutId="activeCat"
                    className="absolute -bottom-8 left-0 right-0 h-0.5 bg-[#00d084]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Product Grid - Matching Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="wait">
            {currentProducts.map((product, i) => (
              <motion.div
                key={`${selectedCategory}-${product.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-md rounded-[30px] overflow-hidden border border-white/5 hover:border-[#00d084]/30 group flex flex-col transition-colors duration-500"
              >
                <div 
                  className="aspect-square overflow-hidden cursor-pointer relative"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img 
                    src={product.img} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    alt={product.name}
                  />
                  <div className="absolute inset-0 bg-[#001a13]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-10 flex flex-col flex-grow text-center">
                  <h3 className="text-xl font-bold text-white mb-3 font-serif tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-4">
                    {product.volume || product.weight || 'Premium Blend'}
                  </p>
                  <p className="text-lg font-black text-[#00d084] mb-8">
                    {product.price} MAD
                  </p>
                  
                  <button 
                    className="mt-auto w-full py-4 rounded-xl bg-white/5 text-white/60 font-bold text-[9px] tracking-[0.2em] uppercase hover:bg-[#00d084] hover:text-[#001a13] transition-all duration-500 border border-white/5 hover:border-transparent"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Product Details Modal - Updated for new style */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            <div className="absolute inset-0 bg-[#001a13]/90 backdrop-blur-xl" onClick={() => setSelectedProduct(null)} />
            
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-[#001a13] w-full max-w-4xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden relative flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-[#00d084] hover:text-[#001a13] rounded-full transition-all z-10 text-white"
              >
                <X size={18} />
              </button>

              <div className="w-full md:w-1/2 p-12 bg-white/5">
                <img 
                  src={selectedProduct.img} 
                  className="w-full h-full object-cover rounded-3xl shadow-lg"
                  alt={selectedProduct.name}
                />
              </div>

              <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
                <span className="text-[#00d084] font-bold text-[10px] tracking-[0.3em] uppercase mb-4 block">Handcrafted</span>
                <h2 className="text-4xl font-bold text-white mb-6 font-serif tracking-tight">
                  {selectedProduct.name}
                </h2>
                <p className="text-2xl font-black text-[#00d084] mb-10">{selectedProduct.price} MAD</p>
                
                <p className="text-sm text-white/50 leading-relaxed mb-12 font-medium">
                  {selectedProduct.desc || "Experience the perfect harmony of flavors with our premium selection. Each cup is a journey of taste and aroma."}
                </p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-white/5 rounded-full p-2 border border-white/10">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all font-bold text-white"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-[#00d084] text-[#001a13] shadow-lg font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      addToCart(selectedProduct, { size: selectedSize, quantity });
                      setSelectedProduct(null);
                      setQuantity(1);
                    }}
                    className="flex-grow bg-white text-[#001a13] py-4 rounded-full font-black text-[10px] tracking-[0.2em] uppercase shadow-xl hover:bg-[#00d084] transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminDashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    avgWait: 4.2
  });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const response = await fetch('http://localhost:8000/api/admin/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        if (response.ok) {
          setOrders(data.data);
          
          // Calculate stats
          const totalRevenue = data.data.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
          const uniqueUsers = new Set(data.data.map(order => order.user_id)).size;
          
          setStats({
            revenue: totalRevenue,
            orders: data.data.length,
            users: uniqueUsers,
            avgWait: 4.2
          });
        }
      } catch (error) {
        console.error('Fetch admin orders error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      }
    } catch (error) {
      console.error('Update order status error:', error);
    }
  };

  const chartData = [
    { name: 'Mon', sales: 4000, orders: 240 },
    { name: 'Tue', sales: 3000, orders: 198 },
    { name: 'Wed', sales: 2000, orders: 980 },
    { name: 'Thu', sales: 2780, orders: 390 },
    { name: 'Fri', sales: 1890, orders: 480 },
    { name: 'Sat', sales: 2390, orders: 380 },
    { name: 'Sun', sales: 3490, orders: 430 },
  ];

  return (
    <div className="min-h-screen bg-[#001a13] pt-44 pb-20 px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
              Admin <span className="text-[#00d084]">Dashboard</span>
            </h1>
            <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-2">Welcome back to Rashfa Control Center</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white/5 text-white/60 p-4 rounded-2xl border border-white/10 hover:text-white transition-all">
              <Filter size={20} />
            </button>
            <button className="bg-[#00d084] text-[#001a13] px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase flex items-center gap-3">
              Generate Report <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Revenue", value: `${stats.revenue.toLocaleString()} MAD`, change: "+12.5%", icon: <DollarSign className="text-[#00d084]" /> },
            { label: "Total Orders", value: stats.orders.toLocaleString(), change: "+8.2%", icon: <Package className="text-[#00d084]" /> },
            { label: "Active Users", value: stats.users.toLocaleString(), change: "+5.1%", icon: <Users className="text-[#00d084]" /> },
            { label: "Avg. Wait Time", value: `${stats.avgWait} min`, change: "-2.4%", icon: <Clock className="text-[#00d084]" /> },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl p-8 rounded-[35px] border border-white/10"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-[#00d084]/10 rounded-2xl">{stat.icon}</div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3 italic">
                <TrendingUp size={20} className="text-[#00d084]" /> Sales Analytics
              </h3>
              <div className="flex gap-2">
                {['Day', 'Week', 'Month'].map(t => (
                  <button key={t} className={`px-4 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all ${t === 'Week' ? 'bg-[#00d084] text-[#001a13]' : 'text-white/40 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d084" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00d084" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700}}
                  />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#001a13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px'}}
                    itemStyle={{color: '#00d084', fontSize: '12px', fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#00d084" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-10 flex items-center gap-3 italic">
              <Package size={20} className="text-[#00d084]" /> Recent Orders
            </h3>
            <div className="space-y-6 flex-grow overflow-y-auto max-h-[400px] no-scrollbar">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-[#00d084]/30 border-t-[#00d084] rounded-full animate-spin" />
                </div>
              ) : orders.length > 0 ? (
                orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="bg-white/5 rounded-2xl p-4 border border-white/5 group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white/40 text-[8px] font-bold tracking-widest uppercase">{order.order_number}</p>
                        <h4 className="text-white font-bold text-sm">{order.user?.name || 'Guest'}</h4>
                      </div>
                      <p className="text-[#00d084] font-black text-sm">{order.total_amount} MAD</p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="bg-[#001a13] text-white/60 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#00d084] transition-all"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <span className="text-white/20 text-[8px] font-bold uppercase">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/40 text-center py-10 text-xs">No recent orders found.</p>
              )}
            </div>
            <button className="w-full mt-10 py-4 bg-white/5 rounded-2xl text-white/40 font-bold text-[10px] tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all">
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#001a13] text-white font-sans pt-44 pb-32 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
        {/* Left Side: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#00d084] text-[10px] font-bold tracking-[0.5em] uppercase block mb-6">
            Contact
          </span>
          <h1 className="text-5xl md:text-[70px] font-medium leading-[1] tracking-tighter font-display mb-12">
            Let's brew <br />
            <span className="font-script text-[#00d084] text-[80px] md:text-[110px] lowercase block -mt-4">something</span>
            <span className="block -mt-4">special.</span>
          </h1>
          
          <div className="space-y-12 mt-20">
            {[
              { icon: MapPin, title: "Our Roastery", detail: "123 Coffee Lane, Casablanca, Morocco" },
              { icon: Bell, title: "Phone", detail: "+212 5XX XX XX XX" },
              { icon: User, title: "Email", detail: "hello@rashfa.com" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00d084] group-hover:bg-[#00d084] group-hover:text-[#001a13] transition-all duration-500">
                  <item.icon size={24} />
                </div>
                <div>
                  <h4 className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-1">{item.title}</h4>
                  <p className="text-xl font-bold text-white">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex gap-6">
            {['Instagram', 'Twitter', 'Facebook'].map((social) => (
              <button key={social} className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-[#00d084] transition-colors">
                {social}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl p-12 md:p-16 rounded-[50px] border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d084]/10 blur-[100px] -z-10" />
          
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#00d084] transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#00d084] transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Subject</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#00d084] transition-colors appearance-none">
                <option className="bg-[#001a13]">General Inquiry</option>
                <option className="bg-[#001a13]">Order Support</option>
                <option className="bg-[#001a13]">Business Partnership</option>
                <option className="bg-[#001a13]">Feedback</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Message</label>
              <textarea rows="5" placeholder="Your message here..." className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm focus:outline-none focus:border-[#00d084] transition-colors resize-none"></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#00d084] text-[#001a13] py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-[#00d084]/20"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName === 'BUTTON' || 
        e.target.tagName === 'A' || 
        e.target.closest('button') || 
        e.target.closest('a') ||
        e.target.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-[#00d084] rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{
          x: mousePos.x - 16,
          y: mousePos.y - 16,
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? 'rgba(0, 208, 132, 0.2)' : 'transparent',
          borderColor: isHovering ? '#00d084' : 'rgba(0, 208, 132, 0.5)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#00d084] rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{
          x: mousePos.x - 3,
          y: mousePos.y - 3,
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 500, mass: 0.1 }}
      />
    </>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          whileHover={{ scale: 1.1, backgroundColor: '#00d084', color: '#001a13' }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-[999] bg-[#001a13]/80 backdrop-blur-md border border-white/10 text-white p-4 rounded-full shadow-2xl transition-colors duration-300 group"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} className="group-hover:animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const CheckoutPage = ({ cart, cartTotal, setLastOrder, setCart, user, token }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    paymentMethod: 'online',
    onlinePaymentType: 'card',
    paypalEmail: '',
    cardDetails: {
      number: '',
      expiry: '',
      cvv: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name) newErrors.name = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.phone) newErrors.phone = true;
    if (!formData.address) newErrors.address = true;

    if (formData.paymentMethod === 'online') {
      if (formData.onlinePaymentType === 'card') {
        if (!formData.cardDetails.number) newErrors.cardNumber = true;
        if (!formData.cardDetails.expiry) newErrors.cardExpiry = true;
        if (!formData.cardDetails.cvv) newErrors.cardCvv = true;
      } else if (formData.onlinePaymentType === 'paypal') {
        if (!formData.paypalEmail) newErrors.paypalEmail = true;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.name || newErrors.email || newErrors.phone || newErrors.address) {
        setStep(1);
      } else {
        setStep(2);
      }
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          payment_method: formData.paymentMethod,
          total_amount: cartTotal,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      const data = await response.json();

      if (response.ok) {
        setLastOrder(data.data);
        setCart([]);
        navigate('/order-success');
      } else {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          alert(firstError);
        } else {
          alert(data.message || 'Failed to place order');
        }
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('An error occurred while placing your order.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-8 bg-[#001a13] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 p-12 rounded-[40px] border border-white/10 backdrop-blur-xl"
        >
          <div className="w-24 h-24 bg-[#00d084]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingCart className="text-[#00d084]" size={40} />
          </div>
          <h2 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase">Your tray is empty</h2>
          <p className="text-white/40 mb-10 max-w-xs mx-auto">Add some of our premium coffee blends to start your journey.</p>
          <button 
            onClick={() => navigate('/shop')} 
            className="group relative bg-[#00d084] text-[#001a13] px-12 py-5 rounded-2xl font-black text-[10px] tracking-widest uppercase overflow-hidden"
          >
            <span className="relative z-10">Explore Menu</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#001a13] selection:bg-[#00d084] selection:text-[#001a13]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[#00d084] text-[10px] font-black tracking-[0.4em] uppercase mb-4"
            >
              Secure Checkout
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none"
            >
              FINALIZE<br />ORDER.
            </motion.h1>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-right hidden md:block"
          >
            <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-2">Estimated Delivery</div>
            <div className="text-white font-black text-2xl">25-35 MIN</div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            {/* Step Indicators */}
            <div className="relative mb-16">
              {/* Connection Line Background */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2" />
              
              <div className="relative flex justify-between items-center max-w-2xl">
                {[
                  { id: 1, name: 'Information' },
                  { id: 2, name: 'Payment' },
                  { id: 3, name: 'Confirmation' }
                ].map((s, index) => (
                  <div key={s.id} className="relative flex flex-col items-center group">
                    {/* Step Circle */}
                    <motion.button 
                      onClick={() => step > s.id && setStep(s.id)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg z-10 transition-all duration-500 border-4 ${
                        step === s.id 
                          ? 'bg-[#00d084] border-[#001a13] text-[#001a13] shadow-[0_0_20px_rgba(0,208,132,0.4)] scale-110' 
                          : step > s.id 
                            ? 'bg-[#00d084] border-[#001a13] text-[#001a13]' 
                            : 'bg-[#001a13] border-white/10 text-white/20'
                      }`}
                    >
                      {step > s.id ? <CheckCircle2 size={24} /> : s.id}
                    </motion.button>

                    {/* Step Name */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className={`text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-500 ${
                        step >= s.id ? 'text-[#00d084]' : 'text-white/20'
                      }`}>
                        {s.name}
                      </span>
                    </div>

                    {/* Progress Line Filler */}
                    {index < 2 && (
                      <div className="absolute top-1/2 left-14 w-[calc(100vw/3)] max-w-[200px] h-[2px] pointer-events-none overflow-hidden">
                        <motion.div 
                          initial={false}
                          animate={{ 
                            width: step > s.id ? '100%' : '0%' 
                          }}
                          className="h-full bg-[#00d084]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <div className="flex justify-between items-center mb-2 px-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Name <span className="text-red-500">*</span></label>
                          {errors.name && <span className="text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                        </div>
                        <User className="absolute left-6 top-[54px] -translate-y-1/2 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={18} />
                        <input 
                          type="text" 
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({...formData, name: e.target.value});
                            if (e.target.value) setErrors(prev => ({...prev, name: false}));
                          }}
                          className={`w-full bg-white/5 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-14 pr-6 py-5 text-white focus:outline-none focus:border-[#00d084] focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-bold text-sm`}
                        />
                      </div>
                      <div className="relative group">
                        <div className="flex justify-between items-center mb-2 px-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Email Address <span className="text-red-500">*</span></label>
                          {errors.email && <span className="text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                        </div>
                        <Mail className="absolute left-6 top-[54px] -translate-y-1/2 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={18} />
                        <input 
                          type="email" 
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({...formData, email: e.target.value});
                            if (e.target.value) setErrors(prev => ({...prev, email: false}));
                          }}
                          className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-14 pr-6 py-5 text-white focus:outline-none focus:border-[#00d084] focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-bold text-sm`}
                        />
                      </div>
                      <div className="md:col-span-2 relative group">
                        <div className="flex justify-between items-center mb-2 px-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Phone Number <span className="text-red-500">*</span></label>
                          {errors.phone && <span className="text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                        </div>
                        <Phone className="absolute left-6 top-[54px] -translate-y-1/2 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={18} />
                        <input 
                          type="tel" 
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({...formData, phone: e.target.value});
                            if (e.target.value) setErrors(prev => ({...prev, phone: false}));
                          }}
                          className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-14 pr-6 py-5 text-white focus:outline-none focus:border-[#00d084] focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-bold text-sm`}
                        />
                      </div>
                      <div className="md:col-span-2 relative group">
                        <div className="flex justify-between items-center mb-2 px-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Delivery Address <span className="text-red-500">*</span></label>
                          {errors.address && <span className="text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                        </div>
                        <MapPin className="absolute left-6 top-16 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={18} />
                        <textarea 
                          placeholder="Delivery Address"
                          value={formData.address}
                          onChange={(e) => {
                            setFormData({...formData, address: e.target.value});
                            if (e.target.value) setErrors(prev => ({...prev, address: false}));
                          }}
                          rows="3"
                          className={`w-full bg-white/5 border ${errors.address ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-14 pr-6 py-5 text-white focus:outline-none focus:border-[#00d084] focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-bold text-sm resize-none`}
                        />
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const newErrors = {};
                        if (!formData.name) newErrors.name = true;
                        if (!formData.email) newErrors.email = true;
                        if (!formData.phone) newErrors.phone = true;
                        if (!formData.address) newErrors.address = true;
                        
                        if (Object.keys(newErrors).length > 0) {
                          setErrors(newErrors);
                          return;
                        }
                        setStep(2);
                      }}
                      className="w-full bg-[#00d084] text-[#001a13] py-6 rounded-2xl font-black text-sm tracking-[0.3em] uppercase transition-all hover:scale-[1.02]"
                    >
                      Next Step
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: 'online'})}
                        className={`group relative p-8 rounded-3xl border transition-all text-left overflow-hidden ${formData.paymentMethod === 'online' ? 'bg-[#00d084] border-[#00d084]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                      >
                        <CreditCard className={`mb-4 transition-colors ${formData.paymentMethod === 'online' ? 'text-[#001a13]' : 'text-[#00d084]'}`} size={32} />
                        <div className={`font-black text-sm uppercase tracking-widest ${formData.paymentMethod === 'online' ? 'text-[#001a13]' : 'text-white'}`}>Online Payment</div>
                        <div className={`text-[10px] font-bold mt-1 uppercase opacity-60 ${formData.paymentMethod === 'online' ? 'text-[#001a13]' : 'text-white'}`}>Credit / Debit Card</div>
                        {formData.paymentMethod === 'online' && (
                          <motion.div layoutId="payment-check" className="absolute top-4 right-4 text-[#001a13]"><CheckCircle2 size={20} /></motion.div>
                        )}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: 'cash'})}
                        className={`group relative p-8 rounded-3xl border transition-all text-left overflow-hidden ${formData.paymentMethod === 'cash' ? 'bg-[#00d084] border-[#00d084]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                      >
                        <Truck className={`mb-4 transition-colors ${formData.paymentMethod === 'cash' ? 'text-[#001a13]' : 'text-[#00d084]'}`} size={32} />
                        <div className={`font-black text-sm uppercase tracking-widest ${formData.paymentMethod === 'cash' ? 'text-[#001a13]' : 'text-white'}`}>Cash on Delivery</div>
                        <div className={`text-[10px] font-bold mt-1 uppercase opacity-60 ${formData.paymentMethod === 'cash' ? 'text-[#001a13]' : 'text-white'}`}>Pay when you receive</div>
                        {formData.paymentMethod === 'cash' && (
                          <motion.div layoutId="payment-check" className="absolute top-4 right-4 text-[#001a13]"><CheckCircle2 size={20} /></motion.div>
                        )}
                      </button>
                    </div>

                    {formData.paymentMethod === 'online' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 bg-white/5 border border-white/10 rounded-[32px] p-6"
                      >
                        <div className="flex gap-4">
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, onlinePaymentType: 'card'})}
                            className={`flex-1 p-6 rounded-2xl border transition-all text-center ${formData.onlinePaymentType === 'card' ? 'bg-[#00d084]/10 border-[#00d084] text-[#00d084]' : 'bg-white/5 border-white/10 text-white/40'}`}
                          >
                            <CreditCard size={24} className="mx-auto mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Card</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, onlinePaymentType: 'paypal'})}
                            className={`flex-1 p-6 rounded-2xl border transition-all text-center ${formData.onlinePaymentType === 'paypal' ? 'bg-[#00d084]/10 border-[#00d084] text-[#00d084]' : 'bg-white/5 border-white/10 text-white/40'}`}
                          >
                            <DollarSign size={24} className="mx-auto mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest">PayPal</span>
                          </button>
                        </div>

                        {formData.onlinePaymentType === 'card' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                          >
                            <div className="relative group">
                              <div className="flex justify-between items-center mb-2 px-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Card Number <span className="text-red-500">*</span></label>
                                {errors.cardNumber && <span className="text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                              </div>
                              <CreditCard className="absolute left-4 top-[50px] -translate-y-1/2 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={20} />
                              <input 
                                type="text" 
                                placeholder="Card Number"
                                maxLength="19"
                                value={formData.cardDetails.number}
                                onChange={(e) => {
                                  let v = e.target.value.replace(/\D/g, '');
                                  let parts = v.match(/.{1,4}/g) || [];
                                  setFormData({...formData, cardDetails: {...formData.cardDetails, number: parts.join(' ')}});
                                  if (v) setErrors(prev => ({...prev, cardNumber: false}));
                                }}
                                className={`w-full bg-white/5 border ${errors.cardNumber ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-[#00d084] transition-all placeholder:text-white/20 font-bold text-sm`}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="relative group">
                                <div className="flex justify-between items-center mb-2 px-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Expiry <span className="text-red-500">*</span></label>
                                  {errors.cardExpiry && <span className="text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                                </div>
                                <Clock className="absolute left-4 top-[50px] -translate-y-1/2 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={20} />
                                <input 
                                  type="text" 
                                  placeholder="MM/YY"
                                  maxLength="5"
                                  value={formData.cardDetails.expiry}
                                  onChange={(e) => {
                                    let v = e.target.value.replace(/\D/g, '');
                                    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                                    setFormData({...formData, cardDetails: {...formData.cardDetails, expiry: v}});
                                    if (v) setErrors(prev => ({...prev, cardExpiry: false}));
                                  }}
                                  className={`w-full bg-white/5 border ${errors.cardExpiry ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-[#00d084] transition-all placeholder:text-white/20 font-bold text-sm`}
                                />
                              </div>
                              <div className="relative group">
                                <div className="flex justify-between items-center mb-2 px-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">CVV <span className="text-red-500">*</span></label>
                                  {errors.cardCvv && <span className="text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                                </div>
                                <Lock className="absolute left-4 top-[50px] -translate-y-1/2 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={20} />
                                <input 
                                  type="text" 
                                  placeholder="CVV"
                                  maxLength="3"
                                  value={formData.cardDetails.cvv}
                                  onChange={(e) => {
                                    const v = e.target.value.replace(/[^0-9]/gi, '');
                                    setFormData({...formData, cardDetails: {...formData.cardDetails, cvv: v}});
                                    if (v) setErrors(prev => ({...prev, cardCvv: false}));
                                  }}
                                  className={`w-full bg-white/5 border ${errors.cardCvv ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-[#00d084] transition-all placeholder:text-white/20 font-bold text-sm`}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {formData.onlinePaymentType === 'paypal' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                          >
                            <div className="relative group">
                              <div className="flex justify-between items-center mb-2 px-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">PayPal Email <span className="text-red-500">*</span></label>
                                {errors.paypalEmail && <span className="text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                              </div>
                              <Mail className="absolute left-4 top-[50px] -translate-y-1/2 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={20} />
                              <input 
                                type="email" 
                                placeholder="PayPal Email Address"
                                value={formData.paypalEmail}
                                onChange={(e) => {
                                  setFormData({...formData, paypalEmail: e.target.value});
                                  if (e.target.value) setErrors(prev => ({...prev, paypalEmail: false}));
                                }}
                                className={`w-full bg-white/5 border ${errors.paypalEmail ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-[#00d084] transition-all placeholder:text-white/20 font-bold text-sm`}
                              />
                            </div>
                            <div className="p-4 bg-[#00d084]/5 border border-[#00d084]/20 rounded-2xl text-center">
                              <p className="text-white/60 text-[10px] font-bold uppercase">You will be redirected to PayPal to complete your purchase safely.</p>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-white/5 text-white py-6 rounded-2xl font-black text-sm tracking-[0.3em] uppercase border border-white/10 transition-all hover:bg-white/10"
                      >
                        Back
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          const newErrors = {};
                          if (formData.paymentMethod === 'online') {
                            if (formData.onlinePaymentType === 'card') {
                              if (!formData.cardDetails.number) newErrors.cardNumber = true;
                              if (!formData.cardDetails.expiry) newErrors.cardExpiry = true;
                              if (!formData.cardDetails.cvv) newErrors.cardCvv = true;
                            } else if (formData.onlinePaymentType === 'paypal') {
                              if (!formData.paypalEmail) newErrors.paypalEmail = true;
                            }
                          }

                          if (Object.keys(newErrors).length > 0) {
                            setErrors(newErrors);
                            return;
                          }
                          setStep(3);
                        }}
                        className="flex-[2] bg-[#00d084] text-[#001a13] py-6 rounded-2xl font-black text-sm tracking-[0.3em] uppercase transition-all hover:scale-[1.02]"
                      >
                        Review Order
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Delivery To</p>
                          <p className="text-white font-bold text-sm">{formData.name}</p>
                          <p className="text-white/60 text-xs mt-1">{formData.address}</p>
                        </div>
                        <button onClick={() => setStep(1)} className="text-[#00d084] text-[10px] font-black uppercase tracking-widest">Edit</button>
                      </div>
                      <div className="h-[1px] bg-white/10" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Payment Method</p>
                          <p className="text-white font-bold text-sm uppercase">
                            {formData.paymentMethod === 'online' 
                              ? `Online - ${formData.onlinePaymentType === 'card' ? 'Credit Card' : 'PayPal'}` 
                              : 'Cash on Delivery'}
                          </p>
                          {formData.paymentMethod === 'online' && formData.onlinePaymentType === 'card' && (
                            <p className="text-white/40 text-[10px] mt-1 font-bold">CARD: **** **** **** {formData.cardDetails.number.slice(-4)}</p>
                          )}
                        </div>
                        <button onClick={() => setStep(2)} className="text-[#00d084] text-[10px] font-black uppercase tracking-widest">Edit</button>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 bg-white/5 text-white py-6 rounded-2xl font-black text-sm tracking-[0.3em] uppercase border border-white/10 transition-all hover:bg-white/10"
                      >
                        Back
                      </button>
                      <button 
          type="submit"
          disabled={loading}
          className={`flex-[2] bg-[#00d084] text-[#001a13] py-6 rounded-2xl font-black text-sm tracking-[0.3em] uppercase shadow-2xl shadow-[#00d084]/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#001a13]/30 border-t-[#001a13] rounded-full animate-spin" />
          ) : (
            'Place Order'
          )}
        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white/5 rounded-[40px] p-10 border border-white/10 backdrop-blur-xl">
                <h3 className="text-xl font-black text-white mb-8 tracking-tight uppercase">Order Summary</h3>
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar mb-8">
                  {cart.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/40 flex-shrink-0">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.name}</h4>
                          <span className="text-sm font-black text-[#00d084]">{item.price * item.quantity} MAD</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white/40 uppercase">Qty: {item.quantity}</span>
                          {item.customizations && (
                            <div className="flex gap-1">
                              {Object.values(item.customizations).map((v, idx) => (
                                <span key={idx} className="text-[7px] font-black bg-white/10 text-white/60 px-1.5 py-0.5 rounded uppercase">{v}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-8 border-t border-white/10">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40 font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="text-white font-bold">{cartTotal.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40 font-bold uppercase tracking-widest">Delivery Fee</span>
                    <span className="text-white font-bold">15.00 MAD</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">Total</span>
                    <div className="text-right">
                      <div className="text-3xl font-black text-[#00d084] leading-none">{(cartTotal + 15).toFixed(2)} MAD</div>
                      <div className="text-[8px] font-bold text-white/20 mt-1 uppercase">VAT Included (20%)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#00d084]/5 rounded-3xl p-6 border border-[#00d084]/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00d084]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-[#00d084]" size={20} />
                </div>
                <p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase tracking-wider">
                  Every order at <span className="text-[#00d084]">Rashfa</span> supports sustainable coffee farming in North Africa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessPage = ({ lastOrder }) => {
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const [showQuestion, setShowQuestion] = useState(true);
  const [wantsTicket, setWantsTicket] = useState(false);

  const handleDownload = () => {
    window.print();
  };

  if (!lastOrder) {
    return (
      <div className="min-h-screen bg-[#001a13] flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">No recent order found</h2>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-[#00d084] text-[#001a13] px-10 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-8 bg-[#001a13] flex flex-col items-center">
      {/* Ticket Question Modal */}
      <AnimatePresence>
        {showQuestion && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#002118] border border-[#00d084]/20 p-10 rounded-[40px] max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-[#00d084]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="text-[#00d084]" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Order Receipt</h3>
              <p className="text-white/60 mb-8 text-sm">Would you like a receipt?</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setWantsTicket(true);
                    setShowQuestion(false);
                  }}
                  className="w-full bg-[#00d084] text-[#001a13] py-4 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all hover:scale-[1.02]"
                >
                  Yes, please
                </button>
                <button 
                  onClick={() => setShowQuestion(false)}
                  className="w-full bg-white/5 text-white/40 py-4 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all hover:bg-white/10"
                >
                  No, thanks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full text-center mb-12 no-print">
        <div className="w-20 h-20 bg-[#00d084]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-[#00d084]" size={40} />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Congratulations! Your order is placed</h1>
        <p className="text-white/60">Thank you for your trust in Rashfa. Your coffee is being prepared now.</p>
      </div>

      {wantsTicket && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          ref={receiptRef} 
          className="bg-white text-black p-8 rounded-sm shadow-2xl w-full max-w-[350px] font-mono text-xs relative overflow-hidden receipt-print"
        >
          {/* Receipt Top Design */}
          <div className="absolute top-0 left-0 w-full h-2 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[length:10px_10px] opacity-10" />
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-black tracking-tighter mb-1">RASHFA COFFEE</h2>
            <p className="opacity-60 uppercase text-[8px]">Casablanca - Anfa Place</p>
            <p className="opacity-60 text-[8px]">Tel: +212 5XX-XXXXXX</p>
          </div>

          <div className="border-y border-dashed border-black/20 py-4 mb-4">
            <div className="flex justify-between mb-1">
              <span>ORDER:</span>
              <span className="font-bold">{lastOrder.order_number || lastOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span>DATE:</span>
              <span>{new Date(lastOrder.created_at || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between font-bold border-b border-black/10 pb-2">
              <span>ITEM</span>
              <span>TOTAL</span>
            </div>
            {lastOrder.items.map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{(item.price * item.quantity).toFixed(2)}</span>
                </div>
                {item.customizations && Object.entries(item.customizations).map(([k, v]) => (
                  <span key={k} className="text-[8px] opacity-60 ml-4 italic">- {v}</span>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-black/20 pt-4 space-y-2">
            <div className="flex justify-between text-lg font-black">
              <span>TOTAL</span>
              <span>{parseFloat(lastOrder.total_amount || lastOrder.total).toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between opacity-60 text-[8px]">
              <span>PAYMENT:</span>
              <span className="uppercase">{lastOrder.payment_method || lastOrder.paymentMethod}</span>
            </div>
          </div>

          <div className="mt-12 text-center opacity-60">
            <p className="mb-2 italic">Enjoy your coffee!</p>
            <div className="flex justify-center gap-1">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-2 h-0.5 bg-black/20" />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-12 flex flex-col sm:flex-row gap-4 no-print">
        {wantsTicket && (
          <button 
            onClick={handleDownload}
            className="flex items-center justify-center gap-3 bg-white text-[#001a13] px-10 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-[#00d084] transition-all"
          >
            <Download size={16} /> Download Receipt
          </button>
        )}
        <button 
          onClick={() => navigate('/profile')}
          className="bg-[#00d084] text-[#001a13] px-10 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase hover:scale-[1.05] transition-all shadow-xl shadow-[#00d084]/20"
        >
          Track my order
        </button>
        <button 
          onClick={() => navigate('/')}
          className="bg-white/5 text-white px-10 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase border border-white/10 hover:bg-white/10 transition-all"
        >
          Back to Home
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .receipt-print { 
            box-shadow: none !important; 
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            width: 80mm !important;
          }
        }
      `}</style>
    </div>
  );
};

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const location = useLocation();
  const [isLocal, setIsLocal] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const [lastOrder, setLastOrder] = useState(() => {
    const saved = localStorage.getItem('rashfa_last_order');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (lastOrder) {
      localStorage.setItem('rashfa_last_order', JSON.stringify(lastOrder));
    } else {
      localStorage.removeItem('rashfa_last_order');
    }
  }, [lastOrder]);
  const [selectedCartItem, setSelectedCartItem] = useState(null);

  // Auth State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('rashfa_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('rashfa_token');
  });

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('rashfa_user', JSON.stringify(userData));
    localStorage.setItem('rashfa_token', accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rashfa_user');
    localStorage.removeItem('rashfa_token');
  };

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };
  
  // Cart State Management
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('rashfa_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('rashfa_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, customizations = {}) => {
    if (!user) {
      addNotification('Please log in to add items to your cart', 'error');
      navigate('/login');
      return;
    }
    try {
      console.log("Adding to cart:", product, customizations);
      setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => 
          item.id === product.id && 
          JSON.stringify(item.customizations) === JSON.stringify(customizations)
        );

        if (existingItemIndex > -1) {
          const newCart = [...prevCart];
          newCart[existingItemIndex].quantity += (customizations.quantity || 1);
          return newCart;
        }

        return [...prevCart, { ...product, customizations, quantity: (customizations.quantity || 1) }];
      });
      addNotification(`${product.name} added to cart!`, 'success');
    } catch (error) {
      addNotification(`Failed to add ${product.name}`, 'error');
    }
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    // Initial loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
      // After first load is done, set isFirstLoad to false
      setTimeout(() => setIsFirstLoad(false), 1000); 
    }, 3500); // Give enough time for the Brand animation
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isFirstLoad) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isFirstLoad]);

  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    setIsLocal(isLocalHost);
  }, []);

  const heroImages = [
    coffeeImg,
    "https://images.pexels.com/photos/2156681/pexels-photo-2156681.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800",
    coffeeImg2
  ];

  const [selectedImg, setSelectedImg] = useState(heroImages[0]);

  if (!isLocal) {
    return (
      <div className="min-h-screen bg-[#001a13] flex items-center justify-center p-8 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md"
        >
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
            <LogOut size={40} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">ACCESS DENIED</h1>
          <p className="text-white/40 text-sm font-bold tracking-widest uppercase leading-relaxed">
            This application is restricted to local development environments only.
          </p>
          <div className="mt-12 pt-8 border-t border-white/5">
            <Logo className="w-12 h-12 mx-auto opacity-20" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001a13] font-sans selection:bg-[#00d084] selection:text-[#001a13] md:cursor-none">
      <CustomCursor />
      
      {/* Notifications Portal */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-4 pointer-events-none items-center w-full max-w-md px-4">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`w-full p-5 rounded-2xl backdrop-blur-xl border shadow-2xl pointer-events-auto overflow-hidden relative ${
                notif.type === 'success' 
                  ? 'bg-[#00d084]/10 border-[#00d084]/20 text-[#00d084]' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notif.type === 'success' ? 'bg-[#00d084]/20' : 'bg-red-500/20'
                }`}>
                  {notif.type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
                </div>
                <div>
                  <h4 className="font-black text-[10px] tracking-widest uppercase mb-1">
                    {notif.type === 'success' ? 'Success' : 'Error'}
                  </h4>
                  <p className="text-white font-bold text-sm">{notif.message}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration: 3, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-1 ${
                  notif.type === 'success' ? 'bg-[#00d084]' : 'bg-red-500'
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {isLoading && (
          isFirstLoad ? <BrandPreloader key="brand-loader" /> : <PageLoader key="page-loader" />
        )}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<HomePage selectedImg={selectedImg} addToCart={addToCart} />} />
        <Route path="/shop" element={<ShopPage addToCart={addToCart} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route path="/signup" element={<SignUpPage login={login} />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} token={token} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={user ? <CheckoutPage cart={cart} cartTotal={cartTotal} setLastOrder={setLastOrder} setCart={setCart} user={user} token={token} /> : <Navigate to="/login" />} />
        <Route path="/order-success" element={user ? <SuccessPage lastOrder={lastOrder} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.is_admin === true ? <AdminDashboard token={token} /> : <Navigate to="/" />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      {/* Cart Item Detail Modal */}
      <AnimatePresence>
        {selectedCartItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#001a13] w-full max-w-2xl rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedCartItem(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all z-10"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 h-[300px] md:h-auto overflow-hidden bg-black/20">
                  <img src={selectedCartItem.img} alt={selectedCartItem.name} className="w-full h-full object-cover" />
                </div>
                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                  <div className="text-[#00d084] text-[10px] font-black tracking-[0.3em] uppercase mb-4">Product Detail</div>
                  <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">{selectedCartItem.name}</h2>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedCartItem.customizations && Object.entries(selectedCartItem.customizations).map(([k, v]) => (
                      <span key={k} className="bg-[#00d084]/10 text-[#00d084] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {v}
                      </span>
                    ))}
                  </div>
                  <div className="text-3xl font-black text-[#00d084] mb-8">{selectedCartItem.price} MAD</div>
                  <button 
                    onClick={() => {
                      setSelectedCartItem(null);
                      setIsCartOpen(true);
                    }}
                    className="w-full bg-white text-[#001a13] py-4 rounded-full font-black text-[10px] tracking-[0.2em] uppercase shadow-xl hover:bg-[#00d084] transition-all"
                  >
                    Back to Tray
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar cart={cart} cartTotal={cartTotal} cartCount={cartCount} removeFromCart={removeFromCart} user={user} logout={logout} />
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
