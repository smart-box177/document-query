/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import type { IApplication, ISectionA } from '@/interface/application';

interface ApplicationFormState {
  formData: Partial<IApplication>;
  updateFormData: (data: Partial<IApplication>) => void;
  updateSectionA: (data: any) => void;
  updateSectionB: (data: any) => void;
  updateSectionC: (data: any) => void;
  resetForm: () => void;
}

const defaultInitialData: Partial<IApplication> = {
  sectionA: {
    contractType: null,
    currency: null,
    referenceNumber: '',
    dateAndRefIncPlanApproval: '',
    totalContractValue: '',
    operatorOrProjectPromoter: '',
    dateAndRefNCDMBTechEvaluation: '',
    totalNCValue: '',
    contractProjectTitle: '',
    dateAndRefNCDMBCommEvaluation: '',
    onePercentNCDF: '',
    contractProjectNumber: '',
    commencementDate: '',
    ncdmbHcdTrainingBudgetPercent: '',
    bidCommencementDate: '',
    contractCompletionDate: '',
    mainContractor: '',
    singleSourceApprovalDateAndRef: '',
    contractDuration: '',
    subContractors: '',
    totalNCPercentSpend: '',
    totalNCPercentManhours: '',
    operatorName: '',
    operatorDesignation: '',
    operatorDate: '',
  },
    sectionB: {
    b1: {
      b1_0: { id: '1', jobPosition: '', companyName: '', totalPersonnel: '', nigerianNationality: '', foreignNationality: '', inCountryNigerian: '', inCountryExpat: '', outCountryNigerian: '', outCountryExpat: '', ncManhours: '', ncSpendValue: '', foreignSpendValue: '', totalSpendValue: '', ncSpendPercent: '' },
      b1_1: { id: '2', jobPosition: '', companyName: '', totalPersonnel: '', nigerianNationality: '', foreignNationality: '', inCountryNigerian: '', inCountryExpat: '', outCountryNigerian: '', outCountryExpat: '', ncManhours: '', ncSpendValue: '', foreignSpendValue: '', totalSpendValue: '', ncSpendPercent: '' },
      b1_2: { id: '3', jobPosition: '', companyName: '', totalPersonnel: '', nigerianNationality: '', foreignNationality: '', inCountryNigerian: '', inCountryExpat: '', outCountryNigerian: '', outCountryExpat: '', ncManhours: '', ncSpendValue: '', foreignSpendValue: '', totalSpendValue: '', ncSpendPercent: '' },
    },
    b2: [{ id: '1', procurementItem: '', manufacturedInCountry: '', inCountryVendor: '', outCountryVendor: '', uom: '', procuredInCountry: '', procuredOutCountry: '', ncPercent: '', ncValue: '', foreignValue: '', totalValue: '', ncSpendPercent: '' }],
    b3: [{ id: '1', equipmentName: '', availableInCountry: '', inCountryOwner: '', outCountryOwner: '', nigerianOwnership: '', foreignOwnership: '', ncPercent: '', ncValue: '', foreignValue: '', totalValue: '', ncSpendPercent: '' }],
    b4: [{ id: '1', itemName: '', inCountryFabricationYard: '', outCountryFabricationYard: '', uom: '', fabricatedInCountry: '', fabricatedOutCountry: '', ncPercentTonage: '', ncValue: '', foreignValue: '', totalValue: '', ncSpendPercent: '' }],
    b5: [{ id: '1', itemName: '', inCountryVendor: '', outCountryVendor: '', uom: '', executedInCountry: '', executedOutCountry: '', ncPercent: '', ncValue: '', foreignValue: '', totalValue: '', ncSpendPercent: '' }],
    b6: [{ id: '1', itemName: '', inCountryFirm: '', outCountryFirm: '', uom: '', executedInCountry: '', executedOutCountry: '', ncPercent: '', ncValue: '', foreignValue: '', totalValue: '', ncSpendPercent: '' }],
  },
  sectionC: {
    c1: { id: '1', trainingScope: '', hcdPercentage: '' },
    c2: { id: '1', scopeDetails: '', projectLocation: '', activityDuration: '', numberOfPersonnel: '', primaryActivity: '', outcome: '', costOfActivity: '' },
    c3: { id: '1', typeOfResearch: '', projectLocation: '', activityDuration: '', numberOfResearcher: '', typeOfResearcher: '', briefScopeOfWork: '', costOfActivity: '' },
  },
};

