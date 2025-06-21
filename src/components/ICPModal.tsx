
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
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add ICP Row
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add ICP Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="persona">Persona / Title</Label>
            <Input
              id="persona"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="e.g., VP Sales"
            />
          </div>
          
          <div>
            <Label htmlFor="problem">Pain Point</Label>
            <Input
              id="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g., Struggling with lead generation"
            />
          </div>
          
          <div>
            <Label htmlFor="benefit">Benefit / Feature</Label>
            <Input
              id="benefit"
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              placeholder="e.g., Automated outreach sequences"
            />
          </div>
          
          <div>
            <Label>Value Proposition</Label>
            <RadioGroup value={umbrella} onValueChange={setUmbrella} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Make Money" id="make-money" />
                <Label htmlFor="make-money">Make Money</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Save Money" id="save-money" />
                <Label htmlFor="save-money">Save Money</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Save Time" id="save-time" />
                <Label htmlFor="save-time">Save Time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Reduce Risk" id="reduce-risk" />
                <Label htmlFor="reduce-risk">Reduce Risk</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save ICP
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ICPModal;
