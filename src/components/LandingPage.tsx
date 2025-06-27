
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, Target, Users, CheckCircle, ArrowRight, BarChart3, Zap } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calculator,
      title: "Smart SAL Calculator",
      description: "Calculate your Sales Accepted Leads pipeline with precision using industry benchmarks and your specific goals."
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Monitor your pipeline performance with detailed analytics and real-time tracking of key metrics."
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set realistic targets based on your sales capacity and market conditions with data-driven insights."
    },
    {
      icon: BarChart3,
      title: "Detailed Reporting",
      description: "Generate comprehensive reports to understand your pipeline health and identify optimization opportunities."
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Manage multiple campaigns and track team performance across different sales initiatives."
    },
    {
      icon: Zap,
      title: "Quick Insights",
      description: "Get instant recommendations and actionable insights to improve your sales process efficiency."
    }
  ];

  const benefits = [
    "Reduce sales cycle time by 30%",
    "Improve lead qualification accuracy",
    "Increase pipeline visibility",
    "Optimize resource allocation",
    "Data-driven decision making",
    "Scalable growth strategies"
  ];

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
              <h1 className="text-xl font-semibold text-[var(--c-text)]">SAL Pipeline Navigator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/auth')} size="sm">
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')} size="sm" className="btn-blue">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--c-text)] mb-6 leading-tight">
            Master Your
            <span className="text-[var(--c-blue)] block">Sales Pipeline</span>
          </h1>
          <p className="text-xl text-[var(--c-gray)] mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your sales process with our intelligent SAL Pipeline Navigator. 
            Calculate, track, and optimize your Sales Accepted Leads with precision and confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              className="btn-blue text-lg px-8 py-3 h-auto"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-3 h-auto border-[var(--c-blue)] text-[var(--c-blue)] hover:bg-[var(--c-blue)] hover:text-white"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--c-text)] mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-[var(--c-gray)] max-w-2xl mx-auto">
              Comprehensive tools and insights to optimize your sales pipeline from lead generation to conversion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-[var(--c-blue)]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-[var(--c-blue)]" />
                  </div>
                  <CardTitle className="text-xl text-[var(--c-text)]">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-[var(--c-gray)] leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[var(--c-blue)]/5 to-[var(--c-lime)]/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[var(--c-text)] mb-6">
                Why Choose SAL Pipeline Navigator?
              </h2>
              <p className="text-lg text-[var(--c-gray)] mb-8 leading-relaxed">
                Our platform combines advanced analytics with intuitive design to help sales teams 
                achieve unprecedented pipeline visibility and performance optimization.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--c-text)] font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[var(--c-blue)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--c-text)] mb-2">Pipeline Health Score</h3>
                  <div className="text-4xl font-bold text-[var(--c-blue)] mb-2">92%</div>
                  <p className="text-[var(--c-gray)]">Above industry average</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[var(--c-text)]">156</div>
                    <div className="text-sm text-[var(--c-gray)]">Active Leads</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[var(--c-text)]">67K</div>
                    <div className="text-sm text-[var(--c-gray)]">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--c-blue)] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Sales Pipeline?
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Join thousands of sales professionals who trust SAL Pipeline Navigator 
            to optimize their sales processes and drive revenue growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              className="bg-white text-[var(--c-blue)] hover:bg-gray-100 text-lg px-8 py-3 h-auto font-semibold"
            >
              Start Your Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[var(--c-blue)] text-lg px-8 py-3 h-auto"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-8 h-8 bg-[var(--c-blue)] rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded transform rotate-45"></div>
                </div>
                <h1 className="text-xl font-semibold text-[var(--c-text)]">SAL Pipeline Navigator</h1>
              </div>
              <p className="text-[var(--c-gray)] mb-4 max-w-md">
                The ultimate tool for sales pipeline optimization and performance tracking.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-[var(--c-text)] mb-4">Product</h3>
              <ul className="space-y-2 text-[var(--c-gray)]">
                <li><a href="#" className="hover:text-[var(--c-blue)]">Features</a></li>
                <li><a href="#" className="hover:text-[var(--c-blue)]">Pricing</a></li>
                <li><a href="#" className="hover:text-[var(--c-blue)]">Integrations</a></li>
                <li><a href="#" className="hover:text-[var(--c-blue)]">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-[var(--c-text)] mb-4">Support</h3>
              <ul className="space-y-2 text-[var(--c-gray)]">
                <li><a href="#" className="hover:text-[var(--c-blue)]">Help Center</a></li>
                <li><a href="#" className="hover:text-[var(--c-blue)]">Contact Us</a></li>
                <li><a href="#" className="hover:text-[var(--c-blue)]">Documentation</a></li>
                <li><a href="#" className="hover:text-[var(--c-blue)]">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-[var(--c-gray)]">
            <p>&copy; 2024 SAL Pipeline Navigator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
