/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContractType, type ISectionA } from "@/interface/application";

// ─── B1 row ───────────────────────────────────────────────────────────────────

export const computeB1Row = (row: any): any => {
  if (!row) return row;
  const nc = parseFloat(row.ncSpendValue) || 0;
  const foreign = parseFloat(row.foreignSpendValue) || 0;
  return { ...row, totalSpendValue: (nc + foreign).toString() };
};

// ─── B2–B6 array rows ─────────────────────────────────────────────────────────

export const computeArrayRows = (rows: any[]): any[] =>
  Array.isArray(rows)
    ? rows.map((row: any) => {
        const nc = parseFloat(row.ncValue) || 0;
        const foreign = parseFloat(row.foreignValue) || 0;
        return { ...row, totalValue: (nc + foreign).toString() };
      })
    : rows;

// ─── Section A derived values ─────────────────────────────────────────────────

export const calculateTotalContractValue = (sectionB: any): string => {
  let total = 0;

  if (sectionB.b1) {
    total += parseFloat(sectionB.b1.b1_0?.totalSpendValue) || 0;
    total += parseFloat(sectionB.b1.b1_1?.totalSpendValue) || 0;
    total += parseFloat(sectionB.b1.b1_2?.totalSpendValue) || 0;
  }

  const sumValues = (records: any[]): number =>
    Array.isArray(records)
      ? records.reduce((sum, r) => sum + (parseFloat(r.totalValue) || 0), 0)
      : 0;

  total += sumValues(sectionB.b2);
  total += sumValues(sectionB.b3);
  total += sumValues(sectionB.b4);
  total += sumValues(sectionB.b5);

  return total.toString();
};

export const calculateTotalNCValue = (sectionB: any): string => {
  let total = 0;

  if (sectionB.b1) {
    total += parseFloat(sectionB.b1.b1_0?.ncSpendValue) || 0;
    total += parseFloat(sectionB.b1.b1_1?.ncSpendValue) || 0;
    total += parseFloat(sectionB.b1.b1_2?.ncSpendValue) || 0;
  }

  const sumNC = (records: any[]): number =>
    Array.isArray(records)
      ? records.reduce((sum, r) => sum + (parseFloat(r.ncValue) || 0), 0)
      : 0;

  total += sumNC(sectionB.b2);
  total += sumNC(sectionB.b3);
  total += sumNC(sectionB.b4);
  total += sumNC(sectionB.b5);

  return total.toString();
};

export const calculateOnePercentNCDF = (
  totalContractValue: string,
  sectionA: ISectionA
): string => {
  if (sectionA?.contractType === ContractType.CALL_OUT) {
    return "1% of Every PO Shall be Applicable as NCDF";
  }
  const value = parseFloat(totalContractValue) || 0;
  return (value * 0.01).toString();
};

export const calculateNCDMBHcdTrainingBudgetPercent = (sectionC: any): string => {
  return sectionC?.c1?.hcdPercentage ?? "";
};
