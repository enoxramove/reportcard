import { GraduationCap, UserCog, Users2 } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "Educators",
    description: "Teachers, class teachers, and head teachers can easily manage report cards with our intuitive interface."
  },
  {
    icon: UserCog,
    title: "Administrators",
    description: "School administrators can oversee report card generation and distribution across all classes."
  },
  {
    icon: Users2,
    title: "Students and Parents",
    description: "Receive personalized report cards, enabling students to track progress and parents to stay informed."
  }
];

const Audience = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Built For Everyone
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our system caters to all stakeholders in the educational process
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className="text-center space-y-4 p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <audience.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {audience.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Audience;
