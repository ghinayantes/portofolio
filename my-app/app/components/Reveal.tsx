"use client";

import React, { createContext, useContext, useState, useEffect, useId } from "react";

interface RevealContextType {
  openIds: Set<string>;
  toggleId: (id: string) => void;
  registerId: (id: string) => void;
  unregisterId: (id: string) => void;
  totalCount: number;
}

const RevealContext = createContext<RevealContextType | undefined>(undefined);

export function RevealCountProvider({ children }: { children: React.ReactNode }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());

  const registerId = (id: string) => {
    setRegisteredIds((prev) => {
      if (prev.has(id)) return prev;
      return new Set(prev).add(id);
    });
  };

  const unregisterId = (id: string) => {
    setRegisteredIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleId = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <RevealContext.Provider
      value={{
        openIds,
        toggleId,
        registerId,
        unregisterId,
        totalCount: registeredIds.size,
      }}
    >
      {children}
    </RevealContext.Provider>
  );
}

export function useReveal() {
  const context = useContext(RevealContext);
  if (!context) {
    throw new Error("useReveal must be used within a RevealCountProvider");
  }
  return context;
}

export function RevealCounter() {
  const { openIds, totalCount } = useReveal();
  return (
    <div className="counter">
      R{openIds.size}/{totalCount}
    </div>
  );
}

interface RevealProps {
  trigger: string;
  children: React.ReactNode;
}

export function Reveal({ trigger, children }: RevealProps) {
  const id = useId();
  const { openIds, toggleId, registerId, unregisterId } = useReveal();
  const isOpen = openIds.has(id);

  useEffect(() => {
    registerId(id);
    return () => unregisterId(id);
  }, [id]);

  return (
    <span className="reveal-wrapper inline">
      <button
        type="button"
        className="reveal-trigger"
        data-state={isOpen ? "open" : "closed"}
        onClick={() => toggleId(id)}
      >
        {trigger}
      </button>
      <span className="reveal-content" data-state={isOpen ? "open" : "closed"}>
        {children}
      </span>
    </span>
  );
}