import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Upload, AlertTriangle, CheckCircle, Calculator, TrendingUp, Download, Mail, Linkedin } from 'lucide-react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';
import ICPModal from '@/components/ICPModal';

interface Results {
  Y: number;
  Y_li: number;
  Y_em: number;
  PosLI: number;
  PosEM: number;
  RepLI: number;
  RepEM: number;
  VerEM: number;
  VerLI: number;
  TAM_EM: number;
  TAM_LI: number;
  ConnReq: number;
  capOK: string;
  pipeline: number;
}

interface ICPData {
  persona: string;
  problem: string;
  benefit: string;
  umbrella: string;
}

interface CSVPersonaData {
  Persona: string;
  Problem: string;
  Benefit: string;
  Umbrella: string;
}

const Index = () => {
  const { toast } = useToast();
  
  // Form state
  const [salGoal, setSalGoal] = useState<number>(100);
  const [valueSal, setValueSal] = useState<number>(50000);
  const [channels, setChannels] = useState<string>('Both');
  const [liAccts, setLiAccts] = useState<number>(4);
  const [splitLI, setSplitLI] = useState<number>(60);
  const [splitEM, setSplitEM] = useState<number>(40);
  
  // Advanced defaults
  const [showRate, setShowRate] = useState<number>(60);
  const [salPerMtg, setSalPerMtg] = useState<number>(50);
  const [emReply, setEmReply] = useState<number>(3);
  const [emPositive, setEmPositive] = useState<number>(30);
  const [liReply, setLiReply] = useState<number>(20);
  const [liPositive, setLiPositive] = useState<number>(35);
  const [liAccept, setLiAccept] = useState<number>(30);
  const [verifiedRt, setVerifiedRt] = useState<number>(40);
  
  // ICP and results state
  const [icpRows, setIcpRows] = useState<ICPData[]>([]);
  const [csvRows, setCsvRows] = useState<CSVPersonaData[]>([]);
  const [results, setResults] = useState<Results | null>(null);
  
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
    if (channels === 'Both' && splitLI + splitEM !== 100) {
      toast({
        title: "Validation Error",
        description: "LinkedIn and Email percentages must add up to 100%",
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
    const pctLI = channels === "Email" ? 0 : channels === "LinkedIn" ? 100 : +splitLI;
    const pctEM = channels === "LinkedIn" ? 0 : channels === "Email" ? 100 : +splitEM;

    const Y = X / (show * salPM);
    const Y_li = Y * pctLI / 100;
    const Y_em = Y * pctEM / 100;

    const PosLI = Y_li / show;
    const PosEM = Y_em / show;

    const RepLI = PosLI / (liPositive / 100);
    const RepEM = PosEM / (emPositive / 100);

    const VerEM = RepEM / (emReply / 100);
    const liMsgs = RepLI / (liReply / 100);
    const ConnReq = liMsgs / (liAccept / 100);
    const VerLI = ConnReq;

    const TAM_EM = VerEM / (verifiedRt / 100);
    const TAM_LI = VerLI / (verifiedRt / 100);

    const capOK = ConnReq <= (+liAccts * 500 * 3) ? "OK" : "Exceeds capacity";
    const pipeline = X * V;

    const newResults: Results = {
      Y, Y_li, Y_em, PosLI, PosEM, RepLI, RepEM,
      VerEM, VerLI, TAM_EM, TAM_LI, ConnReq,
      capOK, pipeline
    };

    setResults(newResults);
  };

  const handleICPSave = (data: ICPData) => {
    setIcpRows(prev => [...prev, data]);
    toast({
      title: "ICP Added",
      description: `Added ${data.persona} to your ICP list`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data as CSVPersonaData[];
        const validData = data.filter(row => row.Persona && row.Problem && row.Benefit && row.Umbrella);
        setCsvRows(validData);
        setIcpRows([]); // Clear manual entries when CSV is uploaded
        toast({
          title: "CSV Uploaded",
          description: `Successfully loaded ${validData.length} persona(s)`,
        });
      },
      error: (error) => {
        toast({
          title: "Upload Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const downloadResults = () => {
    if (!results) return;
    
    const csvContent = [
      ['Metric', 'Value'],
      ['Meetings to Book (PQLs)', formatNumber(results.Y)],
      ['Meetings via LinkedIn', formatNumber(results.Y_li)],
      ['Meetings via Email', formatNumber(results.Y_em)],
      ['Positive Replies LinkedIn', formatNumber(results.PosLI)],
      ['Positive Replies Email', formatNumber(results.PosEM)],
      ['Total Replies LinkedIn', formatNumber(results.RepLI)],
      ['Total Replies Email', formatNumber(results.RepEM)],
      ['Verified Contacts LinkedIn', formatNumber(results.VerLI)],
      ['Verified Contacts Email', formatNumber(results.VerEM)],
      ['Required TAM LinkedIn', formatNumber(results.TAM_LI)],
      ['Required TAM Email', formatNumber(results.TAM_EM)],
      ['LinkedIn Capacity Check', results.capOK],
      ['Estimated Pipeline Value', formatCurrency(results.pipeline)]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sal-pipeline-results.csv';
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

  const displayedPersonas = csvRows.length > 0 ? csvRows.map(row => ({
    persona: row.Persona,
    problem: row.Problem,
    benefit: row.Benefit,
    umbrella: row.Umbrella
  })) : icpRows;

  return (
    <div className="min-h-screen bg-[var(--c-bg)]">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="https://www.cience.com/hubfs/cience-logo-2023.svg" 
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
            {/* Basic Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="salGoal" className="text-[var(--c-text)] font-medium">Target SALs (next 3 months)</Label>
                <Input
                  id="salGoal"
                  type="number"
                  value={salGoal}
                  onChange={(e) => setSalGoal(Number(e.target.value))}
                  className="text-right text-lg h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
                />
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
            </div>

            <div className="space-y-4">
              <Label className="text-[var(--c-text)] font-medium">Outreach channel(s)</Label>
              <RadioGroup value={channels} onValueChange={setChannels} className="grid grid-cols-3 gap-4">
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
                  <RadioGroupItem value="Both" id="both" />
                  <Label htmlFor="both" className="cursor-pointer">Both</Label>
                </div>
              </RadioGroup>
            </div>

            {(channels === 'LinkedIn' || channels === 'Both') && (
              <div className="space-y-2">
                <Label htmlFor="liAccts" className="text-[var(--c-text)] font-medium"># LinkedIn SDR accounts</Label>
                <Input
                  id="liAccts"
                  type="number"
                  placeholder="4"
                  value={liAccts}
                  onChange={(e) => setLiAccts(Number(e.target.value))}
                  className="text-right text-lg h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
                />
              </div>
            )}

            {channels === 'Both' && (
              <div className="grid grid-cols-2 gap-6">
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
              </div>
            )}

            {/* ICP Management */}
            <ICPModal onSave={handleICPSave} />

            {/* CSV Upload */}
            <div className="space-y-4">
              <Label htmlFor="csvUpload" className="block text-[var(--c-text)] font-medium">Upload ICP CSV (optional, overrides manual rows)</Label>
              <div className="border-2 border-dashed border-[var(--c-blue)] rounded-xl p-8 text-center hover:border-[var(--c-blue-dark)] transition-colors bg-[var(--c-gray-light)]">
                <Input
                  id="csvUpload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Label htmlFor="csvUpload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-[var(--c-blue)]" />
                  <p className="text-[var(--c-text)] font-medium">Click to upload CSV file</p>
                  <p className="text-sm text-[var(--c-gray)] mt-2">Expected columns: Persona, Problem, Benefit, Umbrella</p>
                </Label>
              </div>
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
                    <Label htmlFor="liAccept" className="text-[var(--c-text)] font-medium">LinkedIn Acceptance Rate (%)</Label>
                    <Input
                      id="liAccept"
                      type="number"
                      value={liAccept}
                      onChange={(e) => setLiAccept(Number(e.target.value))}
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
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button onClick={calculate} className="btn-blue w-full mt-8" size="lg">
              <Calculator className="w-5 h-5 mr-3" />
              Calculate Pipeline
            </Button>
          </CardContent>
        </Card>

        {/* ICP Summary (when personas exist) */}
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
                      <h3 className="font-bold text-xl mb-3 text-[var(--c-blue-dark)]">{persona.persona}</h3>
                      <p className="text-[var(--c-text)] mb-4 leading-relaxed">{persona.problem}</p>
                      <p className="font-semibold mb-4 text-[var(--c-text)]">{persona.benefit}</p>
                      <span className={getUmbrellaColor(persona.umbrella)}>
                        {persona.umbrella}
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Results Panel */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-[var(--c-blue-dark)]">
                    <TrendingUp className="w-6 h-6" />
                    Pipeline Results
                    <Button onClick={downloadResults} variant="outline" size="sm" className="ml-auto rounded-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b-2 border-gray-100">
                      <span className="font-semibold text-lg">Meetings to Book (PQLs)</span>
                      <span className="text-right text-lg font-bold text-[var(--c-blue)]">{formatNumber(results.Y)}</span>
                    </div>
                    
                    {channels !== 'Email' && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium">Meetings via LinkedIn</span>
                        <span className="text-right font-semibold">{formatNumber(results.Y_li)}</span>
                      </div>
                    )}
                    
                    {channels !== 'LinkedIn' && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium">Meetings via Email</span>
                        <span className="text-right font-semibold">{formatNumber(results.Y_em)}</span>
                      </div>
                    )}
                    
                    {channels !== 'Email' && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium">Positive Replies LinkedIn</span>
                        <span className="text-right font-semibold">{formatNumber(results.PosLI)}</span>
                      </div>
                    )}
                    
                    {channels !== 'LinkedIn' && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium">Positive Replies Email</span>
                        <span className="text-right font-semibold">{formatNumber(results.PosEM)}</span>
                      </div>
                    )}
                    
                    {channels !== 'Email' && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium">Total Replies LinkedIn</span>
                        <span className="text-right font-semibold">{formatNumber(results.RepLI)}</span>
                      </div>
                    )}
                    
                    {channels !== 'LinkedIn' && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium">Total Replies Email</span>
                        <span className="text-right font-semibold">{formatNumber(results.RepEM)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium">Verified Contacts</span>
                      <span className="text-right font-semibold">
                        {formatNumber(results.VerLI + results.VerEM)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium">Required TAM</span>
                      <span className="text-right font-semibold">
                        {formatNumber(results.TAM_LI + results.TAM_EM)}
                      </span>
                    </div>
                    
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
                    
                    <div className="flex justify-between py-4 border-t-2 border-[var(--c-blue)] bg-gradient-to-r from-blue-50 to-green-50 px-4 rounded-xl">
                      <span className="font-bold text-xl">Estimated Pipeline Value</span>
                      <span className="text-right font-bold text-xl text-[var(--c-blue)]">
                        {formatCurrency(results.pipeline)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center text-[var(--c-gray)]">
          <p>Benchmarks: email reply 3%, LI reply 20%, etc. Edit under Advanced.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
