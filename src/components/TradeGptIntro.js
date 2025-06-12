import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, TrendingUp, Brain, BarChart3, Shield, Zap,
  Target, ArrowRight, Star, CheckCircle
} from 'lucide-react';

const TradeGPTIntro = () => {
  const navigate = useNavigate();
  const [currentPrice, setCurrentPrice] = useState(1219.88);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => prev + (Math.random() - 0.5) * 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    { icon: <Brain className="w-8 h-8" />, title: "AI-Powered Analysis", description: "Advanced machine learning algorithms analyze market trends and provide intelligent trading insights in real-time." },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Smart Stock Picks", description: "Get personalized stock recommendations based on your risk profile and market conditions." },
    { icon: <BarChart3 className="w-8 h-8" />, title: "Real-Time Market Data", description: "Access live market data, price movements, and comprehensive financial indicators instantly." },
    { icon: <Shield className="w-8 h-8" />, title: "Risk Management", description: "Intelligent risk assessment tools help you make informed decisions and protect your investments." },
    { icon: <Zap className="w-8 h-8" />, title: "Lightning Fast Execution", description: "Get instant responses to your trading queries with our optimized AI processing engine." },
    { icon: <Target className="w-8 h-8" />, title: "Precision Trading Signals", description: "Receive precise entry and exit points based on technical analysis and market sentiment." }
  ];

  const stats = [
    { number: "500K+", label: "Active Traders" },
    { number: "99.9%", label: "Uptime" },
    { number: "2.5x", label: "Avg. Returns" },
    { number: "24/7", label: "Market Coverage" }
  ];

  const testimonials = [
    { text: "I can't tell you how happy and grateful I am to have found TradeGPT", author: "Sarah M.", rating: 5, profit: "+$12,450" },
    { text: "...made me around 10K... in just 3 months using TradeGPT signals", author: "Mike R.", rating: 5, profit: "+$10,000" },
    { text: "...don't lose any time if you want to make serious money", author: "Jennifer L.", rating: 5, profit: "+$8,750" },
    { text: "I have finally found the holy grail!", author: "David K.", rating: 5, profit: "+$15,200" },
    { text: "...hitting every call! The best program out there", author: "Robert P.", rating: 5, profit: "+$9,850" },
    { text: "Win Ratio is above 75% for most of the trades", author: "Lisa T.", rating: 5, profit: "+$11,300" }
  ];

  return (
    <div className="intro-main-container relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" style={{ zIndex: 100 }}>
      
      {/* Floating Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed bottom-6 left-6 z-50 bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-gray-200 transition-all"
      >
        ← Back to TradeGPT
      </button>

      {/* Header */}
      <header className="relative z-50 px-4 py-6">
        <nav className="mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">TradeGPT</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#preview" className="text-gray-300 hover:text-white transition-colors">Preview</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Success Stories</a>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
              Get Started
            </button>
          </div>
        </nav>
      </header>
      

      {/* Hero Section */}
      <section className="relative px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-blue-200">Trusted by 500K+ traders worldwide</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                UNLEASH THE POWER OF
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}TRADEGPT
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Revolutionary AI-powered trading assistant that analyzes market trends, provides intelligent stock picks, 
                and helps you make informed investment decisions with confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                  <span>REGISTER NOW!</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                {/* <button className="group border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:border-gray-500 hover:bg-gray-800/50 transition-all flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button> */}
              </div>

              <div className="grid grid-cols-4 gap-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Form */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">REGISTER NOW!</h3>
                  <p className="text-blue-600 font-semibold">LEARN HOW TO MAKE MONEY WITH TRADEGPT</p>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-gray-700 text-sm">
                    The FREE training is designed to help retail traders jump-start their trading with TradeGPT's "super-intelligent" AI called TradeGPT.
                  </p>
                  <p className="text-gray-700 text-sm">
                    You'll learn AI. It's way to use TradeGPT anything to get instant trade analysis and even trade recommendations from AI that's engineered to help financial trading profits.
                  </p>
                  <p className="text-gray-700 text-sm">
                    This training is packed with 7 proven money-making strategies that our analysts are using to win with the revolutionary tech.
                  </p>
                  <p className="text-gray-700 text-sm">
                    This training is perfect for options traders, day traders and other investors - even if they have zero experience using AI trading tools.
                  </p>
                </div>

                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors transform hover:scale-105"
                  >
                    GET STARTED
                  </button>
                </form>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Yes, please send Valour Wealth to keep in touch with additional marketing communications.
                </p>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
                +12.5%
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                AI Powered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features for Smart Trading
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the advanced capabilities that make TradeGPT the ultimate trading companion for both beginners and professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section id="preview" className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Here's a <span className="text-blue-600 underline">Preview</span> of TradeGPT in Action!
            </h2>
            <p className="text-xl text-gray-600">
              Watch these videos to grab a glimpse of how powerful TradeGPT can be for retail traders:
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Live Market Analysis</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Live</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">NFLX</span>
                      <span className="text-green-400">${currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">+1.35%</span>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-semibold">AI Insight</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Strong bullish momentum detected. Technical indicators suggest continued upward trend with 
                      resistance at $1,250. Consider position sizing based on volatility.
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                      BUY
                    </button>
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">
                      SELL
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">What You'll Learn:</h3>
                <ul className="space-y-3">
                  {[
                    "How to set up TradeGPT for maximum profitability",
                    "7 proven AI trading strategies that work",
                    "Risk management techniques for consistent gains",
                    "How to interpret AI signals for better trades",
                    "Advanced portfolio optimization methods",
                    "Real-time market analysis and decision making"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How TradeGPT Works</h2>
            <p className="text-xl text-gray-300">Simple steps to start your AI-powered trading journey</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Your Account",
                description: "Securely link your trading account and set your preferences and risk tolerance."
              },
              {
                step: "02", 
                title: "Get AI Insights",
                description: "Receive real-time market analysis, stock recommendations, and trading signals."
              },
              {
                step: "03",
                title: "Execute Trades",
                description: "Make informed decisions and execute trades with confidence using our insights."
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-center">
                  <div className="text-4xl font-bold text-white mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                  <p className="text-blue-100">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">This System Works!</h2>
            <p className="text-xl text-gray-600">Look at what our members said about TradeGPT's trading system...</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{testimonial.author}</span>
                  <span className="text-green-600 font-bold">{testimonial.profit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                COME AND LEARN HOW TO UNLEASH THE POWER OF TRADEGPT!
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of successful traders who trust TradeGPT for intelligent market insights and profitable decisions.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">REGISTER NOW!</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors transform hover:scale-105"
                >
                  REGISTER
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Yes, please send Valour Wealth to keep in touch with additional marketing communications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">TradeGPT</span>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Risk Disclosure</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-gray-400  pt-8">
            <p className="mb-2">© 2024 TradeGPT. All rights reserved.</p>
            <p className="text-sm">Trading involves risk. Always do your own research. Past performance does not guarantee future results.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TradeGPTIntro;