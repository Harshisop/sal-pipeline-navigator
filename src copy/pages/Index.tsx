import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, CheckCircle, Calculator, TrendingUp, Download, Mail, Linkedin, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import ICPModal from '@/components/ICPModal';

interface Results {
  Y: number;
  Y_li: number;
  Y_em: number;
  Y_call: number;
  PosLI: number;
  PosEM: number;
  PosCall: number;
  RepLI: number;
  RepEM: number;
  RepCall: number;
  AppointmentCalls: number;
  CallsNeeded: number;
  ConnReq: number;
  VerEM: number;
  VerLI: number;
  VerCall: number;
  TAM_EM: number;
  TAM_LI: number;
  TAM_Call: number;
  capOK: string;
  capOK_Call: string;
  pipeline: number;
}

interface ICPData {
  personaGroup: string;
  seniority: string[];
  painPoint: string;
  benefitFeature: string;
  umbrella: string;
  socialGroup: string;
}

const Index = () => {
  const { toast } = useToast();
  
  // Form state
  const [period, setPeriod] = useState<string>('3 months');
  const [salGoal, setSalGoal] = useState<number>(100);
  const [valueSal, setValueSal] = useState<number>(50000);
  const [hasOutbound, setHasOutbound] = useState<string>('Yes (we know our offers)');
  const [channels, setChannels] = useState<string>('All');
  const [liAccts, setLiAccts] = useState<number>(4);
  const [callAccts, setCallAccts] = useState<number>(2);
  const [splitLI, setSplitLI] = useState<number>(60);
  const [splitEM, setSplitEM] = useState<number>(30);
  const [splitCall, setSplitCall] = useState<number>(10);
  const [channelFile, setChannelFile] = useState<File | null>(null);
  
  // Advanced defaults
  const [showRate, setShowRate] = useState<number>(60);
  const [salPerMtg, setSalPerMtg] = useState<number>(50);
  const [emReply, setEmReply] = useState<number>(3);
  const [emPositive, setEmPositive] = useState<number>(30);
  const [liReply, setLiReply] = useState<number>(20);
  const [liPositive, setLiPositive] = useState<number>(35);
  const [liAccept, setLiAccept] = useState<number>(30);
  const [connectionRatio, setConnectionRatio] = useState<number>(1);
  const [verifiedRt, setVerifiedRt] = useState<number>(40);
  
  // Call benchmarks
  const [pickupRate, setPickupRate] = useState<number>(22);
  const [appointmentRate, setAppointmentRate] = useState<number>(2.3);
  
  // ICP and results state
  const [icpRows, setIcpRows] = useState<ICPData[]>([]);
  const [results, setResults] = useState<Results | null>(null);
  const [campaignLive, setCampaignLive] = useState<boolean>(false);
  
  // UI state
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(num));
  };

  const validateSplit = () => {
    if (channels === 'All' && splitLI + splitEM + splitCall !== 100) {
      toast({
        title: "Validation Error",
        description: "LinkedIn, Email, and Call percentages must add up to 100%",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const calculate = () => {
    if (!validateSplit()) return;

    const X = +salGoal;
    const V = +valueSal;
    const show = showRate / 100;
    const salPM = salPerMtg / 100;
    
    let pctLI = 0, pctEM = 0, pctCall = 0;
    
    switch (channels) {
      case 'Email':
        pctEM = 100;
        break;
      case 'LinkedIn':
        pctLI = 100;
        break;
      case 'Call':
        pctCall = 100;
        break;
      case 'All':
        pctLI = +splitLI;
        pctEM = +splitEM;
        pctCall = +splitCall;
        break;
    }

    const Y = X / (show * salPM);
    const Y_li = Y * pctLI / 100;
    const Y_em = Y * pctEM / 100;
    const Y_call = Y * pctCall / 100;

    const PosLI = Y_li / show;
    const PosEM = Y_em / show;
    const PosCall = Y_call;

    const RepLI = PosLI / (liPositive / 100);
    const RepEM = PosEM / (emPositive / 100);
    const AppointmentCalls = Y_call / (appointmentRate / 100);
    const CallsNeeded = AppointmentCalls / (pickupRate / 100);
    const RepCall = CallsNeeded;

    const VerEM = RepEM / (emReply / 100);
    const liMsgs = RepLI / (liReply / 100);
    const ConnReq = liMsgs / (liAccept / 100) * connectionRatio;
    const VerLI = ConnReq;
    const VerCall = CallsNeeded;

    const TAM_EM = VerEM / (verifiedRt / 100);
    const TAM_LI = VerLI / (verifiedRt / 100);
    const TAM_Call = VerCall / (verifiedRt / 100);

    const capOK = ConnReq <= (+liAccts * 500 * 3) ? "OK" : "Exceeds capacity";
    const capOK_Call = CallsNeeded <= (+callAccts * 150 * 22) ? "OK" : "Exceeds capacity";
    const pipeline = X * V;

    const newResults: Results = {
      Y, Y_li, Y_em, Y_call, PosLI, PosEM, PosCall, RepLI, RepEM, RepCall,
      AppointmentCalls, CallsNeeded, ConnReq, VerEM, VerLI, VerCall, 
      TAM_EM, TAM_LI, TAM_Call, capOK, capOK_Call, pipeline
    };

    setResults(newResults);
  };

  const handleICPSave = (data: ICPData) => {
    setIcpRows(prev => [...prev, data]);
    toast({
      title: "ICP Added",
      description: `Added ${data.personaGroup} to your ICP list`,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setChannelFile(file);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been attached`,
      });
    }
  };

  const downloadPipelineResults = () => {
    if (!results) return;
    
    const headers = [
      'Meetings to Book (PQLs)', 'Meetings via LinkedIn', 'Meetings via Email', 'Meetings via Call',
      'Positive Replies LinkedIn', 'Total Replies LinkedIn', 'Connection Requests to Send',
      'Positive Replies Email', 'Total Replies Email', 'Email Contacts Required',
      'Positive Responses from Calls', 'Total Responses from Calls', 'Phone Contacts Required',
      'Required TAM LinkedIn', 'Required TAM Email', 'Required TAM Call',
      'LinkedIn Capacity Check', 'Call Capacity Check', 'Estimated Pipeline Value'
    ];
    
    const values = [
      formatNumber(results.Y), formatNumber(results.Y_li), formatNumber(results.Y_em),
      formatNumber(results.Y_call), formatNumber(results.PosLI), formatNumber(results.RepLI),
      formatNumber(results.ConnReq), formatNumber(results.PosEM), formatNumber(results.RepEM),
      formatNumber(results.VerEM), formatNumber(results.PosCall), formatNumber(results.RepCall),
      formatNumber(results.VerCall), formatNumber(results.TAM_LI), formatNumber(results.TAM_EM),
      formatNumber(results.TAM_Call), results.capOK, results.capOK_Call, formatCurrency(results.pipeline)
    ];
    
    const csvContent = headers.join(',') + '\n' + values.map(item => `"${item}"`).join(',');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline-results.csv';
    a.click();
  };

  const downloadICPData = () => {
    if (icpRows.length === 0) {
      toast({
        title: "No ICP Data",
        description: "Please add at least one ICP before downloading",
        variant: "destructive",
      });
      return;
    }
    
    const headers = ['Persona Group', 'Seniority', 'Pain Point', 'Benefit from Feature', 'Value Prop', 'Social Group'];
    let csvContent = headers.join(',') + '\n';
    
    icpRows.forEach(icp => {
      const row = [
        icp.personaGroup, icp.seniority.join(';'), icp.painPoint, 
        icp.benefitFeature, icp.umbrella, icp.socialGroup
      ];
      csvContent += row.map(item => `"${item}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'icp-data.csv';
    a.click();
  };

  const getUmbrellaColor = (umbrella: string) => {
    switch (umbrella) {
      case 'Make Money': return 'chip';
      case 'Save Money': return 'chip';
      case 'Save Time': return 'chip';
      case 'Reduce Risk': return 'chip';
      default: return 'chip';
    }
  };

  const getTimelineMessage = () => {
    return hasOutbound === 'Yes (we know our offers)' 
      ? 'Expected timeline for positive results: 2–3 months.'
      : 'Expected timeline for positive results: 4–5 months (experimental phase).';
  };

  const displayedPersonas = icpRows;

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
            <span className="text-lg font-semibold text-[var(--c-text)]">Pipeline Estimator</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-12 py-12 px-4">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="gradient-bg text-white rounded-3xl p-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              SAL & Pipeline Estimator
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Turn TAM into meetings, SALs, and revenue—step by step
            </p>
          </div>
        </div>

        {/* Input Panel */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-[var(--c-blue-dark)]">
              <Calculator className="w-6 h-6" />
              Input Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Timeframe and Goals */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="period" className="text-[var(--c-text)] font-medium">Timeframe</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="h-12 rounded-xl border-2 focus:border-[var(--c-blue)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="4 months">4 months</SelectItem>
                    <SelectItem value="5 months">5 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="9 months">9 months</SelectItem>
                    <SelectItem value="12 months">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salGoal" className="text-[var(--c-text)] font-medium">Target SALs</Label>
                <Input
                  id="salGoal"
                  type="number"
                  value={salGoal}
                  onChange={(e) => setSalGoal(Number(e.target.value))}
                  className="text-right text-lg h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valueSal" className="text-[var(--c-text)] font-medium">Value per SAL (USD)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                <Input
                  id="valueSal"
                  type="number"
                  value={valueSal}
                  onChange={(e) => setValueSal(Number(e.target.value))}
                  className="text-right text-lg h-12 rounded-xl border-2 focus:border-[var(--c-blue)] pl-10"
                />
              </div>
            </div>

            {/* Outbound Experience */}
            <div className="space-y-4">
              <Label className="text-[var(--c-text)] font-medium">Have you run outbound before?</Label>
              <RadioGroup value={hasOutbound} onValueChange={setHasOutbound} className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-[var(--c-blue)] transition-colors">
                  <RadioGroupItem value="Yes (we know our offers)" id="yes-outbound" />
                  <Label htmlFor="yes-outbound" className="cursor-pointer">Yes (we know our offers)</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-[var(--c-blue)] transition-colors">
                  <RadioGroupItem value="No (experimental phase needed)" id="no-outbound" />
                  <Label htmlFor="no-outbound" className="cursor-pointer">No (experimental phase needed)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Outreach Channels */}
            <div className="space-y-4">
              <Label className="text-[var(--c-text)] font-medium">Outreach channel(s)</Label>
              <RadioGroup value={channels} onValueChange={setChannels} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-[var(--c-blue)] transition-colors">
                  <RadioGroupItem value="Email" id="email" />
                  <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                    <Mail className="w-5 h-5 text-[var(--c-blue)]" />
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-[var(--c-blue)] transition-colors">
                  <RadioGroupItem value="LinkedIn" id="linkedin" />
                  <Label htmlFor="linkedin" className="flex items-center gap-2 cursor-pointer">
                    <Linkedin className="w-5 h-5 text-[var(--c-blue)]" />
                    LinkedIn
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-[var(--c-blue)] transition-colors">
                  <RadioGroupItem value="Call" id="call" />
                  <Label htmlFor="call" className="cursor-pointer">Call</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:border-[var(--c-blue)] transition-colors">
                  <RadioGroupItem value="All" id="all" />
                  <Label htmlFor="all" className="cursor-pointer">All</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Account Configuration */}
            <div className="grid md:grid-cols-2 gap-6">
              {(channels === 'LinkedIn' || channels === 'All') && (
                <div className="space-y-2">
                  <Label htmlFor="liAccts" className="text-[var(--c-text)] font-medium"># LinkedIn SDR accounts</Label>
                  <Input
                    id="liAccts"
                    type="number"
                    value={liAccts}
                    onChange={(e) => setLiAccts(Number(e.target.value))}
                    className="text-right text-lg h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
                  />
                </div>
              )}

              {(channels === 'Call' || channels === 'All') && (
                <div className="space-y-2">
                  <Label htmlFor="callAccts" className="text-[var(--c-text)] font-medium"># Call SDR accounts</Label>
                  <Input
                    id="callAccts"
                    type="number"
                    value={callAccts}
                    onChange={(e) => setCallAccts(Number(e.target.value))}
                    className="text-right text-lg h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
                  />
                </div>
              )}
            </div>

            {channels === 'All' && (
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="splitLI" className="text-[var(--c-text)] font-medium">% meetings via LinkedIn</Label>
                  <Input
                    id="splitLI"
                    type="number"
                    value={splitLI}
                    onChange={(e) => setSplitLI(Number(e.target.value))}
                    className="text-right text-lg h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="splitEM" className="text-[var(--c-text)] font-medium">% meetings via Email</Label>
                  <Input
                    id="splitEM"
                    type="number"
                    value={splitEM}
                    onChange={(e) => setSplitEM(Number(e.target.value))}
                    className="text-right text-lg h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="splitCall" className="text-[var(--c-text)] font-medium">% meetings via Call</Label>
                  <Input
                    id="splitCall"
                    type="number"
                    value={splitCall}
                    onChange={(e) => setSplitCall(Number(e.target.value))}
                    className="text-right text-lg h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
                  />
                </div>
              </div>
            )}

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="channelFile" className="text-[var(--c-text)] font-medium">Attach channel data file (optional)</Label>
              <div className="relative">
                <Input
                  id="channelFile"
                  type="file"
                  onChange={handleFileChange}
                  className="h-12 rounded-xl border-2 focus:border-[var(--c-blue)] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[var(--c-blue)] file:text-white"
                />
                <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {channelFile && (
                <p className="text-sm text-green-600">Attached: {channelFile.name}</p>
              )}
            </div>

            {/* ICP Management */}
            <div className="flex gap-3">
              <ICPModal onSave={handleICPSave} />
              <Button onClick={downloadICPData} variant="outline" className="flex-1 h-12 rounded-xl border-2">
                <Download className="w-5 h-5 mr-3" />
                Download ICP CSV
              </Button>
            </div>

            {/* Advanced Defaults */}
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-[var(--c-text)] hover:text-[var(--c-blue)] font-medium">
                <ChevronDown className={`w-5 h-5 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                Advanced defaults
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="showRate" className="text-[var(--c-text)] font-medium">Show-Up Rate (%)</Label>
                    <Input
                      id="showRate"
                      type="number"
                      value={showRate}
                      onChange={(e) => setShowRate(Number(e.target.value))}
                      className="text-right h-10 rounded-lg border-2 focus:border-[var(--c-blue)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salPerMtg" className="text-[var(--c-text)] font-medium">SAL per Meeting (%)</Label>
                    <Input
                      id="salPerMtg"
                      type="number"
                      value={salPerMtg}
                      onChange={(e) => setSalPerMtg(Number(e.target.value))}
                      className="text-right h-10 rounded-lg border-2 focus:border-[var(--c-blue)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emReply" className="text-[var(--c-text)] font-medium">Email Reply Rate (%)</Label>
                    <Input
                      id="emReply"
                      type="number"
                      value={emReply}
                      onChange={(e) => setEmReply(Number(e.target.value))}
                      className="text-right h-10 rounded-lg border-2 focus:border-[var(--c-blue)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emPositive" className="text-[var(--c-text)] font-medium">Email Positive-Share (%)</Label>
                    <Input
                      id="emPositive"
                      type="number"
                      value={emPositive}
                      onChange={(e) => setEmPositive(Number(e.target.value))}
                      className="text-right h-10 rounded-lg border-2 focus:border-[var(--c-blue)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liReply" className="text-[var(--c-text)] font-medium">LinkedIn Reply Rate (%)</Label>
                    <Input
                      id="liReply"
                      type="number"
                      value={liReply}
                      onChange={(e) => setLiReply(Number(e.target.value))}
                      className="text-right h-10 rounded-lg border-2 focus:border-[var(--c-blue)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liPositive" className="text-[var(--c-text)] font-medium">LinkedIn Positive-Share (%)</Label>
                    <Input
                      id="liPositive"
                      type="number"
                      value={liPositive}
                      onChange={(e) => setLiPositive(Number(e.target.value))}
                      className="text-right h-10 rounded-lg border-2 focus:border-[var(--c-blue)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liAccept" className="text-[var(--c-text)] font-medium">LinkedIn Connection-Acceptance (%)</Label>
                    <Input
                      id="liAccept"
                      type="number"
                      value={liAccept}
                      onChange={(e) => setLiAccept(Number(e.target.value))}
                      className="text-right h-10 rounded-lg border-2 focus:border-[var(--c-blue)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="connectionRatio" className="text-[var(--c-text)] font-medium">Connection→Contact Ratio</Label>
                    <Input
                      id="connectionRatio"
                      type="number"
                      step="0.1"
                      value={connectionRatio}
                      onChange={(e) => setConnectionRatio(Number(e.target.value))}
                      className="text-right h-10 rounded-lg border-2 focus:border-[var(--c-blue)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="verifiedRt" className="text-[var(--c-text)] font-medium">Verified Contacts / TAM (%)</Label>
                    <Input
                      id="verifiedRt"
                      type="number"
                      value={verifiedRt}
                      onChange={(e) => setVerifiedRt(Number(e.target.value))}
                      className="text-right h-10 rounded-lg border-2 focus:border-[var(--c-blue)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupRate" className="text-[var(--c-text)] font-medium">Call Pickup Rate (%)</Label>
                    <Input
                      id="pickupRate"
                      type="number"
                      value={pickupRate}
                      onChange={(e) => setPickupRate(Number(e.target.value))}
                      className="text-right h-10 rounded-lg border-2 focus:border-[var(--c-blue)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentRate" className="text-[var(--c-text)] font-medium">Call Appointment Rate (%)</Label>
                    <Input
                      id="appointmentRate"
                      type="number"
                      step="0.1"
                      value={appointmentRate}
                      onChange={(e)=> setAppointmentRate(Number(e.target.value))}
                      className="text-right h-10 rounded-lg border-2 focus:border-[var(--c-blue)]"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button onClick={calculate} className="btn-blue w-full mt-8" size="lg">
              <Calculator className="w-5 h-5 mr-3" />
              Calculate Pipeline
            </Button>
          </CardContent>
        </Card>

        {/* ICP Summary */}
        {displayedPersonas.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--c-blue-dark)]">ICP Summary ({displayedPersonas.length} personas)</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPersonas.map((persona, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white border-2 hover:border-[var(--c-blue)]">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-3 text-[var(--c-blue-dark)]">{persona.personaGroup}</h3>
                      <p className="text-sm text-gray-600 mb-2">Seniority: {persona.seniority.join(', ')}</p>
                      <p className="text-[var(--c-text)] mb-4 leading-relaxed">{persona.painPoint}</p>
                      <p className="font-semibold mb-4 text-[var(--c-text)]">{persona.benefitFeature}</p>
                      <div className="flex justify-between items-center">
                        <span className={getUmbrellaColor(persona.umbrella)}>
                          {persona.umbrella}
                        </span>
                        <span className="text-sm text-gray-500">{persona.socialGroup}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Campaign Toggle */}
        {results && (
          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="campaignLive" className="text-lg font-semibold text-[var(--c-text)]">Campaign Live</Label>
                  <p className="text-sm text-gray-600">Toggle when your campaign goes live to access reporting</p>
                </div>
                <Switch
                  id="campaignLive"
                  checked={campaignLive}
                  onCheckedChange={setCampaignLive}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Panel or Report Button */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              {campaignLive ? (
                <Card className="card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-[var(--c-blue-dark)]">
                      <TrendingUp className="w-6 h-6" />
                      Campaign is Live!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <p className="text-lg mb-6 text-[var(--c-text)]">Your campaign is now live. View real-time performance data in the report dashboard.</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                      <Link to="/report">
                        <Button className="btn-blue" size="lg">
                          Go to Report Dashboard
                        </Button>
                      </Link>
                      <Link to="/mis-tracking">
                        <Button className="btn-green" size="lg">
                          Go to MIS Tracking
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-[var(--c-blue-dark)]">
                      <TrendingUp className="w-6 h-6" />
                      Pipeline Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b-2 border-gray-100">
                        <span className="font-semibold text-lg">Meetings to Book (PQLs)</span>
                        <span className="text-right text-lg font-bold text-[var(--c-blue)]">{formatNumber(results.Y)}</span>
                      </div>
                      
                      {channels !== 'Email' && channels !== 'Call' && (
                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="font-medium">Meetings via LinkedIn</span>
                          <span className="text-right font-semibold">{formatNumber(results.Y_li)}</span>
                        </div>
                      )}
                      
                      {channels !== 'LinkedIn' && channels !== 'Call' && (
                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="font-medium">Meetings via Email</span>
                          <span className="text-right font-semibold">{formatNumber(results.Y_em)}</span>
                        </div>
                      )}

                      {channels !== 'LinkedIn' && channels !== 'Email' && (
                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="font-medium">Meetings via Call</span>
                          <span className="text-right font-semibold">{formatNumber(results.Y_call)}</span>
                        </div>
                      )}
                      
                      {channels !== 'Email' && channels !== 'Call' && (
                        <>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="font-medium">Positive Replies LinkedIn</span>
                            <span className="text-right font-semibold">{formatNumber(results.PosLI)}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="font-medium">Total Replies LinkedIn</span>
                            <span className="text-right font-semibold">{formatNumber(results.RepLI)}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="font-medium">Connection Requests to Send</span>
                            <span className="text-right font-semibold">{formatNumber(results.ConnReq)}</span>
                          </div>
                        </>
                      )}
                      
                      {channels !== 'LinkedIn' && channels !== 'Call' && (
                        <>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="font-medium">Positive Replies Email</span>
                            <span className="text-right font-semibold">{formatNumber(results.PosEM)}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="font-medium">Total Replies Email</span>
                            <span className="text-right font-semibold">{formatNumber(results.RepEM)}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="font-medium">Email Contacts Required</span>
                            <span className="text-right font-semibold">{formatNumber(results.VerEM)}</span>
                          </div>
                        </>
                      )}

                      {channels !== 'LinkedIn' && channels !== 'Email' && (
                        <>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="font-medium">Positive Responses from Calls</span>
                            <span className="text-right font-semibold">{formatNumber(results.PosCall)}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="font-medium">Total Responses from Calls</span>
                            <span className="text-right font-semibold">{formatNumber(results.RepCall)}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="font-medium">Phone Contacts Required</span>
                            <span className="text-right font-semibold">{formatNumber(results.VerCall)}</span>
                          </div>
                        </>
                      )}
                      
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium">Required TAM LinkedIn</span>
                        <span className="text-right font-semibold">{formatNumber(results.TAM_LI)}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium">Required TAM Email</span>
                        <span className="text-right font-semibold">{formatNumber(results.TAM_EM)}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium">Required TAM Call</span>
                        <span className="text-right font-semibold">{formatNumber(results.TAM_Call)}</span>
                      </div>
                      
                      {channels !== 'Email' && channels !== 'Call' && (
                        <div className={`flex justify-between py-3 border-b border-gray-100 ${results.capOK !== 'OK' ? 'text-red-500' : 'text-emerald-500'}`}>
                          <span className="flex items-center gap-2 font-medium">
                            {results.capOK === 'OK' ? 
                              <CheckCircle className="w-5 h-5" /> : 
                              <AlertTriangle className="w-5 h-5" />
                            }
                            LinkedIn Capacity Check
                          </span>
                          <span className="text-right font-bold">{results.capOK}</span>
                        </div>
                      )}

                      {channels !== 'LinkedIn' && channels !== 'Email' && (
                        <div className={`flex justify-between py-3 border-b border-gray-100 ${results.capOK_Call !== 'OK' ? 'text-red-500' : 'text-emerald-500'}`}>
                          <span className="flex items-center gap-2 font-medium">
                            {results.capOK_Call === 'OK' ? 
                              <CheckCircle className="w-5 h-5" /> : 
                              <AlertTriangle className="w-5 h-5" />
                            }
                            Call Capacity Check
                          </span>
                          <span className="text-right font-bold">{results.capOK_Call}</span>
                        </div>
                      )}

                      <div className="flex justify-center py-4">
                        <Button onClick={downloadPipelineResults} className="btn-blue">
                          <Download className="w-4 h-4 mr-2" />
                          Download Pipeline CSV
                        </Button>
                      </div>
                      
                      <div className="flex justify-between py-4 border-t-2 border-[var(--c-blue)] bg-gradient-to-r from-blue-50 to-green-50 px-4 rounded-xl">
                        <span className="font-bold text-xl">Estimated Pipeline Value</span>
                        <span className="text-right font-bold text-xl text-[var(--c-blue)]">
                          {formatCurrency(results.pipeline)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline Message */}
        {results && (
          <div className="text-center">
            <p className="text-lg text-[var(--c-text)] bg-blue-50 p-4 rounded-xl border border-blue-200">
              {getTimelineMessage()}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-[var(--c-gray)]">
          <p>Benchmarks: email reply 3%, LI reply 20%, call pickup 22%, appointment 2.3%. Edit under Advanced.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
