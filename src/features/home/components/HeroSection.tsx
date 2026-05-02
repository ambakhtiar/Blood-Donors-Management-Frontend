"use client";

import Link from "next/link";
import { Search, Heart, ArrowRight, Activity, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background min-h-[60vh] flex items-center border-b border-border/40">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-destructive/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center py-12">
        {/* Left Content */}
        <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase">
            <Activity className="h-3 w-3" /> Verifiable Donation Network
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Empowering Life Through <br />
            <span className="text-primary">Seamless Donation.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Connect with verified blood donors, manage emergency requests, and support patients through medical crowdfunding. A community-driven platform for saving lives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 rounded-xl text-md font-bold shadow-lg shadow-primary/20 group" asChild>
              <Link href="/feed?type=BLOOD_FINDING">
                Find Blood <Search className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl text-md font-bold border-primary/20 hover:bg-primary/5 group" asChild>
              <Link href="/feed?type=HELPING">
                Donate Funds <Heart className="ml-2 h-5 w-5 text-destructive transition-transform group-hover:scale-110" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-8 border-t border-border/50 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" /> 100% Verified
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" /> Nationwide Coverage
            </div>
          </div>
        </div>

        {/* Right Content - Visual Elements */}
        <div className="hidden lg:flex justify-center animate-in fade-in zoom-in duration-1000 delay-200">
          <div className="relative group">
            {/* Main Interactive Card */}
            <div className="relative z-10 w-[450px] h-[350px] bg-card border border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 flex flex-col justify-between group-hover:shadow-primary/10 transition-all duration-500">
               <div className="flex justify-between items-start">
                  <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
                    <Droplets className="h-8 w-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-muted-foreground">Emergency Feed</p>
                    <p className="text-xl font-bold">382 Requests</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[75%] animate-pulse" />
                  </div>
                  <p className="text-sm text-muted-foreground flex justify-between font-medium">
                    <span>Blood Units Needed</span>
                    <span>75% Fulfilled</span>
                  </p>
               </div>

               <div className="flex -space-x-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                      D{i}
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
                    +12k
                  </div>
               </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 h-24 w-24 bg-white dark:bg-zinc-900 border border-border shadow-xl rounded-2xl flex flex-col items-center justify-center p-3 animate-bounce" style={{ animationDuration: '4s' }}>
                <Heart className="h-8 w-8 text-destructive fill-destructive/20 mb-1" />
                <p className="text-[10px] font-bold text-center">Lives Saved</p>
            </div>
            
            <div className="absolute -bottom-10 -left-10 h-32 w-56 bg-white dark:bg-zinc-900 border border-border shadow-xl rounded-2xl p-4 flex flex-col justify-between animate-pulse" style={{ animationDuration: '5s' }}>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-bold">Active Campaign</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full" />
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold text-primary">৳ 1.2M Raised</span>
                   <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Droplets({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4-8-4-8s-4 4.7-4 8c0 2.2 1.8 4 4 4z"/>
      <path d="M17 16.3c2.2 0 4-1.8 4-4 0-3.3-4-8-4-8s-4 4.7-4 8c0 2.2 1.8 4 4 4z"/>
    </svg>
  )
}
