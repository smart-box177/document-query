/* eslint-disable @typescript-eslint/no-explicit-any */
import { FloatingInput } from "@/components/ui/floating-input";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { ISectionA } from "@/interface/application";
import { useApplicationFormStore } from "@/store/application-form.store";
import { Label } from "@/components/ui/label";

const SectionA = () => {
  const { formData, updateSectionA } = useApplicationFormStore();
  const [localData, setLocalData] = useState<ISectionA>(formData.sectionA!);

  const handleChange = (field: keyof ISectionA, value: any) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    updateSectionA(updatedData);
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        {/* Row 1 equivalent */}
        <div className="flex gap-4 col-span-1 md:col-span-2 space-x-2">
          <div className="flex-1 space-y-2">
            <Label className="text-xs text-muted-foreground ml-1">
              Contract Type
            </Label>
            <Select
              value={localData.contractType || ""}
              onValueChange={(value) => handleChange("contractType", value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select Contract Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CALL-OUT">CALL-OUT</SelectItem>
                <SelectItem value="NON-CALL-OUT">NON CALL-OUT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-xs text-muted-foreground ml-1">
              Currency
            </Label>
            <Select
              value={localData.currency || ""}
              onValueChange={(value) => handleChange("currency", value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FUSD">FUSD</SelectItem>
                <SelectItem value="NGN">NGN</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="hidden lg:block"></div>
        <div className="hidden lg:block"></div>

        {/* Grid Fields */}
        {/* <FloatingInput
                     label="Ref. No."
                     disabled
                     value={localData.referenceNumber}
                     onChange={(e) => handleChange('referenceNumber', e.target.value)}
                 /> */}
        <DatePicker
          label="Date and Ref Inc Plan Approval"
          value={localData.dateAndRefIncPlanApproval}
          onChange={(value) => handleChange("dateAndRefIncPlanApproval", value)}
        />

        <FloatingInput
          label="Name of Operator / Project Promoter"
          value={localData.operatorOrProjectPromoter}
          onChange={(e) =>
            handleChange("operatorOrProjectPromoter", e.target.value)
          }
        />
        <DatePicker
          label="Date of and Ref (NCDMB Tech Evaluation Rpt)"
          value={localData.dateAndRefNCDMBTechEvaluation}
          onChange={(value) => handleChange("dateAndRefNCDMBTechEvaluation", value)}
        />
        <FloatingInput
          label="Contract / Project Title"
          value={localData.contractProjectTitle}
          onChange={(e) => handleChange("contractProjectTitle", e.target.value)}
        />
        <FloatingInput
          label="Date of and Ref (NCDMB Comm Evaluation Rpt)"
          value={localData.dateAndRefNCDMBCommEvaluation}
          onChange={(e) =>
            handleChange("dateAndRefNCDMBCommEvaluation", e.target.value)
          }
        />
        <FloatingInput
          label="1% NCDF: Being the sum of one percent of contract awarded"
          disabled
          value={localData.onePercentNCDF}
          onChange={(e) => handleChange("onePercentNCDF", e.target.value)}
        />

        <FloatingInput
          label="Contract / Project Number"
          value={localData.contractProjectNumber}
          onChange={(e) =>
            handleChange("contractProjectNumber", e.target.value)
          }
        />
        <DatePicker
          label="Date of Commencement of Contract"
          value={localData.commencementDate}
          onChange={(value) => handleChange("commencementDate", value)}
        />
        <FloatingInput
          label="NCDMB HCD Training Budget (% of TCV)"
          disabled
          value={localData.ncdmbHcdTrainingBudgetPercent}
          onChange={(e) =>
            handleChange("ncdmbHcdTrainingBudgetPercent", e.target.value)
          }
        />

        <DatePicker
          label="Date of Commencement of Bid"
          value={localData.bidCommencementDate}
          onChange={(value) => handleChange("bidCommencementDate", value)}
        />
        <FloatingInput
          label="Date of Completion of Contract"
          value={localData.contractCompletionDate}
          onChange={(e) =>
            handleChange("contractCompletionDate", e.target.value)
          }
        />
        <FloatingInput
          label="Main Contractor"
          value={localData.mainContractor}
          onChange={(e) => handleChange("mainContractor", e.target.value)}
        />

        <DatePicker
          label="Date and Ref (Single Source/ Selective Approval) - Not Applicable"
          value={localData.singleSourceApprovalDateAndRef}
          onChange={(value) => handleChange("singleSourceApprovalDateAndRef", value)}
        />
        <FloatingInput
          label="Duration of Contract"
          value={localData.contractDuration}
          onChange={(e) => handleChange("contractDuration", e.target.value)}
        />

        <div className="hidden lg:block"></div>

        {/* Sub-contractor */}
        <div className="flex flex-col gap-2 relative">
          <FloatingInput
            label="Sub-Contractor(s)"
            value={localData.subContractors}
            onChange={(e) => handleChange("subContractors", e.target.value)}
          />
          <p className="text-[10px] text-muted-foreground leading-tight px-1  -bottom-10 left-0 max-w-125">
            In line with the statutory requirement of the NOGICD Act 2010,
            Tenderer shall deduct 1% NCDF for every subcontract to be issued on
            this contract and remit same to NCDMB. Failure to remit the said 1%
            NCDF shall be in non-compliance with the requirement of the NOGICD
            Act and be liable for sanctions.
          </p>
        </div>

        {/* Total Fields - Bottom Row */}
        <FloatingInput
          label="Total NC Spend"
          disabled
          value={localData.totalNCPercentSpend}
          onChange={(e) => handleChange("totalNCPercentSpend", e.target.value)}
        />
        <FloatingInput
          label="Total Contract Value"
          disabled
          value={localData.totalContractValue}
          onChange={(e) => handleChange("totalContractValue", e.target.value)}
        />
        <FloatingInput
          label="Total NC% Manhours"
          disabled
          value={localData.totalNCPercentManhours}
          onChange={(e) =>
            handleChange("totalNCPercentManhours", e.target.value)
          }
        />
        <FloatingInput
          label="Total NC Value"
          disabled
          value={localData.totalNCValue}
          onChange={(e) => handleChange("totalNCValue", e.target.value)}
        />
      </div>
    </div>
  );
};

export default SectionA;
