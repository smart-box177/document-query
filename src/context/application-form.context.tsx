/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { IApplication, ISectionA } from "@/interface/application";
import {
  computeB1Row,
  computeArrayRows,
  calculateTotalContractValue,
  calculateTotalNCValue,
  calculateOnePercentNCDF,
  calculateNCDMBHcdTrainingBudgetPercent,
} from "@/utils/application-form.utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApplicationFormState {
  formData: Partial<IApplication>;
  updateFormData: (data: Partial<IApplication>) => void;
  updateSectionA: (data: Partial<ISectionA>) => void;
  updateSectionB: (data: any) => void;
  updateSectionC: (data: any) => void;
  loadDraft: (application: IApplication) => void;
  updateDeclaration: (
    data: Pick<
      IApplication,
      | "operatorSignature"
      | "operatorSignatureToken"
      | "operatorName"
      | "operatorDesignation"
      | "operatorDate"
      | "serviceProviderSignature"
      | "serviceProviderSignatureToken"
      | "serviceProviderName"
      | "serviceProviderDesignation"
      | "serviceProviderDate"
    >
  ) => void;
  resetForm: () => void;
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "application-form-data";

const loadFromStorage = (): Partial<IApplication> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {};
};

const saveToStorage = (data: Partial<IApplication>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
};

const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ApplicationFormContext = createContext<ApplicationFormState | null>(null);

export function ApplicationFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<Partial<IApplication>>(loadFromStorage);

  const updateFormData = useCallback((data: Partial<IApplication>) => {
    setFormData((prev) => {
      const next = { ...prev, ...data };
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateSectionA = useCallback((data: Partial<ISectionA>) => {
    setFormData((prev) => {
      const next = { ...prev, sectionA: { ...prev.sectionA, ...data } as ISectionA };
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateSectionB = useCallback((data: any) => {
    setFormData((prev) => {
      const merged: any = { ...prev.sectionB, ...data };

      if (merged.b1) {
        merged.b1 = {
          b1_0: computeB1Row(merged.b1.b1_0),
          b1_1: computeB1Row(merged.b1.b1_1),
          b1_2: computeB1Row(merged.b1.b1_2),
        };
      }

      for (const key of ["b2", "b3", "b4", "b5", "b6"] as const) {
        if (merged[key]) merged[key] = computeArrayRows(merged[key]);
      }

      const totalContractValue = calculateTotalContractValue(merged);
      const totalNCValue = calculateTotalNCValue(merged);
      const onePercentNCDF = calculateOnePercentNCDF(totalContractValue, prev.sectionA as ISectionA);

      const next = {
        ...prev,
        sectionB: merged,
        sectionA: { ...prev.sectionA, totalContractValue, totalNCValue, onePercentNCDF } as ISectionA,
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateSectionC = useCallback((data: any) => {
    setFormData((prev) => {
      const newC = { ...prev.sectionC, ...data };
      const ncdmbHcdTrainingBudgetPercent = calculateNCDMBHcdTrainingBudgetPercent(newC);
      const next = {
        ...prev,
        sectionC: newC,
        sectionA: { ...prev.sectionA, ncdmbHcdTrainingBudgetPercent } as ISectionA,
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const loadDraft = useCallback((application: IApplication) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, id, userId, createdAt, updatedAt, ...rest } = application as IApplication & {
      createdAt?: unknown;
      updatedAt?: unknown;
    };
    const data: Partial<IApplication> = rest;
    saveToStorage(data);
    setFormData(data);
  }, []);

  const updateDeclaration = useCallback(
    (
      data: Pick<
        IApplication,
        | "operatorSignature"
        | "operatorSignatureToken"
        | "operatorName"
        | "operatorDesignation"
        | "operatorDate"
        | "serviceProviderSignature"
        | "serviceProviderSignatureToken"
        | "serviceProviderName"
        | "serviceProviderDesignation"
        | "serviceProviderDate"
      >
    ) => {
      setFormData((prev) => {
        const next = { ...prev, ...data };
        saveToStorage(next);
        return next;
      });
    },
    []
  );

  const resetForm = useCallback(() => {
    clearStorage();
    setFormData({});
  }, []);

  const value: ApplicationFormState = {
    formData,
    updateFormData,
    updateSectionA,
    updateSectionB,
    updateSectionC,
    loadDraft,
    updateDeclaration,
    resetForm,
  };

  return (
    <ApplicationFormContext.Provider value={value}>
      {children}
    </ApplicationFormContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApplicationFormContext(): ApplicationFormState {
  const ctx = useContext(ApplicationFormContext);
  if (!ctx) {
    throw new Error("useApplicationFormContext must be used within ApplicationFormProvider");
  }
  return ctx;
}
