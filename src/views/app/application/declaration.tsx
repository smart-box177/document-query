import { FloatingInput } from "@/components/ui/floating-input";
import { DatePicker } from "@/components/date-picker";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ISectionA } from "@/interface/application";
import { useApplicationFormStore } from "@/store/application-form.store";

const Declaration = () => {
  const { formData, updateSectionA } = useApplicationFormStore();
  const sectionA = formData.sectionA!;

  const handleChange = (field: keyof ISectionA, value: string) => {
    updateSectionA({ ...sectionA, [field]: value });
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      <div>
        <h3 className="text-base font-semibold">Declaration &amp; Signatures</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Both the Operator and Service Provider representatives must sign the
          declarations below before the application is submitted.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
        {/* ── Operator Declaration ─────────────────────────────── */}
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border/50 shadow-sm">
          <h3 className="font-semibold text-base mb-3 border-b pb-2">
            DECLARATION BY OPERATOR (1-6)
          </h3>
          <ol className="list-decimal list-outside ml-4 space-y-2 text-muted-foreground text-xs leading-relaxed">
            <li>
              We understand that the NCCC is submitted with a view to ensuring
              strict compliance with the letter and spirit of the NOGICD Act, in
              particular the schedule thereto on the utilization of Nigerian
              Goods, Services and personnel as defined in the act.
            </li>
            <li>
              We understand that the agreed Nigerian scope stated in the NCCC
              includes any scope not specifically included in the foreign scope
              or any foreign scope that the NCDMB may in future re-define as
              Nigerian scope.
            </li>
            <li>
              We understand that foreign scope is limited to the items listed in
              the NCCC which shall be procured in compliance with extant
              Guidelines applicable and precedent to the procurement of such
              foreign scope.
            </li>
            <li>
              We undertake that all our Contractors, Sub-contractors and
              Sub-vendors shall be contractually bound to this NCCC, and report
              Nigerian Content Information to the Operator and the Board.
            </li>
            <li>
              We understand that NCDMB's endorsement of the NCCC does not
              preclude it from further exercising any of additional statutory
              responsibilities as may arise from new circumstances not provided
              for in the NCCC; nor does the endorsement discharge the operator,
              its contractors, sub contractors and vendors from their continuing
              obligation to ensure strict compliance with the provisions of the
              NOGICD Act.
            </li>
            <li>
              Operator shall ensure that the process of putting in place, the
              award and execution of this contract in compliance with all
              relevant Sections of the NOGICD Act, 2010 pertaining to host
              community content and catchment area as well as the latest
              revisions of NCDMB Community Content Guidelines to the industry.
            </li>
          </ol>

          <Separator className="my-6" />

          <div className="space-y-6">
            <Label className="font-semibold text-sm">
              Signature of Operator authorised Representative (Contract
              Manager/Contract Holder):
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground bg-background hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Click to Sign digitally
                </p>
                <p className="text-xs mt-1">or drag and drop a signature file</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <FloatingInput
                label="Name"
                className="bg-background"
                value={sectionA.operatorName ?? ""}
                onChange={(e) => handleChange("operatorName", e.target.value)}
              />
              <FloatingInput
                label="Designation"
                className="bg-background"
                value={sectionA.operatorDesignation ?? ""}
                onChange={(e) =>
                  handleChange("operatorDesignation", e.target.value)
                }
              />
              <DatePicker
                label="Date"
                value={sectionA.operatorDate ?? ""}
                onChange={(value) => handleChange("operatorDate", value)}
              />
            </div>
          </div>
        </div>

        {/* ── Service Provider Declaration ──────────────────────── */}
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border/50 shadow-sm">
          <h3 className="font-semibold text-base mb-3 border-b pb-2">
            DECLARATION BY SERVICE PROVIDER (1-5)
          </h3>
          <ol className="list-decimal list-outside ml-4 space-y-2 text-muted-foreground text-xs leading-relaxed">
            <li>
              We understand that the NCCC is submitted with a view to ensuring
              strict compliance with the letter and spirit of the NOGICD Act, in
              particular the schedule thereto on the utilization of Nigerian
              Goods, Services and personnel as defined in the act.
            </li>
            <li>
              We understand that the agreed Nigerian scope stated in the NCCC
              includes any scope not specifically included in the foreign scope
              or any foreign scope that the NCDMB may in future re-define as
              Nigerian scope.
            </li>
            <li>
              We understand that foreign scope is limited to the items listed in
              the NCCC which shall be procured in compliance with extant
              Guidelines applicable and precedent to the procurement of such
              foreign scope.
            </li>
            <li>
              We undertake that all our Sub-contractors and Sub-vendors shall be
              contractually bound to this NCCC, and report Nigerian Content
              Information to the Operator and the Board.
            </li>
            <li>
              We understand that NCDMB's endorsement of the NCCC does not
              preclude it from further exercising any of additional statutory
              responsibilities as may arise from new circumstances not provided
              for in the NCCC; nor does the endorsement discharge the service
              provider, its sub contractors and vendors from their continuing
              obligation to ensure strict compliance with the provisions of the
              NOGICD Act.
            </li>
          </ol>

          <Separator className="my-6" />

          <div className="space-y-6">
            <p className="text-destructive text-xs italic font-medium -mt-2 mb-4">
              *Signing of the Declaration by Service Provider is at the sole
              discretion of the Operator
            </p>
            <Label className="font-semibold text-sm">
              Signature of Service Provider, if applicable (MD to sign):
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground bg-background hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Click to Sign digitally
                </p>
                <p className="text-xs mt-1">or drag and drop a signature file</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <FloatingInput
                label="Name"
                className="bg-background"
                value={sectionA.serviceProviderName ?? ""}
                onChange={(e) =>
                  handleChange("serviceProviderName", e.target.value)
                }
              />
              <FloatingInput
                label="Designation"
                className="bg-background"
                value={sectionA.serviceProviderDesignation ?? ""}
                onChange={(e) =>
                  handleChange("serviceProviderDesignation", e.target.value)
                }
              />
              <DatePicker
                label="Date"
                value={sectionA.serviceProviderDate ?? ""}
                onChange={(value) => handleChange("serviceProviderDate", value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Declaration;
