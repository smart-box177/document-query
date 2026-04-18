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
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApplicationFormStore } from "@/store/application-form.store";
import { Label } from "@/components/ui/label";
import {
  sectionASchema,
  type SectionAFormValues,
} from "@/schemas/section-a.schema";

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-xs text-destructive mt-1 px-1">{message}</p>
  ) : null;

const SectionA = () => {
  const { formData, updateSectionA } = useApplicationFormStore();
  const sectionAData = formData.sectionA;

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SectionAFormValues>({
    resolver: zodResolver(sectionASchema),
    defaultValues: {
      contractType: sectionAData?.contractType ?? undefined,
      currency: sectionAData?.currency ?? undefined,
      dateAndRefIncPlanApproval: sectionAData?.dateAndRefIncPlanApproval ?? "",
      operatorOrProjectPromoter: sectionAData?.operatorOrProjectPromoter ?? "",
      dateAndRefNCDMBTechEvaluation:
        sectionAData?.dateAndRefNCDMBTechEvaluation ?? "",
      contractProjectTitle: sectionAData?.contractProjectTitle ?? "",
      dateAndRefNCDMBCommEvaluation:
        sectionAData?.dateAndRefNCDMBCommEvaluation ?? "",
      contractProjectNumber: sectionAData?.contractProjectNumber ?? "",
      commencementDate: sectionAData?.commencementDate ?? "",
      bidCommencementDate: sectionAData?.bidCommencementDate ?? "",
      contractCompletionDate: sectionAData?.contractCompletionDate ?? "",
      mainContractor: sectionAData?.mainContractor ?? "",
      singleSourceApprovalDateAndRef:
        sectionAData?.singleSourceApprovalDateAndRef ?? "",
      contractDuration: sectionAData?.contractDuration ?? "",
      subContractors: sectionAData?.subContractors ?? "",
    },
    mode: "onTouched",
  });

  // Parse existing contractDuration (e.g. "12 Months") into amount + unit
  const parseDuration = (val: string) => {
    const match = val?.match(/^(\d+)\s*(Days|Weeks|Months|Years)$/i);
    return match
      ? { amount: match[1], unit: match[2] as DurationUnit }
      : { amount: "", unit: "Months" as DurationUnit };
  };

  type DurationUnit = "Days" | "Weeks" | "Months" | "Years";
  const parsed = parseDuration(sectionAData?.contractDuration ?? "");
  const [durationAmount, setDurationAmount] = useState(parsed.amount);
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(parsed.unit);

  const updateDuration = (amount: string, unit: DurationUnit) => {
    const combined = amount ? `${amount} ${unit}` : "";
    setValue("contractDuration", combined, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  useEffect(() => {
    const subscription = watch((data) => {
      updateSectionA(data);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateSectionA]);

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        {/* Row 1: Contract Type + Currency */}
        <div className="flex gap-4 col-span-1 md:col-span-2 space-x-2">
          <div className="flex-1 space-y-2">
            <Label className="text-xs text-muted-foreground ml-1">
              Contract Type
            </Label>
            <Controller
              name="contractType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(val) => {
                    field.onChange(val);
                    field.onBlur();
                  }}
                >
                  <SelectTrigger
                    className={`h-12 ${errors.contractType ? "border-destructive" : ""}`}
                  >
                    <SelectValue placeholder="Select Contract Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CALL-OUT">CALL-OUT</SelectItem>
                    <SelectItem value="NON-CALL-OUT">NON CALL-OUT</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.contractType?.message} />
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-xs text-muted-foreground ml-1">
              Currency
            </Label>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(val) => {
                    field.onChange(val);
                    field.onBlur();
                  }}
                >
                  <SelectTrigger
                    className={`h-12 ${errors.currency ? "border-destructive" : ""}`}
                  >
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FUSD">FUSD</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.currency?.message} />
          </div>
        </div>
        <div className="hidden lg:block"></div>
        <div className="hidden lg:block"></div>

        {/* Date and Ref Inc Plan Approval */}
        <div>
          <Controller
            name="dateAndRefIncPlanApproval"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date and Ref Inc Plan Approval"
                value={field.value || ""}
                toDate={new Date()}
                onChange={(val) => {
                  field.onChange(val);
                  field.onBlur();
                }}
              />
            )}
          />
          <FieldError message={errors.dateAndRefIncPlanApproval?.message} />
        </div>

        {/* Operator / Project Promoter */}
        <div>
          <FloatingInput
            label="Name of Operator / Project Promoter"
            aria-invalid={!!errors.operatorOrProjectPromoter}
            {...register("operatorOrProjectPromoter")}
          />
          <FieldError message={errors.operatorOrProjectPromoter?.message} />
        </div>

        {/* NCDMB Tech Evaluation */}
        <div>
          <Controller
            name="dateAndRefNCDMBTechEvaluation"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date of and Ref (NCDMB Tech Evaluation Rpt)"
                value={field.value || ""}
                toDate={new Date()}
                onChange={(val) => {
                  field.onChange(val);
                  field.onBlur();
                }}
              />
            )}
          />
          <FieldError message={errors.dateAndRefNCDMBTechEvaluation?.message} />
        </div>

        {/* Contract Title */}
        <div>
          <FloatingInput
            label="Contract / Project Title"
            aria-invalid={!!errors.contractProjectTitle}
            {...register("contractProjectTitle")}
          />
          <FieldError message={errors.contractProjectTitle?.message} />
        </div>

        {/* NCDMB Comm Evaluation */}
        <div>
          <Controller
            name="dateAndRefNCDMBCommEvaluation"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date of and Ref (NCDMB Comm Evaluation Rpt)"
                value={field.value || ""}
                toDate={new Date()}
                onChange={(val) => {
                  field.onChange(val);
                  field.onBlur();
                }}
              />
            )}
          />
          <FieldError message={errors.dateAndRefNCDMBCommEvaluation?.message} />
        </div>

        {/* 1% NCDF — auto-calculated, disabled */}
        <FloatingInput
          label="1% NCDF: Being the sum of one percent of contract awarded"
          disabled
          value={sectionAData?.onePercentNCDF ?? ""}
          onChange={() => {}}
        />

        {/* Contract / Project Number */}
        <div>
          <FloatingInput
            label="Contract / Project Number"
            aria-invalid={!!errors.contractProjectNumber}
            {...register("contractProjectNumber")}
          />
          <FieldError message={errors.contractProjectNumber?.message} />
        </div>

        {/* Date of Commencement of Contract */}
        <div>
          <Controller
            name="commencementDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date of Commencement of Contract"
                value={field.value || ""}
                toDate={new Date()}
                onChange={(val) => {
                  field.onChange(val);
                  field.onBlur();
                }}
              />
            )}
          />
          <FieldError message={errors.commencementDate?.message} />
        </div>

        {/* NCDMB HCD Training Budget — auto-calculated, disabled */}
        <FloatingInput
          label="NCDMB HCD Training Budget (% of TCV)"
          disabled
          value={sectionAData?.ncdmbHcdTrainingBudgetPercent ?? ""}
          onChange={() => {}}
        />

        {/* Date of Commencement of Bid */}
        <div>
          <Controller
            name="bidCommencementDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date of Commencement of Bid"
                value={field.value || ""}
                toDate={new Date()}
                onChange={(val) => {
                  field.onChange(val);
                  field.onBlur();
                }}
              />
            )}
          />
          <FieldError message={errors.bidCommencementDate?.message} />
        </div>

        {/* Date of Completion of Contract */}
        <div>
          <Controller
            name="contractCompletionDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date of Completion of Contract"
                value={field.value || ""}
                toDate={new Date()}
                onChange={(val) => {
                  field.onChange(val);
                  field.onBlur();
                }}
              />
            )}
          />
          <FieldError message={errors.contractCompletionDate?.message} />
        </div>

        {/* Main Contractor */}
        <div>
          <FloatingInput
            label="Main Contractor"
            aria-invalid={!!errors.mainContractor}
            {...register("mainContractor")}
          />
          <FieldError message={errors.mainContractor?.message} />
        </div>

        {/* Single Source / Selective Approval */}
        <div>
          <Controller
            name="singleSourceApprovalDateAndRef"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date and Ref (Single Source/ Selective Approval) - Not Applicable"
                value={field.value || ""}
                toDate={new Date()}
                onChange={(val) => {
                  field.onChange(val);
                  field.onBlur();
                }}
              />
            )}
          />
          <FieldError
            message={errors.singleSourceApprovalDateAndRef?.message}
          />
        </div>

        {/* Duration of Contract */}
        <div>
          <Label className="text-xs text-muted-foreground ml-1">
            Duration of Contract
          </Label>
          <div className="flex mt-2 px-3 items-center rounded-md border border-input overflow-hidden focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
            <input
              type="number"
              min="1"
              placeholder="e.g. 12"
              value={durationAmount}
              onChange={(e) => {
                setDurationAmount(e.target.value);
                updateDuration(e.target.value, durationUnit);
              }}
              className="h-12 w-full bg-transparent px-3 text-sm outline-none border-none"
              aria-invalid={!!errors.contractDuration}
            />
            <Select
              value={durationUnit}
              onValueChange={(val) => {
                const unit = val as DurationUnit;
                setDurationUnit(unit);
                updateDuration(durationAmount, unit);
              }}
            >
              <SelectTrigger className="h-12 w-28 border-input shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Days">Days</SelectItem>
                <SelectItem value="Weeks">Weeks</SelectItem>
                <SelectItem value="Months">Months</SelectItem>
                <SelectItem value="Years">Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FieldError message={errors.contractDuration?.message} />
        </div>

        <div className="hidden lg:block"></div>

        {/* Sub-contractor */}
        <div className="flex flex-col gap-2 relative">
          <FloatingInput
            label="Sub-Contractor(s)"
            aria-invalid={!!errors.subContractors}
            {...register("subContractors")}
          />
          <FieldError message={errors.subContractors?.message} />
          <p className="text-[10px] text-muted-foreground leading-tight px-1 left-0 max-w-125">
            In line with the statutory requirement of the NOGICD Act 2010,
            Tenderer shall deduct 1% NCDF for every subcontract to be issued on
            this contract and remit same to NCDMB. Failure to remit the said 1%
            NCDF shall be in non-compliance with the requirement of the NOGICD
            Act and be liable for sanctions.
          </p>
        </div>

        {/* Total Fields — auto-calculated, disabled */}
        <FloatingInput
          label="Total NC Spend"
          disabled
          value={sectionAData?.totalNCPercentSpend ?? ""}
          onChange={() => {}}
        />
        <FloatingInput
          label="Total Contract Value"
          disabled
          value={sectionAData?.totalContractValue ?? ""}
          onChange={() => {}}
        />
        <FloatingInput
          label="Total NC% Manhours"
          disabled
          value={sectionAData?.totalNCPercentManhours ?? ""}
          onChange={() => {}}
        />
        <FloatingInput
          label="Total NC Value"
          disabled
          value={sectionAData?.totalNCValue ?? ""}
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default SectionA;
