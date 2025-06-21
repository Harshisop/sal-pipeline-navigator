
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus } from 'lucide-react';

interface ICPData {
  persona: string;
  problem: string;
  benefit: string;
  umbrella: string;
}

interface ICPModalProps {
  onSave: (data: ICPData) => void;
}

const ICPModal: React.FC<ICPModalProps> = ({ onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [persona, setPersona] = useState('');
  const [problem, setProblem] = useState('');
  const [benefit, setBenefit] = useState('');
  const [umbrella, setUmbrella] = useState('Make Money');

  const handleSave = () => {
    if (!persona.trim() || !problem.trim() || !benefit.trim()) return;
    
    onSave({ persona, problem, benefit, umbrella });
    
    // Reset form
    setPersona('');
    setProblem('');
    setBenefit('');
    setUmbrella('Make Money');
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
      <DialogContent className="bg-white rounded-3xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[var(--c-blue-dark)] font-bold">Add ICP Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="persona" className="text-[var(--c-text)] font-medium">Persona / Title</Label>
            <Input
              id="persona"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="e.g., VP Sales"
              className="h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="problem" className="text-[var(--c-text)] font-medium">Pain Point</Label>
            <Input
              id="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g., Struggling with lead generation"
              className="h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="benefit" className="text-[var(--c-text)] font-medium">Benefit / Feature</Label>
            <Input
              id="benefit"
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              placeholder="e.g., Automated outreach sequences"
              className="h-12 rounded-xl border-2 focus:border-[var(--c-blue)]"
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
