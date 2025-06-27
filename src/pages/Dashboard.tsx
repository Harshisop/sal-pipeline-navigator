
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calculator, TrendingUp, Users, Target } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  metrics?: {
    leads: number;
    conversion: number;
    revenue: number;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [hasUsedCalculator, setHasUsedCalculator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);
      
      // Simulate fetching user data
      // In a real app, you'd fetch from your database
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: 'Enterprise Outreach Q4',
          status: 'active',
          createdAt: '2024-01-15',
          metrics: { leads: 156, conversion: 12.5, revenue: 45000 }
        },
        {
          id: '2', 
          name: 'SMB Lead Generation',
          status: 'active',
          createdAt: '2024-01-10',
          metrics: { leads: 89, conversion: 8.7, revenue: 22000 }
        }
      ];
      
      // Simulate different user states for demo
      const userEmail = user.email || '';
      if (userEmail.includes('new')) {
        setCampaigns([]);
        setHasUsedCalculator(false);
      } else if (userEmail.includes('empty')) {
        setCampaigns([]);
        setHasUsedCalculator(true);
      } else {
        setCampaigns(mockCampaigns);
        setHasUsedCalculator(true);
      }
      
      setLoading(false);
    };

    getCurrentUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--c-blue)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-[var(--c-blue)] rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded transform rotate-45"></div>
              </div>
              <h1 className="text-xl font-semibold text-[var(--c-text)]">SAL Pipeline</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[var(--c-gray)]">
                Welcome back, {user?.email?.split('@')[0] || 'User'}!
              </span>
              <Button variant="outline" onClick={handleSignOut} size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--c-text)] mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'User'}!
          </h2>
          <p className="text-[var(--c-gray)] text-lg">
            Track your SAL pipelines and optimize your sales processes
          </p>
        </div>

        {/* Quick Stats */}
        {campaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-[var(--c-blue)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--c-gray)]">Total Leads</p>
                    <p className="text-2xl font-semibold text-[var(--c-text)]">
                      {campaigns.reduce((sum, c) => sum + (c.metrics?.leads || 0), 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--c-gray)]">Avg Conversion</p>
                    <p className="text-2xl font-semibold text-[var(--c-text)]">
                      {campaigns.length > 0 
                        ? (campaigns.reduce((sum, c) => sum + (c.metrics?.conversion || 0), 0) / campaigns.length).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[var(--c-lime)]/20 rounded-lg">
                    <Target className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--c-gray)]">Total Revenue</p>
                    <p className="text-2xl font-semibold text-[var(--c-text)]">
                      ${campaigns.reduce((sum, c) => sum + (c.metrics?.revenue || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Your Existing SAL Campaigns */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[var(--c-text)]">Your Existing SAL Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length > 0 ? (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-[var(--c-text)]">{campaign.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-[var(--c-gray)]">
                        Created {new Date(campaign.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {campaign.metrics && (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-[var(--c-gray)]">Leads: </span>
                          <span className="font-medium text-[var(--c-text)]">{campaign.metrics.leads}</span>
                        </div>
                        <div>
                          <span className="text-[var(--c-gray)]">Conversion: </span>
                          <span className="font-medium text-[var(--c-text)]">{campaign.metrics.conversion}%</span>
                        </div>
                        <div>
                          <span className="text-[var(--c-gray)]">Revenue: </span>
                          <span className="font-medium text-[var(--c-text)]">${campaign.metrics.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-[var(--c-gray)]" />
                </div>
                <h3 className="text-lg font-medium text-[var(--c-text)] mb-2">
                  You have no active SAL pipelines yet
                </h3>
                <p className="text-[var(--c-gray)] mb-6">
                  Get started by creating your first campaign or using our calculator to plan your pipeline.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')} 
            className="btn-blue flex items-center space-x-2"
            size="lg"
          >
            <Calculator className="h-5 w-5" />
            <span>Calculate SAL Pipeline</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 border-[var(--c-blue)] text-[var(--c-blue)] hover:bg-[var(--c-blue)] hover:text-white"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Pipeline</span>
          </Button>
        </div>

        {/* Getting Started Section for New Users */}
        {!hasUsedCalculator && (
          <Card className="mt-8 bg-gradient-to-r from-[var(--c-blue)]/5 to-[var(--c-lime)]/5 border-[var(--c-blue)]/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-[var(--c-text)] mb-3">
                Ready to optimize your sales pipeline?
              </h3>
              <p className="text-[var(--c-gray)] mb-6 max-w-2xl mx-auto">
                Our SAL calculator helps you determine the right metrics and targets for your sales pipeline. 
                Get personalized recommendations based on your goals and industry benchmarks.
              </p>
              <Button 
                onClick={() => navigate('/')} 
                className="btn-blue"
                size="lg"
              >
                Get Started with Calculator
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
