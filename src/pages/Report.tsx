
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Report = () => {
  return (
    <div className="min-h-screen bg-[var(--c-bg)]">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/4bd4baaa-1f9f-456e-99ce-92e40c619011.png" 
              alt="Cience" 
              className="h-8"
            />
            <div className="h-6 w-px bg-gray-300"></div>
            <span className="text-lg font-semibold text-[var(--c-text)]">Campaign MIS Dashboard</span>
          </div>
          <div className="ml-auto">
            <Link to="/">
              <Button variant="outline" className="rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Calculator
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-8 py-12 px-4">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="gradient-bg text-white rounded-3xl p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Campaign MIS Dashboard
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Real-time campaign performance and analytics
            </p>
          </div>
        </div>

        {/* Main Dashboard Card */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-[var(--c-blue-dark)]">
              <TrendingUp className="w-6 h-6" />
              Campaign Performance Data
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-16">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--c-text)]">Data Loading Soon</h3>
              <p className="text-[var(--c-text)] leading-relaxed">
                Campaign performance data will load here once webhooks are integrated and your campaigns are generating results.
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-[var(--c-blue)]">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                  Webhook integration pending
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Features Preview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-[var(--c-text)] mb-2">Real-time Metrics</h4>
              <p className="text-sm text-gray-600">Live campaign performance tracking</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-[var(--c-text)] mb-2">Channel Analytics</h4>
              <p className="text-sm text-gray-600">Email, LinkedIn, and call performance</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
            <CardContent className="p-6 text-center">
              <h4 className="font-semibold text-[var(--c-text)] mb-2">ROI Tracking</h4>
              <p className="text-sm text-gray-600">Pipeline value and conversion rates</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Report;
