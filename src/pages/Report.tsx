
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

const METRICS = [
  'Meetings to Book (PQLs)',
  'Meetings via LinkedIn',
  'Meetings via Email',
  'Meetings via Call',
  'Positive Replies LinkedIn',
  'Total Replies LinkedIn',
  'Connection Requests to Send (LinkedIn)',
  'Positive Replies Email',
  'Total Replies Email',
  'Email Contacts Required',
  'Positive Responses from Call',
  'Total Responses from Call',
  'Phone Contacts Required (Call)',
  'Required TAM LinkedIn',
  'Required TAM Email',
  'Required TAM Call',
];

const glassStyle =
  'bg-white/70 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl';

const Report = () => {
  const navigate = useNavigate();
  const [achieved, setAchieved] = useState<string[][]>([]);
  const [monthlyAchieved, setMonthlyAchieved] = useState<string[]>([]);
  const [weeks, setWeeks] = useState(0);
  const [months, setMonths] = useState(0);
  const [weeklyTargets, setWeeklyTargets] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);
  const [pipelineData, setPipelineData] = useState<any>(null);

  useEffect(() => {
    const loadPipelineData = () => {
      setLoading(true);
      
      // Try to get pipeline data from localStorage first
      const storedPipeline = localStorage.getItem('currentPipeline');
      if (storedPipeline) {
        const pipeline = JSON.parse(storedPipeline);
        setPipelineData(pipeline);
        setupReportData(pipeline);
      } else {
        // If no stored pipeline, redirect to dashboard
        navigate('/dashboard');
      }
      
      setLoading(false);
    };

    const setupReportData = (pipeline: any) => {
      const m = pipeline.expected_timeline_months || 3;
      const w = m * 4 + 1;
      setMonths(m);
      setWeeks(w);
      
      // For each metric, divide the value from calculated_data across weeks
      const calc = pipeline.calculated_data || {};
      const metricKeys = [
        'Y', 'Y_li', 'Y_em', 'Y_call', 'PosLI', 'RepLI', 'ConnReq',
        'PosEM', 'RepEM', 'EmailContacts', 'PosCall', 'TotalCallResp',
        'PhoneContactsReq', 'TAM_LI', 'TAM_EM', 'TAM_Call',
      ];
      
      const targetsPerMetric: number[][] = metricKeys.map((key) => {
        const total = Math.round(Number(calc[key]) || 0);
        // Distribute total across weeks as evenly as possible
        const base = Math.floor(total / w);
        const remainder = total % w;
        return Array.from({ length: w }).map((_, i) => base + (i < remainder ? 1 : 0));
      });
      
      setWeeklyTargets(targetsPerMetric);
      setAchieved(Array(METRICS.length).fill(0).map(() => Array(w).fill('')));
      setMonthlyAchieved(Array(m).fill(''));
    };

    loadPipelineData();
  }, [navigate]);

  const getTarget = (metricIdx: number, weekIdx: number) => {
    return weeklyTargets[metricIdx]?.[weekIdx] || 0;
  };

  const handleInput = (i: number, j: number, value: string) => {
    setAchieved((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[i][j] = value;
      return copy;
    });
  };

  const handleMonthlyInput = (i: number, value: string) => {
    setMonthlyAchieved((prev) => {
      const copy = [...prev];
      copy[i] = value;
      return copy;
    });
  };

  if (loading) return <div className="p-12 text-center text-xl">Loading...</div>;

  if (!pipelineData) {
    return (
      <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Pipeline Selected</h1>
          <p className="text-gray-600 mb-6">Please select a pipeline from your dashboard.</p>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="ml-auto flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Pipeline: {pipelineData.target_sales} SALs • {pipelineData.expected_timeline_months} months
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[98vw] mx-auto space-y-8 py-12 px-2">
        {/* Monthly Target vs Achieved Table */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Monthly Target vs Achieved</h3>
          <div className="overflow-x-auto">
            <table className="min-w-[400px] text-center border-separate border-spacing-y-2 bg-white/80 rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-lg">Month</th>
                  <th className="px-4 py-2 text-lg">Target</th>
                  <th className="px-4 py-2 text-lg">Achieved</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: months }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 font-semibold text-lg">Month {i + 1}</td>
                    <td className="px-4 py-2 text-blue-700 font-bold text-lg">
                      {Math.round((pipelineData.target_sales || 0) / months)}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        className="w-32 bg-white/70 rounded-lg px-2 py-2 text-center border border-gray-200 text-lg"
                        placeholder="Enter"
                        value={monthlyAchieved[i]}
                        onChange={e => handleMonthlyInput(i, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <CardContent>
            {/* Sliding Weekly Data */}
            <div className="flex items-start gap-0 w-full">
              <Carousel className="w-full flex-1">
                <CarouselPrevious />
                <CarouselContent>
                  {Array.from({ length: weeks }).map((_, weekIdx) => (
                    <CarouselItem key={weekIdx} className="flex flex-col items-center justify-start w-full">
                      {/* Week header */}
                      <div className="mb-6 text-center font-bold text-2xl text-blue-900">Week {weekIdx + 1}</div>
                      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
                        {METRICS.map((label, i) => (
                          <div key={i} className="flex flex-row items-center gap-0 w-full">
                            {/* Left stair label */}
                            <div className="flex items-center pl-4 font-medium text-base text-gray-900 min-h-[60px] min-w-[220px] max-w-[220px] bg-white rounded shadow-sm border border-gray-200">
                              {label}
                            </div>
                            {/* Card for Target/Achieved */}
                            <div className={`flex flex-col items-stretch justify-center ${glassStyle} shadow-xl rounded-2xl px-8 py-6 min-h-[110px] flex-1 ml-2`}>
                              <div className="flex flex-row items-center justify-between mb-2">
                                <span className="font-semibold text-gray-700 text-lg">Target</span>
                                <span className="font-semibold text-blue-700 text-lg">{getTarget(i, weekIdx)}</span>
                              </div>
                              <div className="flex flex-row items-center justify-between mt-2">
                                <span className="font-semibold text-gray-700 text-lg">Achieved</span>
                                <input
                                  type="text"
                                  className="w-24 bg-white/70 rounded-lg px-2 py-2 text-center border border-gray-200 text-lg font-semibold text-purple-900 outline-none"
                                  placeholder="Achieved"
                                  value={achieved[i][weekIdx]}
                                  onChange={e => handleInput(i, weekIdx, e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselNext />
              </Carousel>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Report;
