import { z } from "zod";
import { ContractType, Currency } from "../interface/application";

const contractTypeValues = Object.values(ContractType) as [
  ContractType,
  ...ContractType[],
];
const currencyValues = Object.values(Currency) as [Currency, ...Currency[]];

export const sectionASchema = z.object({
  // Required selects
  contractType: z.enum(contractTypeValues, {
    error: "Please select a contract type",
  }),
  currency: z.enum(currencyValues, { error: "Please select a currency" }),

  // Required user-editable fields
  dateAndRefIncPlanApproval: z.string().min(1, "This field is required"),
  operatorOrProjectPromoter: z.string().min(1, "This field is required"),
  dateAndRefNCDMBTechEvaluation: z.string().min(1, "This field is required"),
  contractProjectTitle: z.string().min(1, "This field is required"),
  dateAndRefNCDMBCommEvaluation: z.string().min(1, "This field is required"),
  contractProjectNumber: z.string().min(1, "This field is required"),
  commencementDate: z.string().min(1, "This field is required"),
  bidCommencementDate: z.string().min(1, "This field is required"),
  contractCompletionDate: z.string().min(1, "This field is required"),
  mainContractor: z.string().min(1, "This field is required"),
  singleSourceApprovalDateAndRef: z.string().min(1, "This field is required"),
  contractDuration: z.string().min(1, "This field is required"),
  subContractors: z.string().min(1, "This field is required"),
});

export type SectionAFormValues = z.infer<typeof sectionASchema>;
