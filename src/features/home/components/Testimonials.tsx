import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Dr. Farhana Yasmin",
    role: "Senior Consultant, DMCH",
    content: "The verifiable donation ledger has made our hospital records much more reliable. We can now trust every donor record on this platform.",
    avatar: "FY",
  },
  {
    name: "Tanvir Ahmed",
    role: "Regular Blood Donor",
    content: "I've tried many platforms, but the speed of matching on BloodLink is unparalleled. I found a recipient in just 15 minutes for an emergency.",
    avatar: "TA",
  },
  {
    name: "Mousumi Begum",
    role: "Crowdfunding Beneficiary",
    content: "When my brother needed urgent heart surgery, this community raised 2 lakhs in just 3 days. I am forever grateful to the donors here.",
    avatar: "MB",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Voices of Impact</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Read how our community is making a difference in the lives of patients and healthcare providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-card border-none shadow-xl shadow-black/5 relative pt-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold border-4 border-background">
                 {t.avatar}
              </div>
              <CardContent className="p-8 space-y-6 text-center">
                <div className="flex justify-center gap-1">
                   {[1,2,3,4,5].map(star => (
                     <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                   ))}
                </div>
                <div className="relative">
                   <Quote className="h-10 w-10 text-primary/10 absolute -top-4 -left-4 -z-0" />
                   <p className="text-muted-foreground italic leading-relaxed z-10 relative">
                     "{t.content}"
                   </p>
                </div>
                <div>
                   <h4 className="font-bold text-lg">{t.name}</h4>
                   <p className="text-xs font-medium text-primary uppercase tracking-widest">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
