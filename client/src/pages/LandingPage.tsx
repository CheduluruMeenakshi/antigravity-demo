import { Link } from 'react-router-dom';
import {
  Microscope,
  Sprout,
  CloudRain,
  BarChart3,
  Shield,
  Database,
  Leaf,
} from 'lucide-react';

const FEATURES = [
  {
    icon: <Microscope className="w-7 h-7 text-green-600" />,
    title: 'Instant Disease Diagnosis',
    desc: 'Upload a photo or describe symptoms and get an AI-powered diagnosis in seconds.',
  },
  {
    icon: <Sprout className="w-7 h-7 text-green-600" />,
    title: 'Smart Treatment Plans',
    desc: 'Receive tailored organic and chemical treatment recommendations for your specific crop.',
  },
  {
    icon: <CloudRain className="w-7 h-7 text-green-600" />,
    title: 'Weather-Aware Advice',
    desc: 'Get recommendations that account for current and upcoming weather conditions.',
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-green-600" />,
    title: 'Economic Impact Analysis',
    desc: 'Understand the financial implications of crop diseases before they hit your bottom line.',
  },
  {
    icon: <Shield className="w-7 h-7 text-green-600" />,
    title: 'Sustainable Practices First',
    desc: 'Every recommendation prioritises sustainable and eco-friendly farming methods.',
  },
  {
    icon: <Database className="w-7 h-7 text-green-600" />,
    title: 'Complete Farm History',
    desc: 'Keep a detailed record of every advisory and track your farm\'s health over time.',
  },
];

const CROPS = [
  { name: 'Wheat', emoji: '🌾' },
  { name: 'Rice', emoji: '🌾' },
  { name: 'Corn', emoji: '🌽' },
  { name: 'Soy', emoji: '🫘' },
  { name: 'Cotton', emoji: '⚪' },
  { name: 'Tomato', emoji: '🍅' },
  { name: 'Potato', emoji: '🥔' },
  { name: 'Sugarcane', emoji: '🎋' },
  { name: 'Apple', emoji: '🍎' },
  { name: 'Citrus', emoji: '🍊' },
];

const STATS = [
  { value: '10,000+', label: 'Farmers Served' },
  { value: '98%', label: 'Accuracy Rate' },
  { value: '50+', label: 'Crop Diseases' },
  { value: '24/7', label: 'AI Support' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Leaf className="w-7 h-7 text-green-600" />
            <span className="text-xl font-bold text-green-700">AgriAdvisor AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/auth/login"
              className="text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/auth/register"
              className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative background blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-0 w-72 h-72 bg-lime-200 rounded-full opacity-20 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Powered by Gemini AI
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            AI-Powered Crop Advisory{' '}
            <span className="text-green-600">at Your Fingertips</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Help farmers diagnose crop diseases, receive tailored treatment recommendations,
            and protect their yields — all powered by cutting-edge artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/register"
              className="bg-green-600 text-white text-base font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-green-700 transition-all hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/auth/login"
              className="bg-white text-green-700 text-base font-semibold px-8 py-3 rounded-xl border border-green-200 shadow hover:bg-green-50 transition-all hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-green-600 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="text-green-100 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
            Everything a Modern Farmer Needs
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            From disease detection to economic analysis, AgriAdvisor AI covers every aspect of crop health management.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-green-50 rounded-2xl p-6 hover:shadow-lg hover:bg-white border border-transparent hover:border-green-100 transition-all group"
              >
                <div className="bg-white group-hover:bg-green-50 rounded-xl w-12 h-12 flex items-center justify-center mb-4 shadow-sm transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported crops */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Supported Crops</h2>
          <p className="text-gray-500 mb-10">
            Our AI is trained on diseases and conditions for 10 major crop types.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {CROPS.map((crop) => (
              <div
                key={crop.name}
                className="flex items-center gap-2 bg-white px-5 py-3 rounded-full border border-green-100 shadow-sm text-gray-700 font-medium hover:shadow-md hover:border-green-300 transition-all"
              >
                <span className="text-xl">{crop.emoji}</span>
                <span>{crop.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Protect Your Crops?
          </h2>
          <p className="text-green-100 mb-8">
            Join thousands of farmers already using AgriAdvisor AI to safeguard their yields.
          </p>
          <Link
            to="/auth/register"
            className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-all shadow hover:scale-105"
          >
            Start for Free — No Credit Card Required
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf className="w-5 h-5 text-green-400" />
          <span className="text-white font-semibold">AgriAdvisor AI</span>
        </div>
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} AgriAdvisor AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
