/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { IApplication } from '@/interface/application';

interface ApplicationFormContextType {
  formData: Partial<IApplication>;
  updateFormData: (data: Partial<IApplication>) => void;
  updateSectionA: (data: any) => void;
  updateSectionB: (data: any) => void;
  updateSectionC: (data: any) => void;
}

export const ApplicationFormContext = createContext<ApplicationFormContextType | undefined>(undefined);

interface ApplicationFormProviderProps {
  children: ReactNode;
  initialData?: Partial<IApplication>;
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
    b2: { id: '1', procurementItem: '', manufacturedInCountry: '', inCountryVendor: '', outCountryVendor: '', uom: '', procuredInCountry: '', procuredOutCountry: '', ncPercent: '', ncValue: '', foreignValue: '', totalValue: '', ncSpendPercent: '' },
    b3: { id: '1', equipmentName: '', availableInCountry: '', inCountryOwner: '', outCountryOwner: '', nigerianOwnership: '', foreignOwnership: '', ncPercent: '', ncValue: '', foreignValue: '', totalValue: '', ncSpendPercent: '' },
    b4: { id: '1', itemName: '', inCountryFabricationYard: '', outCountryFabricationYard: '', uom: '', fabricatedInCountry: '', fabricatedOutCountry: '', ncPercentTonage: '', ncValue: '', foreignValue: '', totalValue: '', ncSpendPercent: '' },
    b5: { id: '1', itemName: '', inCountryVendor: '', outCountryVendor: '', uom: '', executedInCountry: '', executedOutCountry: '', ncPercent: '', ncValue: '', foreignValue: '', totalValue: '', ncSpendPercent: '' },
    b6: { id: '1', itemName: '', inCountryFirm: '', outCountryFirm: '', uom: '', executedInCountry: '', executedOutCountry: '', ncPercent: '', ncValue: '', foreignValue: '', totalValue: '', ncSpendPercent: '' },
  },
  sectionC: {
    c1: { id: '1', trainingScope: '', hcdPercentage: '' },
    c2: { id: '1', scopeDetails: '', projectLocation: '', activityDuration: '', numberOfPersonnel: '', primaryActivity: '', outcome: '', costOfActivity: '' },
    c3: { id: '1', typeOfResearch: '', projectLocation: '', activityDuration: '', numberOfResearcher: '', typeOfResearcher: '', briefScopeOfWork: '', costOfActivity: '' },
  },
};

export const ApplicationFormProvider = ({ 
  children, 
  initialData = defaultInitialData 
}: ApplicationFormProviderProps) => {
  const [formData, setFormData] = useState<Partial<IApplication>>(initialData);

  const updateFormData = (data: Partial<IApplication>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const updateSectionA = (data: any) => {
    setFormData(prev => ({ ...prev, sectionA: { ...prev.sectionA, ...data } }));
  };

  const updateSectionB = (data: any) => {
    setFormData(prev => ({ ...prev, sectionB: { ...prev.sectionB, ...data } }));
  };

  const updateSectionC = (data: any) => {
    setFormData(prev => ({ ...prev, sectionC: { ...prev.sectionC, ...data } }));
  };

  return (
    <ApplicationFormContext.Provider
      value={{
        formData,
        updateFormData,
        updateSectionA,
        updateSectionB,
        updateSectionC,
      }}
    >
      {children}
    </ApplicationFormContext.Provider>
  );
};
