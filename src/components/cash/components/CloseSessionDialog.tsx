
import React from 'react';
import { CashSession } from '../types/cash-types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DollarSign } from 'lucide-react';

interface CloseSessionDialogProps {
  session: CashSession | null;
  closingAmount: string;
  setClosingAmount: (value: string) => void;
  sessionNotes: string;
  setSessionNotes: (value: string) => void;
  onCloseSession: () => void;
  onCancel: () => void;
}

export const CloseSessionDialog = ({
  session,
  closingAmount,
  setClosingAmount,
  sessionNotes,
  setSessionNotes,
  onCloseSession,
  onCancel
}: CloseSessionDialogProps) => {
  if (!session) return null;

  const expectedCash = session.openingFloat + 
    session.salesTotal + 
    session.cashInTotal - 
    session.cashOutTotal;

  return (
    <DialogContent className="bg-gray-800 text-white border-gray-700">
      <DialogHeader>
        <DialogTitle>Close Cash Session</DialogTitle>
        <DialogDescription className="text-gray-400">
          Count the cash in the register and enter the final amount below.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="bg-gray-700 p-4 rounded-lg mb-4">
          <p className="font-semibold">{session.registerName}</p>
          <p className="text-sm text-gray-400">Cashier: {session.cashierName}</p>
          <p className="text-sm text-gray-400">
            Open since: {new Date(session.openingTime).toLocaleString()}
          </p>
          <Separator className="my-2 bg-gray-600" />
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>
              <p className="text-gray-400">Opening Float</p>
              <p className="text-white">{session.openingFloat.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Sales Total</p>
              <p className="text-white">{session.salesTotal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Cash In</p>
              <p className="text-white">{session.cashInTotal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Cash Out</p>
              <p className="text-white">{session.cashOutTotal.toLocaleString()}</p>
            </div>
          </div>
          <Separator className="my-2 bg-gray-600" />
          <div className="flex justify-between items-center">
            <p className="font-medium">Expected Cash:</p>
            <p className="font-bold text-green-400">
              {expectedCash.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="closingAmount">Actual Counted Cash Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              id="closingAmount"
              type="number"
              placeholder="0.00"
              value={closingAmount}
              onChange={(e) => setClosingAmount(e.target.value)}
              className="bg-gray-700 border-gray-600 pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="closeSessionNotes">Notes (Optional, required for discrepancies)</Label>
          <Input
            id="closeSessionNotes"
            placeholder="Explain any discrepancy..."
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            className="bg-gray-700 border-gray-600"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          className="bg-red-500 hover:bg-red-600" 
          onClick={onCloseSession}
        >
          Close Session
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
