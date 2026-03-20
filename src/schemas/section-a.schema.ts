// schemas/nccc-section-a.schema.ts
import { z } from "zod";
import { ContractType, Currency } from "../interface/application";

// Using the const object style (recommended)
const contractTypeValues = Object.values(ContractType) as [
  ContractType,
  ...ContractType[]
];
const currencyValues = Object.values(Currency) as [Currency, ...Currency[]];

export const ncccSectionASchema = z.object({
  contractType: z.enum(contractTypeValues, {
    error: "Please select a contract type",
  }),
  currency: z.enum(currencyValues, {
    error: "Please select a currency",
  }),

  // Text / number fields
  referenceNumber: z.string().min(1, "Reference number is required"),
  dateAndRefIncPlanApproval: z
    .string()
    .min(1, "Date and reference is required"),
  totalContractValue: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid amount"),

  operatorOrProjectPromoter: z
    .string()
    .min(2, "Operator / Promoter name is required"),
  dateAndRefNCDMBTechEvaluation: z
    .string()
    .min(1, "Date and reference is required"),
  totalNCValue: z.string().regex(/^\d+(\.\d{1,2})?$/, "Must be a valid amount"),

  contractProjectTitle: z
    .string()
    .min(3, "Contract / Project title is required"),
  dateAndRefNCDMBCommEvaluation: z
    .string()
    .min(1, "Date and reference is required"),
  onePercentNCDF: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid amount"),

  contractProjectNumber: z
    .string()
    .min(1, "Contract / Project number is required"),
  commencementDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  ncdmbHcdTrainingBudgetPercent: z
    .string()
    .regex(/^(\d{1,2}(\.\d{1,2})?|100)$/, "Must be 0-100%"),

  bidCommencementDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
    .optional(),
  contractCompletionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
    .optional(),
  mainContractor: z
    .string()
    .min(2, "Main contractor name is required")
    .optional(),

  singleSourceApprovalDateAndRef: z.string().optional(),
  contractDuration: z.string().min(1, "Duration is required").optional(),

  subContractors: z
    .string()
    .min(1, "Sub-contractor(s) information is required"),

  totalNCPercentSpend: z
    .string()
    .regex(/^(\d{1,2}(\.\d{1,2})?|100)$/, "Must be 0-100%"),
  totalNCPercentManhours: z
    .string()
    .regex(/^(\d{1,2}(\.\d{1,2})?|100)$/, "Must be 0-100%"),

  // Operator signature block
  operatorName: z.string().min(2, "Name is required"),
  operatorDesignation: z.string().min(2, "Designation is required"),
  operatorDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),

  // Service Provider (optional block)
  serviceProviderName: z.string().min(2, "Name is required").optional(),
  serviceProviderDesignation: z
    .string()
    .min(2, "Designation is required")
    .optional(),
  serviceProviderDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
    .optional(),
});

// For partial / optional service provider section
export const ncccSectionASchemaWithOptionalProvider = ncccSectionASchema.extend(
  {
    serviceProviderName: z.string().optional(),
    serviceProviderDesignation: z.string().optional(),
    serviceProviderDate: z.string().optional(),
  }
);

// Type inference
export type NCCCSectionAFormData = z.infer<typeof ncccSectionASchema>;
