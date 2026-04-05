import {
  Heart,
  Shield,
  Activity,
  Smile,
  Flame,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const benefits = [
  {
    icon: Heart,
    title: "Saves Lives",
    description:
      "A single donation can save up to 3 lives. Your blood is separated into red cells, plasma, and platelets.",
  },
  {
    icon: Activity,
    title: "Improves Heart Health",
    description:
      "Regular blood donation reduces iron overload, lowering the risk of heart disease and stroke.",
  },
  {
    icon: Shield,
    title: "Free Health Screening",
    description:
      "Every donation includes tests for HIV, Hepatitis B/C, Syphilis, and blood type — completely free.",
  },
  {
    icon: Flame,
    title: "Burns Calories",
    description:
      "Donating one pint of blood burns approximately 650 calories as your body replenishes the supply.",
  },
  {
    icon: Smile,
    title: "Boosts Mental Health",
    description:
      "The act of altruism releases endorphins, reducing stress and giving a sense of emotional fulfillment.",
  },
  {
    icon: Sparkles,
    title: "Stimulates New Blood Cells",
    description:
      "Your body produces fresh red blood cells within 48 hours, keeping your blood supply young and active.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-16 sm:py-20 bg-muted/30" aria-label="Benefits of blood donation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Why Donate Blood?
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Benefits & Motivation
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Blood donation is not just a medical need — it is an act of worship and humanity.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              className="group border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground mb-2">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quranic Verse Card */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-primary/5 p-8 sm:p-12">
          {/* Decorative Quote Marks */}
          <div className="absolute top-4 left-6 text-8xl font-serif text-primary/10 leading-none select-none">
            &ldquo;
          </div>
          <div className="absolute bottom-4 right-6 text-8xl font-serif text-primary/10 leading-none select-none">
            &rdquo;
          </div>

          <div className="relative text-center space-y-4 max-w-3xl mx-auto">
            <BookOpen className="h-6 w-6 text-primary mx-auto" />
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed tracking-tight text-foreground">
              And whoever saves one life — it is as if he had saved mankind entirely.
            </blockquote>
            <cite className="block text-sm sm:text-base text-primary font-semibold not-italic">
              — Al-Quran, Surah Al-Ma&apos;idah (5:32)
            </cite>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              In Islam, saving a life is considered one of the greatest acts of virtue.
              Blood donation is a simple yet profound way to fulfill this sacred duty.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
