// Application interface
export interface IApplication {
  id?: string;
  contractId?: string;
  status?: "draft" | "submitted" | "reviewing" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
  
  // Section A: General Information
  sectionA: ISectionA;
  
  // Section B: Local Content Components
  sectionB: ISectionB;
  
  // Section C: Capacity Development & R&D
  sectionC: ISectionC;
  
  // Additional fields
  notes?: string;
  attachments?: string[];
}

// Section A: General Information
export interface ISectionA {
  contractType: "call-out" | "non-call-out";
  currency: "FUSD" | "NGN" | "USD";
  refNo: string;
  dateRefIncPlanApproval: string;
  totalContractValue: string;
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
