
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ReactFlow, Node, Edge, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface ROIWeek {
  id: string;
  campaign_id: string;
  kpi: string;
  year: number;
  month: number;
  week: number;
  target: number;
  achieved: number;
}

interface Campaign {
  id: string;
  name: string;
  go_live: string;
  period_months: number;
}

const ROI = () => {
  const [rows, setRows] = useState<ROIWeek[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load latest campaign and its data
  const loadCampaignData = async () => {
    try {
      setLoading(true);
      
      // Get latest campaign
      const { data: camp, error: campError } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (campError || !camp) {
        toast.error('No campaigns found. Please run the calculator first.');
        return;
      }

      setCurrentCampaign(camp);

      // Get all ROI weeks for this campaign
      const { data: weekData, error: weekError } = await supabase
        .from("roi_weeks")
        .select("*")
        .eq("campaign_id", camp.id)
        .order("year")
        .order("month")
        .order("week");

      if (weekError) throw weekError;

      setRows(weekData || []);
    } catch (error) {
      console.error('Error loading campaign data:', error);
      toast.error('Failed to load campaign data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaignData();
  }, []);

  // Handle achieved value updates
  const handleAchievedEdit = async (row: ROIWeek, newValue: number) => {
    try {
      const { error } = await supabase
        .from("roi_weeks")
        .update({ achieved: newValue })
        .eq("campaign_id", row.campaign_id)
        .eq("kpi", row.kpi)
        .eq("year", row.year)
        .eq("month", row.month)
        .eq("week", row.week);

      if (error) throw error;

      // Update local state
      setRows(rows.map(r => 
        (r.kpi === row.kpi && r.year === row.year && r.month === row.month && r.week === row.week)
          ? { ...r, achieved: newValue }
          : r
      ));

      toast.success('Achieved value updated');
    } catch (error) {
      console.error('Error updating achieved value:', error);
      toast.error('Failed to update achieved value');
    }
  };

  // Calculate month totals
  const monthTotal = (kpi: string, year: number, month: number, field: 'target' | 'achieved') =>
    rows
      .filter(r => r.kpi === kpi && r.year === year && r.month === month)
      .reduce((sum, r) => sum + Number(r[field] || 0), 0);

  // Get unique KPIs
  const uniqueKPIs = [...new Set(rows.map(r => r.kpi))];

  // Get current month data based on offset
  const getCurrentMonthData = () => {
    if (!currentCampaign) return { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
    
    const startDate = new Date(currentCampaign.go_live);
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + monthOffset);
    
    return {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1
    };
  };

  const { year: currentYear, month: currentMonth } = getCurrentMonthData();

  // Generate ladder view nodes for React Flow
  const generateLadderNodes = (): { nodes: Node[], edges: Edge[] } => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    const kpis = [
      "Connection Requests to Send (LinkedIn)",
      "Total Replies LinkedIn", 
      "Positive Replies LinkedIn",
      "Meetings via LinkedIn",
      "Email Contacts Required",
      "Total Replies Email",
      "Positive Replies Email", 
      "Meetings via Email",
      "Phone Contacts Required (Call)",
      "Total Responses from Call",
      "Positive Responses from Call",
      "Meetings via Call"
    ];

    kpis.forEach((kpi, index) => {
      const monthlyTarget = monthTotal(kpi, currentYear, currentMonth, 'target');
      const monthlyAchieved = monthTotal(kpi, currentYear, currentMonth, 'achieved');
      const achievementRate = monthlyTarget > 0 ? (monthlyAchieved / monthlyTarget * 100).toFixed(1) : '0';
      
      nodes.push({
        id: kpi,
        type: 'default',
        position: { x: (index % 3) * 250, y: Math.floor(index / 3) * 100 },
        data: { 
          label: (
            <div className="text-center p-2">
              <div className="font-semibold text-sm">{kpi}</div>
              <div className="text-xs text-gray-600">
                Target: {monthlyTarget} | Achieved: {monthlyAchieved}
              </div>
              <div className="text-xs font-bold">{achievementRate}%</div>
            </div>
          )
        },
        style: {
          background: monthlyAchieved >= monthlyTarget ? '#dcfce7' : '#fef3c7',
          border: '1px solid #ccc',
          borderRadius: '8px',
          width: 200
        }
      });

      if (index < kpis.length - 1) {
        edges.push({
          id: `${kpi}-${kpis[index + 1]}`,
          source: kpi,
          target: kpis[index + 1],
          type: 'smoothstep'
        });
      }
    });

    return { nodes, edges };
  };

  const { nodes, edges } = generateLadderNodes();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!currentCampaign) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">ROI Tracking</h1>
        <Card>
          <CardContent className="p-6">
            <p>No campaigns found. Please run the calculator first to generate data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ROI Tracking</h1>
      
      {/* Campaign Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{currentCampaign.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Start Date: {new Date(currentCampaign.go_live).toLocaleDateString()}</p>
          <p>Duration: {currentCampaign.period_months} months</p>
        </CardContent>
      </Card>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setMonthOffset(Math.max(monthOffset - 1, 0))}
          disabled={monthOffset === 0}
        >
          ← Previous Month
        </Button>
        
        <h2 className="text-xl font-semibold">
          {new Date(currentYear, currentMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        
        <Button 
          onClick={() => setMonthOffset(Math.min(monthOffset + 1, currentCampaign.period_months - 1))}
          disabled={monthOffset >= currentCampaign.period_months - 1}
        >
          Next Month →
        </Button>
      </div>

      {/* KPI Grid */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly KPI Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">KPI</th>
                  <th className="border p-2">Week 1</th>
                  <th className="border p-2">Week 2</th>
                  <th className="border p-2">Week 3</th>
                  <th className="border p-2">Week 4</th>
                  <th className="border p-2">Month Total</th>
                </tr>
              </thead>
              <tbody>
                {uniqueKPIs.map(kpi => (
                  <tr key={kpi}>
                    <td className="border p-2 font-semibold">{kpi}</td>
                    {[1, 2, 3, 4].map(week => {
                      const weekRow = rows.find(r => 
                        r.kpi === kpi && r.year === currentYear && r.month === currentMonth && r.week === week
                      );
                      return (
                        <td key={week} className="border p-2 text-center">
                          <div className="mb-1 text-sm text-gray-600">
                            Target: {weekRow?.target || 0}
                          </div>
                          <Input
                            type="number"
                            value={weekRow?.achieved || 0}
                            onChange={(e) => {
                              if (weekRow) {
                                handleAchievedEdit(weekRow, Number(e.target.value));
                              }
                            }}
                            className="text-center"
                            placeholder="Achieved"
                          />
                        </td>
                      );
                    })}
                    <td className="border p-2 text-center font-semibold">
                      <div>Target: {monthTotal(kpi, currentYear, currentMonth, 'target')}</div>
                      <div>Achieved: {monthTotal(kpi, currentYear, currentMonth, 'achieved')}</div>
                      <div className="text-sm">
                        {monthTotal(kpi, currentYear, currentMonth, 'target') > 0 
                          ? ((monthTotal(kpi, currentYear, currentMonth, 'achieved') / monthTotal(kpi, currentYear, currentMonth, 'target')) * 100).toFixed(1)
                          : 0}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ladder View */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Flow Ladder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] bg-white rounded-xl">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ROI;
