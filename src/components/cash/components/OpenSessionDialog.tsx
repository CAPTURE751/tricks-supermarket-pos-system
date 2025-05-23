
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DollarSign } from 'lucide-react';

interface OpenSessionDialogProps {
  floatAmount: string;
  setFloatAmount: (value: string) => void;
  sessionNotes: string;
  setSessionNotes: (value: string) => void;
  onOpenSession: () => void;
  onClose: () => void;
}

export const OpenSessionDialog = ({
  floatAmount,
  setFloatAmount,
  sessionNotes,
  setSessionNotes,
  onOpenSession,
  onClose
}: OpenSessionDialogProps) => {
  return (
    <DialogContent className="bg-gray-800 text-white border-gray-700">
      <DialogHeader>
        <DialogTitle>Open New Cash Session</DialogTitle>
        <DialogDescription className="text-gray-400">
          Enter the opening float amount to start a new cash session.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="floatAmount">Opening Float Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="floatAmount"
              type="number"
              placeholder="0.00"
              value={floatAmount}
              onChange={(e) => setFloatAmount(e.target.value)}
              className="bg-gray-700 border-gray-600 pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sessionNotes">Session Notes (Optional)</Label>
          <Input
            id="sessionNotes"
            placeholder="Add any notes for this session..."
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            className="bg-gray-700 border-gray-600"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          className="bg-green-500 hover:bg-green-600" 
          onClick={onOpenSession}
        >
          Open Session
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
