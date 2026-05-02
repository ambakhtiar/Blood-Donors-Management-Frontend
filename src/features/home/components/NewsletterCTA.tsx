import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary/90 to-destructive relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 h-96 w-96 rounded-full bg-white/20 blur-[100px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 h-64 w-64 rounded-full bg-black/10 blur-[80px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-[3rem] p-8 md:p-16 text-center text-white space-y-8 shadow-2xl">
          <div className="space-y-4">
             <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
               Stay Connected, <br /> Save Lives.
             </h2>
             <p className="text-primary-foreground/80 max-w-xl mx-auto text-lg font-medium">
               Get notified about urgent blood requests in your area and the latest crowdfunding campaigns. No spam, only impact.
             </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
             <Input 
               type="email" 
               placeholder="Enter your email address" 
               className="h-14 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/50 text-md px-6"
             />
             <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-primary hover:bg-white/90 font-black text-md shadow-xl group">
               Subscribe <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
             </Button>
          </div>
          
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">
            Secure & Private • Unsubscribe Anytime
          </p>
        </div>
      </div>
    </section>
  );
}
