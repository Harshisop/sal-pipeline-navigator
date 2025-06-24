

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ReactFlow, Node, Edge, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase } from '@/integrations/supabase/client';

interface Results {
  Y: number;
  Y_li: number;
  Y_em: number;
  Y_call: number;
  PosLI: number;
  RepLI: number;
  ConnReq: number;
  PosEM: number;
  RepEM: number;
  EmailContacts: number;
  PosCall: number;
  TotalCallResp: number;
  PhoneContactsReq: number;
  TAM_LI: number;
  TAM_EM: number;
  TAM_Call: number;
  capOK_LI: number;
  capOK_Call: number;
  pipeline: number;
}

const defaultResults: Results = {
  Y: 0,
  Y_li: 0,
  Y_em: 0,
  Y_call: 0,
  PosLI: 0,
  RepLI: 0,
  ConnReq: 0,
  PosEM: 0,
  RepEM: 0,
  EmailContacts: 0,
  PosCall: 0,
  TotalCallResp: 0,
  PhoneContactsReq: 0,
  TAM_LI: 0,
  TAM_EM: 0,
  TAM_Call: 0,
  capOK_LI: 0,
  capOK_Call: 0,
  pipeline: 0
};

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Input Node' }, position: { x: 250, y: 25 } },
  { id: '2', data: { label: 'Default Node' }, position: { x: 100, y: 125 } },
  { id: '3', data: { label: 'Default Node' }, position: { x: 400, y: 125 } },
  { id: '4', type: 'output', data: { label: 'Output Node' }, position: { x: 250, y: 250 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' }
];

const Index = () => {
  const [salGoal, setSalGoal] = useState<number | undefined>(undefined);
  const [valueSal, setValueSal] = useState<number | undefined>(undefined);
  const [period, setPeriod] = useState<string>("3");
  const [results, setResults] = useState<Results>(defaultResults);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isMindMapOpen, setIsMindMapOpen] = useState(false);

  const calculate = async () => {
    const periodMonths: number = Number(period);
    
    if (!salGoal || !periodMonths) {
      toast.error('Please fill in all required fields');
      return;
    }

    const Y = salGoal;
    const Y_li = Math.ceil(Y * 0.2);
    const Y_em = Math.ceil(Y * 0.3);
    const Y_call = Math.ceil(Y * 0.5);

    const PosLI = Math.ceil(Y_li * 4);
    const RepLI = Math.ceil(PosLI * 2.5);
    const ConnReq = Math.ceil(RepLI * 2);

    const PosEM = Math.ceil(Y_em * 4);
    const RepEM = Math.ceil(PosEM * 3.3);
    const EmailContacts = Math.ceil(RepEM * 1.6);

    const PosCall = Math.ceil(Y_call * 4);
    const TotalCallResp = Math.ceil(PosCall * 2.5);
    const PhoneContactsReq = Math.ceil(TotalCallResp * 3);

    const TAM_LI = ConnReq;
    const TAM_EM = EmailContacts;
    const TAM_Call = PhoneContactsReq;

    const capOK_LI = Math.ceil(PosLI / ConnReq * 100);
    const capOK_Call = Math.ceil(PosCall / PhoneContactsReq * 100);

    const pipeline = salGoal * (valueSal || 0);

    const calculatedResults = {
      Y,
      Y_li,
      Y_em,
      Y_call,
      PosLI,
      RepLI,
      ConnReq,
      PosEM,
      RepEM,
      EmailContacts,
      PosCall,
      TotalCallResp,
      PhoneContactsReq,
      TAM_LI,
      TAM_EM,
      TAM_Call,
      capOK_LI,
      capOK_Call,
      pipeline
    };

    setResults(calculatedResults);

    // Auto-save campaign and weekly targets to Supabase
    try {
      const startDate = new Date().toISOString().split('T')[0]; // today as start date
      
      // Create or update campaign
      const { data: camp, error: campError } = await supabase
        .from("campaigns")
        .upsert({
          name: `Campaign ${periodMonths}M ${new Date().toLocaleDateString()}`,
          go_live: startDate,
          period_months: periodMonths
        }, { onConflict: "name" })
        .select()
        .single();

      if (campError) throw campError;

      // Helper functions for breaking down targets
      const perMonth = (tot: number) => Math.ceil(tot / periodMonths);
      const weekify = (mTot: number) => Math.ceil(mTot / 4);

      // Define target KPIs to save
      const targets = [
        ["Meetings via LinkedIn", calculatedResults.Y_li],
        ["Meetings via Email", calculatedResults.Y_em],
        ["Meetings via Call", calculatedResults.Y_call],
        ["Positive Replies LinkedIn", calculatedResults.PosLI],
        ["Total Replies LinkedIn", calculatedResults.RepLI],
        ["Connection Requests to Send (LinkedIn)", calculatedResults.ConnReq],
        ["Positive Replies Email", calculatedResults.PosEM],
        ["Total Replies Email", calculatedResults.RepEM],
        ["Email Contacts Required", calculatedResults.EmailContacts],
        ["Positive Responses from Call", calculatedResults.PosCall],
        ["Total Responses from Call", calculatedResults.TotalCallResp],
        ["Phone Contacts Required (Call)", calculatedResults.PhoneContactsReq]
      ];

      // Generate weekly target rows
      const rows = [];
      for (let m = 0; m < periodMonths; m++) {
        targets.forEach(([kpi, totalValue]) => {
          const monthlyTotal = perMonth(totalValue);
          const weeklyTotal = weekify(monthlyTotal);
          for (let week = 1; week <= 4; week++) {
            const targetDate = new Date(startDate);
            targetDate.setMonth(targetDate.getMonth() + m);
            
            rows.push({
              campaign_id: camp.id,
              kpi: kpi,
              year: targetDate.getFullYear(),
              month: targetDate.getMonth() + 1,
              week: week,
              target: weeklyTotal,
              achieved: 0
            });
          }
        });
      }

      // UPSERT rows (prevents duplicates on recalculation)
      const { error: rowsError } = await supabase
        .from("roi_weeks")
        .upsert(rows, { onConflict: "campaign_id,kpi,year,month,week" });

      if (rowsError) throw rowsError;

      toast.success('Targets calculated and saved successfully!');
    } catch (error) {
      console.error('Error saving targets:', error);
      toast.error('Calculation completed but failed to save targets');
    }
  };

  useEffect(() => {
    const periodMonths = Number(period); // Convert string to number for calculations
    
    // Define new nodes based on results
    const newNodes: Node[] = [
      { id: 'salGoal', data: { label: `Sales Goal: ${salGoal}` }, position: { x: 50, y: 50 } },
      { id: 'valueSal', data: { label: `Value per Sale: ${valueSal}` }, position: { x: 250, y: 50 } },
      { id: 'period', data: { label: `Period (Months): ${periodMonths}` }, position: { x: 450, y: 50 } },
      { id: 'Y', data: { label: `Total Meetings: ${results.Y}` }, position: { x: 250, y: 150 } },
      { id: 'Y_li', data: { label: `LinkedIn Meetings: ${results.Y_li}` }, position: { x: 50, y: 250 } },
      { id: 'Y_em', data: { label: `Email Meetings: ${results.Y_em}` }, position: { x: 250, y: 250 } },
      { id: 'Y_call', data: { label: `Call Meetings: ${results.Y_call}` }, position: { x: 450, y: 250 } },
      { id: 'pipeline', data: { label: `Pipeline Value: ${results.pipeline}` }, position: { x: 250, y: 350 } },
    ];

    const newEdges: Edge[] = [
      { id: 'e1-4', source: 'salGoal', target: 'Y' },
      { id: 'e2-4', source: 'valueSal', target: 'Y' },
      { id: 'e3-4', source: 'period', target: 'Y' },
      { id: 'e4-5', source: 'Y', target: 'Y_li' },
      { id: 'e4-6', source: 'Y', target: 'Y_em' },
      { id: 'e4-7', source: 'Y', target: 'Y_call' },
      { id: 'e4-8', source: 'Y', target: 'pipeline' },
    ];

    setNodes(newNodes);
    setEdges(newEdges);
  }, [salGoal, valueSal, period, results]);

  const downloadCSV = () => {
    const csvRows = [];
    const headers = Object.keys(defaultResults);
    csvRows.push(headers.join(','));

    const values = Object.values(results);
    csvRows.push(values.join(','));

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'results.csv');
    a.click();
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Marketing Campaign Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="salesGoal">Sales Goal</Label>
              <Input
                type="number"
                id="salesGoal"
                placeholder="Enter sales goal"
                onChange={(e) => setSalGoal(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="valuePerSale">Value per Sale</Label>
              <Input
                type="number"
                id="valuePerSale"
                placeholder="Enter value per sale"
                onChange={(e) => setValueSal(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="campaignPeriod">Campaign Period (Months)</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={calculate}>Calculate</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>Total Meetings: {results.Y}</div>
            <div>LinkedIn Meetings: {results.Y_li}</div>
            <div>Email Meetings: {results.Y_em}</div>
            <div>Call Meetings: {results.Y_call}</div>
            <div>Pipeline Value: {results.pipeline}</div>
          </div>
          <Button className="mt-4" onClick={downloadCSV}>Download CSV</Button>
          <Button className="mt-4" onClick={() => setIsMindMapOpen(true)}>View Mind Map</Button>
        </CardContent>
      </Card>

      <Dialog open={isMindMapOpen} onOpenChange={setIsMindMapOpen}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle>Mind Map</DialogTitle>
          </DialogHeader>
          <div style={{ width: '800px', height: '600px' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              style={{ backgroundColor: '#f0f0f0' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
