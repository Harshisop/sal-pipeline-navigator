import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@supabase/auth-helpers-react';
import { Link } from 'react-router-dom';

interface ResultsType {
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
}

const Index = () => {
  const [targetSales, setTargetSales] = useState<number>(100000);
  const [timelineMonths, setTimelineMonths] = useState<number>(6);
  const [results, setResults] = useState<ResultsType>({
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
  });
  const { toast } = useToast();
  const user = useUser();

  const calculatePipeline = () => {
    const meetingsNeeded = targetSales / 1000;
    const meetingsLinkedIn = meetingsNeeded * 0.6;
    const meetingsEmail = meetingsNeeded * 0.3;
    const meetingsCall = meetingsNeeded * 0.1;
    const positiveRepliesLinkedIn = meetingsLinkedIn * 5;
    const totalRepliesLinkedIn = positiveRepliesLinkedIn * 3;
    const connectionRequests = totalRepliesLinkedIn * 5;
    const positiveRepliesEmail = meetingsEmail * 3;
    const totalRepliesEmail = positiveRepliesEmail * 4;
    const emailContacts = totalRepliesEmail * 6;
    const positiveCallResponses = meetingsCall * 2;
    const totalCallResponses = positiveCallResponses * 7;
    const phoneContacts = totalCallResponses * 4;
    const totalAddressableMarketLinkedIn = connectionRequests * 2.5;
    const totalAddressableMarketEmail = emailContacts * 2.5;
    const totalAddressableMarketCall = phoneContacts * 2.5;

    setResults({
      Y: Math.round(meetingsNeeded),
      Y_li: Math.round(meetingsLinkedIn),
      Y_em: Math.round(meetingsEmail),
      Y_call: Math.round(meetingsCall),
      PosLI: Math.round(positiveRepliesLinkedIn),
      RepLI: Math.round(totalRepliesLinkedIn),
      ConnReq: Math.round(connectionRequests),
      PosEM: Math.round(positiveRepliesEmail),
      RepEM: Math.round(totalRepliesEmail),
      EmailContacts: Math.round(emailContacts),
      PosCall: Math.round(positiveCallResponses),
      TotalCallResp: Math.round(totalCallResponses),
      PhoneContactsReq: Math.round(phoneContacts),
      TAM_LI: Math.round(totalAddressableMarketLinkedIn),
      TAM_EM: Math.round(totalAddressableMarketEmail),
      TAM_Call: Math.round(totalAddressableMarketCall),
    });
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your pipeline data.",
        variant: "destructive",
      });
      return;
    }

    try {
      const calculatedData = {
        Y: results.Y,
        Y_li: results.Y_li,
        Y_em: results.Y_em,
        Y_call: results.Y_call,
        PosLI: results.PosLI,
        RepLI: results.RepLI,
        ConnReq: results.ConnReq,
        PosEM: results.PosEM,
        RepEM: results.RepEM,
        EmailContacts: results.EmailContacts,
        PosCall: results.PosCall,
        TotalCallResp: results.TotalCallResp,
        PhoneContactsReq: results.PhoneContactsReq,
        TAM_LI: results.TAM_LI,
        TAM_EM: results.TAM_EM,
        TAM_Call: results.TAM_Call,
      };

      const { error } = await supabase.from('pipeline_reports').insert([
        {
          calculated_data: calculatedData as any,
          target_sales: targetSales,
          expected_timeline_months: timelineMonths,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pipeline data saved successfully!",
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Failed to save pipeline data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--c-bg)] text-[var(--c-text)] p-8 space-y-6">
      {/* Header */}
      <header className="w-full text-center">
        <h1 className="text-3xl font-bold text-[var(--c-blue-dark)] mb-2">
          B2B Pipeline Calculator
        </h1>
        <p className="text-md text-gray-600">
          Plan your outreach strategy for predictable revenue
        </p>
      </header>

      {/* Input Section */}
      <section className="w-full max-w-md space-y-4">
        {/* Target Sales Input */}
        <Card>
          <CardHeader>
            <CardTitle>Target Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="targetSales">Enter Target Sales ($)</Label>
              <Input
                type="number"
                id="targetSales"
                placeholder="Enter target sales"
                value={targetSales}
                onChange={(e) => setTargetSales(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Timeline Slider */}
        <Card>
          <CardHeader>
            <CardTitle>Expected Timeline</CardTitle>
            {/* <CardDescription>Set the expected timeline in months.</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="timeline">Select Timeline (Months)</Label>
              <Slider
                id="timeline"
                defaultValue={[timelineMonths]}
                max={24}
                step={1}
                onValueChange={(value) => setTimelineMonths(value[0])}
              />
              <p className="text-sm text-muted-foreground">
                Selected Timeline: {timelineMonths} Months
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Calculate Button */}
      <Button size="lg" onClick={calculatePipeline}>
        Calculate Pipeline
      </Button>

      {/* Results Section */}
      {results.Y > 0 && (
        <section className="w-full max-w-lg space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calculated Pipeline Metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <Label>Meetings to Book (PQLs):</Label>
                <p className="font-semibold">{results.Y.toLocaleString()}</p>
              </div>
              <div>
                <Label>Meetings via LinkedIn:</Label>
                <p className="font-semibold">{results.Y_li.toLocaleString()}</p>
              </div>
              <div>
                <Label>Meetings via Email:</Label>
                <p className="font-semibold">{results.Y_em.toLocaleString()}</p>
              </div>
              <div>
                <Label>Meetings via Call:</Label>
                <p className="font-semibold">{results.Y_call.toLocaleString()}</p>
              </div>
              <div>
                <Label>Positive Replies LinkedIn:</Label>
                <p className="font-semibold">{results.PosLI.toLocaleString()}</p>
              </div>
              <div>
                <Label>Total Replies LinkedIn:</Label>
                <p className="font-semibold">{results.RepLI.toLocaleString()}</p>
              </div>
              <div>
                <Label>Connection Requests to Send (LinkedIn):</Label>
                <p className="font-semibold">{results.ConnReq.toLocaleString()}</p>
              </div>
              <div>
                <Label>Positive Replies Email:</Label>
                <p className="font-semibold">{results.PosEM.toLocaleString()}</p>
              </div>
              <div>
                <Label>Total Replies Email:</Label>
                <p className="font-semibold">{results.RepEM.toLocaleString()}</p>
              </div>
              <div>
                <Label>Email Contacts Required:</Label>
                <p className="font-semibold">{results.EmailContacts.toLocaleString()}</p>
              </div>
              <div>
                <Label>Positive Responses from Call:</Label>
                <p className="font-semibold">{results.PosCall.toLocaleString()}</p>
              </div>
              <div>
                <Label>Total Responses from Call:</Label>
                <p className="font-semibold">{results.TotalCallResp.toLocaleString()}</p>
              </div>
              <div>
                <Label>Phone Contacts Required (Call):</Label>
                <p className="font-semibold">{results.PhoneContactsReq.toLocaleString()}</p>
              </div>
              <div>
                <Label>Required TAM LinkedIn:</Label>
                <p className="font-semibold">{results.TAM_LI.toLocaleString()}</p>
              </div>
              <div>
                <Label>Required TAM Email:</Label>
                <p className="font-semibold">{results.TAM_EM.toLocaleString()}</p>
              </div>
              <div>
                <Label>Required TAM Call:</Label>
                <p className="font-semibold">{results.TAM_Call.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Save and Report Buttons */}
          <div className="flex justify-between">
            <Button onClick={handleSave}>Save to Dashboard</Button>
            <Link to="/report">
              <Button variant="secondary">
                View Report
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
