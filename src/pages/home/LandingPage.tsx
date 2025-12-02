import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NavLanding from "@/components/NavLanding";
import {
  FileText,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Upload,
  Brain,
  FileCheck,
  Scale,
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: "Risk Detection",
      description:
        "Identify potential legal risks and problematic clauses instantly with AI-powered analysis.",
    },
    {
      icon: FileText,
      title: "Clause Extraction",
      description:
        "Automatically extract and categorize key clauses from contracts and legal documents.",
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description:
        "Get comprehensive analysis results in seconds, not hours or days.",
    },
  ];

  const steps = [
    {
      icon: Upload,
      step: "01",
      title: "Upload Document",
      description:
        "Simply upload your legal document in PDF, DOCX, or TXT format.",
    },
    {
      icon: Brain,
      step: "02",
      title: "AI Analysis",
      description:
        "Our AI engine analyzes the document for risks, clauses, and key information.",
    },
    {
      icon: FileCheck,
      step: "03",
      title: "Get Report",
      description:
        "Receive a detailed report with risk scores, clause breakdown, and recommendations.",
    },
  ];

  const stats = [
    { value: "98%", label: "Accuracy Rate" },
    { value: "10K+", label: "Documents Analyzed" },
    { value: "500+", label: "Active Users" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavLanding />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-sidebar">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sidebar-foreground leading-tight">
                AI-Powered <span className="text-warning">Legal Document</span>{" "}
                Analysis
              </h1>
              <p className="text-lg text-sidebar-foreground/70 max-w-xl">
                Trusted legal solutions powered by artificial intelligence.
                Analyze contracts, detect risks, and extract key clauses in
                seconds.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-warning hover:bg-warning/90 text-sidebar font-semibold gap-2"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-sidebar-foreground/30 text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-warning">
                      {stat.value}
                    </div>
                    <div className="text-sm text-sidebar-foreground/60">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Feature Card */}
            <div
              className="relative animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Card className="bg-card/10 backdrop-blur border-sidebar-border">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center">
                      <Scale className="w-5 h-5 text-sidebar" />
                    </div>
                    <span className="text-xl font-semibold text-sidebar-foreground">
                      Quick Analysis
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-sidebar-accent/50 rounded-lg p-4">
                      <label className="text-sm text-sidebar-foreground/60 block mb-2">
                        Document Type
                      </label>
                      <div className="text-sidebar-foreground">
                        Contract Agreement
                      </div>
                    </div>
                    <div className="bg-sidebar-accent/50 rounded-lg p-4">
                      <label className="text-sm text-sidebar-foreground/60 block mb-2">
                        Risk Level
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-warning"></div>
                        <span className="text-sidebar-foreground">
                          Medium Risk
                        </span>
                      </div>
                    </div>
                    <Link to="/signup">
                      <Button className="w-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground">
                        Try Analysis
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose LegalAI?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines advanced AI technology with legal expertise
              to provide accurate, fast, and reliable document analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="card-interactive animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <Card className="h-full hover-lift">
                  <CardContent className="p-8">
                    <div className="text-6xl font-bold text-primary/10 mb-4">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sidebar">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-sidebar-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-sidebar-foreground/70 mb-8 max-w-2xl mx-auto">
            Join thousands of legal professionals who trust LegalAI for their
            document analysis needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-warning hover:bg-warning/90 text-sidebar font-semibold gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth/lawyer-signup">
              <Button
                size="lg"
                variant="outline"
                className="border-sidebar-foreground/30 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                Register as Lawyer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-sidebar border-t border-sidebar-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center">
                  <Scale className="w-4 h-4 text-sidebar" />
                </div>
                <span className="text-xl font-bold text-sidebar-foreground">
                  LegalAI
                </span>
              </div>
              <p className="text-sidebar-foreground/60 text-sm">
                AI-powered legal document analysis for modern legal
                professionals.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/pricing"
                    className="text-sidebar-foreground/60 hover:text-warning"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="text-sidebar-foreground/60 hover:text-warning"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-sidebar-foreground/60 hover:text-warning"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-sidebar-foreground/60">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="text-sidebar-foreground/60">
                    Terms of Service
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sidebar-foreground mb-4">
                Contact
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-sidebar-foreground/60">
                    support@legalai.com
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-sidebar-border mt-8 pt-8 text-center">
            <p className="text-sidebar-foreground/60 text-sm">
              © {new Date().getFullYear()} LegalAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
