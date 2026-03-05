import { Clock, Target, Sparkles, MessageCircle } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Time-Saving",
    description: "Automate report card generation, reducing administrative tasks for educators."
  },
  {
    icon: Target,
    title: "Accuracy",
    description: "Ensure accurate and consistent reporting of student progress."
  },
  {
    icon: Sparkles,
    title: "Personalization",
    description: "Customize report cards to reflect individual student achievements and goals."
  },
  {
    icon: MessageCircle,
    title: "Enhanced Communication",
    description: "Share report cards with parents and guardians, promoting transparency and collaboration."
  }
];

const Benefits = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Benefits
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your reporting process with powerful advantages
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center space-y-4 p-6 rounded-xl bg-card hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <benefit.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
