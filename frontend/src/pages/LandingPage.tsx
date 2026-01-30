import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  // Optional: If user is already logged in, redirect to dashboard?
  // For now, we let them see the landing page so they can see the new design!
  useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (token) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* 1. Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-3xl">🏸</span>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                BadMintoz<span className="text-blue-600">.shop</span>
              </h1>
            </div>

            {/* Nav Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 font-semibold transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
           <img
             src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop"
             alt="Badminton Court"
             className="w-full h-full object-cover opacity-30"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-6 animate-fade-in-up">
            🚀 The #1 Badminton Community
          </span>
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-7xl mb-6">
            <span className="block">Play More.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Wait Less.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300 mb-10">
            Book wooden & synthetic courts instantly. Connect with local players, track your stats, and dominate the leaderboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login" className="px-8 py-4 border border-transparent text-lg font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:text-xl shadow-xl transition transform hover:scale-105">
              Book a Court 📅
            </Link>
            <a href="#features" className="px-8 py-4 border border-gray-600 text-lg font-bold rounded-lg text-gray-300 hover:bg-gray-800 md:text-xl transition">
              Explore Features
            </a>
          </div>
        </div>
      </div>

      {/* 3. Features Grid */}
      <div id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm">Why Choose Us?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to Smash it. 🏸
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Booking</h3>
              <p className="text-gray-500 leading-relaxed">
                Real-time availability for Wooden, Synthetic, and Rubber courts. No phone calls, just click and play.
              </p>
            </div>

             {/* Card 2 */}
             <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl mb-6">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Player Stats (Coming Soon)</h3>
              <p className="text-gray-500 leading-relaxed">
                Track your wins, losses, and skill level. Build your profile and find opponents that match your style.
              </p>
            </div>

             {/* Card 3 */}
             <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-3xl mb-6">
                🏆
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tournaments (Coming Soon)</h3>
              <p className="text-gray-500 leading-relaxed">
                Join local leagues, compete for prizes, and see your name on the BadMintoz Leaderboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">BadMintoz.shop</h3>
            <p className="text-sm">Engineered with ❤️ for the Badminton Community.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Register</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
            <p className="text-sm">support@badmintoz.shop</p>
            <p className="text-sm">+91 98765 43210</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs">
          &copy; 2026 BadMintoz Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;