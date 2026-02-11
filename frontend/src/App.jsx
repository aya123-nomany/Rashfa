import React, { Suspense, useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, useTexture, Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { 
  ShoppingCart, User, Search, ChevronLeft, ChevronRight, ChevronDown, Menu, X, Phone,
  Coffee, Sparkles, LayoutDashboard, Users, Package, Settings, Leaf,
  LogOut, CreditCard, MapPin, Bell, CheckCircle2, ArrowRight, ArrowUp,
  TrendingUp, DollarSign, Clock, Filter, Mail, Lock, Truck, Download, Eye, Plus, Edit, Trash2,
  FileText, Check, Star, Upload
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import coffeeImg from './assets/0a2e60c15f4dd0e82f6f58f42f913955-removebg-preview.png';
import croissantImg from './assets/croissant.png';
import firstImg from './assets/1.png';
import rashfaLogo from './assets/LR-removebg-preview.png';
import ph1 from './assets/ph1.jpg';
import ph2 from './assets/ph2.jpg';
import ph3 from './assets/ph3.jpg';
import ph4 from './assets/ph4.jpg';
import ph5 from './assets/ph5.jpg';
import ph6 from './assets/ph6.jpg';
import ph7 from './assets/ph7.jpg';
import americanoImg from './assets/americano.jpg';
import latteImg from './assets/latte.jpg';
import teasImg from './assets/teas.jpg';
import muffinsImg from './assets/chocolate muffins.jpg';
import icedAmericanoImg from './assets/iced americcano.jpg';
import mochaImg from './assets/mocha.jpg';
import juiceImg from './assets/juice.jpg';
import espressoImg from './assets/espresso.jpg';
import cappuccinoImg from './assets/cappuccino.jpg';
import blueberryMuffinsImg from './assets/BLUEBERRY MUFFINS.jpg';
import mineralWaterImg from './assets/mineral water.jpg';
import almondCroissantImg from './assets/ALMOND CROISSANT.jpg';
import chocolateCroissantImg from './assets/CHOCOLATE CROISSANT.jpg';
import wafflesImg from './assets/Waffles.jpg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const apiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

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
  COLD: 'COLD',
  TEAS: 'TEAS',
  BAKERY: 'BAKERY'
};

const CUSTOMIZATION_OPTIONS = {
  [CATEGORIES.COFFEE]: {
    milk: ["None", "Whole Milk", "Soy Milk", "Oat Milk", "Almond Milk"],
    sugar: ["No Sugar", "Light Sugar", "Normal", "Extra Sugar"]
  }
};
const MENU_ITEMS = {
  [CATEGORIES.COFFEE]: [
    { id: 'c1', name: "ESPRESSO", price: 15, img: espressoImg, desc: "Intense and aromatic single shot", volume: "30ml", allergens: ["None"], nutrition: { cal: 5, caffeine: "63mg" } },
    { id: 'c2', name: "AMERICANO", price: 18, img: americanoImg, desc: "Smooth long black coffee", volume: "60ml", allergens: ["None"], nutrition: { cal: 5, caffeine: "80mg" } },
    { id: 'c3', name: "CAPPUCCINO", price: 25, img: cappuccinoImg, desc: "Equal parts espresso, milk & foam", volume: "200ml", allergens: ["Lactose"], nutrition: { cal: 120, protein: "8g" } },
    { id: 'c4', name: "CAFE LATTE", price: 22, img: latteImg, desc: "Espresso with steamed milk", volume: "250ml", allergens: ["Lactose"], nutrition: { cal: 150, protein: "10g" } },
    { id: 'c5', name: "ICED AMERICANO", price: 20, img: icedAmericanoImg, desc: "Espresso diluted with hot water", volume: "200ml", allergens: ["None"], nutrition: { cal: 10, caffeine: "120mg" } },
    { id: 'c6', name: "MOCHA", price: 30, img: mochaImg, desc: "Espresso with chocolate and milk", volume: "250ml", allergens: ["Lactose", "Cacao"], nutrition: { cal: 230, sugar: "25g" } }
  ],
  [CATEGORIES.COLD]: [
    { id: 'b2', name: "JUICES", price: 25, img: juiceImg, desc: "Freshly squeezed seasonal fruits", volume: "330ml", allergens: ["None"], nutrition: { cal: 140, vitC: "80%" } },
    { id: 'b3', name: "MINERAL WATERS", price: 10, img: mineralWaterImg, desc: "Chilled natural mineral water", volume: "500ml", allergens: ["None"], nutrition: { cal: 0, ph: "7.2" } }
  ],
  [CATEGORIES.TEAS]: [
    { id: 'b1', name: "TEAS", price: 15, img: teasImg, desc: "Premium green or black tea selection", volume: "250ml", allergens: ["None"], nutrition: { cal: 0, sugar: "0g" } }
  ],
  [CATEGORIES.BAKERY]: [
    { id: 'cr1', name: "CLASSIC CROISSANT", price: 15, img: croissantImg, desc: "Buttery and flaky classic croissant", allergens: ["Lactose", "Gluten"], nutrition: { cal: 230 } },
    { id: 'cr2', name: "ALMOND CROISSANT", price: 20, img: almondCroissantImg, desc: "Filled with almond cream and topped with flakes", allergens: ["Lactose", "Gluten", "Nuts"], nutrition: { cal: 310 } },
    { id: 'cr3', name: "CHOCOLATE CROISSANT", price: 18, img: chocolateCroissantImg, desc: "French pastry with chocolate filling", allergens: ["Lactose", "Gluten"], nutrition: { cal: 280 } },
    { id: 'p1', name: "CHOCOLATE MUFFINS", price: 22, img: muffinsImg, desc: "Rich chocolate muffins with chips", allergens: ["Lactose", "Gluten"], nutrition: { cal: 350 } },
    { id: 'p2', name: "BLUEBERRY MUFFINS", price: 20, img: blueberryMuffinsImg, desc: "Fresh blueberry muffins", allergens: ["Lactose", "Gluten"], nutrition: { cal: 310 } },
    { id: 'p3', name: "Waffles", price: 25, img: wafflesImg, desc: "Delicious warm waffles", allergens: ["Lactose", "Gluten"], nutrition: { cal: 280 } }
  ]
};

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Coffee Enthusiast",
    text: "The best coffee experience I've had in years. The aroma of their signature blend is simply unmatched. Highly recommended!",
    rating: 5,
    img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200"
  },
  {
    id: 2,
    name: "Ahmed Mansour",
    role: "Digital Nomad",
    text: "Rashfa is my go-to place for work. Great atmosphere, fast WiFi, and the croissants are to die for. The almond one is my favorite.",
    rating: 5,
    img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Pastry Chef",
    text: "As a professional, I'm very picky about my pastries. Rashfa's bakery products are top-tier. Authentic, fresh, and perfectly flaky.",
    rating: 4,
    img: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200"
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Local Resident",
    text: "The staff here is incredibly friendly. They know my order by heart. It's more than just a coffee shop, it's a community.",
    rating: 5,
    img: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200"
  },
  {
    id: 5,
    name: "Layla Amrani",
    role: "Tea Lover",
    text: "Their selection of premium teas is impressive. The presentation is beautiful and the flavors are so delicate. A peaceful retreat.",
    rating: 5,
    img: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200"
  },
  {
    id: 6,
    name: "David Smith",
    role: "Morning Regular",
    text: "I start every morning here. The consistency of their espresso is remarkable. Best way to kickstart my day!",
    rating: 5,
    img: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200"
  }
];

const CoffeeCupCharacter = ({ isFocused = false, isPasswordFocused = false, floating = true }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center pointer-events-none">
      <motion.div
        animate={floating ? {
          y: [0, -10, 0],
          rotate: isFocused ? [0, -2, 2, 0] : 0
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10"
      >
        {/* Cup Body */}
        <div className="relative w-32 h-28 bg-white rounded-b-[40px] rounded-t-lg shadow-xl border-2 border-[#00d084]/20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-black/10" />
          {/* Coffee Liquid */}
          <motion.div 
            animate={{ height: isFocused ? "40%" : "30%" }}
            className="absolute bottom-0 left-0 w-full bg-[#3d2b1f] transition-all duration-500"
          />
        </div>
        
        {/* Handle */}
        <div className="absolute right-[-20px] top-8 w-12 h-16 border-4 border-white rounded-r-full border-l-0" />

        {/* Face */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="flex gap-6 mt-4">
            {/* Left Eye */}
            <motion.div 
              animate={{ 
                x: mousePos.x * 20, 
                y: mousePos.y * 10,
                scaleY: isFocused ? 1.2 : 1
              }}
              className="w-3 h-3 bg-[#001a13] rounded-full relative"
            >
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
            </motion.div>
            {/* Right Eye */}
            <motion.div 
              animate={{ 
                x: mousePos.x * 20, 
                y: mousePos.y * 10,
                scaleY: isFocused ? 1.2 : 1
              }}
              className="w-3 h-3 bg-[#001a13] rounded-full relative"
            >
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
            </motion.div>
          </div>
          {/* Mouth */}
          <motion.div 
            animate={{ 
              scaleX: isFocused ? 1.5 : 1,
              borderRadius: isPasswordFocused ? "2px" : "20px"
            }}
            className="w-6 h-1 bg-[#001a13] rounded-full mt-2"
          />
        </div>
      </motion.div>

      {/* Steam */}
      <div className="absolute top-0 flex gap-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -40],
              x: [0, (i - 1) * 10],
              opacity: [0, 0.5, 0],
              scale: [0.5, 1.2, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.6,
              ease: "easeOut"
            }}
            className="w-2 h-8 bg-white/20 rounded-full blur-sm"
          />
        ))}
      </div>
    </div>
  );
};

const Libri9Character = ({ floating = true, dropHeight = 40, dropCount = 3 }) => {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center pointer-events-none">
      <motion.div
        animate={floating ? { 
          rotate: [15, 35, 15],
          x: [0, 5, 0],
          y: [0, -2, 0]
        } : {}}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative z-10"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          className="text-[#00d084] fill-none"
        >
          {/* Traditional Pot Shape */}
          <path 
            d="M35 85 C35 90 65 90 65 85 L60 45 C60 40 40 40 40 45 Z" 
            className="fill-[#00d084]/10 stroke-[#00d084]"
            strokeWidth="2"
          />
          {/* Spout */}
          <path 
            d="M60 50 L80 40 L80 45 L62 55" 
            className="fill-[#00d084] stroke-[#00d084]"
            strokeWidth="1"
          />
          {/* Handle */}
          <path 
            d="M40 50 C25 50 25 80 40 80" 
            className="stroke-[#00d084]"
            strokeWidth="2"
          />
          {/* Lid / Top */}
          <path 
            d="M45 40 Q50 30 55 40" 
            className="stroke-[#00d084]"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      {/* Dripping Coffee Drops */}
      {[...Array(dropCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-[72px] top-[42px] w-1 h-1 bg-[#00d084] rounded-full blur-[0.2px] z-0"
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{ 
            y: [0, dropHeight],
            x: [0, dropHeight * 0.1, dropHeight * 0.2],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.2]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeIn",
            delay: i * (1.5 / dropCount)
          }}
        />
      ))}
    </div>
  );
};

