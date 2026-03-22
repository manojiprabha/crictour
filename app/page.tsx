"use client"

import Navbar from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar01Icon, SearchList01Icon, Airplane01Icon, ArrowRight01Icon } from "hugeicons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
export default function Home() {
  const [showEmail, setShowEmail] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        window.location.href = "/dashboard"
      }
    }
    checkSession()
  }, [])

  async function googleLogin() {
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard"
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl }
    })
  }

  async function emailSignup() {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert("Check your email to confirm your account")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center bg-[#091b15] text-white overflow-hidden py-20 lg:py-0">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px]" />
            <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-800/20 blur-[100px]" />
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#091b15] to-transparent z-10" />
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
          </div>

          <div className="relative z-20 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <motion.div 
              className="lg:col-span-7 text-center lg:text-left pt-10 lg:pt-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide uppercase mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                The UK Cricket Network
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                Find fixtures.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                  Organise tours.
                </span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg lg:text-xl text-emerald-50/70 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                The modern platform for cricket clubs to fill fixture gaps, discover new opponents, and arrange tours across the UK effortlessly.
              </motion.p>

              <motion.div variants={containerVariants} className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm text-emerald-100/80 max-w-lg mx-auto lg:mx-0">
                <motion.div variants={itemVariants} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">✓</div>
                  Post gaps instantly
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">✓</div>
                  Browse by region
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">✓</div>
                  Match team strength
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">✓</div>
                  Direct messaging
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="lg:col-span-5 w-full max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                
                <h2 className="text-2xl font-bold mb-2 relative z-10 text-center text-white">Get Started</h2>
                <p className="text-emerald-100/70 text-sm text-center mb-8 relative z-10">Join hundreds of active clubs today.</p>

                <div className="relative z-10 flex flex-col gap-4">
                  <Button
                    onClick={googleLogin}
                    variant="outline"
                    className="w-full h-12 flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-semibold transition-all shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 text-sm border-0"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="" />
                    Continue with Google
                  </Button>

                  <div className="flex items-center my-2">
                    <div className="flex-1 border-t border-white/10"></div>
                    <span className="px-3 text-white/40 text-xs font-medium uppercase tracking-widest">or</span>
                    <div className="flex-1 border-t border-white/10"></div>
                  </div>

                  {!showEmail ? (
                    <Button
                      onClick={() => setShowEmail(true)}
                      variant="outline"
                      className="w-full h-12 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all text-sm backdrop-blur-sm"
                    >
                      Register with Email
                    </Button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex flex-col gap-3"
                    >
                      <Input
                        type="email"
                        placeholder="Club Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 bg-white/5 border-white/20 rounded-xl px-4 text-white placeholder:text-white/40 focus-visible:bg-white/10 focus-visible:ring-emerald-500/50 transition-all font-medium"
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 bg-white/5 border-white/20 rounded-xl px-4 text-white placeholder:text-white/40 focus-visible:bg-white/10 focus-visible:ring-emerald-500/50 transition-all font-medium"
                      />
                      <Button
                        onClick={emailSignup}
                        className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 mt-2 border-0"
                      >
                        Create Account
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 max-w-3xl mx-auto"
            >
              <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase mb-3">Why CricTour?</h2>
              <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Stop relying on WhatsApp groups to fill your fixture list.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We've built a dedicated network to make finding friendly matches and arranging tours as simple as booking a hotel.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Calendar01Icon size={32} className="text-emerald-600" />}
                title="Broadcast Fixtures" 
                description="Post open dates instantly to our network. Let teams looking for a game come directly to you instead of chasing contacts." 
                delay={0.1}
              />
              <FeatureCard 
                icon={<SearchList01Icon size={32} className="text-emerald-600" />}
                title="Find the Right Match" 
                description="Filter available teams by region, date, and playing strength to ensure you get a competitive and enjoyable game." 
                delay={0.2}
              />
              <FeatureCard 
                icon={<Airplane01Icon size={32} className="text-emerald-600" />}
                title="Organise Tours" 
                description="Connect with host clubs across the country. Arrange multi-game tours with confidence using direct messaging." 
                delay={0.3}
              />
            </div>
          </div>
        </section>
        
        {/* CTA SECTION */}
        <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200/50">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-emerald-100/50 rounded-full blur-[100px] opacity-60"></div>
          <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Ready to fill your fixture card?</h2>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                Join the fastest growing network of cricket clubs in the UK. Setup takes less than two minutes.
              </p>
              <Button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-6 bg-[#091b15] hover:bg-[#12372a] text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:-translate-y-1"
              >
                Join CricTour Now
                <ArrowRight01Icon size={20} />
              </Button>
            </motion.div>
          </div>
        </section>

      </main>

      <footer className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-extrabold text-[#091b15] tracking-tight">CricTour</div>
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} CricTour. Connecting Cricket Clubs Across the UK.
          </p>
          <div className="flex gap-4 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="h-full"
    >
      <Card className="group h-full p-8 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-emerald-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white transition-all duration-300 flex flex-col shadow-none">
        <div className="w-14 h-14 rounded-xl bg-emerald-100/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <CardTitle className="font-bold text-xl mb-3 text-slate-900 tracking-tight">{title}</CardTitle>
        <CardContent className="p-0">
          <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}