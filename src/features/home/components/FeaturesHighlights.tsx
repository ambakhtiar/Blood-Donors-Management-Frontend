import { LayoutDashboard, ShieldCheck, Zap, HeartHandshake, History, BellRing } from "lucide-react";

const features = [
  {
    title: "Role-Based Dashboards",
    description: "Customized experiences for Donors, Hospitals, and Organisations to manage activities efficiently.",
    icon: LayoutDashboard,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Verified Institutions",
    description: "All participating hospitals and organisations are strictly verified to ensure safe and reliable donations.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "AI-Powered Matching",
    description: "Smart algorithms to find the most compatible donors and nearby volunteers in real-time.",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Seamless Crowdfunding",
    description: "Verified financial assistance requests with transparent tracking of every contribution.",
    icon: HeartHandshake,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    title: "Donation History",
    description: "Maintain a lifelong record of your contributions and medical impact on a secure digital ledger.",
    icon: History,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Instant Notifications",
    description: "Get real-time alerts for urgent blood needs and campaign updates tailored to your location.",
    icon: BellRing,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
];

export function FeaturesHighlights() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Platform Highlights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced features designed to build a trusted and efficient medical support network for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="bg-card p-8 rounded-[2rem] border border-border/40 hover:border-primary/20 transition-all duration-300 group">
              <div className={`h-14 w-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
