
import React from 'react';
import { CashSession } from '../types/cash-types';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, Calculator } from 'lucide-react';

interface SessionCardProps {
  session: CashSession;
  onCloseSession: (session: CashSession) => void;
}

export const SessionCard = ({ session, onCloseSession }: SessionCardProps) => {
  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-white">{session.registerName}</h4>
            <p className="text-green-400 text-sm flex items-center">
              <Clock size={12} className="mr-1" /> 
              Open since {new Date(session.openingTime).toLocaleTimeString()}
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={() => onCloseSession(session)}
          >
            Close Session
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-gray-400">Cashier</p>
            <p className="text-white">{session.cashierName}</p>
          </div>
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-gray-400">Opening Float</p>
            <p className="text-white flex items-center">
              <DollarSign size={12} className="mr-1" /> 
              {session.openingFloat.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-gray-400">Sales Total</p>
            <p className="text-white flex items-center">
              <DollarSign size={12} className="mr-1" /> 
              {session.salesTotal.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-800 p-2 rounded-md">
            <p className="text-gray-400">Net Cash</p>
            <p className="text-white flex items-center">
              <Calculator size={12} className="mr-1" /> 
              {(session.openingFloat + session.cashInTotal - session.cashOutTotal).toLocaleString()}
            </p>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full text-amber-400 border-amber-400 hover:bg-amber-400/10"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
