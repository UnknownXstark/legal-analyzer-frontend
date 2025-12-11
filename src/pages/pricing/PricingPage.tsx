import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import NavLanding from '@/components/NavLanding';
import PlanCard from '@/components/PlanCard';
import { paymentsAPI } from '@/services/paymentsAPI';
import { Scale, Check } from 'lucide-react';

const PricingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const freePlanFeatures = [
    { text: 'Up to 3 document analyses per month', included: true },
    { text: 'Basic clause detection', included: true },
    { text: 'Risk scoring (basic)', included: true },
    { text: 'PDF Report Export', included: false },
    { text: 'Priority processing', included: false },
    { text: 'Unlimited uploads', included: false },
    { text: 'Advanced AI analysis', included: false },
  ];

  const premiumPlanFeatures = [
    { text: 'Unlimited document uploads', included: true },
    { text: 'Unlimited AI analyses', included: true },
    { text: 'Full clause detection', included: true },
    { text: 'Advanced risk scoring', included: true },
    { text: 'PDF Report Export', included: true },
    { text: 'Priority queue processing', included: true },
    { text: 'Faster processing times', included: true },
  ];

  const businessPlanFeatures = [
    { text: 'Everything in Premium', included: true },
    { text: 'Unlimited team members', included: true },
    { text: 'Custom integrations', included: true },
    { text: 'Dedicated account manager', included: true },
    { text: 'SLA guarantee (99.9%)', included: true },
    { text: 'API access', included: true },
    { text: 'Custom AI model training', included: true },
  ];

  const handleSelectPlan = async (plan: 'free' | 'premium' | 'business') => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      toast.info('Please sign up or login first');
      navigate('/signup');
      return;
    }

    if (plan === 'free') {
      toast.success('You are on the Free plan');
      navigate('/dashboard');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await paymentsAPI.createCheckoutSession('premium');

      if (error) {
        toast.error(error);
        return;
      }

      // Redirect to Stripe checkout
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to start checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavLanding />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for you. Upgrade anytime as your needs grow.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <PlanCard
                name="Free"
                price="Free"
                description="Perfect for getting started"
                features={freePlanFeatures}
                buttonText="Get Started"
                onSelect={() => handleSelectPlan('free')}
                disabled={isLoading}
              />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <PlanCard
                name="Premium"
                price="$29"
                period="/month"
                description="For professionals"
                features={premiumPlanFeatures}
                isPopular
                buttonText="Upgrade to Premium"
                onSelect={() => handleSelectPlan('premium')}
                disabled={isLoading}
              />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <PlanCard
                name="Business"
                price="$99"
                period="/month"
                description="For teams and enterprises"
                features={businessPlanFeatures}
                buttonText="Contact Sales"
                onSelect={() => handleSelectPlan('business')}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-card">
                <h3 className="font-semibold text-foreground mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. Your access will continue
                  until the end of your billing period.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-card">
                <h3 className="font-semibold text-foreground mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards through our secure Stripe payment system.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-card">
                <h3 className="font-semibold text-foreground mb-2">
                  Is there a trial period for Premium?
                </h3>
                <p className="text-muted-foreground">
                  You can use the Free plan with limited features to test our platform before
                  upgrading to Premium.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Scale className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">LegalAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LegalAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