const PageLoader = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[10000] bg-[#001a13] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,208,132,0.08),transparent_70%)]" />
      
      <div className="relative flex flex-col items-center">
        {/* Coffee Pot (Libri9) Container */}
        <div className="relative mb-12 scale-125 md:scale-150">
          <Libri9Character dropHeight={85} dropCount={5} />
        </div>

        {/* Filling Progress Bar Container */}
         <div className="flex flex-col items-center gap-4">
           <div className="w-64 h-[6px] bg-[#00d084]/5 relative overflow-hidden rounded-full border border-[#00d084]/10 backdrop-blur-sm">
             <motion.div 
               className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00d084]/40 via-[#00d084] to-[#00d084] shadow-[0_0_15px_rgba(0,208,132,0.8)]"
               initial={{ width: "0%" }}
               animate={{ width: "100%" }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             />
             {/* Splash effect on the filling edge */}
             <motion.div 
                className="absolute top-0 h-full w-4 bg-white/30 blur-sm z-10"
                animate={{ 
                  left: ["0%", "100%"]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             />
           </div>
          
          <div className="flex items-center gap-3 mt-2">
            <span className="w-1.5 h-1.5 bg-[#00d084] rounded-full animate-pulse shadow-[0_0_8px_#00d084]" />
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] font-black uppercase text-[#00d084] tracking-[0.6em] translate-x-[0.3em] drop-shadow-[0_0_5px_rgba(0,208,132,0.3)]"
            >
              Brewing Excellence
            </motion.p>
            <span className="w-1.5 h-1.5 bg-[#00d084] rounded-full animate-pulse shadow-[0_0_8px_#00d084]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

  const HomeInitialLoader = () => {
    const [stage, setStage] = useState('typing'); // 'typing' -> 'formed' -> 'exit'
    const letters = "Rashfa".split("");
  
    useEffect(() => {
      const formedTimeout = setTimeout(() => setStage('formed'), 2500);
      const exitTimeout = setTimeout(() => setStage('exit'), 4500);
  
      return () => {
        clearTimeout(formedTimeout);
        clearTimeout(exitTimeout);
      };
    }, []);
  
    const containerVariants = {
      typing: { scale: 1 },
      formed: { 
        scale: [1, 0.7, 1.15],
        filter: [
          "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
          "drop-shadow(0px 0px 15px rgba(255,255,255,0.4)) drop-shadow(0px 20px 30px rgba(0,0,0,0.4))",
          "drop-shadow(0px 0px 25px rgba(255,255,255,0.6)) drop-shadow(0px 35px 50px rgba(0,0,0,0.6))"
        ],
        transition: { 
          duration: 2, 
          times: [0, 0.4, 1],
          ease: "easeInOut"
        }
      },
      exit: {
        opacity: 0,
        scale: 1.5,
        filter: "blur(15px)",
        transition: { duration: 0.8, ease: "easeIn" }
      }
    };
  
    const letterVariants = {
      initial: { opacity: 0, y: 15, display: "none" },
      animate: (i) => ({
        opacity: 1,
        y: 0,
        display: "inline-block",
        transition: {
          duration: 0.7,
          delay: i * 0.25,
          ease: "easeOut"
        }
      })
    };
  
    return (
      <>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
            .font-rashfa {
              font-family: 'Great Vibes', cursive;
            }
          `}
        </style>
        <motion.div
          initial={{ opacity: 1 }}
          animate={stage === 'exit' ? 'exit' : ''}
          variants={containerVariants}
          className="fixed inset-0 z-[10001] bg-[#002b21] flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div
            variants={containerVariants}
            initial="typing"
            animate={stage === 'formed' ? 'formed' : 'typing'}
            className="relative"
          >
            <h1 className="text-white text-7xl md:text-9xl font-rashfa select-none tracking-tight">
              {letters.map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </motion.div>
        </motion.div>
      </>
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
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
              {content}
            </motion.div>
            <motion.div
              initial={{ x: reverse ? "-100%" : "0" }}
              animate={{ x: reverse ? "0" : "-100%" }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
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

const STATIC_BEANS = Array.from({ length: 15 }).map(() => ({
  position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8],
  rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
  scale: 0.08 + Math.random() * 0.15,
  speed: 0.1 + Math.random() * 0.3
}));

const FloatingBeans = () => {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      const b = STATIC_BEANS[i];
      child.position.y += Math.sin(t * b.speed + i) * 0.005;
      child.rotation.x += 0.005;
      child.rotation.y += 0.005;
    });
  });

  return (
    <group ref={ref}>
      {STATIC_BEANS.map((b, i) => (
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

const Logo = () => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
      src={rashfaLogo} 
  >
    <img 
      src="/assets/LR-removebg-preview.png" 
      alt="RASHFA Logo" 
      className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,208,132,0.2)]"
    />
  </motion.div>
);

const Navbar = ({ cart, cartTotal, cartCount, removeFromCart, user, logout, settings, isCartOpen, setIsCartOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase();
      const allProducts = Object.values(MENU_ITEMS).flat();
      return allProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.desc.toLowerCase().includes(query)
      );
    }
    return [];
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);
  
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
          const [locationType, setLocationType] = useState('pickup'); // 'pickup' or 'delivery'
          const [selectedStore, setSelectedStore] = useState(null);

          const stores = [
            { id: 1, name: `${settings.storeName.split(' ')[0]} Casablanca`, address: "123 Coffee Lane, Maarif", city: "Casablanca", lat: 33.588, lng: -7.611, zoom: 15 },
            { id: 2, name: `${settings.storeName.split(' ')[0]} Rabat`, address: "45 Agdal Square, Rabat", city: "Rabat", lat: 34.000, lng: -6.850, zoom: 15 },
            { id: 3, name: `${settings.storeName.split(' ')[0]} Marrakech`, address: "88 Guéliz Avenue, Marrakech", city: "Marrakech", lat: 31.630, lng: -8.010, zoom: 15 }
          ];
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    // Close all menus on navigation
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
      setIsCartOpen(false);
      setIsLocationsOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location, setIsCartOpen]);

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
  const currencySymbol = settings.currency.split(' ')[0];

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <div className="absolute inset-x-0 top-0 z-[9998] pointer-events-none">
      <div className="px-4 py-8">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`mx-auto max-w-7xl pointer-events-auto relative py-4 px-6 md:px-12 rounded-[50px] transition-all duration-500 border ${
            isScrolled 
              ? isLightPage 
                ? "bg-white/80 backdrop-blur-2xl shadow-2xl shadow-[#002118]/5 border-[#002118]/10" 
                : "bg-[#001a13]/80 backdrop-blur-2xl shadow-2xl shadow-black/20 border-white/10"
              : "bg-white/5 backdrop-blur-md border-white/10"
          }`}
        >
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="group flex items-center gap-2">
            <span className={`text-3xl md:text-5xl ${isLightPage ? 'text-[#002118]' : 'text-white'}`} style={{ fontFamily: "'Great Vibes', cursive" }}>Rashfa</span>
          </Link>

          {/* Navigation Pill */}
          <div className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-md ${
            isLightPage ? 'bg-[#002118]/5 border-[#002118]/10' : 'bg-white/5 border-white/10'
          }`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`relative px-7 py-2.5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                  location.pathname === link.path 
                    ? "text-[#001a13]" 
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

          {/* Actions & CTA */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              {[
                { icon: Search, label: 'Search', onClick: () => setIsSearchOpen(true) },
                { icon: MapPin, label: 'Locations', onClick: () => setIsLocationsOpen(true) },
                { icon: ShoppingCart, label: 'Cart', badge: cartCount > 0 ? cartCount.toString() : null, onClick: () => setIsCartOpen(true) },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={item.onClick}
                    className="relative p-2 cursor-pointer group hidden md:block"
                  >
                    <Icon className={`w-5 h-5 transition-colors ${
                      isLightPage 
                        ? "text-[#002118]/60 group-hover:text-[#00754a]" 
                        : "text-white/60 group-hover:text-[#00d084]"
                    }`} />
                    {item.badge && (
                      <span className={`absolute -top-1 -right-1 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                        isLightPage 
                          ? 'bg-[#00754a] text-white border-[#f2f0eb]' 
                          : 'bg-[#00d084] text-[#001a13] border-[#001a13]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => user ? logout() : navigate('/signup')}
                whileHover={{ scale: 1.05, boxShadow: isLightPage ? "0 10px 30px rgba(0, 117, 74, 0.3)" : "0 10px 30px rgba(0, 208, 132, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className={`hidden sm:flex items-center gap-3 px-8 py-3.5 rounded-full text-[11px] font-black tracking-[0.2em] transition-all uppercase ${
                  isLightPage ? 'bg-[#00754a] text-white' : 'bg-[#00d084] text-[#001a13]'
                }`}
              >
                {user ? 'LOGOUT' : 'JOIN NOW'}
                {user ? <LogOut size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
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
                      onClick={() => setIsMobileMenuOpen(false)}
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

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => { setIsSearchOpen(true); setIsMobileMenuOpen(false); }}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border ${
                      isLightPage ? 'bg-[#002118]/5 border-[#002118]/10 text-[#002118]' : 'bg-white/5 border-white/10 text-white'
                    }`}
                  >
                    <Search size={24} className="mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Search</span>
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => { setIsLocationsOpen(true); setIsMobileMenuOpen(false); }}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border ${
                      isLightPage ? 'bg-[#002118]/5 border-[#002118]/10 text-[#002118]' : 'bg-white/5 border-white/10 text-white'
                    }`}
                  >
                    <MapPin size={24} className="mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Find Store</span>
                  </motion.button>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-4 p-4 rounded-2xl ${
                          isLightPage ? 'bg-[#002118]/5 text-[#002118]' : 'bg-white/5 text-white'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-[#00d084]/20 flex items-center justify-center text-[#00d084]">
                          <User size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-widest">{user.name}</span>
                          <span className="text-[8px] text-white/40 uppercase tracking-widest">View Profile</span>
                        </div>
                      </Link>
                      <button 
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="w-full p-4 rounded-2xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/20"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                      className={`w-full py-5 rounded-2xl font-black text-xs tracking-[0.3em] shadow-lg transition-all uppercase ${
                        isLightPage ? 'bg-[#00754a] text-white' : 'bg-[#00d084] text-[#001a13]'
                      }`}
                    >
                      JOIN NOW
                    </motion.button>
                  )}
                </div>
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
            className="fixed inset-0 z-[1000] bg-[#001a13]/95 backdrop-blur-2xl pointer-events-auto flex flex-col items-center px-8 pt-40 pb-20"
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="absolute top-12 right-12 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00d084] hover:text-[#001a13] transition-all"
            >
              <X size={24} />
            </motion.button>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-5xl"
            >
              <div className="relative group mb-12">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#00d084] w-8 h-8" />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you craving?" 
                  className="w-full bg-white/5 border-b-2 border-white/10 px-20 py-12 text-5xl font-medium focus:outline-none focus:border-[#00d084] transition-all placeholder:text-white/10 text-white"
                />
              </div>

              {/* Search Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {searchResults.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all cursor-pointer flex gap-6"
                    onClick={() => {
                      navigate(`/shop?product=${product.id}`);
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5 bg-black/40">
                      <img 
                        src={product.img} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#00d084] transition-colors">{product.name}</h3>
                      <p className="text-white/40 text-sm line-clamp-1 mb-2">{product.desc}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[#00d084] font-black">{product.price} {currencySymbol}</span>
                        <span className="text-white/20 text-xs font-bold px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest">{product.volume || 'Unit'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {searchQuery.trim().length > 1 && searchResults.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <Search size={32} className="text-white/20" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                    <p className="text-white/40">Try searching for something else like "espresso" or "latte"</p>
                  </div>
                )}

                {searchQuery.trim().length <= 1 && (
                  <div className="col-span-full py-10 text-center">
                    <p className="text-white/20 font-bold tracking-[0.3em] uppercase text-xs">Start typing to search products</p>
                  </div>
                )}
              </div>

              <p className="mt-12 text-white/30 text-xs font-bold tracking-[0.3em] uppercase text-center">Press ESC to close</p>
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
                            <span className="text-xs font-black text-[#00d084]">{item.price} {currencySymbol}</span>
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
                  <span className="text-xl font-black text-[#00d084]">{cartTotal.toFixed(2)} {currencySymbol}</span>
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
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsLocationsOpen(false);
                          navigate('/shop');
                        }}
                        className="bg-[#00d084] text-[#001a13] px-10 py-3.5 rounded-full font-black text-xs tracking-widest uppercase hover:bg-white transition-all shadow-xl shadow-[#00d084]/20"
                      >
                        Get started
                      </motion.button>
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
  
  const Hero = ({ addToCart, settings, currencySymbol }) => {
  const heroImages = [
    { 
      url: coffeeImg, 
      name: "FRAPPUCCINO DELIGHT", 
      price: "25", 
      tags: ["BEST RATING"],
      floatingLabel: "FRAPPUCCINO",
      floatingSubLabel: "COLD BREW BASE",
      description: "A perfect blend of chilled coffee and creamy texture, topped with our signature froth."
    },
    { 
      url: croissantImg, 
      name: "ARTISAN CROISSANT", 
      price: "15", 
      tags: ["FRESHLY BAKED"],
      floatingLabel: "CROISSANT",
      floatingSubLabel: "FRESHLY BAKED",
      description: "Flaky, buttery, and golden-brown. Our croissants are baked fresh every morning using traditional French methods."
    },
    { 
      url: firstImg, 
      name: "LATTE ART SPECIAL", 
      price: "22", 
      tags: ["HOUSE SPECIAL"],
      floatingLabel: "LATTE ART", 
      floatingSubLabel: "HOUSE SPECIAL", 
      description: "A unique blend of our finest beans, crafted to provide a balanced and memorable coffee experience."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(() => Date.now());
  const selectedItem = heroImages[activeIndex];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [heroImages.length, isPaused, lastInteraction]);

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-screen md:h-screen md:min-h-[900px] bg-[#001a13] flex flex-col md:flex-row items-center px-8 md:px-24 overflow-hidden pt-20 gap-8 md:gap-40"
    >
      {/* Background Text */}
      <motion.div 
        style={{ opacity: 0.03 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <h1 className="text-[15vw] md:text-[20vw] font-black tracking-tighter uppercase">{settings.storeName}</h1>
      </motion.div>

      {/* Left Side Content */}
      <div className="z-20 w-full md:w-[45%] mt-10 md:mt-0 pt-10 md:pt-0 text-center md:text-left">
        <div className="mb-8">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <div className="w-12 h-[2px] bg-[#00d084]" />
            <span className="text-[#00d084] text-[10px] md:text-xs font-black tracking-[0.4em] uppercase font-sans">
              WHERE EVERY CUP TELLS A STORY
            </span>
          </div>
          <h1 className="text-white text-4xl md:text-[85px] font-black leading-none tracking-tighter font-display mb-10 uppercase italic">
            {selectedItem.name.split(' ').map((word, i) => (
              <span key={i} className={i === selectedItem.name.split(' ').length - 1 ? "text-[#00d084]" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>
          <p className="text-white/60 max-w-md mx-auto md:mx-0 text-xs md:text-base font-serif italic leading-relaxed mb-8 border-l-2 border-[#00d084]/50 pl-6 py-1">
            {selectedItem.description}
          </p>
          
          <div className="flex items-center justify-center md:justify-start gap-6 mb-10">
             <div className="bg-[#00d084]/10 text-[#00d084] text-[9px] font-black px-4 py-1.5 rounded-full border border-[#00d084]/20 tracking-[0.2em] uppercase">
               {selectedItem.tags[0]}
             </div>
             <div className="text-white text-2xl md:text-3xl font-black tracking-tight">
               {selectedItem.price} <span className="text-[#00d084] text-base md:text-lg ml-1 font-sans">{currencySymbol}</span>
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-5">
            <Magnetic>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#006241" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setLastInteraction(Date.now());
                  addToCart({
                    id: `hero-${activeIndex}`,
                    name: selectedItem.name,
                    price: parseFloat(selectedItem.price),
                    img: selectedItem.url
                  });
                }}
                className="w-full md:w-auto bg-[#00754a] text-white px-10 py-5 rounded-full font-black text-[10px] tracking-[0.3em] shadow-xl uppercase transition-colors"
              >
                ADD TO CART
              </motion.button>
            </Magnetic>
            <div className="flex gap-3">
              {heroImages.map((img, i) => (
                <motion.div
                  key={i}
                  onClick={() => {
                    setActiveIndex(i);
                    setLastInteraction(Date.now());
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-500 ${
                  <img src={img.url} className="w-full h-full object-cover" />
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Breakfast Promo Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#00d084]/20 flex items-center justify-center text-[#00d084]">
            <Coffee size={20} />
          </div>
          <div className="text-left">
            <h4 className="text-white font-bold text-[8px] md:text-[10px] tracking-widest uppercase">Breakfast Formula</h4>
            <p className="text-[#00d084] font-black text-sm md:text-lg">{`25 ${currencySymbol}`} <span className="text-white/20 text-[10px] md:text-xs line-through ml-2">{`30 ${currencySymbol}`}</span></p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - 3D/Image Display */}
      <div className="w-full md:w-[50%] h-[300px] md:h-full relative flex items-center justify-center mt-8 md:mt-0">
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
            className="relative z-10 w-[220px] md:w-[380px]"
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-[#00d084]/20 blur-[120px] rounded-full" style={{ transform: "translateZ(-50px)" }}></div>
            <img 
              src={selectedItem.url} 
              className="relative w-full drop-shadow-[0_50px_100px_rgba(0,0,0,0.5)]" 
              style={{ transform: "translateZ(50px)" }}
              referrerPolicy="no-referrer"
            />
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 md:-top-8 md:-right-8 bg-[#001a13] border border-white/10 p-2 md:p-3 rounded-xl md:rounded-2xl backdrop-blur-md shadow-2xl"
              style={{ transform: "translateZ(80px)" }}
            >
              <p className="text-[#00d084] font-black text-[8px] md:text-[10px] tracking-widest mb-1">{selectedItem.floatingLabel}</p>
              <p className="text-white font-bold text-[6px] md:text-[7px] tracking-widest opacity-40">{selectedItem.floatingSubLabel}</p>
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

const TestimonialsSection = () => {
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
          x: () => -(totalWidth - viewportWidth + 64),
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
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="bg-[#001a13] py-20 md:py-32 min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full px-8 mb-16">
        <span className="text-[#00d084] font-black text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 block text-center">Wall of Love</span>
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none text-center">
          What Our<br /><span className="text-[#00d084]">Customers Say</span>
        </h2>
      </div>

      <div className="w-full relative">
        <div 
          ref={scrollRef} 
          className="flex gap-6 md:gap-10 px-4 md:px-8 w-max"
        >
          {TESTIMONIALS.map((item, idx) => (
            <div key={item.id} className="flex-shrink-0 w-[85vw] md:w-[450px]">
              <TiltWrapper>
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative p-10 md:p-14 rounded-[40px] md:rounded-[50px] border border-white/10 bg-white/5 hover:border-[#00d084]/30 transition-all cursor-pointer group flex flex-col h-[400px] md:h-[500px] shadow-2xl overflow-hidden"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 30V15C0 6.71573 6.71573 0 15 0H16.25V5H15C9.47715 5 5 9.47715 5 15H15V30H0ZM23.75 30V15C23.75 6.71573 30.4657 0 38.75 0H40V5H38.75C33.2272 5 28.75 9.47715 28.75 15H40V30H23.75Z" fill="#00d084"/>
                    </svg>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < item.rating ? "fill-[#00d084] text-[#00d084]" : "text-white/10"} 
                      />
                    ))}
                  </div>

                  <p className="text-lg md:text-xl text-[#d4e9e2] font-medium italic mb-auto leading-relaxed font-serif">
                    "{item.text}"
                  </p>

                  <div className="flex items-center gap-4 mt-8">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-[#00d084]/20">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase tracking-widest text-sm mb-1">{item.name}</h4>
                      <p className="text-[#00d084] text-[10px] font-bold uppercase tracking-widest opacity-60">{item.role}</p>
                    </div>
                  </div>
                </motion.div>
              </TiltWrapper>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GALLERY_IMAGES = [ph1, ph2, ph3, ph4, ph5, ph6, ph7];

const HorizontalGallery = () => {
  const ImageItem = ({ url, index, total }) => {
    const ref = useRef();
    const texture = useTexture(url);
    
    const width = 4;
    const gap = 0.5;
    const totalWidth = (width + gap) * total;

    useFrame((state, delta) => {
      if (ref.current) {
        ref.current.position.x -= delta * 0.7;
        if (ref.current.position.x < -totalWidth / 2) {
          ref.current.position.x += totalWidth;
        }
      }
    });

    return (
      <mesh ref={ref} position={[(width + gap) * (index - total / 2), 0, 0]}>
        <planeGeometry args={[width, width * 1.4]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={1} />
      </mesh>
    );
  };

  return (
    <section className="h-[50vh] md:h-[70vh] bg-[#001a13] relative overflow-hidden border-y border-white/5 my-16 md:my-32">
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
          className="text-white text-3xl md:text-6xl font-medium tracking-tighter uppercase font-display italic"
        >
          Our Atmosphere
        </motion.h2>
      </div>
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas>
          <Suspense fallback={null}>
            <group>
              {GALLERY_IMAGES.map((url, i) => (
                <ImageItem key={i} url={url} index={i} total={GALLERY_IMAGES.length} />
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
  <section className="bg-[#001a13] pt-20 md:pt-40 pb-10 md:pb-20 px-8 overflow-hidden relative">
    <div className="max-w-7xl mx-auto relative flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 md:mb-24"
      >
        <span className="text-[#00d084] font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">Quality & Passion</span>
        <h2 className="text-white text-4xl md:text-7xl font-bold tracking-tighter">
          RASHFA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d084] to-[#00f0a4]">EXCELLENCE</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 w-full">
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
    <section className="pt-24 md:pt-32 pb-20 md:pb-64 px-4 md:px-8 bg-[#001a13] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-white/20 text-[10px] md:text-sm font-bold tracking-[0.5em] mb-4 uppercase">Explosive Flavor</div>
        <h2 className="text-white text-3xl md:text-8xl font-black mb-12 md:mb-20 tracking-tighter text-center leading-none">
          DECONSTRUCTED <br className="hidden md:block"/> <span className="text-[#00d084]">ARTISTRY</span>
        </h2>
        
        <div ref={blastRef} className="relative w-[280px] h-[350px] md:w-[500px] md:h-[600px] perspective-1000">
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
                  backgroundImage: `url(/assets/cofee.png)`,
                  backgroundSize: '500% 500%',
                  backgroundPosition: `${x * 25}% ${y * 25}%`,
                  willChange: 'transform, opacity'
                }}
              />
            );
          })}
        </div>

        <div className="mt-20 md:mt-40 text-center px-4">
          <p className="text-white/40 text-base md:text-lg font-serif italic max-w-2xl mx-auto leading-relaxed">
            "Every sip is a reconstruction of tradition, a modern blast of premium essence that comes together in perfect harmony."
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 208, 132, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto mt-12 md:mt-16 bg-[#00d084] text-[#001a13] px-12 py-5 rounded-full font-black tracking-[0.3em] uppercase text-[10px] md:text-xs"
          >
            Explore the Blend
          </motion.button>
        </div>
      </div>
    </section>
  );
};

const BranchesSection = () => (
  <section className="py-20 md:py-32 px-4 md:px-8 bg-[#001a13]">
    <div className="max-w-7xl mx-auto bg-white/5 rounded-[40px] md:rounded-[60px] p-8 md:p-20 border border-white/10 shadow-3xl">
      <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-[#00d084] font-display uppercase mb-4">OUR BRANCHES</h2>
        <div className="w-16 md:w-20 h-1 bg-[#00754a] rounded-full mb-6" />
        <p className="text-white/40 text-[10px] md:text-xs font-sans tracking-widest max-w-lg px-4 leading-relaxed">
          Continuous Service: 7:00 AM - 8:00 PM | Delivery: 6:30 AM - 7:30 PM
          <br className="hidden md:block" />
          <span className="text-[#00d084] block mt-2">05XX-XXXXXX | customerservice@rashfa.ma</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
        {[
          { city: "CASABLANCA - ANFA", addr: "Anfa Place Shopping Center, Bd de la Corniche" },
          { city: "MARRAKECH - HIVERNAGE", addr: "M Avenue, Hivernage, Marrakech 40000" },
          { city: "RABAT - AGDAL", addr: "Arribat Center, Agdal, Rabat" },
          { city: "TANGER - CITY CENTER", addr: "Tanger City Center, Place du Maghreb" }
        ].map((branch, i) => (
          <div key={i} className="flex gap-4 md:gap-6 p-4 md:p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-[#00d084]/20 transition-all group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0">
               <img 
                 src={`https://images.pexels.com/photos/2067561/pexels-photo-2067561.jpeg?auto=compress&cs=tinysrgb&w=150`} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                 referrerPolicy="no-referrer"
                 alt="Branch"
               />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-bold text-lg md:text-xl tracking-tight font-serif text-white">{branch.city}</h4>
              <p className="text-[8px] md:text-[10px] font-bold text-white/50 tracking-[0.15em] leading-relaxed uppercase mt-1 font-sans">{branch.addr}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TRAIL_IMAGES = [
  "https://images.pexels.com/photos/2156681/pexels-photo-2156681.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/302904/pexels-photo-302904.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/414645/pexels-photo-414645.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/894612/pexels-photo-894612.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1235706/pexels-photo-1235706.jpeg?auto=compress&cs=tinysrgb&w=400"
];

const ImageTrail = () => {
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });
  
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
            url: TRAIL_IMAGES[Math.floor(Math.random() * TRAIL_IMAGES.length)],
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
            animate={{ opacity: 0.3, scale: 1, rotate: item.rotation }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)", rotate: item.rotation + 10 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            style={{ left: item.x, top: item.y }}
            className="absolute w-40 h-52 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src={item.url} 
                className="w-full h-full object-cover grayscale-[80%] brightness-75" 
                alt="" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#002118]/5" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const RulesSection = ({ currencySymbol, settings }) => (
  <section className="py-16 md:py-32 px-6 md:px-24 bg-[#001a13] relative overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-8">
        <div>
          <span className="text-[#00d084] text-[10px] font-bold tracking-[0.5em] uppercase block mb-4">Service Excellence</span>
          <h2 className="text-3xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">Our Service <br /> <span className="text-[#00d084]">Commitment</span></h2>
        </div>
        <p className="text-white/40 max-w-md text-xs md:text-sm font-medium leading-relaxed">We adhere to the highest standards of quality and efficiency to ensure your {settings.storeName} experience is perfect every time.</p>
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
                  {detail.replace('MAD', currencySymbol)}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Delivery Fee", value: `15 ${currencySymbol}` },
          { label: "Free Delivery", value: `> 100 ${currencySymbol}` },
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

const MaintenancePage = ({ settings }) => (
  <div className="min-h-screen bg-[#001a13] flex items-center justify-center p-8 text-center overflow-hidden relative">
    {/* Animated background elements */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00d084]/5 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00d084]/5 rounded-full blur-[120px] animate-pulse delay-700" />
    
    <div className="relative z-10 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="w-24 h-24 bg-[#00d084]/10 rounded-[30px] flex items-center justify-center mx-auto mb-8 border border-[#00d084]/20 rotate-12">
          <Settings size={40} className="text-[#00d084] animate-spin-slow" />
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic font-display">
          Back <span className="text-[#00d084]">Soon</span>
        </h1>
        <p className="text-white/40 text-sm md:text-base font-bold tracking-[0.3em] uppercase leading-relaxed max-w-md mx-auto">
          {settings.storeName} is currently undergoing scheduled maintenance to improve your experience.
        </p>
      </motion.div>

      <div className="h-[1px] w-32 bg-white/10 mx-auto mb-12" />

      <div className="flex flex-col items-center gap-6">
        <p className="text-[#00d084] text-[10px] font-black tracking-[0.5em] uppercase">Estimated downtime: 2 hours</p>
        <div className="flex gap-4">
          <div className="w-2 h-2 bg-[#00d084] rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-[#00d084] rounded-full animate-bounce delay-150" />
          <div className="w-2 h-2 bg-[#00d084] rounded-full animate-bounce delay-300" />
        </div>
      </div>
    </div>
  </div>
);

const HomePage = ({ addToCart, settings, currencySymbol }) => (
  <>
    <Hero addToCart={addToCart} settings={settings} currencySymbol={currencySymbol} />
    <Marquee text={`Premium Coffee Experience • Signature Blends • Freshly Roasted • ${settings.storeName} Experience`} />
    <HorizontalGallery />
    <TestimonialsSection />
    <Marquee text="Join our community • Special Offers • New Arrivals • Limited Edition" reverse={true} tilted={true} isStatic={true} />
    <QualitySection />
    <RulesSection currencySymbol={currencySymbol} settings={settings} />
    <PopularSection />
    <BranchesSection />
  </>
);

const LoginPage = ({ login, settings }) => {
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
      const response = await fetch(apiUrl('/api/login'), {
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
    } catch {
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
                `Enter ${settings.storeName.split(' ')[0]}`
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

const SignUpPage = ({ login, settings }) => {
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
      const response = await fetch(apiUrl('/api/register'), {
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
    } catch {
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
                `Join ${settings.storeName.split(' ')[0]}`
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

const ProfilePage = ({ user, logout, token, currencySymbol }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [profilePic, setProfilePic] = useState(() => {
    return localStorage.getItem(`profile_pic_${user?.id}`) || null;
  });
  const [addresses, setAddresses] = useState([
    { id: 1, title: "Home", detail: "123 Coffee Street, Casablanca", isDefault: true },
    { id: 2, title: "Office", detail: "456 Tech Boulevard, Rabat", isDefault: false }
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Order Confirmed", message: "Your order #RSF-123 has been confirmed.", time: "2 hours ago", read: false },
    { id: 2, title: "New Offer!", message: "Get 20% off on all cold brews this weekend.", time: "5 hours ago", read: true },
    { id: 3, title: "Points Earned", message: "You just earned 50 points from your last purchase.", time: "1 day ago", read: true }
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ title: '', detail: '' });
  const [newCard, setNewCard] = useState({ number: '', holder: '', expiry: '' });
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, number: '••••  ••••  ••••  4242', holder: user.name, expiry: '12/26', isPrimary: true }
  ]);
  const fileInputRef = useRef(null);
  const contentRef = useRef(null);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) { // On mobile
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePic(base64String);
        localStorage.setItem(`profile_pic_${user?.id}`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAddress = (e) => {
    e.preventDefault();
    if (newAddress.title && newAddress.detail) {
      setAddresses([...addresses, { ...newAddress, id: Date.now(), isDefault: false }]);
      setNewAddress({ title: '', detail: '' });
      setShowAddressModal(false);
    }
  };

  const addCard = (e) => {
    e.preventDefault();
    if (newCard.number && newCard.holder && newCard.expiry) {
      // Simple masking for the UI
      const maskedNumber = `••••  ••••  ••••  ${newCard.number.slice(-4)}`;
      setPaymentMethods([...paymentMethods, { ...newCard, number: maskedNumber, id: Date.now(), isPrimary: false }]);
      setNewCard({ number: '', holder: '', expiry: '' });
      setShowPaymentModal(false);
    }
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const response = await fetch(apiUrl('/api/orders'), {
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
    
    const fetchLowStock = async () => {
      if (!token || !user?.is_admin) return;
      try {
        const response = await fetch(apiUrl('/api/products'), {
          headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        if (response.ok) {
          const lowStock = data.data.filter(p => p.stock <= 5);
          
          // Add to notifications
          if (lowStock.length > 0) {
            const lowStockNotifs = lowStock.map(p => ({
              id: `stock-${p.id}`,
              title: "Stock Alert",
              message: `Product ${p.name} is low on stock (${p.stock} units left).`,
              time: "Just now",
              read: false,
              type: 'alert'
            }));
            setNotifications(prev => [...lowStockNotifs, ...prev]);
          }
        }
      } catch (error) {
        console.error('Fetch low stock error:', error);
      }
    };

    fetchLowStock();
  }, [token, user]);

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
  const points = Math.floor(totalSpent / 10); // 1 point for every 10 units

  const menuItems = [
    { id: 'orders', icon: <Package size={18} />, name: "My Orders" },
    { id: 'payment', icon: <CreditCard size={18} />, name: "Payment Methods" },
    { id: 'addresses', icon: <MapPin size={18} />, name: "Addresses" },
    { id: 'notifications', icon: <Bell size={18} />, name: "Notifications" },
    ...(user?.is_admin === true ? [{ id: 'dashboard', icon: <LayoutDashboard size={18} />, name: "Dashboard", action: () => navigate('/admin') }] : []),
    { id: 'signout', icon: <LogOut size={18} />, name: "Sign Out", danger: true, action: handleLogout },
  ];

  return (
    <div className="min-h-screen bg-[#001a13] pt-24 md:pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6 md:space-y-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-[30px] md:rounded-[40px] p-6 md:p-10 border border-white/10">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 md:mb-6 group">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleProfilePicChange} 
                />
                <div 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#00d084] p-1 cursor-pointer overflow-hidden relative"
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#00754a] to-[#00d084] flex items-center justify-center overflow-hidden">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-[#001a13] md:size-[60px]" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Edit size={20} className="text-white" />
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-[#00d084] p-2 md:p-3 rounded-full shadow-xl border-4 border-[#001a13]"
                >
                  <Settings size={14} className="text-[#001a13] md:size-[16px]" />
                </motion.button>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-[#00d084] text-[9px] md:text-[10px] font-bold tracking-widest uppercase mb-6">{user.email}</p>
              
              <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
                <button 
                  onClick={() => handleTabChange('orders')}
                  className="bg-white/5 rounded-2xl p-3 md:p-4 border border-white/5 hover:bg-white/10 transition-colors text-left"
                >
                  <p className="text-white/40 text-[8px] md:text-[9px] font-bold tracking-widest uppercase mb-1">Orders</p>
                  <p className="text-lg md:text-xl font-bold text-white">{orders.length}</p>
                </button>
                <button 
                  onClick={() => handleTabChange('notifications')}
                  className="bg-white/5 rounded-2xl p-3 md:p-4 border border-white/5 hover:bg-white/10 transition-colors text-left"
                >
                  <p className="text-white/40 text-[8px] md:text-[9px] font-bold tracking-widest uppercase mb-1">Points</p>
                  <p className="text-lg md:text-xl font-bold text-[#00d084]">{points}</p>
                </button>
              </div>
            </div>

            <div className="mt-8 md:mt-10 space-y-1 md:space-y-2">
              {menuItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={item.action || (() => handleTabChange(item.id))}
                  className={`w-full flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all ${
                    activeTab === item.id ? 'bg-[#00d084] text-[#001a13]' : item.danger ? 'text-red-400 hover:bg-red-400/10' : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeTab}
          ref={contentRef}
          className="lg:col-span-2 space-y-6 md:space-y-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-[30px] md:rounded-[40px] p-6 md:p-10 border border-white/10 min-h-[400px] md:min-h-[500px]">
            {activeTab === 'orders' && (
              <>
                <h3 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
                  <Clock size={18} className="text-[#00d084] md:size-[20px]" /> Recent Orders
                </h3>
                
                <div className="space-y-4 md:space-y-6">
                  {loading ? (
                    <div className="flex justify-center py-10">
                      <div className="w-8 h-8 border-2 border-[#00d084]/30 border-t-[#00d084] rounded-full animate-spin" />
                    </div>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className="bg-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="w-full sm:w-auto">
                          <p className="text-white/40 text-[8px] md:text-[9px] font-bold tracking-widest uppercase mb-1">{order.order_number}</p>
                          <h4 className="text-white font-bold text-sm md:text-base">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</h4>
                          <p className="text-white/60 text-[10px] md:text-xs mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                          <p className="text-[#00d084] font-black text-sm md:text-base">{order.total_amount} {currencySymbol}</p>
                          <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                            order.status === 'completed' ? 'bg-[#00d084]/10 text-[#00d084]' : 'bg-orange-500/10 text-orange-500'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-white/40 text-xs md:text-sm">No orders yet. Start ordering your favorite coffee!</p>
                    </div>
                  )}
                </div>

                {orders.length > 0 && (
                  <button 
                    onClick={() => navigate('/shop')}
                    className="w-full mt-8 md:mt-10 py-3 md:py-4 border-2 border-white/5 rounded-xl md:rounded-2xl text-white/40 font-bold text-[9px] md:text-[10px] tracking-widest uppercase hover:bg-white/5 hover:text-white transition-all"
                  >
                    Continue Shopping
                  </button>
                )}
              </>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <CreditCard size={20} className="text-[#00d084]" /> Payment Methods
                  </h3>
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00d084]/10 text-[#00d084] rounded-xl font-bold text-[10px] tracking-widest uppercase border border-[#00d084]/20 hover:bg-[#00d084]/20 transition-all"
                  >
                    <Plus size={14} /> Add Card
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-[30px] border border-white/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard size={120} />
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-12">
                          <div className="w-12 h-8 bg-white/10 rounded-md" />
                          {method.isPrimary && (
                            <p className="text-white/40 text-[10px] font-black tracking-widest uppercase">Primary Card</p>
                          )}
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-white mb-8 tracking-[0.2em]">{method.number}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest mb-1">Card Holder</p>
                            <p className="text-sm font-bold text-white uppercase">{method.holder}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest mb-1">Expires</p>
                            <p className="text-sm font-bold text-white">{method.expiry}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-center text-white/20 text-[10px] font-medium italic">
                  * Payment methods are securely encrypted and stored by our payment provider.
                </p>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <MapPin size={20} className="text-[#00d084]" /> My Addresses
                  </h3>
                  <button 
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00d084]/10 text-[#00d084] rounded-xl font-bold text-[10px] tracking-widest uppercase border border-[#00d084]/20 hover:bg-[#00d084]/20 transition-all"
                  >
                    <Plus size={14} /> Add New
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <div key={addr.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 relative group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <span className="p-2 bg-[#00d084]/10 rounded-lg text-[#00d084]">
                              <MapPin size={16} />
                            </span>
                            <h4 className="text-white font-bold">{addr.title}</h4>
                            {addr.isDefault && (
                              <span className="text-[7px] font-black uppercase tracking-widest bg-[#00d084] text-[#001a13] px-1.5 py-0.5 rounded">Default</span>
                            )}
                          </div>
                          <button 
                            onClick={() => deleteAddress(addr.id)}
                            className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-400/10 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-white/40 text-xs leading-relaxed">{addr.detail}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                      <MapPin size={48} className="text-[#00d084] mb-4 opacity-20" />
                      <p className="text-white/40 text-sm max-w-xs">You haven't added any addresses yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                  <Bell size={20} className="text-[#00d084]" /> Notifications
                </h3>

                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-6 rounded-3xl border border-white/5 transition-all cursor-pointer group flex justify-between items-center ${
                          n.read ? 'bg-white/5' : 'bg-[#00d084]/5 border-[#00d084]/20 shadow-lg shadow-[#00d084]/5'
                        }`}
                      >
                        <div className="flex gap-4 items-center">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-white/10' : 'bg-[#00d084]'}`} />
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className={`font-bold text-sm md:text-base ${n.read ? 'text-white/60' : 'text-white'}`}>{n.title}</h4>
                              <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{n.time}</span>
                            </div>
                            <p className={`text-[10px] md:text-xs ${n.read ? 'text-white/40' : 'text-white/60'}`}>{n.message}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-400/10 rounded-lg shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Bell size={48} className="text-[#00d084] mb-4 opacity-20" />
                      <p className="text-white/40 text-sm max-w-xs">No notifications yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddressModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#002118] border border-white/10 p-8 md:p-10 rounded-[40px] w-full max-w-lg relative z-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Add New Address</h3>
                <button onClick={() => setShowAddressModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={addAddress} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-[#00d084] uppercase tracking-widest mb-2 block">Address Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Home, Office, Gym"
                    value={newAddress.title}
                    onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d084] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#00d084] uppercase tracking-widest mb-2 block">Address Details</label>
                  <textarea 
                    placeholder="Full address details..."
                    value={newAddress.detail}
                    onChange={(e) => setNewAddress({ ...newAddress, detail: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d084] transition-all min-h-[120px] resize-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#00d084] text-[#001a13] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Save Address
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#002118] border border-white/10 p-8 md:p-10 rounded-[40px] w-full max-w-lg relative z-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Add New Card</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={addCard} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-[#00d084] uppercase tracking-widest mb-2 block">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="4242 4242 4242 4242"
                    maxLength="16"
                    value={newCard.number}
                    onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d084] transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-[#00d084] uppercase tracking-widest mb-2 block">Card Holder</label>
                    <input 
                      type="text" 
                      placeholder="NAME ON CARD"
                      value={newCard.holder}
                      onChange={(e) => setNewCard({ ...newCard, holder: e.target.value.toUpperCase() })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d084] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#00d084] uppercase tracking-widest mb-2 block">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      maxLength="5"
                      value={newCard.expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        setNewCard({ ...newCard, expiry: val });
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d084] transition-all"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#00d084] text-[#001a13] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                >
                  Save Card
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AboutPage = ({ settings, currencySymbol }) => {
  return (
    <div className="min-h-screen bg-[#f2f0eb] text-[#002118] font-sans selection:bg-[#00754a] selection:text-white">
      {/* 1. Overlap Hero Section */}
      <section className="pt-32 md:pt-52 pb-20 md:pb-32 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative flex flex-col md:flex-row items-center justify-center min-h-[500px] md:min-h-[600px]">
          {/* Text Card - Overlaps Image */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-16 shadow-2xl z-20 w-full md:w-[550px] md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 border-t-8 border-[#00754a]"
          >
            <h2 className="text-2xl md:text-4xl font-medium leading-tight mb-6 md:mb-8 tracking-tight text-[#002118] font-serif italic">
              In our coffee-growing regions around the globe, our story begins. It's a tale of dedication, passion, and a deep-rooted love for coffee.
            </h2>
            <div className="w-16 md:w-20 h-1 bg-[#00754a] mb-6 md:mb-8" />
            <p className="text-[10px] md:text-sm font-bold text-[#002118]/60 uppercase tracking-widest leading-relaxed font-sans">
              Every bean tells a story of the soil it grew in and the hands that nurtured it. At {settings.storeName}, we honor this journey from farm to cup.
            </p>
          </motion.div>

          {/* Image Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full md:w-[600px] h-[300px] md:h-[700px] mt-8 md:mt-0 md:ml-60 overflow-hidden shadow-2xl rounded-sm relative"
          >
            <img 
              src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200"
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
              alt="Coffee roasting process"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#00754a]/5 mix-blend-multiply" />
          </motion.div>
        </div>
      </section>

      {/* 2. New Arrival Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
            <div>
              <span className="text-[#00754a] font-black text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 block">Seasonal Collection</span>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-[#002118] uppercase leading-[0.85]">
                New<br /><span className="text-[#00754a]">Arrival</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-4 md:gap-8 border-b border-[#002118]/10 pb-4">
              {['All Coffee', 'Espresso', 'Cold Brew', 'Merchandise'].map((cat, i) => (
                <button key={i} className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-[#00754a]' : 'text-[#002118]/40 hover:text-[#002118]'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
            {[
              { name: "Winter Spice Latte", price: `35 ${currencySymbol}`, img: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400" },
              { name: "Ethiopian Yirgacheffe", price: `45 ${currencySymbol}`, img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400" },
              { name: "Caramel Macchiato", price: `32 ${currencySymbol}`, img: "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=400" },
              { name: "Cold Foam Cold Brew", price: `28 ${currencySymbol}`, img: "https://images.pexels.com/photos/2156681/pexels-photo-2156681.jpeg?auto=compress&cs=tinysrgb&w=400" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] bg-gray-100 mb-4 md:mb-6 overflow-hidden relative">
                  <img 
                    src={item.img} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={item.name} 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-white px-2 md:px-3 py-1 text-[7px] md:text-[8px] font-black uppercase tracking-widest">New</div>
                </div>
                <h4 className="text-[10px] md:text-sm font-black uppercase tracking-tight mb-1">{item.name}</h4>
                <p className="text-[9px] md:text-xs font-bold text-[#00754a]">{item.price}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 md:mt-20 flex justify-center">
            <Link to="/shop" className="w-full md:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto border-2 border-[#002118] text-[#002118] px-12 py-4 rounded-full font-black text-[9px] md:text-[10px] tracking-widest uppercase hover:bg-[#002118] hover:text-white transition-all"
              >
                View More Collection
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Whole Beans Section */}
      <section className="py-20 md:py-32 bg-[#00754a] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-8 md:mb-12 leading-none">
              Whole<br />Beans
            </h2>
            <div className="space-y-8 md:space-y-12">
              {[
                { title: "Roast Level", desc: "From light citrus notes to deep, dark chocolate finishes. Choose your intensity." },
                { title: "Flavor Profile", desc: "Discover hints of caramel, nuts, and berries in our carefully selected single-origin beans." },
                { title: "Brewing Guide", desc: "Master the art of the pour-over, French press, or espresso at home with our experts." }
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="flex items-center gap-4 md:gap-6 mb-3 md:mb-4">
                    <span className="text-xl md:text-2xl font-black text-white/20 group-hover:text-white transition-colors">0{i+1}</span>
                    <h4 className="text-lg md:text-xl font-black uppercase tracking-tight">{item.title}</h4>
                  </div>
                  <p className="text-white/60 text-[11px] md:text-sm leading-relaxed max-w-md ml-10 md:ml-14">
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
              src="https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1200"
              className="relative z-10 w-full h-auto rounded-2xl md:rounded-3xl shadow-3xl" 
              alt="Whole beans" 
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* 4. Bottom Blocks */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        {[
          { title: "About Us", bg: "bg-[#f2f0eb]", text: "text-[#002118]", img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600", path: "/about" },
          { title: "Order and Pick up", bg: "bg-[#d4e9e2]", text: "text-[#002118]", img: "https://images.pexels.com/photos/2156681/pexels-photo-2156681.jpeg?auto=compress&cs=tinysrgb&w=600", path: "/shop" },
          { title: "Business Partners", bg: "bg-[#1e3932]", text: "text-white", img: "https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=600", path: "/contact" }
        ].map((block, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className={`${block.bg} ${block.text} p-10 md:p-16 h-[350px] md:h-[500px] flex flex-col justify-between group cursor-pointer relative overflow-hidden`}
          >
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-none">{block.title}</h3>
              <Link to={block.path} className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 flex items-center group-hover:opacity-100 transition-opacity">
                Discover More <ArrowRight className="inline-block ml-2 w-3 h-3" />
              </Link>
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 md:w-80 md:h-80 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700">
               <img 
                 src={block.img} 
                 className="w-full h-full object-cover rounded-full grayscale" 
                 alt={block.title} 
                 referrerPolicy="no-referrer"
               />
            </div>
          </motion.div>
        ))}
      </section>

      {/* 5. Big Footer Text */}
      <section className="py-20 md:py-40 bg-[#f2f0eb] flex items-center justify-center overflow-hidden relative group">
        <ImageTrail />
        <h2 className="text-[20vw] md:text-[15vw] font-black text-[#002118]/5 uppercase tracking-tighter whitespace-nowrap leading-none select-none relative z-10">
          {settings.storeName}
        </h2>
      </section>
    </div>
  );
};

const ShopPage = ({ addToCart, settings, currencySymbol }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.COFFEE);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Grande');
  const [fetchedProducts, setFetchedProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl('/api/products'));
        const data = await response.json();
        if (response.ok) {
          // Group products by category
          const grouped = data.data.reduce((acc, product) => {
            const cat = product.category;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(product);
            return acc;
          }, {});
          setFetchedProducts(grouped);
        }
      } catch (error) {
        console.error('Fetch shop products error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const shopCategories = [
    { id: CATEGORIES.COFFEE, name: 'Coffee', icon: <Coffee size={18} /> },
    { id: CATEGORIES.COLD, name: 'Cold', icon: <Sparkles size={18} /> },
    { id: CATEGORIES.TEAS, name: 'Teas', icon: <Leaf size={18} /> },
    { id: CATEGORIES.BAKERY, name: 'Bakery', icon: <Package size={18} /> },
  ];

  const currentProducts = [
    ...(fetchedProducts[selectedCategory] || []),
    ...(MENU_ITEMS[selectedCategory] || [])
  ].filter((product, index, self) => 
    index === self.findIndex((p) => p.name.toLowerCase().trim() === product.name.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen bg-[#001a13] text-white font-sans pt-20 md:pt-32 pb-20 md:pb-32 relative overflow-x-hidden">
      {/* Hero Section - Clean & Green */}
      <div className="relative w-full h-[30vh] md:h-[45vh] flex flex-col items-center justify-center text-center px-8 mb-4 bg-gradient-to-b from-[#001a13] to-[#002118]">
        <div className="relative z-10 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ 
              opacity: 1, 
              y: 0,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="rashfa-title select-none drop-shadow-2xl leading-none"
            style={{ 
              fontSize: 'min(120px, 15vw)',
            }}
          >
            {settings.storeName.split(' ')[0]}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Simplified Category Selector */}
        <div className="flex justify-start md:justify-center gap-6 md:gap-12 mb-12 md:mb-24 border-b border-white/5 pb-6 md:pb-8 overflow-x-auto no-scrollbar">
          {shopCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap pb-2 ${
                  isActive ? 'text-[#00d084]' : 'text-white/40 hover:text-white'
                }`}
              >
                {cat.name}
                {isActive && (
                  <motion.div 
                    layoutId="activeCat"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d084]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Product Grid - Matching Card Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-2 border-[#00d084] border-t-transparent rounded-full"
              />
              <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">Loading our selection...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {currentProducts.map((product, i) => (
                <motion.div
                  key={`${selectedCategory}-${product.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-md rounded-[24px] md:rounded-[30px] overflow-hidden border border-white/5 hover:border-[#00d084]/30 group flex flex-col transition-colors duration-500"
                >
                  <div 
                    className="aspect-square overflow-hidden cursor-pointer relative"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img 
                      src={product.image ? (product.image.startsWith('http') ? product.image : apiUrl(product.image)) : product.img} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      alt={product.name}
                    />
                    <div className="absolute inset-0 bg-[#001a13]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-6 md:p-10 flex flex-col flex-grow text-center">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 font-serif tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-[9px] md:text-[10px] text-white/30 font-bold uppercase tracking-widest mb-3 md:mb-4">
                      {product.volume || product.weight || 'Premium Blend'}
                    </p>
                    <p className="text-base md:text-lg font-black text-[#00d084] mb-6 md:mb-8">
                      {product.price} {currencySymbol}
                    </p>
                    
                    <button 
                      className="mt-auto w-full py-3 md:py-4 rounded-xl bg-white/5 text-white/60 font-bold text-[9px] tracking-[0.2em] uppercase hover:bg-[#00d084] hover:text-[#001a13] transition-all duration-500 border border-white/5 hover:border-transparent"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
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
              className="bg-[#001a13] w-full max-w-4xl rounded-[30px] md:rounded-[40px] border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] md:max-h-none md:overflow-hidden relative flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-3 bg-white/5 hover:bg-[#00d084] hover:text-[#001a13] rounded-full transition-all z-10 text-white"
              >
                <X size={18} />
              </button>

              <div className="w-full md:w-1/2 p-6 md:p-12 bg-white/5">
                <img 
                  src={selectedProduct.img} 
                  className="w-full h-auto md:h-full object-cover rounded-2xl md:rounded-3xl shadow-lg"
                  alt={selectedProduct.name}
                />
              </div>

              <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col justify-center">
                <span className="text-[#00d084] font-bold text-[9px] md:text-[10px] tracking-[0.3em] uppercase mb-2 md:mb-4 block">Handcrafted</span>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 font-serif tracking-tight">
                  {selectedProduct.name}
                </h2>

                {/* Size Selector */}
                <div className="mb-6 md:mb-8">
                  <p className="text-white/40 text-[8px] md:text-[9px] font-bold tracking-widest uppercase mb-4">Select Size</p>
                  <div className="flex gap-3">
                    {['Short', 'Tall', 'Grande', 'Venti'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all border ${
                          selectedSize === size 
                            ? 'bg-[#00d084] border-transparent text-[#001a13]' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-[#00d084]/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xl md:text-2xl font-black text-[#00d084] mb-6 md:mb-10">{selectedProduct.price} {currencySymbol}</p>
                
                <p className="text-xs md:text-sm text-white/50 leading-relaxed mb-8 md:mb-12 font-medium">
                  {selectedProduct.desc || "Experience the perfect harmony of flavors with our premium selection. Each cup is a journey of taste and aroma."}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                  <div className="flex items-center w-full sm:w-auto bg-white/5 rounded-full p-2 border border-white/10 justify-between">
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
                    className="w-full sm:flex-grow bg-white text-[#001a13] py-4 rounded-full font-black text-[10px] tracking-[0.2em] uppercase shadow-xl hover:bg-[#00d084] transition-all"
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

const AdminDashboard = ({ token, settings, setSettings, currencySymbol }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminProducts, setAdminProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  
  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-[#00d084] text-[#001a13] px-8 py-4 rounded-full font-black shadow-2xl z-[10000] animate-bounce uppercase tracking-widest text-xs';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };


  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };

      const fetchEndpoint = async (url, setter) => {
        try {
          const res = await fetch(apiUrl(`/api/admin/${url}`), { headers });
          if (res.ok) {
            const data = await res.json();
            setter(data.data);
          }
        } catch (error) {
          console.error(`Fetch ${url} error:`, error);
        }
      };

      try {
        // Fetch orders first as they are most critical for dashboard
        await fetchEndpoint('orders', setOrders);
        
        // Fetch others in parallel
        await Promise.all([
          fetchEndpoint('products', (products) => {
            setAdminProducts(products);
            setLowStockItems(products.filter(p => p.stock <= 5));
          }),
          fetchEndpoint('promotions', setPromotions),
          fetchEndpoint('employees', setEmployees),
          fetchEndpoint('clients', setClients),
          fetchEndpoint('products/best-sellers', setBestSellers)
        ]);
      } catch (error) {
        console.error('Fetch admin data error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (orders.length > 0) {
      const completedOrders = orders.filter(o => o.status === 'completed');
      const totalRevenue = completedOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      const uniqueUsers = new Set(orders.map(order => order.user_id)).size;
      
      const newStats = {
        revenue: totalRevenue,
        orders: orders.length,
        users: uniqueUsers,
        avgWait: 4.2 // Mocked for now
      };
      
      setStats(newStats);
      localStorage.setItem('admin_stats', JSON.stringify(newStats));
    }
  }, [orders]);

  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [promoFormData, setPromoFormData] = useState({
    code: '',
    discount: '',
    type: 'Direct Discount',
    maxUsage: 100,
    status: 'Active'
  });

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    role: 'Barista',
    shift: '07:00 - 15:00',
    status: 'On Duty',
    email: ''
  });

  const handleOpenEmployeeModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setEmployeeFormData({
        name: employee.name,
        role: employee.role,
        shift: employee.shift,
        status: employee.status,
        email: employee.email
      });
    } else {
      setEditingEmployee(null);
      setEmployeeFormData({
        name: '',
        role: 'Barista',
        shift: '07:00 - 15:00',
        status: 'On Duty',
        email: ''
      });
    }
    setIsEmployeeModalOpen(true);
  };

  const handleOpenClientModal = (client) => {
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };

  const handleOpenOrderModal = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleSaveEmployee = async () => {
    try {
      const url = editingEmployee 
        ? apiUrl(`/api/admin/employees/${editingEmployee.id}`)
        : apiUrl('/api/admin/employees');
      
      const response = await fetch(url, {
        method: editingEmployee ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(employeeFormData)
      });

      const data = await response.json();
      if (response.ok) {
        if (editingEmployee) {
          setEmployees(employees.map(e => e.id === editingEmployee.id ? data.data : e));
        } else {
          setEmployees([...employees, data.data]);
        }
        setIsEmployeeModalOpen(false);
      } else {
        alert(data.message || 'Failed to save employee');
      }
    } catch (error) {
      console.error('Save employee error:', error);
      alert('An error occurred while saving employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Remove this team member?')) {
      try {
      const response = await fetch(apiUrl(`/api/admin/employees/${id}`), {
        method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          setEmployees(employees.filter(e => e.id !== id));
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete employee');
        }
      } catch (error) {
        console.error('Delete employee error:', error);
        alert('An error occurred while deleting employee');
      }
    }
  };

  const handleOpenPromoModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setPromoFormData({
        code: promo.code,
        discount: promo.discount,
        type: promo.type,
        maxUsage: promo.maxUsage,
        status: promo.status
      });
    } else {
      setEditingPromo(null);
      setPromoFormData({
        code: '',
        discount: '',
        type: 'Direct Discount',
        maxUsage: 100,
        status: 'Active'
      });
    }
    setIsPromoModalOpen(true);
  };

  const handleSavePromo = async () => {
    try {
      const url = editingPromo 
        ? apiUrl(`/api/admin/promotions/${editingPromo.id}`)
        : apiUrl('/api/admin/promotions');
      
      const response = await fetch(url, {
        method: editingPromo ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(promoFormData)
      });

      const data = await response.json();
      if (response.ok) {
        if (editingPromo) {
          setPromotions(promotions.map(p => p.id === editingPromo.id ? data.data : p));
        } else {
          setPromotions([...promotions, data.data]);
        }
        setIsPromoModalOpen(false);
      } else {
        alert(data.message || 'Failed to save promotion');
      }
    } catch (error) {
      console.error('Save promo error:', error);
      alert('An error occurred while saving promotion');
    }
  };

  const handleDeletePromo = async (id) => {
    if (window.confirm('Delete this promotion?')) {
      try {
      const response = await fetch(apiUrl(`/api/admin/promotions/${id}`), {
        method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          setPromotions(promotions.filter(p => p.id !== id));
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete promotion');
        }
      } catch (error) {
        console.error('Delete promo error:', error);
        alert('An error occurred while deleting promotion');
      }
    }
  };

  const [stockFormData, setStockFormData] = useState({
    productId: '',
    productName: '',
    currentStock: 0,
    adjustment: 0
  });
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const handleOpenStockModal = (product) => {
    setStockFormData({
      productId: product.id,
      productName: product.name,
      currentStock: product.stock,
      adjustment: 0
    });
    setIsStockModalOpen(true);
  };

  const handleSaveStock = async () => {
    try {
      const newStock = parseInt(stockFormData.currentStock) + parseInt(stockFormData.adjustment);
      const response = await fetch(apiUrl(`/api/admin/products/${stockFormData.productId}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ stock: newStock })
      });

      const data = await response.json();
      if (response.ok) {
        setAdminProducts(adminProducts.map(p => p.id === stockFormData.productId ? data.data : p));
        setIsStockModalOpen(false);
        showToast('Stock updated successfully!');
      } else {
        alert(data.message || 'Failed to update stock');
      }
    } catch (error) {
      console.error('Save stock error:', error);
      alert('An error occurred while updating stock');
    }
  };

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: CATEGORIES.COFFEE,
    desc: '',
    img: ''
  });

  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData({
        name: product.name,
        price: product.price,
        stock: product.stock || '0',
        category: product.category,
        desc: product.desc,
        img: product.img
      });
    } else {
      setEditingProduct(null);
      setProductFormData({
        name: '',
        price: '',
        stock: '',
        category: CATEGORIES.COFFEE,
        desc: '',
        img: ''
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      const url = editingProduct 
        ? apiUrl(`/api/admin/products/${editingProduct.id}`)
        : apiUrl('/api/admin/products');
      
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(productFormData)
      });

      const data = await response.json();
      if (response.ok) {
        if (editingProduct) {
          setAdminProducts(adminProducts.map(p => p.id === editingProduct.id ? data.data : p));
          showToast('Product updated successfully!');
        } else {
          setAdminProducts([...adminProducts, data.data]);
          showToast('Product added successfully!');
        }
        setIsProductModalOpen(false);
      } else {
        alert(data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Save product error:', error);
      alert('An error occurred while saving product');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductFormData({ ...productFormData, img: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
      const response = await fetch(apiUrl(`/api/admin/products/${productId}`), {
        method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          setAdminProducts(adminProducts.filter(p => p.id !== productId));
          showToast('🗑️ Product deleted successfully!');
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Delete product error:', error);
        alert('An error occurred while deleting product');
      }
    }
  };

  const [stats, setStats] = useState(() => {
    try {
      const savedStats = localStorage.getItem('admin_stats');
      return savedStats ? JSON.parse(savedStats) : {
        revenue: 0,
        orders: 0,
        users: 0,
        avgWait: 4.2
      };
    } catch {
      return { revenue: 0, orders: 0, users: 0, avgWait: 4.2 };
    }
  });

  const [activeFilter, setActiveFilter] = useState('Week');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const chartData = useMemo(() => {
    if (activeFilter === 'Day') {
      return [
        { name: '08:00', sales: 400 },
        { name: '10:00', sales: 1200 },
        { name: '12:00', sales: 2800 },
        { name: '14:00', sales: 1900 },
        { name: '16:00', sales: 3400 },
        { name: '18:00', sales: 4200 },
        { name: '20:00', sales: 2100 },
      ];
    } else if (activeFilter === 'Week') {
      return [
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 2000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 },
        { name: 'Sat', sales: 2390 },
        { name: 'Sun', sales: 3490 },
      ];
    } else if (activeFilter === 'Month') {
      return [
        { name: 'Week 1', sales: 12000 },
        { name: 'Week 2', sales: 15000 },
        { name: 'Week 3', sales: 11000 },
        { name: 'Week 4', sales: 18000 },
      ];
    }
    return [];
  }, [activeFilter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(apiUrl(`/api/admin/orders/${orderId}/status`), {
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
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Update order status error:', error);
      alert('An error occurred while updating order status');
    }
  };

  const exportToCSV = (data, fileName, headers) => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    const csvRows = [];
    // Add separator hint for Excel
    csvRows.push('sep=,');
    csvRows.push(headers.join(','));

    data.forEach(item => {
      const values = headers.map(header => {
        let value = '';
        const h = header.toLowerCase();
        if (h.includes('number')) value = item.order_number;
        else if (h.includes('client')) value = item.user?.name || item.user_name || 'Guest';
        else if (h.includes('amount')) value = item.total_amount;
        else if (h.includes('status')) value = item.status;
        else if (h.includes('date')) value = new Date(item.created_at).toLocaleDateString();
        else if (h.includes('email')) value = item.email || item.user?.email || '';
        
        const escaped = ('' + value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateReport = () => {
    const headers = ['Order Number', 'Client', 'Total Amount', 'Status', 'Date'];
    exportToCSV(orders, `Rashfa_Orders_Report_${activeFilter}`, headers);
    showToast('Report downloaded successfully!');
  };

  const generateInvoice = (order) => {
    const invoiceWindow = window.open('', '_blank');
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.order_number}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.6; background: #fff; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #00d084; padding-bottom: 20px; margin-bottom: 40px; }
          .logo { font-size: 32px; font-weight: 900; color: #001a13; text-transform: uppercase; }
          .logo span { color: #00d084; }
          .invoice-info { text-align: right; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 2px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .details-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { text-align: left; background: #f9f9f9; padding: 12px; font-size: 12px; text-transform: uppercase; color: #666; }
          td { padding: 12px; border-bottom: 1px solid #eee; }
          .total-section { margin-top: 40px; text-align: right; }
          .total-row { display: flex; justify-content: flex-end; gap: 20px; align-items: center; margin-bottom: 5px; }
          .total-label { font-size: 14px; color: #888; }
          .total-amount { font-size: 24px; font-weight: 900; color: #00d084; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px; }
          @media print {
            body { padding: 20px; }
            .print-btn { display: none; }
          }
          .print-btn { background: #00d084; color: #001a13; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Print Invoice / Save as PDF</button>
        <div class="header">
          <div class="logo">RASH<span>FA</span></div>
          <div class="invoice-info">
            <h2 style="margin:0">INVOICE</h2>
            <p style="margin:5px 0"># ${order.order_number}</p>
            <p style="margin:0; font-size: 14px; color: #888;">Date: ${new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div class="details-grid">
          <div class="section">
            <div class="section-title">Billed To</div>
            <p style="margin: 5px 0; font-weight: bold;">${order.user?.name || order.name}</p>
            <p style="margin: 0; color: #666;">${order.user?.email || order.email}</p>
            <p style="margin: 0; color: #666;">${order.phone}</p>
          </div>
          <div class="section">
            <div class="section-title">Delivery Address</div>
            <p style="margin: 5px 0; color: #666;">${order.address || 'In-store pickup'}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="font-weight: bold;">${item.product_name || item.name}</td>
                  <td>${item.price} ${currencySymbol}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: right; font-weight: bold;">${item.price * item.quantity} ${currencySymbol}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="total-section">
          <div class="total-row">
            <div class="total-label">Payment Method:</div>
            <div style="font-weight: bold; text-transform: uppercase;">${order.payment_method}</div>
          </div>
          <div class="total-row">
            <div class="total-label">Subtotal:</div>
            <div style="font-weight: bold;">${order.total_amount} ${currencySymbol}</div>
          </div>
          <div class="total-row" style="margin-top: 10px;">
            <div class="total-label" style="font-size: 18px; color: #333; font-weight: bold;">Total Amount:</div>
            <div class="total-amount">${order.total_amount} ${currencySymbol}</div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing ${settings.storeName}!</p>
          <p>www.rashfa.com | ${settings.contactEmail}</p>
        </div>
      </body>
      </html>
    `;
    
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={20} /> },
    { id: 'products', label: 'Products', icon: <Coffee size={20} /> },
    { id: 'stocks', label: 'Stocks', icon: <TrendingUp size={20} /> },
    { id: 'clients', label: 'Clients', icon: <Users size={20} /> },
    { id: 'promotions', label: 'Promotions', icon: <Sparkles size={20} /> },
    { id: 'employees', label: 'Employees', icon: <User size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Lock size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#001a13] pt-32 md:pt-44 pb-20 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6 md:gap-10">
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white/5 backdrop-blur-xl rounded-[30px] md:rounded-[40px] border border-white/10 p-6 md:p-8 lg:sticky lg:top-44">
            <div className="mb-6 md:mb-10 px-2 md:px-4">
              <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tighter">ADMIN <span className="text-[#00d084]">PANEL</span></h2>
              <p className="text-white/40 text-[8px] md:text-[10px] font-bold tracking-widest uppercase mt-1 md:mt-2">Rashfa Management v1.0</p>
            </div>
            
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2 no-scrollbar">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-widest uppercase transition-all whitespace-nowrap lg:w-full ${
                    activeTab === item.id 
                      ? 'bg-[#00d084] text-[#001a13] shadow-lg shadow-[#00d084]/20' 
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="hidden lg:block mt-10 pt-10 border-t border-white/5 px-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#00d084]/20 flex items-center justify-center text-[#00d084]">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-[10px] tracking-widest uppercase">Admin User</p>
                  <p className="text-white/40 text-[8px] font-bold tracking-widest uppercase">System Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow space-y-6 md:space-y-10">
          {activeTab === 'dashboard' && (
            <>
              {lowStockItems.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-[30px] p-6 mb-8 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Low Stock Alert</h4>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                        {lowStockItems.length} products are running low on stock
                      </p>
                    </div>
                  </div>
                  <button 
                     onClick={() => setActiveTab('products')}
                     className="px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                   >
                     Manage Stock
                   </button>
                </motion.div>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
                    Control <span className="text-[#00d084]">Center</span>
                  </h1>
                  <p className="text-white/40 text-[10px] md:text-xs font-bold tracking-widest uppercase mt-2">Real-time overview of your business</p>
                </div>
                <div className="flex gap-3 md:gap-4 relative">
                  <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className={`bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 transition-all ${showFilterDropdown ? 'text-[#00d084] border-[#00d084]/30' : 'text-white/60 hover:text-white'}`}
                  >
                    <Filter size={18} className="md:size-[20px]" />
                  </button>

                  {showFilterDropdown && (
                    <div className="absolute top-full mt-4 right-0 w-48 bg-[#002a1e] backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl z-[50] overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                      <p className="px-4 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5 mb-1">Select Period</p>
                      {['Day', 'Week', 'Month'].map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setActiveFilter(t);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-left px-6 py-3 text-[11px] font-bold tracking-widest uppercase transition-all ${
                            activeFilter === t ? 'text-[#00d084] bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}

                  <button 
                    onClick={handleGenerateReport}
                    className="flex-grow md:flex-grow-0 bg-[#00d084] text-[#001a13] px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] tracking-widest uppercase flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#00d084]/20"
                  >
                    Generate Report <ArrowRight size={14} className="md:size-[16px]" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: "Total Revenue", value: `${stats.revenue.toLocaleString()} ${currencySymbol}`, change: "+12.5%", icon: <DollarSign size={18} className="text-[#00d084]" />, tab: 'reports' },
                  { label: "Total Orders", value: stats.orders.toLocaleString(), change: "+8.2%", icon: <Package size={18} className="text-[#00d084]" />, tab: 'orders' },
                  { label: "Active Users", value: stats.users.toLocaleString(), change: "+5.1%", icon: <Users size={18} className="text-[#00d084]" />, tab: 'clients' },
                  { label: "Avg. Wait Time", value: `${stats.avgWait} min`, change: "-2.4%", icon: <Clock size={18} className="text-[#00d084]" />, tab: 'maintenance' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => stat.tab && setActiveTab(stat.tab)}
                    className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[30px] md:rounded-[35px] border border-white/10 hover:bg-white/10 transition-all group cursor-pointer active:scale-95"
                  >
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                      <div className="p-3 md:p-4 bg-[#00d084]/10 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform">
                        {stat.icon}
                      </div>
                      <span className={`text-[9px] md:text-[10px] font-bold px-3 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-white/40 text-[9px] md:text-[10px] font-bold tracking-widest uppercase mb-1">{stat.label}</p>
                    <h3 className={`text-xl md:text-3xl font-black text-white ${loading ? 'animate-pulse' : ''}`}>
                      {stat.value}
                    </h3>
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
                        <button 
                          key={t} 
                          onClick={() => setActiveFilter(t)}
                          className={`px-4 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all ${
                            activeFilter === t 
                              ? 'bg-[#00d084] text-[#001a13] shadow-lg shadow-[#00d084]/20' 
                              : 'text-white/40 hover:bg-white/5 hover:text-white'
                          }`}
                        >
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
                    {orders.length === 0 && loading ? (
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
                            <p className="text-[#00d084] font-black text-sm">{order.total_amount} {currencySymbol}</p>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
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
                              <button 
                                 onClick={() => handleOpenOrderModal(order)}
                                 className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-white/20 hover:text-[#00d084] hover:bg-[#00d084]/10 transition-all border border-white/5"
                                 title="View Details"
                               >
                                 <Eye size={14} />
                               </button>
                            </div>
                            <span className="text-white/20 text-[8px] font-bold uppercase">{new Date(order.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/40 text-center py-10 text-xs">No recent orders found.</p>
                    )}
                  </div>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="w-full mt-10 py-4 bg-white/5 rounded-2xl text-white/40 font-bold text-[10px] tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all"
                  >
                    View All Orders
                  </button>
                </div>
              </div>

              {/* Best Sellers and Inventory Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 italic">
                      <Sparkles size={20} className="text-[#00d084]" /> Best Selling Products
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {bestSellers.length === 0 && loading ? (
                      <div className="col-span-full flex justify-center py-10">
                        <div className="w-8 h-8 border-2 border-[#00d084]/30 border-t-[#00d084] rounded-full animate-spin" />
                      </div>
                    ) : bestSellers.length > 0 ? (
                      bestSellers.map((product, idx) => (
                        <div key={product.id} className="bg-white/5 rounded-[30px] p-6 border border-white/5 flex items-center gap-6 group hover:bg-white/10 transition-all">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5">
                              <img 
                                src={product.image ? (product.image.startsWith('http') ? product.image : apiUrl(product.image)) : (product.img || apiUrl('/assets/cofee.png'))} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
                              />
                            </div>
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#00d084] text-[#001a13] rounded-full flex items-center justify-center font-black text-xs shadow-lg">
                              #{idx + 1}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-white font-bold text-sm mb-1">{product.name}</h4>
                            <div className="flex items-center gap-3">
                              <p className="text-[#00d084] font-black text-xs">{product.total_sales} Sales</p>
                              <span className="text-white/20 text-[8px] font-bold">•</span>
                              <p className="text-white/40 font-bold text-[8px] uppercase tracking-widest">{product.stock} left</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/40 text-center py-10 text-xs col-span-full">No best sellers data yet.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-10 flex items-center gap-3 italic">
                    <LayoutDashboard size={20} className="text-[#00d084]" /> Inventory Status
                  </h3>
                  <div className="space-y-6">
                    {adminProducts.slice(0, 5).map(product => (
                      <div key={product.id} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-white/60">{product.name}</span>
                          <span className={product.stock <= 5 ? 'text-red-500' : 'text-[#00d084]'}>{product.stock} Units</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                            className={`h-full ${product.stock <= 5 ? 'bg-red-500' : 'bg-[#00d084]'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                     onClick={() => setActiveTab('products')}
                     className="w-full mt-10 py-4 bg-white/5 rounded-2xl text-white/40 font-bold text-[10px] tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all"
                   >
                     Full Inventory Report
                   </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
                    Order <span className="text-[#00d084]">Management</span>
                  </h1>
                  <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-2">Manage and track all customer orders</p>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search orders..." 
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-[#00d084] transition-all min-w-[300px]"
                    />
                  </div>
                  <button className="bg-white/5 text-white/60 p-4 rounded-2xl border border-white/10 hover:text-white transition-all">
                    <Filter size={20} />
                  </button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Order Info</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Client</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Items</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Amount</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Status</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.length === 0 && loading ? (
                        <tr>
                          <td colSpan="6" className="px-8 py-20 text-center">
                            <div className="w-10 h-10 border-2 border-[#00d084]/30 border-t-[#00d084] rounded-full animate-spin mx-auto" />
                          </td>
                        </tr>
                      ) : (orders.length > 0 ? (
                        orders
                          .filter(order => 
                            order.order_number?.toLowerCase().includes(orderSearch.toLowerCase()) || 
                            (order.user?.name || 'Guest').toLowerCase().includes(orderSearch.toLowerCase())
                          )
                          .map((order) => (
                          <tr key={order.id} className="group hover:bg-white/[0.02] transition-all">
                            <td className="px-8 py-6">
                              <p className="text-white font-bold text-xs mb-1">{order.order_number}</p>
                              <p className="text-white/20 text-[10px] font-bold uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#00d084]/10 flex items-center justify-center text-[#00d084] text-[10px] font-black">
                                  {order.user?.name?.charAt(0) || 'G'}
                                </div>
                                <div>
                                  <p className="text-white font-bold text-xs">{order.user?.name || 'Guest Client'}</p>
                                  <p className="text-white/20 text-[10px] font-bold uppercase">{order.user?.email || 'Walk-in'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="bg-white/5 text-white/40 text-[10px] font-bold px-3 py-1 rounded-full border border-white/5">
                                {order.items_count || 0} Items
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-[#00d084] font-black text-sm">{order.total_amount} {currencySymbol}</p>
                            </td>
                            <td className="px-8 py-6">
                              <select 
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                className={`text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-xl border transition-all focus:outline-none ${
                                  order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                  order.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                  order.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                  'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => handleOpenOrderModal(order)}
                                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-white/40 hover:text-[#00d084] hover:bg-[#00d084]/10 transition-all border border-white/5 active:scale-90"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-8 py-20 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
                            No orders found in the system
                          </td>
                        </tr>
                      ) )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
                    Product <span className="text-[#00d084]">Library</span>
                  </h1>
                  <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-2">Manage your menu and inventory</p>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search products..." 
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-[#00d084] transition-all min-w-[300px]"
                    />
                  </div>
                  <button 
                    onClick={() => handleOpenProductModal()}
                    className="bg-[#00d084] text-[#001a13] px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase flex items-center gap-3"
                  >
                    <Plus size={16} /> Add Product
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {adminProducts.length === 0 && loading ? (
                  <div className="col-span-full flex justify-center py-20">
                    <div className="w-10 h-10 border-2 border-[#00d084]/30 border-t-[#00d084] rounded-full animate-spin" />
                  </div>
                ) : (adminProducts
                  .filter(product => 
                    product.name?.toLowerCase().includes(productSearch.toLowerCase()) || 
                    product.category?.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map((product) => (
                  <motion.div 
                    key={product.id}
                    layout
                    className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden group"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={product.image ? (product.image.startsWith('http') ? product.image : apiUrl(product.image)) : (product.img || apiUrl('/assets/cofee.png'))} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/50 backdrop-blur-md text-white/70 text-[8px] font-bold px-3 py-1.5 rounded-full border border-white/10 tracking-widest uppercase">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-white font-bold text-lg tracking-tight mb-1">{product.name}</h4>
                          <div className="flex items-center gap-3">
                            <p className="text-[#00d084] font-black text-sm">{product.price} {currencySymbol}</p>
                            <span className="text-white/20 text-[9px] font-bold">•</span>
                            <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest">{product.stock || 0} in stock</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-white/30 text-[10px] font-medium leading-relaxed mb-8 line-clamp-2">
                        {product.desc}
                      </p>
                      <div className="flex gap-3 pt-6 border-t border-white/5">
                        <button 
                          onClick={() => handleOpenProductModal(product)}
                          className="flex-grow flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white py-3 rounded-xl transition-all border border-white/5"
                        >
                          <Edit size={14} /> <span className="text-[9px] font-bold tracking-widest uppercase">Edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )))}
              </div>
            </div>
          )}

          {activeTab === 'stocks' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
                    Stock <span className="text-[#00d084]">Inventory</span>
                  </h1>
                  <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-2">Monitor and manage product stock levels</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Product</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Category</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Current Stock</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Status</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {adminProducts.map((product) => {
                        const stock = product.stock;
                        return (
                          <tr key={product.id} className="group hover:bg-white/[0.02] transition-all">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <img 
                                  src={product.image ? (product.image.startsWith('http') ? product.image : apiUrl(product.image)) : (product.img || apiUrl('/assets/cofee.png'))} 
                                  className="w-10 h-10 rounded-xl object-cover" 
                                />
                                <p className="text-white font-bold text-xs">{product.name}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-white/40 text-[10px] font-bold uppercase">{product.category}</span>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-white font-black text-sm">{stock} Units</p>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                stock > 10 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                              }`}>
                                {stock > 10 ? 'In Stock' : 'Low Stock'}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => handleOpenStockModal(product)}
                                className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-[#00d084] hover:bg-[#00d084]/10 transition-all border border-white/5"
                              >
                                <Plus size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
                    Client <span className="text-[#00d084]">Database</span>
                  </h1>
                  <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-2">View and manage your registered customers</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 group">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-[#00d084]/10 flex items-center justify-center text-[#00d084] text-xl font-black">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">{client.name}</h4>
                        <p className="text-white/20 text-[10px] font-bold uppercase">{client.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-white/40 text-[8px] font-bold uppercase mb-1">Orders</p>
                        <p className="text-white font-black">{client.orders_count}</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-white/40 text-[8px] font-bold uppercase mb-1">Spent</p>
                        <p className="text-[#00d084] font-black">{client.orders_sum_total_amount || 0} {currencySymbol}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <p className="text-white/20 text-[8px] font-bold uppercase">Member since {new Date(client.created_at).toLocaleDateString()}</p>
                      <button 
                        onClick={() => handleOpenClientModal(client)}
                        className="text-[#00d084] text-[10px] font-black uppercase tracking-widest hover:underline active:opacity-50 transition-all"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'promotions' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
                    Marketing <span className="text-[#00d084]">Promotions</span>
                  </h1>
                  <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-2">Create and manage discount codes</p>
                </div>
                <button 
                  onClick={() => handleOpenPromoModal()}
                  className="bg-[#00d084] text-[#001a13] px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase flex items-center gap-3"
                >
                  <Plus size={16} /> New Promo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {promotions.map((promo) => (
                  <div key={promo.id} className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 flex items-center justify-between group">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-2xl font-black text-white tracking-widest uppercase">{promo.code}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${promo.status === 'Active' ? 'bg-[#00d084]/20 text-[#00d084]' : 'bg-red-500/20 text-red-500'}`}>
                          {promo.status}
                        </span>
                      </div>
                      <p className="text-[#00d084] font-black text-xs uppercase tracking-widest mb-4">{promo.discount} - {promo.type}</p>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#00d084]" style={{ width: `${Math.min((promo.usage / promo.maxUsage) * 100, 100)}%` }} />
                        </div>
                        <span className="text-white/20 text-[10px] font-bold uppercase">{promo.usage}/{promo.maxUsage} Used</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenPromoModal(promo)}
                        className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeletePromo(promo.id)}
                        className="p-4 bg-red-500/10 text-red-500/40 hover:text-red-500 rounded-2xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'employees' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
                    Team <span className="text-[#00d084]">Management</span>
                  </h1>
                  <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-2">Manage your staff and permissions</p>
                </div>
                <button 
                  onClick={() => handleOpenEmployeeModal()}
                  className="bg-[#00d084] text-[#001a13] px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase flex items-center gap-3"
                >
                  <Plus size={16} /> Add Member
                </button>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Member</th>
                      <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Role</th>
                      <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Schedule</th>
                      <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Status</th>
                      <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {employees.map((staff) => (
                      <tr key={staff.id} className="hover:bg-white/[0.02] transition-all">
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-white font-bold text-xs">{staff.name}</p>
                            <p className="text-white/20 text-[9px] uppercase font-bold tracking-widest">{staff.email}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-white/40 text-[10px] font-bold uppercase">{staff.role}</span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-white/60 text-[10px] font-bold uppercase">{staff.shift}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${staff.status === 'On Duty' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/10 text-white/40'}`}>
                            {staff.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleOpenEmployeeModal(staff)}
                              className="p-3 text-white/20 hover:text-white transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteEmployee(staff.id)}
                              className="p-3 text-white/20 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
                    Performance <span className="text-[#00d084]">Reports</span>
                  </h1>
                  <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-2">Analyze your business metrics</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => exportToCSV(orders, 'Full_Sales_Report', ['Order Number', 'Client', 'Total Amount', 'Status', 'Date'])}
                    className="bg-[#00d084] text-[#001a13] px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase flex items-center gap-3 hover:scale-105 transition-all"
                  >
                    <Download size={16} /> Export CSV
                  </button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden">
                <div className="p-10 border-b border-white/5">
                  <h3 className="text-white font-bold text-xl uppercase tracking-widest italic">Sales Overview Table</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Order No</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Client</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Date</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Amount</th>
                        <th className="px-8 py-6 text-white/40 text-[10px] font-bold tracking-widest uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                            <span className="text-white font-bold text-xs">{order.order_number}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-white/60 text-xs font-medium">{order.user?.name || 'Guest'}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-white/40 text-xs">{new Date(order.created_at).toLocaleDateString()}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-[#00d084] font-black text-sm">{order.total_amount} {currencySymbol}</span>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                              order.status === 'completed' ? 'bg-[#00d084]/10 text-[#00d084]' : 
                              order.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                              'bg-red-500/10 text-red-500'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
                  <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-widest italic">Weekly Revenue</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} />
                        <Tooltip contentStyle={{backgroundColor: '#001a13', border: 'none', borderRadius: '10px'}} />
                        <Bar dataKey="sales" fill="#00d084" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
                  <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-widest italic">Top Categories</h3>
                  <div className="space-y-6">
                    {[
                      { name: "Coffee", percentage: 55 },
                      { name: "Bakery", percentage: 20 },
                      { name: "Teas", percentage: 15 },
                      { name: "Cold Drinks", percentage: 10 },
                    ].map((cat, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-bold text-xs uppercase">{cat.name}</span>
                          <span className="text-[#00d084] font-black text-xs">{cat.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#00d084]" style={{ width: `${cat.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
                    System <span className="text-[#00d084]">Settings</span>
                  </h1>
                  <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-2">Configure your application preferences</p>
                </div>
                <button 
                  onClick={() => {
                    localStorage.setItem('rashfa_settings', JSON.stringify(settings));
                    showToast('Settings saved successfully!');
                  }}
                  className="bg-[#00d084] text-[#001a13] px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase hover:scale-105 active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
                  <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-widest italic">General Settings</h3>
                  <div className="space-y-6">
                    {[
                      { label: "Store Name", value: settings.storeName, key: 'storeName' },
                      { label: "Contact Email", value: settings.contactEmail, key: 'contactEmail' },
                      { label: "Currency", value: settings.currency, key: 'currency' },
                    ].map((set, i) => (
                      <div key={i} className="space-y-2">
                        <label className="text-white/40 text-[10px] font-bold uppercase ml-4">{set.label}</label>
                        <input 
                          type="text" 
                          value={set.value} 
                          onChange={(e) => setSettings({...settings, [set.key]: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs focus:outline-none focus:border-[#00d084] transition-all" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
                  <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-widest italic">Operations</h3>
                  <div className="space-y-6">
                    {[
                      { label: "Accepting Orders", status: settings.acceptingOrders, key: 'acceptingOrders' },
                      { label: "Email Notifications", status: settings.emailNotifications, key: 'emailNotifications' },
                      { label: "Maintenance Mode", status: settings.maintenanceMode, key: 'maintenanceMode' },
                    ].map((op, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-white font-bold text-xs uppercase">{op.label}</span>
                        <div 
                          onClick={() => setSettings({...settings, [op.key]: !op.status})}
                          className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${op.status ? 'bg-[#00d084]' : 'bg-white/10'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${op.status ? 'right-1' : 'left-1'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
                    System <span className="text-[#00d084]">Maintenance</span>
                  </h1>
                  <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-2">Monitor system health and logs</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Server Status", value: "Healthy", color: "text-emerald-500" },
                  { label: "Database", value: "Connected", color: "text-emerald-500" },
                  { label: "Storage", value: "45% Full", color: "text-amber-500" },
                ].map((m, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 text-center">
                    <p className="text-white/40 text-[10px] font-bold uppercase mb-2 tracking-widest">{m.label}</p>
                    <h4 className={`text-2xl font-black uppercase ${m.color}`}>{m.value}</h4>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
                <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-widest italic">Recent Logs</h3>
                <div className="space-y-4 font-mono">
                  {[
                    { time: "10:45:22", type: "INFO", msg: "Backup completed successfully" },
                    { time: "09:30:05", type: "WARN", msg: "High memory usage detected" },
                    { time: "08:15:10", type: "INFO", msg: "New admin user logged in" },
                  ].map((log, i) => (
                    <div key={i} className="text-[10px] flex gap-4 border-b border-white/5 pb-2">
                      <span className="text-white/20">[{log.time}]</span>
                      <span className={log.type === 'WARN' ? 'text-amber-500' : 'text-[#00d084]'}>{log.type}</span>
                      <span className="text-white/60">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && activeTab !== 'orders' && activeTab !== 'products' && activeTab !== 'stocks' && activeTab !== 'clients' && activeTab !== 'promotions' && activeTab !== 'employees' && activeTab !== 'reports' && activeTab !== 'settings' && activeTab !== 'maintenance' && (
            <div className="bg-white/5 backdrop-blur-xl p-20 rounded-[50px] border border-white/10 text-center">
              <div className="w-24 h-24 bg-[#00d084]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00d084]/20">
                <div className="text-[#00d084] animate-pulse">
                  {menuItems.find(i => i.id === activeTab)?.icon}
                </div>
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">
                {activeTab} <span className="text-[#00d084]">Section</span>
              </h2>
              <p className="text-white/40 text-sm font-bold tracking-[0.3em] uppercase leading-relaxed max-w-md mx-auto">
                This module is currently under active development. <br /> Check back soon for management features.
              </p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="mt-12 bg-white text-[#001a13] px-10 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-[#00d084] transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="absolute inset-0 bg-[#001a13]/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl shadow-2xl"
            >
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-medium text-white tracking-tighter uppercase italic font-display">
                  {editingProduct ? 'Edit' : 'Add New'} <span className="text-[#00d084]">Product</span>
                </h2>
                <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">Fill in the details below</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Product Name</label>
                    <input 
                      type="text" 
                      value={productFormData.name}
                      onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                      placeholder="e.g. Espresso" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Price ({currencySymbol})</label>
                    <input 
                      type="number" 
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({...productFormData, price: e.target.value})}
                      placeholder="0.00" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Category</label>
                    <select 
                      value={productFormData.category}
                      onChange={(e) => setProductFormData({...productFormData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors appearance-none"
                    >
                      {Object.values(CATEGORIES).map(cat => (
                        <option key={cat} value={cat} className="bg-[#001a13]">{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Stock Quantity</label>
                    <input 
                      type="number" 
                      value={productFormData.stock}
                      onChange={(e) => setProductFormData({...productFormData, stock: e.target.value})}
                      placeholder="e.g. 100" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Description</label>
                  <textarea 
                    value={productFormData.desc}
                    onChange={(e) => setProductFormData({...productFormData, desc: e.target.value})}
                    rows="3" 
                    placeholder="Describe the product..." 
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Image</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={productFormData.img}
                        onChange={(e) => setProductFormData({...productFormData, img: e.target.value})}
                        placeholder="Image URL or upload from PC..." 
                        className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors" 
                      />
                      <label className="shrink-0 bg-white/5 border border-white/10 hover:border-[#00d084] hover:bg-[#00d084]/10 rounded-2xl px-6 py-4 cursor-pointer flex items-center justify-center transition-all group">
                        <Upload size={18} className="text-white/40 group-hover:text-[#00d084]" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                    {productFormData.img && (
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10">
                        <img src={productFormData.img} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          onClick={() => setProductFormData({...productFormData, img: ''})}
                          className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleSaveProduct}
                    className="w-full bg-[#00d084] text-[#001a13] py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-[#00d084]/20 hover:scale-[1.02] transition-all"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stock Modal */}
      <AnimatePresence>
        {isStockModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStockModalOpen(false)}
              className="absolute inset-0 bg-[#001a13]/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl shadow-2xl"
            >
              <button 
                onClick={() => setIsStockModalOpen(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-medium text-white tracking-tighter uppercase italic font-display">
                  Adjust <span className="text-[#00d084]">Stock</span>
                </h2>
                <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">{stockFormData.productName}</p>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Current Stock</span>
                  <span className="text-2xl font-black text-white">{stockFormData.currentStock} Units</span>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Adjustment Amount</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number" 
                      value={stockFormData.adjustment}
                      onChange={(e) => setStockFormData({...stockFormData, adjustment: e.target.value})}
                      className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-2xl font-black focus:outline-none focus:border-[#00d084] transition-colors" 
                      placeholder="0"
                    />
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-white/20 uppercase italic">Use negative values for reduction</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-center mb-6 px-4">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">New Total</span>
                    <span className="text-xl font-black text-[#00d084]">
                      {parseInt(stockFormData.currentStock) + (parseInt(stockFormData.adjustment) || 0)} Units
                    </span>
                  </div>
                  <button 
                    onClick={handleSaveStock}
                    className="w-full bg-[#00d084] text-[#001a13] py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-[#00d084]/20 hover:scale-[1.02] transition-all"
                  >
                    Confirm Adjustment
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Promotion Modal */}
      <AnimatePresence>
        {isPromoModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPromoModalOpen(false)}
              className="absolute inset-0 bg-[#001a13]/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl shadow-2xl"
            >
              <button 
                onClick={() => setIsPromoModalOpen(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-medium text-white tracking-tighter uppercase italic font-display">
                  {editingPromo ? 'Edit' : 'Create'} <span className="text-[#00d084]">Promotion</span>
                </h2>
                <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">Configure discount code details</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Promo Code</label>
                  <input 
                    type="text" 
                    value={promoFormData.code}
                    onChange={(e) => setPromoFormData({...promoFormData, code: e.target.value.toUpperCase()})}
                    placeholder="E.G. COFFEE2024" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold tracking-widest focus:outline-none focus:border-[#00d084] transition-colors" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Discount Value</label>
                    <input 
                      type="text" 
                      value={promoFormData.discount}
                      onChange={(e) => setPromoFormData({...promoFormData, discount: e.target.value})}
                      placeholder={`e.g. 20% or 50 ${currencySymbol}`} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Type</label>
                    <select 
                      value={promoFormData.type}
                      onChange={(e) => setPromoFormData({...promoFormData, type: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors appearance-none"
                    >
                      <option value="Direct Discount" className="bg-[#001a13]">Direct Discount</option>
                      <option value="Fixed Amount" className="bg-[#001a13]">Fixed Amount</option>
                      <option value="First Order" className="bg-[#001a13]">First Order</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Max Usage</label>
                    <input 
                      type="number" 
                      value={promoFormData.maxUsage}
                      onChange={(e) => setPromoFormData({...promoFormData, maxUsage: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Status</label>
                    <select 
                      value={promoFormData.status}
                      onChange={(e) => setPromoFormData({...promoFormData, status: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors appearance-none"
                    >
                      <option value="Active" className="bg-[#001a13]">Active</option>
                      <option value="Expired" className="bg-[#001a13]">Expired</option>
                      <option value="Disabled" className="bg-[#001a13]">Disabled</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleSavePromo}
                    className="w-full bg-[#00d084] text-[#001a13] py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-[#00d084]/20 hover:scale-[1.02] transition-all"
                  >
                    {editingPromo ? 'Update Promotion' : 'Launch Promotion'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Employee Modal */}
      {/* Order Details Modal */}
      <AnimatePresence>
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute inset-0 bg-[#001a13]/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-3xl font-medium text-white tracking-tighter uppercase italic font-display">
                    Order <span className="text-[#00d084]">Details</span>
                  </h2>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                    selectedOrder.status === 'completed' ? 'bg-[#00d084]/10 text-[#00d084]' : 
                    selectedOrder.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">ID: {selectedOrder.order_number}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <h4 className="text-white/20 text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-2">Customer Information</h4>
                  <div>
                    <p className="text-white font-bold text-sm">{selectedOrder.user?.name || 'Guest Customer'}</p>
                    <p className="text-white/40 text-xs mt-1">{selectedOrder.user?.email || 'No email provided'}</p>
                    <p className="text-white/40 text-xs">{selectedOrder.phone || 'No phone provided'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white/20 text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-2">Delivery Address</h4>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {selectedOrder.address || 'In-store pickup'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <h4 className="text-white/20 text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-2">Order Items</h4>
                <div className="max-h-[200px] overflow-y-auto pr-4 space-y-3 custom-scrollbar">
                  {(() => {
                    try {
                      const items = typeof selectedOrder.items === 'string' 
                        ? JSON.parse(selectedOrder.items) 
                        : (selectedOrder.items || []);
                      
                      return items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                               <img 
                                 src={(() => {
                                   const itemName = (item.product_name || item.name || "").toLowerCase();
                                   
                                   // 1. Try to find in MENU_ITEMS first for consistency with menu images
                                   const allMenuItems = Object.values(MENU_ITEMS).flat();
                                   const menuItem = allMenuItems.find(m => 
                                     m.name.toLowerCase() === itemName || 
                                     itemName.includes(m.name.toLowerCase()) ||
                                     m.name.toLowerCase().includes(itemName)
                                   );
                                   if (menuItem) return menuItem.img;

                                   // 2. Fallback to item data
                                   if (item.image) return item.image.startsWith('http') ? item.image : apiUrl(item.image);
                                   if (item.img || item.product?.img) return item.img || item.product?.img;
                                   
                                   // 3. Last resort fallbacks
                                   if (itemName.includes('latte')) return latteImg;
                                   if (itemName.includes('cappuccino')) return cappuccinoImg;
                                   if (itemName.includes('espresso')) return espressoImg;
                                   if (itemName.includes('americano')) return americanoImg;
                                   if (itemName.includes('mocha')) return mochaImg;
                                   if (itemName.includes('croissant')) return croissantImg;
                                   if (itemName.includes('muffin')) return muffinsImg;
                                   return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=100';
                                 })()} 
                                 className="w-full h-full object-cover" 
                               />
                            </div>
                            <div>
                              <p className="text-white font-bold text-xs">{item.product_name || item.name}</p>
                              <p className="text-white/20 text-[10px] font-bold uppercase">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-white font-black text-xs">{item.price * item.quantity} {currencySymbol}</p>
                        </div>
                      ));
                    } catch (e) {
                      console.error("Error parsing order items:", e);
                      return <p className="text-white/20 text-xs text-center py-4 uppercase font-bold">Error loading items</p>;
                    }
                  })()}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-3xl font-black text-[#00d084]">{selectedOrder.total_amount} <span className="text-xs font-normal text-white/40">{currencySymbol}</span></p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsOrderModalOpen(false)}
                    className="px-8 py-4 rounded-2xl bg-white/5 text-white/40 font-black text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      generateInvoice(selectedOrder);
                    }}
                    className="px-8 py-4 rounded-2xl bg-[#00d084] text-[#001a13] font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Download size={14} /> Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Client Profile Modal */}
      <AnimatePresence>
        {isClientModalOpen && selectedClient && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsClientModalOpen(false)}
              className="absolute inset-0 bg-[#001a13]/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsClientModalOpen(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-8 mb-12">
                <div className="w-24 h-24 rounded-[30px] bg-[#00d084]/10 flex items-center justify-center text-[#00d084] text-4xl font-black">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-4xl font-medium text-white tracking-tighter uppercase italic font-display">
                    {selectedClient.name}
                  </h2>
                  <p className="text-[#00d084] text-xs font-bold tracking-widest uppercase mt-2">
                    Member Since {new Date(selectedClient.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                  <p className="text-white/40 text-[10px] font-bold uppercase mb-2 tracking-widest">Email Address</p>
                  <p className="text-white font-bold">{selectedClient.email}</p>
                </div>
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                  <p className="text-white/40 text-[10px] font-bold uppercase mb-2 tracking-widest">Phone Number</p>
                  <p className="text-white font-bold">{selectedClient.phone || 'Not Provided'}</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest ml-4">Statistics</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5 text-center">
                    <p className="text-white/20 text-[8px] font-bold uppercase mb-2">Total Orders</p>
                    <p className="text-3xl font-black text-white">{selectedClient.orders_count}</p>
                  </div>
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5 text-center">
                    <p className="text-white/20 text-[8px] font-bold uppercase mb-2">Total Spent</p>
                    <p className="text-3xl font-black text-[#00d084]">{selectedClient.orders_sum_total_amount || 0}</p>
                    <p className="text-[8px] font-bold text-white/20 uppercase">{currencySymbol}</p>
                  </div>
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5 text-center">
                    <p className="text-white/20 text-[8px] font-bold uppercase mb-2">Avg. Order</p>
                    <p className="text-3xl font-black text-white">
                      {selectedClient.orders_count > 0 
                        ? (selectedClient.orders_sum_total_amount / selectedClient.orders_count).toFixed(0) 
                        : 0}
                    </p>
                    <p className="text-[8px] font-bold text-white/20 uppercase">{currencySymbol}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex justify-end gap-4">
                <button 
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-8 py-4 rounded-2xl bg-white/5 text-white/40 font-black text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all"
                >
                  Close Profile
                </button>
                <button 
                  onClick={() => {
                    window.location.href = `mailto:${selectedClient.email}`;
                  }}
                  className="px-8 py-4 rounded-2xl bg-[#00d084] text-[#001a13] font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all flex items-center gap-2"
                >
                  Contact Client
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEmployeeModalOpen(false)}
              className="absolute inset-0 bg-[#001a13]/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl shadow-2xl"
            >
              <button 
                onClick={() => setIsEmployeeModalOpen(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-medium text-white tracking-tighter uppercase italic font-display">
                  {editingEmployee ? 'Edit' : 'Add'} <span className="text-[#00d084]">Member</span>
                </h2>
                <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-2">Team management details</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Full Name</label>
                    <input 
                      type="text" 
                      value={employeeFormData.name}
                      onChange={(e) => setEmployeeFormData({...employeeFormData, name: e.target.value})}
                      placeholder="e.g. Youssef Idrissi" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Email</label>
                    <input 
                      type="email" 
                      value={employeeFormData.email}
                      onChange={(e) => setEmployeeFormData({...employeeFormData, email: e.target.value})}
                      placeholder="email@rashfa.com" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Role</label>
                    <select 
                      value={employeeFormData.role}
                      onChange={(e) => setEmployeeFormData({...employeeFormData, role: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors appearance-none"
                    >
                      <option value="Barista" className="bg-[#001a13]">Barista</option>
                      <option value="Head Barista" className="bg-[#001a13]">Head Barista</option>
                      <option value="Store Manager" className="bg-[#001a13]">Store Manager</option>
                      <option value="Delivery Rider" className="bg-[#001a13]">Delivery Rider</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Status</label>
                    <select 
                      value={employeeFormData.status}
                      onChange={(e) => setEmployeeFormData({...employeeFormData, status: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors appearance-none"
                    >
                      <option value="On Duty" className="bg-[#001a13]">On Duty</option>
                      <option value="Off Duty" className="bg-[#001a13]">Off Duty</option>
                      <option value="On Leave" className="bg-[#001a13]">On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Shift Schedule</label>
                  <input 
                    type="text" 
                    value={employeeFormData.shift}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, shift: e.target.value})}
                    placeholder="e.g. 07:00 - 15:00" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00d084] transition-colors" 
                  />
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleSaveEmployee}
                    className="w-full bg-[#00d084] text-[#001a13] py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-[#00d084]/20 hover:scale-[1.02] transition-all"
                  >
                    {editingEmployee ? 'Update Member' : 'Add to Team'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactPage = ({ settings }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://formspree.io/f/xojlgger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (response.ok) {
        setFormData({
          fullName: '',
          email: '',
          subject: 'General Inquiry',
          message: ''
        });
        
        // Add a visual feedback
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-[#00d084] text-[#001a13] px-8 py-4 rounded-full font-black shadow-2xl z-[10000] animate-bounce uppercase tracking-widest text-xs';
        toast.innerText = '📩 Message sent! We will get back to you soon.';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
      } else {
        throw new Error("Form submission failed");
      }
    } catch {
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              { icon: User, title: "Email", detail: settings.contactEmail }
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
          <form 
            onSubmit={handleSubmit} 
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="John Doe" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#00d084] transition-colors" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#00d084] transition-colors" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Subject</label>
              <select 
                name="subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#00d084] transition-colors appearance-none"
              >
                <option className="bg-[#001a13]">General Inquiry</option>
                <option className="bg-[#001a13]">Order Support</option>
                <option className="bg-[#001a13]">Business Partnership</option>
                <option className="bg-[#001a13]">Feedback</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 ml-4">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="5" 
                placeholder="Your message here..." 
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm focus:outline-none focus:border-[#00d084] transition-colors resize-none"
                required
              ></textarea>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className={`w-full bg-[#00d084] text-[#001a13] py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-[#00d084]/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
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
        e.target.tagName === 'IMG' ||
        e.target.closest('button') || 
        e.target.closest('a') ||
        e.target.closest('.cursor-pointer') ||
        e.target.closest('img')
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

const CheckoutPage = ({ cart, cartTotal, setLastOrder, setCart, user, token, settings, currencySymbol }) => {
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
    wantsReceipt: false,
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      console.log('Placing order...', {
        url: apiUrl('/api/orders'),
        token: token ? 'Present' : 'Missing',
        cartCount: cart.length
      });

      const response = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        signal: controller.signal,
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
          wants_receipt: formData.wantsReceipt,
          total_amount: cartTotal,
          items: cart.map(item => ({
            product_id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        const orderData = {
          ...data.data,
          wants_receipt: formData.wantsReceipt
        };
        setLastOrder(orderData);
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
      if (error.name === 'AbortError') {
        alert('The request timed out. Please check your internet connection and try again.');
      } else {
        alert('An error occurred while placing your order. Please make sure the backend server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 md:pt-32 px-4 md:px-8 bg-[#001a13] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 p-8 md:p-12 rounded-[30px] md:rounded-[40px] border border-white/10 backdrop-blur-xl w-full max-w-lg"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 bg-[#00d084]/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
            <ShoppingCart className="text-[#00d084]" size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 md:mb-6 tracking-tighter uppercase">Your tray is empty</h2>
          <p className="text-white/40 mb-8 md:mb-10 max-w-xs mx-auto text-sm md:text-base">Add some of our premium coffee blends to start your journey.</p>
          <button 
            onClick={() => navigate('/shop')} 
            className="group relative w-full sm:w-auto bg-[#00d084] text-[#001a13] px-12 py-5 rounded-2xl font-black text-[10px] tracking-widest uppercase overflow-hidden"
          >
            <span className="relative z-10">Explore Menu</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8 bg-[#001a13] selection:bg-[#00d084] selection:text-[#001a13]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[#00d084] text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase mb-2 md:mb-4"
            >
              Secure Checkout
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-none"
            >
              FINALIZE<br />ORDER.
            </motion.h1>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-left md:text-right"
          >
            <div className="text-white/20 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2">Estimated Delivery</div>
            <div className="text-white font-black text-xl md:text-2xl">25-35 MIN</div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            {/* Step Indicators */}
            <div className="relative mb-12 md:mb-16">
              {/* Connection Line Background */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2" />
              
              <div className="relative flex justify-between items-center max-w-2xl">
                {[
                  { id: 1, name: 'Info' },
                  { id: 2, name: 'Pay' },
                  { id: 3, name: 'Confirm' }
                ].map((s, index) => (
                  <div key={s.id} className="relative flex flex-col items-center group">
                    {/* Step Circle */}
                    <motion.button 
                      onClick={() => step > s.id && setStep(s.id)}
                      className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center font-black text-sm md:text-lg z-10 transition-all duration-500 border-2 md:border-4 ${
                        step === s.id 
                          ? 'bg-[#00d084] border-[#001a13] text-[#001a13] shadow-[0_0_20px_rgba(0,208,132,0.4)] scale-110' 
                          : step > s.id 
                            ? 'bg-[#00d084] border-[#001a13] text-[#001a13]' 
                            : 'bg-[#001a13] border-white/10 text-white/20'
                      }`}
                    >
                      {step > s.id ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : s.id}
                    </motion.button>

                    {/* Step Name */}
                    <div className="absolute -bottom-6 md:bottom-[-2rem] left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className={`text-[8px] md:text-[10px] font-black tracking-[0.1em] md:tracking-[0.2em] uppercase transition-colors duration-500 ${
                        step >= s.id ? 'text-[#00d084]' : 'text-white/20'
                      }`}>
                        {s.name}
                      </span>
                    </div>

                    {/* Progress Line Filler */}
                    {index < 2 && (
                      <div className="absolute top-1/2 left-10 md:left-14 w-[calc(100vw/4)] max-w-[200px] h-[2px] pointer-events-none overflow-hidden">
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

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
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
                        <div className="flex justify-between items-center mb-1.5 md:mb-2 px-2">
                          <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40">Full Name <span className="text-red-500">*</span></label>
                          {errors.name && <span className="text-[7px] md:text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                        </div>
                        <User className="absolute left-5 md:left-6 top-[48px] md:top-[54px] -translate-y-1/2 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={16} />
                        <input 
                          type="text" 
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({...formData, name: e.target.value});
                            if (e.target.value) setErrors(prev => ({...prev, name: false}));
                          }}
                          className={`w-full bg-white/5 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 md:pl-14 pr-5 md:pr-6 py-4 md:py-5 text-white focus:outline-none focus:border-[#00d084] focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-bold text-xs md:text-sm`}
                        />
                      </div>
                      <div className="relative group">
                        <div className="flex justify-between items-center mb-1.5 md:mb-2 px-2">
                          <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40">Email Address <span className="text-red-500">*</span></label>
                          {errors.email && <span className="text-[7px] md:text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                        </div>
                        <Mail className="absolute left-5 md:left-6 top-[48px] md:top-[54px] -translate-y-1/2 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={16} />
                        <input 
                          type="email" 
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({...formData, email: e.target.value});
                            if (e.target.value) setErrors(prev => ({...prev, email: false}));
                          }}
                          className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 md:pl-14 pr-5 md:pr-6 py-4 md:py-5 text-white focus:outline-none focus:border-[#00d084] focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-bold text-xs md:text-sm`}
                        />
                      </div>
                      <div className="md:col-span-2 relative group">
                        <div className="flex justify-between items-center mb-1.5 md:mb-2 px-2">
                          <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40">Phone Number <span className="text-red-500">*</span></label>
                          {errors.phone && <span className="text-[7px] md:text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                        </div>
                        <Phone className="absolute left-5 md:left-6 top-[48px] md:top-[54px] -translate-y-1/2 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={16} />
                        <input 
                          type="tel" 
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({...formData, phone: e.target.value});
                            if (e.target.value) setErrors(prev => ({...prev, phone: false}));
                          }}
                          className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 md:pl-14 pr-5 md:pr-6 py-4 md:py-5 text-white focus:outline-none focus:border-[#00d084] focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-bold text-xs md:text-sm`}
                        />
                      </div>
                      <div className="md:col-span-2 relative group">
                        <div className="flex justify-between items-center mb-1.5 md:mb-2 px-2">
                          <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40">Delivery Address <span className="text-red-500">*</span></label>
                          {errors.address && <span className="text-[7px] md:text-[8px] font-black uppercase text-red-500 animate-pulse">Required</span>}
                        </div>
                        <MapPin className="absolute left-5 md:left-6 top-14 md:top-16 text-white/20 group-focus-within:text-[#00d084] transition-colors" size={16} />
                        <textarea 
                          placeholder="Delivery Address"
                          value={formData.address}
                          onChange={(e) => {
                            setFormData({...formData, address: e.target.value});
                            if (e.target.value) setErrors(prev => ({...prev, address: false}));
                          }}
                          rows="3"
                          className={`w-full bg-white/5 border ${errors.address ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 md:pl-14 pr-5 md:pr-6 py-4 md:py-5 text-white focus:outline-none focus:border-[#00d084] focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-bold text-xs md:text-sm resize-none`}
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
                      className="w-full bg-[#00d084] text-[#001a13] py-5 md:py-6 rounded-2xl font-black text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all hover:scale-[1.02]"
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
                        className={`group relative p-6 md:p-8 rounded-3xl border transition-all text-left overflow-hidden ${formData.paymentMethod === 'online' ? 'bg-[#00d084] border-[#00d084]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                      >
                        <CreditCard className={`mb-3 md:mb-4 transition-colors ${formData.paymentMethod === 'online' ? 'text-[#001a13]' : 'text-[#00d084]'}`} size={28} />
                        <div className={`font-black text-xs md:text-sm uppercase tracking-widest ${formData.paymentMethod === 'online' ? 'text-[#001a13]' : 'text-white'}`}>Online Payment</div>
                        <div className={`text-[8px] md:text-[10px] font-bold mt-1 uppercase opacity-60 ${formData.paymentMethod === 'online' ? 'text-[#001a13]' : 'text-white'}`}>Credit / Debit Card</div>
                        {formData.paymentMethod === 'online' && (
                          <motion.div layoutId="payment-check" className="absolute top-4 right-4 text-[#001a13]"><CheckCircle2 size={18} /></motion.div>
                        )}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: 'cash'})}
                        className={`group relative p-6 md:p-8 rounded-3xl border transition-all text-left overflow-hidden ${formData.paymentMethod === 'cash' ? 'bg-[#00d084] border-[#00d084]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                      >
                        <Truck className={`mb-3 md:mb-4 transition-colors ${formData.paymentMethod === 'cash' ? 'text-[#001a13]' : 'text-[#00d084]'}`} size={28} />
                        <div className={`font-black text-xs md:text-sm uppercase tracking-widest ${formData.paymentMethod === 'cash' ? 'text-[#001a13]' : 'text-white'}`}>Cash on Delivery</div>
                        <div className={`text-[8px] md:text-[10px] font-bold mt-1 uppercase opacity-60 ${formData.paymentMethod === 'cash' ? 'text-[#001a13]' : 'text-white'}`}>Pay when you receive</div>
                        {formData.paymentMethod === 'cash' && (
                          <motion.div layoutId="payment-check" className="absolute top-4 right-4 text-[#001a13]"><CheckCircle2 size={18} /></motion.div>
                        )}
                      </button>
                    </div>

                    {formData.paymentMethod === 'online' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 md:space-y-6 bg-white/5 border border-white/10 rounded-[24px] md:rounded-[32px] p-4 md:p-6"
                      >
                        <div className="flex gap-3 md:gap-4">
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, onlinePaymentType: 'card'})}
                            className={`flex-1 p-4 md:p-6 rounded-2xl border transition-all text-center ${formData.onlinePaymentType === 'card' ? 'bg-[#00d084]/10 border-[#00d084] text-[#00d084]' : 'bg-white/5 border-white/10 text-white/40'}`}
                          >
                            <CreditCard size={20} className="mx-auto mb-1.5 md:mb-2" />
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Card</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, onlinePaymentType: 'paypal'})}
                            className={`flex-1 p-4 md:p-6 rounded-2xl border transition-all text-center ${formData.onlinePaymentType === 'paypal' ? 'bg-[#00d084]/10 border-[#00d084] text-[#00d084]' : 'bg-white/5 border-white/10 text-white/40'}`}
                          >
                            <DollarSign size={20} className="mx-auto mb-1.5 md:mb-2" />
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">PayPal</span>
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

                        {/* Receipt Option for Online Payment */}
                        <div className="pt-4 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, wantsReceipt: !formData.wantsReceipt})}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.wantsReceipt ? 'bg-[#00d084]/10 border-[#00d084] text-[#00d084]' : 'bg-white/5 border-white/10 text-white/40'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.wantsReceipt ? 'bg-[#00d084] border-[#00d084]' : 'border-white/20'}`}>
                                {formData.wantsReceipt && <Check size={12} className="text-[#001a13]" />}
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest">I want a printed receipt</span>
                            </div>
                            <FileText size={18} />
                          </button>
                        </div>
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
                          <span className="text-sm font-black text-[#00d084]">{item.price * item.quantity} {currencySymbol}</span>
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
                    <span className="text-white font-bold">{cartTotal.toFixed(2)} {currencySymbol}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40 font-bold uppercase tracking-widest">Delivery Fee</span>
                    <span className="text-white font-bold">15.00 {currencySymbol}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">Total</span>
                    <div className="text-right">
                      <div className="text-3xl font-black text-[#00d084] leading-none">{(cartTotal + 15).toFixed(2)} {currencySymbol}</div>
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
                  Every order at <span className="text-[#00d084]">{settings.storeName}</span> supports sustainable coffee farming in North Africa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessPage = ({ lastOrder, settings, currencySymbol }) => {
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const [showQuestion, setShowQuestion] = useState(lastOrder?.wants_receipt === false);
  const [wantsTicket, setWantsTicket] = useState(lastOrder?.wants_receipt === true);

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
        <p className="text-white/60">Thank you for your trust in {settings.storeName}. Your coffee is being prepared now.</p>
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
            <h2 className="text-xl font-black tracking-tighter mb-1 uppercase">{settings.storeName}</h2>
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
              <span>{lastOrder.created_at ? new Date(lastOrder.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</span>
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
              <span>{parseFloat(lastOrder.total_amount || lastOrder.total).toFixed(2)} {currencySymbol}</span>
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('rashfa_settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      storeName: "Rashfa Coffee Roasters",
      contactEmail: "hello@rashfa.com",
      currency: "MAD (Moroccan Dirham)",
      acceptingOrders: true,
      emailNotifications: true,
      maintenanceMode: false
    };
  });

  useEffect(() => {
    localStorage.setItem('rashfa_settings', JSON.stringify(settings));
  }, [settings]);

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
    if (!settings.acceptingOrders) {
      addNotification('Ordering is currently disabled', 'error');
      return;
    }
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
    } catch {
      addNotification(`Failed to add ${product.name}`, 'error');
    }
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const currencySymbol = settings.currency.split(' ')[0];

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  useEffect(() => {
    // Wrap in timeout to avoid cascading render warning
    const loadTimer = setTimeout(() => {
      setIsLoading(true);
      
      // Use Rashfa only for the initial load of the Home page
      const isInitialHomeLoad = isHomePage && !hasLoadedInitially;
      setIsFirstLoad(isInitialHomeLoad);
  
      // Duration is long only for initial home load, otherwise short
      const duration = isInitialHomeLoad ? 5500 : 1500; 
      const finishTimer = setTimeout(() => {
        setIsLoading(false);
        setHasLoadedInitially(true);
      }, duration);
      
      return () => clearTimeout(finishTimer);
    }, 0);
    
    return () => clearTimeout(loadTimer);
  }, [location.pathname, isHomePage, hasLoadedInitially]); // Trigger on any path change

  // Maintenance Mode Check
  if (settings.maintenanceMode && !user?.is_admin && location.pathname !== '/login' && location.pathname !== '/admin') {
    return <MaintenancePage settings={settings} />;
  }

  return (
    <div className="min-h-screen bg-[#001a13] font-sans selection:bg-[#00d084] selection:text-[#001a13]">
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
          isHomePage ? (
            // Only show loader on Home if it's the very first load
            isFirstLoad ? <HomeInitialLoader key="home-initial-loader" /> : null
          ) : (
            // Show Libri9 loader for all other page transitions
            <PageLoader key="page-loader" />
          )
        )}
      </AnimatePresence>

      {!isHomePage && !isAuthPage && (
        <div className="fixed bottom-0 right-0 z-[60] scale-[0.4] md:scale-[0.5] origin-bottom-right pointer-events-none mb-[-20px] mr-[-20px] opacity-80 hover:opacity-100 transition-opacity">
          <CoffeeCupCharacter />
        </div>
      )}

      <motion.div
        initial={false}
        animate={{ 
          opacity: isLoading ? 0 : 1,
          visibility: isLoading ? "hidden" : "visible"
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Routes>
          <Route path="/" element={<HomePage addToCart={addToCart} settings={settings} currencySymbol={currencySymbol} />} />
          <Route path="/shop" element={<ShopPage addToCart={addToCart} settings={settings} currencySymbol={currencySymbol} />} />
          <Route path="/about" element={<AboutPage settings={settings} currencySymbol={currencySymbol} />} />
          <Route path="/login" element={<LoginPage login={login} settings={settings} />} />
            <Route path="/signup" element={<SignUpPage login={login} settings={settings} />} />
            <Route path="/profile" element={user ? <ProfilePage user={user} token={token} logout={logout} settings={settings} currencySymbol={currencySymbol} /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={user ? <CheckoutPage cart={cart} cartTotal={cartTotal} setLastOrder={setLastOrder} setCart={setCart} user={user} token={token} settings={settings} currencySymbol={currencySymbol} /> : <Navigate to="/login" />} />
            <Route path="/order-success" element={user ? <SuccessPage lastOrder={lastOrder} settings={settings} currencySymbol={currencySymbol} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.is_admin === true ? <AdminDashboard token={token} settings={settings} setSettings={setSettings} currencySymbol={currencySymbol} /> : <Navigate to="/" />} />
          <Route path="/contact" element={<ContactPage settings={settings} />} />
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
                    <img 
                      src={selectedCartItem.img} 
                      alt={selectedCartItem.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
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
                    <div className="text-3xl font-black text-[#00d084] mb-8">{selectedCartItem.price} {currencySymbol}</div>
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

        <Navbar cart={cart} cartTotal={cartTotal} cartCount={cartCount} removeFromCart={removeFromCart} user={user} logout={logout} settings={settings} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
        
        {/* Premium Modern Footer */}
        {!(location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/profile' || location.pathname.startsWith('/admin')) && (
          <footer className="mt-20 relative bg-[#001a13] pt-20 pb-10 border-t border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
              
              <div className="relative z-10">
                {/* Top Section: Brand & Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                  {/* Brand Info */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white/5 rounded-xl p-2.5 border border-white/10 flex items-center justify-center shadow-2xl flex-shrink-0">
                      <img src="/assets/LR-removebg-preview.png" alt="Rashfa Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-white font-['Great_Vibes'] text-2xl leading-none mb-2">
                        {settings.storeName}
                      </h3>
                      <p className="text-white/40 text-[9px] font-bold tracking-[0.25em] leading-relaxed uppercase max-w-[300px]">
                        Crafting moments of pure indulgence through the finest beans and traditional techniques.
                      </p>
                    </div>
                  </div>

                  {/* Newsletter Section */}
                  <div className="flex flex-col items-start lg:items-end w-full relative">
                    <div className="w-full max-w-md relative group">
                      <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-1.5 pl-6 backdrop-blur-xl focus-within:border-[#00d084]/40 transition-all">
                        <input 
                          type="email" 
                          placeholder="ENTER YOUR EMAIL..." 
                          className="bg-transparent border-none outline-none text-white text-[9px] font-black tracking-[0.2em] w-full placeholder:text-white/20"
                        />
                        <button className="bg-white text-[#001a13] px-8 py-3 rounded-full font-black text-[9px] tracking-[0.2em] uppercase hover:bg-[#00d084] transition-all whitespace-nowrap shadow-xl">
                          Join Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Links & Logo Center */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 pt-10 border-t border-white/5">
                  {/* Links */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-10 flex-1">
                    {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                      <Link 
                        key={item}
                        to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                        className="text-white/40 hover:text-[#00d084] text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-110 block"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>

                  {/* Logo Center */}
                  <div className="flex flex-col items-center flex-1 relative">
                    <h2 className="font-['Great_Vibes'] text-5xl text-white select-none drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{settings.storeName.split(' ')[0]}</h2>
                  </div>

                  {/* Spacer for balance to keep logo centered */}
                  <div className="hidden lg:block flex-1"></div>
                </div>
              </div>
            </div>
          </footer>
        )}

        <ScrollToTop />
      </motion.div>
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