// Application interface
export interface IApplication {
  _id?: string; 
  id?: string;
  userId?: string;
  status?: "DRAFT" | "SUBMITTED" | "REVIEWING" | "APPROVED" | "REJECTED" | "REVISION_REQUESTED";
  createdAt?: Date;
  updatedAt?: Date;
  adminComments?: string;

  // NCCC multi-step form sections
  sectionA?: ISectionA;
  sectionB?: ISectionB;
  sectionC?: ISectionC;

  // Contract / document fields (migrated from Contract model)
  operator?: string;
  contractorName?: string;
  contractTitle?: string;
  year?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  contractValue?: number;
  contractStatus?: "active" | "completed" | "pending" | "cancelled";

  // Media fields
  hasMedia?: boolean;
  mediaType?: "pdf" | "image" | "document" | "other" | null;

  // Archive fields
  isArchived?: boolean;
  archivedAt?: Date;
  archivedBy?: string;

  // Declaration & Signatures (top-level — not tied to a single form section)
  operatorSignature?: string | null;
  operatorSignatureToken?: string | null;
  operatorName?: string;
  operatorDesignation?: string;
  operatorDate?: string;
  serviceProviderSignature?: string | null;
  serviceProviderSignatureToken?: string | null;
  serviceProviderName?: string;
  serviceProviderDesignation?: string;
  serviceProviderDate?: string;

  notes?: string;
  attachments?: string[];
}

// enums/currency.ts
export const Currency = {
  FUSD: "FUSD",
  NGN: "NGN",
  USD: "USD",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export const ContractType = {
  CALL_OUT: "CALL-OUT",
  NON_CALL_OUT: "NON-CALL-OUT",
} as const;

export type ContractType = (typeof ContractType)[keyof typeof ContractType];

export interface ISectionA {
  contractType: ContractType | null;
  currency: Currency | null;
  referenceNumber: string;
  dateAndRefIncPlanApproval: string;
  totalContractValue: string;
  operatorOrProjectPromoter: string;
  dateAndRefNCDMBTechEvaluation: string;
  totalNCValue: string;
  contractProjectTitle: string;
  dateAndRefNCDMBCommEvaluation: string;
  onePercentNCDF: string;
  contractProjectNumber: string;
  commencementDate: string;
  ncdmbHcdTrainingBudgetPercent: string;
  bidCommencementDate: string;
  contractCompletionDate: string;
  mainContractor: string;
  singleSourceApprovalDateAndRef: string;
  contractDuration: string;
  subContractors: string; // usually comma-separated or multiline
  totalNCPercentSpend: string;
  totalNCPercentManhours: string;
}

// Section B: Local Content Components
export interface ISectionB {
  b1: IPersonnelRecords;
  b2: IProcurementRecord[];
  b3: IEquipmentRecord[];
  b4: IFabricationRecord[];
  b5: IOtherServicesRecord[];
  b6: IProfessionalServicesRecord[];
}

export interface IPersonnelRecords {
  b1_0: IPersonnelRecord;
  b1_1: IPersonnelRecord;
  b1_2: IPersonnelRecord;
}

export interface IPersonnelRecord {
  id: string; // unique identifier (usually timestamp or uuid)
  jobPosition: string;
  companyName: string; // often includes address
  totalPersonnel: string; // kept as string because it's <input type="number"> controlled
  nigerianNationality: string;
  foreignNationality: string;
  inCountryNigerian: string;
  inCountryExpat: string;
  outCountryNigerian: string;
  outCountryExpat: string;
  ncSpendValue: string; // Nigerian Content spend
  foreignSpendValue: string;
  totalSpendValue: string;
  ncManhours: string; // NC% manhours (Nigerian Content %)
  ncSpendPercent: string; // NC% spend
}

interface IEquipmentRecord {
  id: string;
  equipmentName: string;
  availableInCountry: string;
  inCountryOwner: string;
  outCountryOwner: string;
  nigerianOwnership: string;
  foreignOwnership: string;
  ncPercent: string;
  ncValue: string;
  foreignValue: string;
  totalValue: string;
  ncSpendPercent: string;
}

interface IProcurementRecord {
  id: string;
  procurementItem: string;
  manufacturedInCountry: string;
  inCountryVendor: string;
  outCountryVendor: string;
  uom: string;
  procuredInCountry: string;
  procuredOutCountry: string;
  ncPercent: string;
  ncValue: string;
  foreignValue: string;
  totalValue: string;
  ncSpendPercent: string;
}

interface IFabricationRecord {
  id: string;
  itemName: string;
  inCountryFabricationYard: string;
  outCountryFabricationYard: string;
  uom: string;
  fabricatedInCountry: string;
  fabricatedOutCountry: string;
  ncPercentTonage: string;
  ncValue: string;
  foreignValue: string;
  totalValue: string;
  ncSpendPercent: string;
}

interface IOtherServicesRecord {
  id: string;
  itemName: string;
  inCountryVendor: string;
  outCountryVendor: string;
  uom: string;
  executedInCountry: string;
  executedOutCountry: string;
  ncPercent: string;
  ncValue: string;
  foreignValue: string;
  totalValue: string;
  ncSpendPercent: string;
}

interface IProfessionalServicesRecord {
  id: string;
  itemName: string;
  inCountryFirm: string;
  outCountryFirm: string;
  uom: string;
  executedInCountry: string;
  executedOutCountry: string;
  ncPercent: string;
  ncValue: string;
  foreignValue: string;
  totalValue: string;
  ncSpendPercent: string;
}

// Section C: Capacity Development & R&D
export interface ISectionC {
  c1: IHCDTrainingRecord;
  c2: ICapacityDevelopmentRecord;
  c3: IResearchDevelopmentRecord;
}

interface IHCDTrainingRecord {
  id: string;
  trainingScope: string;
  hcdPercentage: string;
}

interface ICapacityDevelopmentRecord {
  id: string;
  scopeDetails: string;
  projectLocation: string;
  activityDuration: string;
  numberOfPersonnel: string;
  primaryActivity: string;
  outcome: string;
  costOfActivity: string;
}


interface IResearchDevelopmentRecord {
    id: string;
    typeOfResearch: string;
    projectLocation: string;
    activityDuration: string;
    numberOfResearcher: string;
    typeOfResearcher: string;
    briefScopeOfWork: string;
    costOfActivity: string;
  }

// Application submission interface
export interface IApplicationSubmission {
  application: IApplication;
  documents?: File[];
}

// Application response interface
export interface IApplicationResponse {
  success: boolean;
  message: string;
  application?: IApplication;
  errors?: string[];
}

// Application filter interface
export interface IApplicationFilter {
  status?: string[];
  fromDate?: Date;
  toDate?: Date;
  search?: string;
  operator?: string;
  contractorName?: string;
  year?: string;
}
