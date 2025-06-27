import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, Users, Target, FileText, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LandingPage from "@/components/LandingPage";

interface Results {
  totalLeads: number;
  linkedinLeads: number;
  emailLeads: number;
  callLeads: number;
  linkedinPositiveReplies: number;
  linkedinTotalReplies: number;
  linkedinConnectionRequests: number;
  emailPositiveReplies: number;
  emailTotalReplies: number;
  emailContacts: number;
  callPositiveResponses: number;
  callTotalResponses: number;
  callContacts: number;
  linkedinTAM: number;
  emailTAM: number;
  callTAM: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auth state
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [salGoal, setSalGoal] = useState<number>(100);
  const [periodMonths, setPeriodMonths] = useState<number>(12);
  const [industry, setIndustry] = useState<string>("");
  const [companySize, setCompanySize] = useState<string>("");
  const [linkedinWeight, setLinkedinWeight] = useState<number[]>([60]);
  const [emailWeight, setEmailWeight] = useState<number[]>([30]);
  const [callWeight, setCallWeight] = useState<number[]>([10]);
  const [results, setResults] = useState<Results | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(async () => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(profileData);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--c-blue)]"></div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!user) {
    return <LandingPage />;
  }

  const calculateResults = () => {
    // Base conversion rates (industry averages)
    const baseRates = {
      linkedinReplyRate: 0.35,
      linkedinMeetingRate: 0.15,
      emailReplyRate: 0.30,
      emailMeetingRate: 0.12,
      callResponseRate: 0.22,
      callMeetingRate: 0.05,
    };

    // Industry multipliers
    const industryMultipliers: { [key: string]: number } = {
      "saas": 1.2,
      "fintech": 1.1,
      "healthcare": 0.9,
      "manufacturing": 0.8,
      "consulting": 1.3,
      "ecommerce": 1.0,
      "other": 1.0,
    };

    // Company size multipliers
    const sizeMultipliers: { [key: string]: number } = {
      "startup": 1.4,
      "small": 1.2,
      "medium": 1.0,
      "large": 0.8,
      "enterprise": 0.6,
    };

    const industryMult = industryMultipliers[industry] || 1.0;
    const sizeMult = sizeMultipliers[companySize] || 1.0;
    const totalMult = industryMult * sizeMult;

    // Adjust rates based on multipliers
    const adjustedRates = {
      linkedinReplyRate: Math.min(baseRates.linkedinReplyRate * totalMult, 0.6),
      linkedinMeetingRate: Math.min(baseRates.linkedinMeetingRate * totalMult, 0.3),
      emailReplyRate: Math.min(baseRates.emailReplyRate * totalMult, 0.5),
      emailMeetingRate: Math.min(baseRates.emailMeetingRate * totalMult, 0.25),
      callResponseRate: Math.min(baseRates.callResponseRate * totalMult, 0.4),
      callMeetingRate: Math.min(baseRates.callMeetingRate * totalMult, 0.15),
    };

    // Calculate distribution of leads across channels
    const totalWeight = linkedinWeight[0] + emailWeight[0] + callWeight[0];
    const linkedinLeads = Math.round((salGoal * linkedinWeight[0]) / totalWeight);
    const emailLeads = Math.round((salGoal * emailWeight[0]) / totalWeight);
    const callLeads = salGoal - linkedinLeads - emailLeads; // Ensure total matches

    // Calculate backwards from meetings to required outreach
    const linkedinPositiveReplies = Math.round(linkedinLeads / adjustedRates.linkedinMeetingRate);
    const linkedinTotalReplies = Math.round(linkedinPositiveReplies / adjustedRates.linkedinReplyRate);
    const linkedinConnectionRequests = Math.round(linkedinTotalReplies / 0.06); // 6% connection acceptance rate

    const emailPositiveReplies = Math.round(emailLeads / adjustedRates.emailMeetingRate);
    const emailTotalReplies = Math.round(emailPositiveReplies / adjustedRates.emailReplyRate);
    const emailContacts = Math.round(emailTotalReplies / 0.03); // 3% email response rate

    const callPositiveResponses = Math.round(callLeads / adjustedRates.callMeetingRate);
    const callTotalResponses = Math.round(callPositiveResponses / adjustedRates.callResponseRate);
    const callContacts = Math.round(callTotalResponses / 0.22); // 22% call pickup rate

    // Calculate Total Addressable Market requirements
    const linkedinTAM = Math.round(linkedinConnectionRequests * 2.5); // Buffer for targeting
    const emailTAM = Math.round(emailContacts * 2.5);
    const callTAM = Math.round(callContacts * 2.5);

    const newResults: Results = {
      totalLeads: salGoal,
      linkedinLeads,
      emailLeads,
      callLeads,
      linkedinPositiveReplies,
      linkedinTotalReplies,
      linkedinConnectionRequests,
      emailPositiveReplies,
      emailTotalReplies,
      emailContacts,
      callPositiveResponses,
      callTotalResponses,
      callContacts,
      linkedinTAM,
      emailTAM,
      callTAM,
    };

    setResults(newResults);
    return newResults;
  };

  const handleCalculate = async () => {
    if (!industry || !companySize) {
      toast({
        title: "Please fill all fields", 
        description: "Industry and company size are required for accurate calculations.",
        variant: "destructive",
      });
      return;
    }

    const newResults = calculateResults();
    
    // Save to database
    if (user) {
      try {
        const { data, error } = await supabase
          .from('pipeline_reports')
          .insert({
            user_id: user.id,
            calculated_data: newResults as any,
            target_sales: salGoal,
            expected_timeline_months: periodMonths,
          })
          .select()
          .single();
        if (error) {
          console.error('Error saving report:', error);
          toast({
            title: "Calculation completed",
            description: "Results generated but couldn't save to database.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Calculation completed!",
            description: "Your SAL pipeline has been calculated and saved.",
          });
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleViewReport = () => {
    if (results) {
      navigate('/report', { state: { results, salGoal, periodMonths, industry, companySize } });
    }
  };

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
              <h1 className="text-xl font-semibold text-[var(--c-text)]">SAL Pipeline Calculator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[var(--c-gray)]">
                Welcome, {profile?.username || user?.email?.split('@')[0] || 'User'}!
              </span>
              <Button variant="outline" onClick={() => navigate('/dashboard')} size="sm">
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleSignOut} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-6 w-6 text-[var(--c-blue)]" />
                <span>Pipeline Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* SAL Goal Input */}
              <div className="space-y-2">
                <Label htmlFor="sal-goal">Monthly SAL Goal</Label>
                <Input
                  id="sal-goal"
                  type="number"
                  value={salGoal}
                  onChange={(e) => setSalGoal(Number(e.target.value))}
                  placeholder="e.g., 100"
                />
              </div>

              {/* Time Period */}
              <div className="space-y-2">
                <Label htmlFor="period">Planning Period (months)</Label>
                <Input
                  id="period"
                  type="number"
                  value={periodMonths}
                  onChange={(e) => setPeriodMonths(Number(e.target.value))}
                  placeholder="e.g., 12"
                />
              </div>

              {/* Industry Selection */}
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saas">SaaS / Software</SelectItem>
                    <SelectItem value="fintech">FinTech</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Company Size */}
              <div className="space-y-2">
                <Label>Company Size</Label>
                <Select value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                    <SelectItem value="small">Small (11-50 employees)</SelectItem>
                    <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                    <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Channel Weight Distribution */}
              <div className="space-y-4">
                <h3 className="font-medium text-[var(--c-text)]">Channel Distribution</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>LinkedIn Outreach</Label>
                    <span className="text-sm text-[var(--c-gray)]">{linkedinWeight[0]}%</span>
                  </div>
                  <Slider
                    value={linkedinWeight}
                    onValueChange={setLinkedinWeight}
                    max={80}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Email Outreach</Label>
                    <span className="text-sm text-[var(--c-gray)]">{emailWeight[0]}%</span>
                  </div>
                  <Slider
                    value={emailWeight}
                    onValueChange={setEmailWeight}
                    max={60}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Cold Calling</Label>
                    <span className="text-sm text-[var(--c-gray)]">{callWeight[0]}%</span>
                  </div>
                  <Slider
                    value={callWeight}
                    onValueChange={setCallWeight}
                    max={40}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="text-sm text-[var(--c-gray)]">
                  Total: {linkedinWeight[0] + emailWeight[0] + callWeight[0]}%
                </div>
              </div>

              <Button onClick={handleCalculate} className="w-full btn-blue">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Pipeline Requirements
              </Button>
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 text-[var(--c-blue)] mx-auto mb-2" />
                      <div className="text-2xl font-bold text-[var(--c-text)]">{results.totalLeads}</div>
                      <div className="text-sm text-[var(--c-gray)]">Monthly SALs</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-[var(--c-text)]">{(results.linkedinConnectionRequests + results.emailContacts + results.callContacts).toLocaleString()}</div>
                      <div className="text-sm text-[var(--c-gray)]">Total Outreach</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-[var(--c-lime)] mx-auto mb-2" />
                      <div className="text-2xl font-bold text-[var(--c-text)]">{(results.linkedinTAM + results.emailTAM + results.callTAM).toLocaleString()}</div>
                      <div className="text-sm text-[var(--c-gray)]">Required TAM</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* LinkedIn */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-[var(--c-blue)] mb-3">LinkedIn Outreach ({linkedinWeight[0]}%)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.linkedinLeads}</div>
                            <div className="text-[var(--c-gray)]">Target Meetings</div>
                          </div>
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.linkedinPositiveReplies.toLocaleString()}</div>
                            <div className="text-[var(--c-gray)]">Positive Replies</div>
                          </div>
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.linkedinConnectionRequests.toLocaleString()}</div>
                            <div className="text-[var(--c-gray)]">Connection Requests</div>
                          </div>
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.linkedinTAM.toLocaleString()}</div>
                            <div className="text-[var(--c-gray)]">Required TAM</div>
                          </div>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-green-600 mb-3">Email Outreach ({emailWeight[0]}%)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.emailLeads}</div>
                            <div className="text-[var(--c-gray)]">Target Meetings</div>
                          </div>
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.emailPositiveReplies.toLocaleString()}</div>
                            <div className="text-[var(--c-gray)]">Positive Replies</div>
                          </div>
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.emailContacts.toLocaleString()}</div>
                            <div className="text-[var(--c-gray)]">Email Contacts</div>
                          </div>
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.emailTAM.toLocaleString()}</div>
                            <div className="text-[var(--c-gray)]">Required TAM</div>
                          </div>
                        </div>
                      </div>

                      {/* Cold Calling */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-orange-600 mb-3">Cold Calling ({callWeight[0]}%)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.callLeads}</div>
                            <div className="text-[var(--c-gray)]">Target Meetings</div>
                          </div>
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.callPositiveResponses.toLocaleString()}</div>
                            <div className="text-[var(--c-gray)]">Positive Responses</div>
                          </div>
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.callContacts.toLocaleString()}</div>
                            <div className="text-[var(--c-gray)]">Call Attempts</div>
                          </div>
                          <div>
                            <div className="font-medium text-[var(--c-text)]">{results.callTAM.toLocaleString()}</div>
                            <div className="text-[var(--c-gray)]">Required TAM</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button onClick={handleViewReport} className="flex-1 btn-blue">
                    <FileText className="mr-2 h-4 w-4" />
                    View Detailed Report
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                    Go to Dashboard
                  </Button>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calculator className="h-16 w-16 text-[var(--c-gray)] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[var(--c-text)] mb-2">Ready to Calculate</h3>
                  <p className="text-[var(--c-gray)]">
                    Fill in your requirements and click calculate to see your SAL pipeline breakdown.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