const calculateTotalContractValue = (sectionB: any): string => {
  let total = 0;

  // Sum totalSpendValue from b1 sections
  if (sectionB.b1) {
    if (sectionB.b1.b1_0?.totalSpendValue) {
      total += parseFloat(sectionB.b1.b1_0.totalSpendValue) || 0;
    }
    if (sectionB.b1.b1_1?.totalSpendValue) {
      total += parseFloat(sectionB.b1.b1_1.totalSpendValue) || 0;
    }
    if (sectionB.b1.b1_2?.totalSpendValue) {
      total += parseFloat(sectionB.b1.b1_2.totalSpendValue) || 0;
    }
  }

  // Sum totalValue from b2, b3, b4, b5 sections (arrays of records)
  const sumSectionValues = (records: any[]): number => {
    return records.reduce((sum, record) => {
      return sum + (parseFloat(record.totalValue) || 0);
    }, 0);
  };

  if (sectionB.b2 && Array.isArray(sectionB.b2)) {
    total += sumSectionValues(sectionB.b2);
  }
  if (sectionB.b3 && Array.isArray(sectionB.b3)) {
    total += sumSectionValues(sectionB.b3);
  }
  if (sectionB.b4 && Array.isArray(sectionB.b4)) {
    total += sumSectionValues(sectionB.b4);
  }
  if (sectionB.b5 && Array.isArray(sectionB.b5)) {
    total += sumSectionValues(sectionB.b5);
  }

  return total.toString();
};

const calculateTotalNCValue = (sectionB: any): string => {
  let total = 0;

  // Sum ncSpendValue from b1 sections
  if (sectionB.b1) {
    if (sectionB.b1.b1_0?.ncSpendValue) {
      total += parseFloat(sectionB.b1.b1_0.ncSpendValue) || 0;
    }
    if (sectionB.b1.b1_1?.ncSpendValue) {
      total += parseFloat(sectionB.b1.b1_1.ncSpendValue) || 0;
    }
    if (sectionB.b1.b1_2?.ncSpendValue) {
      total += parseFloat(sectionB.b1.b1_2.ncSpendValue) || 0;
    }
  }

  // Sum ncValue from b2, b3, b4, b5 sections (arrays of records)
  const sumSectionNCValues = (records: any[]): number => {
    return records.reduce((sum, record) => {
      return sum + (parseFloat(record.ncValue) || 0);
    }, 0);
  };

  if (sectionB.b2 && Array.isArray(sectionB.b2)) {
    total += sumSectionNCValues(sectionB.b2);
  }
  if (sectionB.b3 && Array.isArray(sectionB.b3)) {
    total += sumSectionNCValues(sectionB.b3);
  }
  if (sectionB.b4 && Array.isArray(sectionB.b4)) {
    total += sumSectionNCValues(sectionB.b4);
  }
  if (sectionB.b5 && Array.isArray(sectionB.b5)) {
    total += sumSectionNCValues(sectionB.b5);
  }

  return total.toString();
};

const calculateOnePercentNCDF = (totalContractValue: string): string => {
  const value = parseFloat(totalContractValue) || 0;
  return (value * 0.01).toString();
};

const calculateNCDMBHcdTrainingBudgetPercent = (sectionC: any): string => {
  // This comes from section C1 hcdPercentage
  if (sectionC && sectionC.c1 && sectionC.c1.hcdPercentage) {
    return sectionC.c1.hcdPercentage;
  }
  return '';
};

export const useApplicationFormStore = create<ApplicationFormState>()((set) => ({
  formData: defaultInitialData,
  updateFormData: (data: Partial<IApplication>) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },
  updateSectionA: (data: any) => {
    set((state) => ({
      formData: {
        ...state.formData,
        sectionA: { ...state.formData.sectionA, ...data },
      },
    }));
  },
  updateSectionB: (data: any) => {
    set((state) => {
      const newSectionB = { ...state.formData.sectionB, ...data };
      const totalContractValue = calculateTotalContractValue(newSectionB);
      const totalNCValue = calculateTotalNCValue(newSectionB);
      const onePercentNCDF = calculateOnePercentNCDF(totalContractValue);
      
      return {
        formData: {
          ...state.formData,
          sectionB: newSectionB,
          sectionA: {
            ...state.formData.sectionA,
            totalContractValue,
            totalNCValue,
            onePercentNCDF,
          } as ISectionA,
        },
      };
    });
  },
  updateSectionC: (data: any) => {
    set((state) => {
      const newSectionC = { ...state.formData.sectionC, ...data };
      const ncdmbHcdTrainingBudgetPercent = calculateNCDMBHcdTrainingBudgetPercent(newSectionC);
      
      return {
        formData: {
          ...state.formData,
          sectionC: newSectionC,
          sectionA: {
            ...state.formData.sectionA,
            ncdmbHcdTrainingBudgetPercent,
          } as ISectionA,
        },
      };
    });
  },
  resetForm: () => {
    set({ formData: defaultInitialData });
  },
}));
