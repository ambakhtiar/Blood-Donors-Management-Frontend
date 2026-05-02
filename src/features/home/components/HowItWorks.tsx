import { ClipboardEdit, UserCheck, HeartHandshake } from "lucide-react";

const steps = [
  {
    title: "Post a Request",
    description: "Create a blood finding or crowdfunding request with verified medical documents.",
    icon: ClipboardEdit,
    color: "bg-blue-500",
  },
  {
    title: "Get Matched",
    description: "Our AI-powered network instantly notifies verified donors and volunteers in your area.",
    icon: UserCheck,
    color: "bg-primary",
  },
  {
    title: "Save a Life",
    description: "Connect with donors or receive funds directly. Track the impact of your contribution.",
    icon: HeartHandshake,
    color: "bg-emerald-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform simplifies the process of finding help during medical emergencies. Follow three simple steps to start.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500/20 via-primary/20 to-emerald-500/20 -z-10" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-6 group">
              <div className={`h-20 w-20 rounded-3xl ${step.color} flex items-center justify-center text-white shadow-xl shadow-${step.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-bold">
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
