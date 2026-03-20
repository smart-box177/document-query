// Application interface
export interface IApplication {
  id?: string;
  contractId?: string;
  status?: "DRAFT" | "SUBMITTED" | "REVIWING" | "APPROVED" | "REJECTED";
  createdAt?: Date;
  updatedAt?: Date;

  sectionA: ISectionA;
  sectionB: ISectionB;
  sectionC: ISectionC;

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

  // Main grid fields
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

  // Operator Declaration
  operatorSignature?: File | string | null; // or string (base64 / url) depending on your signature handling
  operatorName: string;
  operatorDesignation: string;
  operatorDate: string; // ISO date string or empty

  // Service Provider Declaration (optional)
  serviceProviderSignature?: File | null;
  serviceProviderName?: string;
  serviceProviderDesignation?: string;
  serviceProviderDate?: string;
}

// Section B: Local Content Components
export interface ISectionB {
  b1: ISectionB1;
  b2: ISectionB2;
  b3: ISectionB3;
  b4: ISectionB4;
  b5: ISectionB5;
  b6: ISectionB6;
}

export interface ISectionB1 {
  b1_0: IB10;
  b1_1: IB11;
  b1_2: ISectionB3;
}

export interface IB10 {
    id: string;                      // unique identifier (usually timestamp or uuid)
    jobPosition: string;
    companyName: string;             // often includes address
    totalPersonnel: string;          // kept as string because it's <input type="number"> controlled
    nigerianNationality: string;
    foreignNationality: string;
    inCountryNigerian: string;
    inCountryExpat: string;
    outCountryNigerian: string;
    outCountryExpat: string;
    ncSpendValue: string;       // Nigerian Content spend
    foreignSpendValue: string;
    totalSpendValue: string;
    ncManhours: string;         // NC% manhours (Nigerian Content %)
    ncSpendPercent: string;     // NC% spend
  }

  interface IB11 {
    id: string
    jobPosition: string
    companyName: string
    totalPersonnel: string
    nigerianNationality: string
    foreignNationality: string
    inCountryNigerian: string
    inCountryExpat: string
    outCountryNigerian: string
    outCountryExpat: string
    ncManhours: string
    ncSpendValue: string
    foreignSpendValue: string
    totalSpendValue: string
    ncSpendPercent: string
}

// Section B1: Equipment
export interface ISectionB1 {
  // B1.0: General Equipment
  generalEquipment: IEquipmentRecord[];

  // B1.1: Equipment/Machinery
  equipmentMachinery: IEquipmentRecord[];

  // B1.2: Materials
  materials: IMaterialRecord[];
}

export interface IEquipmentRecord {
  id: string;
  itemName: string;
  manufacturer: string;
  countryOfOrigin: string;
  quantity: string;
  unitPrice: string;
  totalAmount: string;
  localContentPercentage: string;
}

export interface IMaterialRecord {
  id: string;
  itemName: string;
  supplier: string;
  countryOfOrigin: string;
  quantity: string;
  unitPrice: string;
  totalAmount: string;
  localContentPercentage: string;
}

// Section B2: Services
export interface ISectionB2 {
  records: IServiceRecord[];
}

export interface IServiceRecord {
  id: string;
  serviceName: string;
  vendorName: string;
  countryOfOrigin: string;
  scopeOfWork: string;
  contractValue: string;
  localContentPercentage: string;
}

// Section B3: Manpower
export interface ISectionB3 {
  records: IManpowerRecord[];
}

export interface IManpowerRecord {
  id: string;
  position: string;
  numberOfPersonnel: string;
  nationality: string;
  monthlyRate: string;
  totalCost: string;
  localContentPercentage: string;
}

// Section B4: Fabrication
export interface ISectionB4 {
  records: IFabricationRecord[];
}

export interface IFabricationRecord {
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

// Section B5: Transportation
export interface ISectionB5 {
  records: ITransportationRecord[];
}

export interface ITransportationRecord {
  id: string;
  typeOfTransport: string;
  origin: string;
  destination: string;
  quantity: string;
  unitCost: string;
  totalCost: string;
  localContentPercentage: string;
}

// Section B6: Training
export interface ISectionB6 {
  records: ITrainingRecord[];
}

export interface ITrainingRecord {
  id: string;
  trainingType: string;
  numberOfTrainees: string;
  duration: string;
  trainingInstitution: string;
  location: string;
  costPerTrainee: string;
  totalCost: string;
  localContentPercentage: string;
}

// Section C: Capacity Development & R&D
export interface ISectionC {
  c1: ISectionC1;
  c2: ISectionC2;
  c3: ISectionC3;
}

// Section C1: Local Content Plan
export interface ISectionC1 {
  localContentTarget: string;
  description: string;
  implementationTimeline: string;
  responsibleDepartment: string;
  budgetAllocation: string;
}

// Section C2: Capacity Development Initiative (CDI)
export interface ISectionC2 {
  records: ICapacityDevelopmentRecord[];
}

export interface ICapacityDevelopmentRecord {
  id: string;
  scopeDetails: string;
  projectLocation: string;
  activityDuration: string;
  numberOfPersonnel: string;
  primaryActivity: string;
  outcome: string;
  costOfActivity: string;
}

// Section C3: R & D (If Applicable)
export interface ISectionC3 {
  records: IResearchDevelopmentRecord[];
}

export interface IResearchDevelopmentRecord {
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
  contractId?: string;
  fromDate?: Date;
  toDate?: Date;
  search?: string;
}
