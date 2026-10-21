import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-agri-600 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                AgroMed AI
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering farmers with intelligent occupational health hazard assessments, personalized safety precautions, and PPE guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Farmer Features
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/assessment" className="hover:text-agri-400 transition">
                  Health Risk Assessment
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-agri-400 transition">
                  Personalized Safety Tips
                </Link>
              </li>
              <li>
                <Link to="/ppe-guide" className="hover:text-agri-400 transition">
                  PPE Safety Guide
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="hover:text-agri-400 transition">
                  Ask AgroMed AI
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="hover:text-agri-400 transition">
                  Safety Knowledge Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Education */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Educational Focus
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Pesticide Toxicity Awareness</li>
              <li>Cholinesterase Monitoring</li>
              <li>Heat Exhaustion & Hydration</li>
              <li>Chemical Spill Decontamination</li>
              <li>Safe Storage & Container Rinsing</li>
            </ul>
          </div>

          {/* Emergency & Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Emergency Contact
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center space-x-2 text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-xs">Medical Emergency: Dial 108 / 112</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>support@agromed.ai</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>+91 1800-AGROMED (Toll Free)</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Agricultural Health Research Center</span>
              </div>
            </div>
          </div>

        </div>

        {/* Prominent Medical Disclaimer Banner */}
        <div className="my-6 p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-200">IMPORTANT EDUCATIONAL & SAFETY DISCLAIMER: </span>
            AgroMed AI is an educational health and safety awareness platform engineered to highlight occupational hazards in farming. 
            It is <span className="text-slate-200 font-semibold">NOT a medical diagnosis system</span> and does not replace the diagnosis, prescription, or clinical advice of licensed medical practitioners. 
            For acute poisoning, breathing distress, chemical ingestion, or persistent symptoms, seek emergency medical treatment immediately.
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
          <p>© {new Date().getFullYear()} AgroMed AI. Built for Academic Major Project Demonstration.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Dedicated to the health of the farmers who feed the world</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </p>
        </div>

      </div>
    </footer>
  );
}
