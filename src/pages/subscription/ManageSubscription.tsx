import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AppLayout from '@/layouts/AppLayout';
import { paymentsAPI } from '@/services/paymentsAPI';
import { CreditCard, Calendar, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface SubscriptionStatus {
  plan: 'free' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  usage?: {
    analyses_used: number;
    analyses_limit: number;
  };
}

const ManageSubscription = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const { data, error } = await paymentsAPI.getSubscriptionStatus();

      if (error) {
        toast.error(error);
        return;
      }

      setSubscription(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsActionLoading(true);
    try {
      const { data, error } = await paymentsAPI.manageBillingPortal();

      if (error) {
        toast.error(error);
        return;
      }

      if (data?.portal_url) {
        window.location.href = data.portal_url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to open billing portal');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setIsActionLoading(true);
    try {
      const { data, error } = await paymentsAPI.createCheckoutSession('premium');

      if (error) {
        toast.error(error);
        return;
      }

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to start checkout');
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'canceled':
        return <Badge className="bg-muted text-muted-foreground">Canceled</Badge>;
      case 'past_due':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Past Due</Badge>;
      case 'trialing':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Trial</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscription</h1>
          <p className="text-muted-foreground mt-1">Manage your plan and billing</p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Current Plan</CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </div>
              {subscription && getStatusBadge(subscription.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {subscription?.plan === 'premium' ? (
                    <CheckCircle className="w-6 h-6 text-primary" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground capitalize">
                    {subscription?.plan || 'Free'} Plan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {subscription?.plan === 'premium' ? '$29/month' : 'Free forever'}
                  </p>
                </div>
              </div>

              {subscription?.plan === 'free' ? (
                <Button onClick={handleUpgrade} disabled={isActionLoading}>
                  {isActionLoading ? 'Loading...' : 'Upgrade to Premium'}
                </Button>
              ) : (
                <Button variant="outline" onClick={handleManageBilling} disabled={isActionLoading}>
                  {isActionLoading ? 'Loading...' : 'Manage Billing'}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Usage */}
            {subscription?.usage && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Document Analyses</span>
                  <span className="font-medium text-foreground">
                    {subscription.usage.analyses_used} / {subscription.usage.analyses_limit === -1 ? '∞' : subscription.usage.analyses_limit}
                  </span>
                </div>
                {subscription.usage.analyses_limit !== -1 && (
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((subscription.usage.analyses_used / subscription.usage.analyses_limit) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Billing Period */}
            {subscription?.current_period_end && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {subscription.cancel_at_period_end
                    ? `Access until ${new Date(subscription.current_period_end).toLocaleDateString()}`
                    : `Next billing date: ${new Date(subscription.current_period_end).toLocaleDateString()}`}
                </span>
              </div>
            )}

            {subscription?.cancel_at_period_end && (
              <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg text-warning">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Your subscription will end at the current billing period.</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Comparison */}
        {subscription?.plan === 'free' && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade to Premium</CardTitle>
              <CardDescription>Unlock all features and unlimited usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">What you'll get:</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      'Unlimited document uploads',
                      'Unlimited AI analyses',
                      'Full clause detection',
                      'Advanced risk scoring',
                      'PDF Report Export',
                      'Priority queue processing',
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-4xl font-bold text-foreground mb-1">$29</div>
                  <div className="text-muted-foreground mb-4">/month</div>
                  <Button onClick={handleUpgrade} disabled={isActionLoading} className="w-full">
                    {isActionLoading ? 'Loading...' : 'Upgrade Now'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default ManageSubscription;
