
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calculator, TrendingUp, Users, Target, ArrowRight } from "lucide-react";

interface Pipeline {
  id: string;
  target_sales: number;
  expected_timeline_months: number;
  created_at: string;
  calculated_data: any;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);
      
      // Fetch user's pipelines
      const { data: pipelineData, error } = await supabase
        .from('pipeline_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pipelines:', error);
      } else {
        setPipelines(pipelineData || []);
      }
      
      setLoading(false);
    };

    getCurrentUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handlePipelineClick = (pipeline: Pipeline) => {
    // Store pipeline data in localStorage for the report page
    localStorage.setItem('currentPipeline', JSON.stringify(pipeline));
    navigate('/report');
  };

  const handleCalculateNewPipeline = () => {
    // Clear any existing pipeline data and go to calculator
    localStorage.removeItem('currentPipeline');
    navigate('/');
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

        {/* Pipelines Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[var(--c-text)]">Your SAL Pipelines</CardTitle>
          </CardHeader>
          <CardContent>
            {pipelines.length > 0 ? (
              <div className="space-y-4">
                {pipelines.map((pipeline) => (
                  <div 
                    key={pipeline.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                    onClick={() => handlePipelineClick(pipeline)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[var(--c-blue)]/10 rounded-lg flex items-center justify-center">
                          <Target className="h-6 w-6 text-[var(--c-blue)]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--c-text)]">
                            Pipeline - {pipeline.target_sales} SALs
                          </h3>
                          <p className="text-sm text-[var(--c-gray)]">
                            {pipeline.expected_timeline_months} months timeline • Created {new Date(pipeline.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[var(--c-gray)]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-[var(--c-gray)]" />
                </div>
                <h3 className="text-lg font-medium text-[var(--c-text)] mb-2">
                  No pipelines yet
                </h3>
                <p className="text-[var(--c-gray)] mb-6">
                  Create your first SAL pipeline to get started with tracking your sales process.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleCalculateNewPipeline}
            className="btn-blue flex items-center space-x-2"
            size="lg"
          >
            <Calculator className="h-5 w-5" />
            <span>
              {pipelines.length > 0 ? 'Calculate New Pipeline' : 'Calculate New Pipeline'}
            </span>
          </Button>
        </div>
      </main>
    </div>
  );
}
