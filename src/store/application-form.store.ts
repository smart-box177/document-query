/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import type { IApplication } from '@/interface/application';

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
    set((state) => ({
      formData: {
        ...state.formData,
        sectionB: { ...state.formData.sectionB, ...data },
      },
    }));
  },
  updateSectionC: (data: any) => {
    set((state) => ({
      formData: {
        ...state.formData,
        sectionC: { ...state.formData.sectionC, ...data },
      },
    }));
  },
  resetForm: () => {
    set({ formData: defaultInitialData });
  },
}));
