"use client";

import React from "react";
import {
  Heart,
  Target,
  ShieldCheck,
  Zap,
  Users,
  Hospital,
  Building2,
  ArrowRight,
  Droplets
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const stats = [
    { label: "Active Donors", value: "2.5K+", icon: Users },
    { label: "Successful Matches", value: "1.2K+", icon: Heart },
    { label: "Partner Hospitals", value: "45+", icon: Hospital },
    { label: "Verified Orgs", value: "15+", icon: Building2 },
  ];

  const features = [
    {
      title: "Emergency Requests",
      description: "Post real-time blood finding requests that are instantly broadcasted to donors in your specific area and division.",
      icon: Zap,
      color: "bg-red-500/10 text-red-500",
    },
    {
      title: "Verified Ecosystem",
      description: "We verify every donor profile and partnership with hospitals/organisations to ensure maximum reliability and trust.",
      icon: ShieldCheck,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Medical Crowdfunding",
      description: "A unique platform to raise funds for patient medical bills directly through the blood request system.",
      icon: Heart,
      color: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "Smart Matching",
      description: "Advanced location-based filtering ensures you find donors closest to the patient's hospital for rapid response.",
      icon: Target,
      color: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(239,68,68,0.08)_0%,transparent_100%)]" />
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 ring-1 ring-primary/20 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Droplets className="h-3 w-3" />
            OUR VISION
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Connecting Hearts, <span className="text-primary">Saving Lives.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
            {`${process.env.NEXT_PUBLIC_APP_NAME_FF}${process.env.NEXT_PUBLIC_APP_NAME_SS} is a state-of-the-art management system designed to bridge the gap between 
            voluntary blood donors and those in urgent need across Bangladesh.`}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 h-12 gap-2" asChild>
              <Link href="/auth/register">
                Become a Donor <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12" asChild>
              <Link href="/feed">Browse Feed</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border/40 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="h-12 w-12 rounded-2xl bg-background flex items-center justify-center mb-4 shadow-sm ring-1 ring-border group-hover:ring-primary/30 transition-all">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Idea Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">The Core Problem We Solve</h2>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  In Bangladesh, finding the right blood group during an emergency is often a race against time.
                  Family members often resort to social media posts that get lost in the noise, or rely on
                  unverified middlemen.
                </p>
                <div className="space-y-4">
                  {[
                    "Lack of centralized donor database in real-time.",
                    "Unverified donor information leading to false hope.",
                    "Difficulty in coordinating with nearby hospitals quickly.",
                    "Financial barriers for critical surgeries and blood bags."
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-all group">
                  <div className={`h-10 w-10 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 bg-primary/5 border-y border-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Built on Trust and Verification</h2>
          <p className="text-muted-foreground mb-12">
            BloodLink isn't just a donor list. We've built an ecosystem involving Hospitals and Organisations
            to ensure that every request and every donation is verified and documented.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-background rounded-3xl shadow-sm border border-border">
              <div className="text-primary font-bold text-lg mb-2">Verified Donors</div>
              <p className="text-sm text-muted-foreground">Donors are ranked and verified based on their successful donation history.</p>
            </div>
            <div className="p-8 bg-background rounded-3xl shadow-sm border border-border">
              <div className="text-primary font-bold text-lg mb-2">Official Partners</div>
              <p className="text-sm text-muted-foreground">Hospitals record donations directly into the system for 100% accuracy.</p>
            </div>
            <div className="p-8 bg-background rounded-3xl shadow-sm border border-border">
              <div className="text-primary font-bold text-lg mb-2">Secure Platform</div>
              <p className="text-sm text-muted-foreground">Sensitive medical and contact information is protected and encrypted.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Section (Empty as requested) */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center opacity-50">
            <div className="h-[1px] w-1/4 bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
            <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-4">Our Proud Sponsors</span>
            <div className="flex flex-wrap justify-center gap-12 grayscale opacity-50">
              {/* Future Sponsors will be added here */}
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-40 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-foreground text-background p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to make a difference?</h2>
            <p className="text-foreground/70 mb-10 text-lg max-w-2xl mx-auto">
              Join thousands of other life-savers today. Your single donation can save up to three lives.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 h-14 font-bold" asChild>
                <Link href="/auth/register">Join as a Donor</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600/20 text-black hover:bg-gray-200 rounded-full px-10 h-14 font-bold dark:bg-gray-600 dark:text-black dark:hover:bg-gray-700" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
