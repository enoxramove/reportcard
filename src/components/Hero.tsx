import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, FileText, Shield, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.03, y: -6, transition: { duration: 0.3, ease: "easeOut" as const } },
  };

  const features = [
    "Auto-generate professional reports",
    "Customizable for any school",
    "Secure & encrypted data",
    "Download as PDF instantly",
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-blob animate-float-delay" />
        <div className="absolute bottom-[-5%] left-[30%] w-[450px] h-[450px] bg-secondary/10 rounded-full blur-[100px] animate-blob" style={{ animationDelay: "3s" }} />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8 mb-20"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <Sparkles className="w-4 h-4" />
                Trusted by schools across the region
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.1] tracking-tight text-foreground"
            >
              Create Beautiful
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent">
                Report Cards
              </span>
              <br />
              in Minutes
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              The all-in-one platform for primary and secondary schools to generate, 
              customize, and manage professional student reports effortlessly.
            </motion.p>

            {/* Feature pills */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto">
              {features.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card text-sm text-muted-foreground border border-border shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                  {f}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Module Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-24"
          >
            {/* Primary Card */}
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className="relative group cursor-pointer rounded-2xl border-2 border-border bg-card p-8 shadow-md hover:shadow-lg hover:border-primary/40 transition-colors duration-300 overflow-hidden"
                onClick={() => navigate("/auth?module=primary")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <GraduationCap className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Primary Module</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Simplified grading with student-friendly layouts designed for primary schools.
                    </p>
                  </div>
                  <Button className="w-full group/btn" size="lg">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            {/* Secondary Card */}
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className="relative group cursor-pointer rounded-2xl border-2 border-border bg-card p-8 shadow-md hover:shadow-lg hover:border-secondary/40 transition-colors duration-300 overflow-hidden"
                onClick={() => navigate("/auth?module=secondary")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-5">
                  <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                    <FileText className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Secondary Module</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Advanced academic tracking with detailed reporting for secondary schools.
                    </p>
                  </div>
                  <Button className="w-full group/btn" size="lg" variant="secondary">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Stats / Trust Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="rounded-2xl bg-card border border-border shadow-md p-8 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Secure & Private</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    End-to-end encryption keeps your student data safe and protected.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Fully Customizable</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tailor every aspect of the report card to match your school's branding.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto">
                    <GraduationCap className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Generate complete report cards for an entire class in under a minute.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
