
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FlowChartProps {
  calculatedData: any;
  timelineMonths: number;
}

const ProjectFlowChart: React.FC<FlowChartProps> = ({ calculatedData, timelineMonths }) => {
  const flowSteps = [
    {
      id: 1,
      title: 'Success',
      description: 'Project completion and target achievement',
      value: calculatedData?.Y || 0,
      color: 'bg-green-100 border-green-300 text-green-800',
      position: 'top-center'
    },
    {
      id: 2,
      title: 'Progress Log',
      description: 'Tracking milestones and KPIs',
      value: `${timelineMonths} months`,
      color: 'bg-blue-100 border-blue-300 text-blue-800',
      position: 'left'
    },
    {
      id: 3,
      title: 'Happy Clients',
      description: 'Client satisfaction through delivery',
      value: calculatedData?.PosLI || 0,
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      position: 'bottom-left'
    },
    {
      id: 4,
      title: 'Payment',
      description: 'Revenue generation and collection',
      value: `$${(calculatedData?.Y * 1000 || 0).toLocaleString()}`,
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      position: 'top-right'
    },
    {
      id: 5,
      title: 'Income',
      description: 'Total project revenue stream',
      value: calculatedData?.TAM_LI || 0,
      color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
      position: 'bottom-center'
    },
    {
      id: 6,
      title: 'Deposit',
      description: 'Initial project investments',
      value: calculatedData?.ConnReq || 0,
      color: 'bg-gray-100 border-gray-300 text-gray-800',
      position: 'bottom-right'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Project Flow Chart</h2>
        <p className="text-gray-600">Complete Duration Overview - {timelineMonths} Months</p>
      </div>
      
      {/* Flow Chart Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 min-h-[600px]">
        {/* Central Modern Flow Chart */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-2xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Modern Flow Chart</h3>
              <p className="text-sm opacity-90">Impress Your Clients</p>
              <div className="mt-4 text-2xl font-bold">
                {calculatedData?.Y || 0} Meetings
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Flow Chart Nodes */}
        {flowSteps.map((step, index) => {
          let positionClasses = '';
          
          switch (step.position) {
            case 'top-center':
              positionClasses = 'absolute top-8 left-1/2 transform -translate-x-1/2';
              break;
            case 'top-right':
              positionClasses = 'absolute top-8 right-8';
              break;
            case 'left':
              positionClasses = 'absolute top-1/2 left-8 transform -translate-y-1/2';
              break;
            case 'bottom-left':
              positionClasses = 'absolute bottom-8 left-8';
              break;
            case 'bottom-center':
              positionClasses = 'absolute bottom-8 left-1/2 transform -translate-x-1/2';
              break;
            case 'bottom-right':
              positionClasses = 'absolute bottom-8 right-8';
              break;
            default:
              positionClasses = 'relative';
          }

          return (
            <div key={step.id} className={positionClasses}>
              <Card className={`${step.color} border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-48`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                      {step.id}
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-lg">{step.value}</div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                  <p className="text-xs opacity-80">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          );
        })}

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {/* Lines connecting to center */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
             refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
            </marker>
          </defs>
          
          {/* Top to Center */}
          <line x1="50%" y1="15%" x2="50%" y2="45%" 
                stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" 
                markerEnd="url(#arrowhead)" />
          
          {/* Left to Center */}
          <line x1="25%" y1="50%" x2="40%" y2="50%" 
                stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" 
                markerEnd="url(#arrowhead)" />
          
          {/* Right to Center */}
          <line x1="75%" y1="50%" x2="60%" y2="50%" 
                stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" 
                markerEnd="url(#arrowhead)" />
          
          {/* Center to Bottom */}
          <line x1="50%" y1="55%" x2="50%" y2="80%" 
                stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" 
                markerEnd="url(#arrowhead)" />
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-md">
        <h3 className="font-semibold text-gray-800 mb-3">Flow Chart Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
            <span>Project Success Metrics</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
            <span>Progress Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
            <span>Financial Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFlowChart;
