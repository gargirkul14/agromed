import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Activity,
  Lightbulb,
  ShieldCheck,
  Bot,
  BookOpen,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Sun,
  AlertTriangle,
  Users
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-agri-50/70 via-white to-slate-50 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-agri-100/80 border border-agri-200/80 text-agri-800 text-xs font-semibold mb-8 shadow-sm">
            <Shield className="w-4 h-4 text-agri-600" />
            <span>AI-Driven Occupational Safety for Agriculture</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Protecting the People Who{' '}
            <span className="bg-gradient-to-r from-agri-600 via-agri-700 to-health-600 bg-clip-text text-transparent">
              Feed the Nation.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AgroMed AI helps farmers understand occupational health risks, follow safer farming practices, and protect their health against chemicals, heat, and fatigue.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-agri-600 hover:bg-agri-700 text-white font-bold text-base shadow-lg shadow-agri-600/30 hover:shadow-xl transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-base border border-slate-300 shadow-sm transition-all"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Trust Stat Bar */}
          <div className="mt-16 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-left">
            <div>
              <div className="text-2xl font-black text-agri-800">100%</div>
              <div className="text-xs text-slate-500 font-medium">Educational & Non-Diagnostic</div>
            </div>
            <div>
              <div className="text-2xl font-black text-health-700">Real-Time</div>
              <div className="text-xs text-slate-500 font-medium">Risk Scoring Engine</div>
            </div>
            <div>
              <div className="text-2xl font-black text-agri-800">Gemini AI</div>
              <div className="text-xs text-slate-500 font-medium">Field Safety Assistant</div>
            </div>
            <div>
              <div className="text-2xl font-black text-health-700">Zero Setup</div>
              <div className="text-xs text-slate-500 font-medium">Ready For Evaluation</div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
            Core Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Built Specifically For Farmer Occupational Health
          </h2>
          <p className="text-slate-600 mt-4 text-base">
            Agricultural workers face unique hazards daily. AgroMed AI equips them with actionable tools to reduce risks before, during, and after farming shifts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">1. Health Risk Assessment</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Transparent rule-based scoring engine analyzing chemical toxicity, exposure duration, symptoms, and PPE usage to generate a 0–100 safety score and risk tier.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">2. Personalized Recommendations</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Customized precautions tailored to your crop, shift duration, chemical inventory, and recent symptoms across 8 occupational health categories.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-agri-50 text-agri-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">3. PPE Safety Guide</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Activity-specific personal protective equipment requirements with side-by-side gap analysis comparing required gear with your equipped gear.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">4. AI Health Assistant</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              "Ask AgroMed AI" conversational chatbot powered by Google Gemini, providing structured guidance on chemical safety, skin irritation, and heat safety.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">5. Safety Knowledge Center</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Searchable educational database covering emergency chemical eye flushes, organophosphate poisoning prevention, silo safety, and hydration protocols.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">6. Health Dashboard</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Centralized farmer command center with visual risk gauge, timeline trajectory chart, profile completion indicators, and rotating safety tips.
            </p>
          </div>

        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-agri-400 bg-agri-950 px-3 py-1 rounded-full border border-agri-800">
                The Occupational Challenge
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 leading-tight">
                Why Farmer Occupational Health Matters
              </h2>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                Agriculture is recognized globally as one of the most hazardous production sectors. Farmers handle toxic formulations—organophosphates, carbamates, herbicides, and caustic fertilizers—often without adequate safety gear or understanding of exposure routes.
              </p>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                Combined with long working shifts under extreme solar radiation and heavy dust inhalation, preventable occupational risks lead to chronic respiratory illness, acute poisoning, and heat exhaustion. AgroMed AI bridges this critical information gap.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center space-x-2 text-agri-400 font-bold text-sm">
                    <Sun className="w-4 h-4" />
                    <span>Extreme Heat</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Dehydration prevention and structured rest break schedules.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center space-x-2 text-agri-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Chemical Toxicity</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Protection against organophosphate inhalation and skin absorption.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <HeartPulse className="w-5 h-5 text-red-400" />
                <span>Our Core Ethical Protocol</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                AgroMed AI was designed from day one with strict medical ethics:
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />
                  <span><strong>Non-Diagnostic System</strong>: AgroMed AI provides occupational safety awareness and does not diagnose medical diseases.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />
                  <span><strong>Emergency Escalation</strong>: For severe or worsening symptoms, the system immediately recommends contacting a medical doctor or calling 108/112.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />
                  <span><strong>Transparent Scoring</strong>: All risk calculations use auditable rules rather than opaque predictions.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-health-700 bg-health-100 px-3 py-1 rounded-full">
            Simple Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            How AgroMed AI Works
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            Four simple steps to evaluate and protect your health in the field.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-800 font-black text-lg flex items-center justify-center mx-auto shadow-inner">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Create Profile</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Register your demographic details, location, and years of farming experience.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-800 font-black text-lg flex items-center justify-center mx-auto shadow-inner">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Work Profile</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Record your crops, daily work hours, pesticide/fertilizer usage, and equipped PPE gear.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-800 font-black text-lg flex items-center justify-center mx-auto shadow-inner">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Take Assessment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your recent farming activity, chemical used, exposure duration, and symptoms.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-800 font-black text-lg flex items-center justify-center mx-auto shadow-inner">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base">Get Safety Plan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive your safety score, risk level, immediate precautions, and personalized recommendations.
            </p>
          </div>

        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-agri-700 to-health-700 text-white rounded-3xl p-10 sm:p-14 text-center shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto">
            Take Control of Your Farm Safety Today.
          </h2>
          <p className="mt-3 text-agri-100 text-sm sm:text-base max-w-xl mx-auto">
            Join AgroMed AI to assess occupational risks, learn proper PPE protocols, and protect your long-term health.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-white text-agri-800 hover:bg-slate-100 font-bold text-sm shadow-md transition"
            >
              Register Farmer Profile
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl bg-agri-900/40 hover:bg-agri-900/60 border border-white/20 text-white font-bold text-sm transition"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
