import React, { createContext, useState, useMemo, ReactNode } from 'react';
import { NetworkKind, networkModes } from '../theme';

export interface NetworkContextType {
  network: NetworkKind;
  setNetwork: React.Dispatch<React.SetStateAction<NetworkKind>>;
  currentNetwork: typeof networkModes[NetworkKind];
  processing: string | null;
  setProcessing: React.Dispatch<React.SetStateAction<string | null>>;
  launchProcessing: (id: string, callback?: () => void) => void;
  approvalOverlay: boolean;
  setApprovalOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  receiptOverlay: string | null;
  setReceiptOverlay: React.Dispatch<React.SetStateAction<string | null>>;
  handleApprove: (id: string) => void;
}

export const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkKind>('polygon');
  const [processing, setProcessing] = useState<string | null>(null);
  const [approvalOverlay, setApprovalOverlay] = useState(false);
  const [receiptOverlay, setReceiptOverlay] = useState<string | null>(null);

  const currentNetwork = useMemo(() => networkModes[network], [network]);

  const launchProcessing = (id: string, callback?: () => void) => {
    setProcessing(id);
    setTimeout(() => {
      setProcessing((current) => (current === id ? null : current));
      callback?.();
    }, 1200);
  };

  const handleApprove = (id: string) => {
    launchProcessing(`rebate-${id}`, () => {
      setApprovalOverlay(true);
      setReceiptOverlay(id);
      setTimeout(() => setApprovalOverlay(false), 1800);
      setTimeout(() => setReceiptOverlay(null), 2800);
    });
  };

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
        currentNetwork,
        processing,
        setProcessing,
        launchProcessing,
        approvalOverlay,
        setApprovalOverlay,
        receiptOverlay,
        setReceiptOverlay,
        handleApprove,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
