import { useApplicationFormStore } from "@/store/application-form.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const DataRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
  <div className="flex flex-col space-y-1 pb-3 border-b border-border/50 last:border-0 last:pb-0">
    <Label className="text-muted-foreground text-xs font-normal">{label}</Label>
    <div className="font-medium text-sm break-words">{value || "—"}</div>
  </div>
);

const ApplicationPreview = () => {
  const { formData } = useApplicationFormStore();
  const { sectionA, sectionB, sectionC } = formData;

  return (
    <div className="space-y-6 pb-10">
      {/* SECTION A */}
      <Card>
        <CardHeader className="bg-muted/50 pb-4">
          <CardTitle className="text-lg">Section A: Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-6">
          <DataRow label="Contract/Project Title" value={sectionA?.contractProjectTitle} />
          <DataRow label="Contract Type" value={sectionA?.contractType} />
          <DataRow label="Currency" value={sectionA?.currency} />
          <DataRow label="Reference Number" value={sectionA?.referenceNumber} />
          <DataRow label="Total Contract Value" value={sectionA?.totalContractValue} />
          <DataRow label="Operator/Project Promoter" value={sectionA?.operatorOrProjectPromoter} />
          <DataRow label="Total NC Value" value={sectionA?.totalNCValue} />
          <DataRow label="1% NCDF" value={sectionA?.onePercentNCDF} />
          <DataRow label="Contract Project Number" value={sectionA?.contractProjectNumber} />
          <DataRow label="Commencement Date" value={sectionA?.commencementDate} />
          <DataRow label="Bid Commencement Date" value={sectionA?.bidCommencementDate} />
          <DataRow label="Contract Completion Date" value={sectionA?.contractCompletionDate} />
          <DataRow label="Main Contractor" value={sectionA?.mainContractor} />
          <DataRow label="Contract Duration" value={sectionA?.contractDuration} />
          <DataRow label="Total NC % Spend" value={sectionA?.totalNCPercentSpend} />
          <DataRow label="Total NC % Manhours" value={sectionA?.totalNCPercentManhours} />
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <DataRow label="Sub Contractors" value={sectionA?.subContractors} />
          </div>
        </CardContent>
      </Card>

      {/* SECTION B */}
      <Card>
        <CardHeader className="bg-muted/50 pb-4">
          <CardTitle className="text-lg">Section B: Agreed Nigerian Content Scope Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          
          {/* B1: Personnel */}
          <div>
            <h3 className="text-md font-semibold mb-3">B1: Personnel</h3>
            {["b1_0", "b1_1", "b1_2"].map((key) => {
              const record = sectionB?.b1?.[key as keyof typeof sectionB.b1];
              if (!record || !record.jobPosition) return null;
              return (
                <div key={key} className="mb-4 border rounded-md p-4 bg-muted/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataRow label="Job Position" value={record.jobPosition} />
                  <DataRow label="Company Name" value={record.companyName} />
                  <DataRow label="Total Personnel" value={record.totalPersonnel} />
                  <DataRow label="NC Spend Value" value={record.ncSpendValue} />
                  <DataRow label="Total Spend Value" value={record.totalSpendValue} />
                  <DataRow label="NC Spend Percent" value={record.ncSpendPercent} />
                </div>
              );
            })}
          </div>

          {/* B2: Procurement */}
          {sectionB?.b2 && sectionB.b2.length > 0 && sectionB.b2.some(r => r.procurementItem) && (
            <div>
              <h3 className="text-md font-semibold mb-3">B2: Procurement</h3>
              {sectionB.b2.filter(r => r.procurementItem).map((record, idx) => (
                <div key={idx} className="mb-4 border rounded-md p-4 bg-muted/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataRow label="Procurement Item" value={record.procurementItem} />
                  <DataRow label="NC Value" value={record.ncValue} />
                  <DataRow label="Total Value" value={record.totalValue} />
                </div>
              ))}
            </div>
          )}

          {/* B3: Equipment */}
          {sectionB?.b3 && sectionB.b3.length > 0 && sectionB.b3.some(r => r.equipmentName) && (
            <div>
              <h3 className="text-md font-semibold mb-3">B3: Equipment</h3>
              {sectionB.b3.filter(r => r.equipmentName).map((record, idx) => (
                <div key={idx} className="mb-4 border rounded-md p-4 bg-muted/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataRow label="Equipment Name" value={record.equipmentName} />
                  <DataRow label="NC Value" value={record.ncValue} />
                  <DataRow label="Total Value" value={record.totalValue} />
                </div>
              ))}
            </div>
          )}

          {/* B4: Fabrication */}
          {sectionB?.b4 && sectionB.b4.length > 0 && sectionB.b4.some(r => r.itemName) && (
            <div>
              <h3 className="text-md font-semibold mb-3">B4: Fabrication</h3>
              {sectionB.b4.filter(r => r.itemName).map((record, idx) => (
                <div key={idx} className="mb-4 border rounded-md p-4 bg-muted/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataRow label="Item Name" value={record.itemName} />
                  <DataRow label="NC Value" value={record.ncValue} />
                  <DataRow label="Total Value" value={record.totalValue} />
                </div>
              ))}
            </div>
          )}

          {/* B5: Other Services */}
          {sectionB?.b5 && sectionB.b5.length > 0 && sectionB.b5.some(r => r.itemName) && (
            <div>
              <h3 className="text-md font-semibold mb-3">B5: Other Services</h3>
              {sectionB.b5.filter(r => r.itemName).map((record, idx) => (
                <div key={idx} className="mb-4 border rounded-md p-4 bg-muted/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataRow label="Item Name" value={record.itemName} />
                  <DataRow label="NC Value" value={record.ncValue} />
                  <DataRow label="Total Value" value={record.totalValue} />
                </div>
              ))}
            </div>
          )}

          {/* B6: Professional Services */}
          {sectionB?.b6 && sectionB.b6.length > 0 && sectionB.b6.some(r => r.itemName) && (
            <div>
              <h3 className="text-md font-semibold mb-3">B6: Professional Services</h3>
              {sectionB.b6.filter(r => r.itemName).map((record, idx) => (
                <div key={idx} className="mb-4 border rounded-md p-4 bg-muted/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataRow label="Item Name" value={record.itemName} />
                  <DataRow label="NC Value" value={record.ncValue} />
                  <DataRow label="Total Value" value={record.totalValue} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION C */}
      <Card>
        <CardHeader className="bg-muted/50 pb-4">
          <CardTitle className="text-lg">Section C: Training, Gap Closure & R&D</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {sectionC?.c1 && sectionC.c1.trainingScope && (
            <div>
              <h3 className="text-md font-semibold mb-3">C1: HCD Training</h3>
              <div className="border rounded-md p-4 bg-muted/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DataRow label="Training Scope" value={sectionC.c1.trainingScope} />
                <DataRow label="HCD Percentage" value={sectionC.c1.hcdPercentage} />
              </div>
            </div>
          )}

          {sectionC?.c2 && sectionC.c2.scopeDetails && (
            <div>
              <h3 className="text-md font-semibold mb-3">C2: Capacity Development</h3>
              <div className="border rounded-md p-4 bg-muted/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                <DataRow label="Scope Details" value={sectionC.c2.scopeDetails} />
                <DataRow label="Project Location" value={sectionC.c2.projectLocation} />
                <DataRow label="Cost of Activity" value={sectionC.c2.costOfActivity} />
              </div>
            </div>
          )}

          {sectionC?.c3 && sectionC.c3.typeOfResearch && (
            <div>
              <h3 className="text-md font-semibold mb-3">C3: Research & Development</h3>
              <div className="border rounded-md p-4 bg-muted/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                <DataRow label="Type of Research" value={sectionC.c3.typeOfResearch} />
                <DataRow label="Brief Scope of Work" value={sectionC.c3.briefScopeOfWork} />
                <DataRow label="Cost of Activity" value={sectionC.c3.costOfActivity} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationPreview;
