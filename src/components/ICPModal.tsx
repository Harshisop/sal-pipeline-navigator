
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';

interface ICPData {
  personaGroup: string;
  seniority: string[];
  painPoint: string;
  benefitFeature: string;
  umbrella: string;
  socialGroup: string;
}

interface ICPModalProps {
  onSave: (data: ICPData) => void;
}

const ICPModal: React.FC<ICPModalProps> = ({ onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [personaGroup, setPersonaGroup] = useState('Sales');
  const [seniority, setSeniority] = useState<string[]>(['C-level']);
  const [painPoint, setPainPoint] = useState('');
  const [benefitFeature, setBenefitFeature] = useState('');
  const [umbrella, setUmbrella] = useState('Make Money');
  const [socialGroup, setSocialGroup] = useState('');

  const seniorityOptions = [
    'C-level',
    'VP',
    'Director',
    'Head',
    'Manager',
    'Individual Contributor'
  ];

  const handleSeniorityChange = (value: string, checked: boolean) => {
    if (checked) {
      setSeniority(prev => [...prev, value]);
    } else {
      setSeniority(prev => prev.filter(item => item !== value));
    }
  };

  const handleSave = () => {
    if (!personaGroup.trim() || !painPoint.trim() || !benefitFeature.trim() || seniority.length === 0) return;
    
    onSave({ 
      personaGroup, 
      seniority, 
      painPoint, 
      benefitFeature, 
      umbrella, 
      socialGroup 
    });
    
    // Reset form
    setPersonaGroup('Sales');
    setSeniority(['C-level']);
    setPainPoint('');
    setBenefitFeature('');
    setUmbrella('Make Money');
    setSocialGroup('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="btn-lime w-full h-12 text-lg">
          <Plus className="w-5 h-5 mr-3" />
          Manage ICPs
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-3xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[var(--c-blue-dark)] font-bold">Add ICP Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="personaGroup" className="text-[var(--c-text)] font-medium">Target Group</Label>
            <Select value={personaGroup} onValueChange={setPersonaGroup}>
              <SelectTrigger className="h-12 rounded-xl border-2 focus:border-[var(--c-blue)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <Label className="text-[var(--c-text)] font-medium">Seniority (multi-select)</Label>
            <div className="grid grid-cols-2 gap-3">
              {seniorityOptions.map((option) => (
                <div key={option} className="flex items-center space-x-3 p-3 border-2 rounded-xl hover:border-[var(--c-blue)] transition-colors">
                  <Checkbox
                    id={`seniority-${option}`}
                    checked={seniority.includes(option)}
                    onCheckedChange={(checked) => handleSeniorityChange(option, checked as boolean)}
                  />
                  <Label htmlFor={`seniority-${option}`} className="cursor-pointer text-sm">{option}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="painPoint" className="text-[var(--c-text)] font-medium">Pain Point</Label>
            <Textarea
              id="painPoint"
              value={painPoint}
              onChange={(e) => setPainPoint(e.target.value)}
              placeholder="e.g., Struggling with consistent lead generation and pipeline visibility"
              className="min-h-[80px] rounded-xl border-2 focus:border-[var(--c-blue)]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="benefitFeature" className="text-[var(--c-text)] font-medium">Benefit from Feature</Label>
            <Textarea
              id="benefitFeature"
              value={benefitFeature}
              onChange={(e) => setBenefitFeature(e.target.value)}
              placeholder="e.g., Automated multi-channel outreach with detailed analytics and reporting"
              className="min-h-[80px] rounded-xl border-2 focus:border-[var(--c-blue)]"
            />
          </div>
          
          <div className="space-y-4">
            <Label className="text-[var(--c-text)] font-medium">Value Proposition</Label>
            <RadioGroup value={umbrella} onValueChange={setUmbrella} className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 border-2 rounded-xl hover:border-[var(--c-blue)] transition-colors">
                <RadioGroupItem value="Make Money" id="make-money" />
                <Label htmlFor="make-money" className="cursor-pointer">Make Money</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border-2 rounded-xl hover:border-[var(--c-blue)] transition-colors">
                <RadioGroupItem value="Save Money" id="save-money" />
                <Label htmlFor="save-money" className="cursor-pointer">Save Money</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border-2 rounded-xl hover:border-[var(--c-blue)] transition-colors">
                <RadioGroupItem value="Save Time" id="save-time" />
                <Label htmlFor="save-time" className="cursor-pointer">Save Time</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border-2 rounded-xl hover:border-[var(--c-blue)] transition-colors">
                <RadioGroupItem value="Reduce Risk" id="reduce-risk" />
                <Label htmlFor="reduce-risk" className="cursor-pointer">Reduce Risk</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialGroup" className="text-[var(--c-text)] font-medium">Social Group</Label>
            <Input
              id="socialGroup"
              value={socialGroup}
              onChange={(e) => setSocialGroup(e.target.value)}
              placeholder="e.g., B2B SaaS Leaders, Manufacturing Executives"
              className="h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="btn-blue flex-1 h-12">
              Save ICP
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 h-12 rounded-xl border-2">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ICPModal;
