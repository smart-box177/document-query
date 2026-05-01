import { useState } from "react";
import { FloatingInput } from "@/components/ui/floating-input";
import { DatePicker } from "@/components/date-picker";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { IApplication } from "@/interface/application";
import { useApplicationFormContext } from "@/context/application-form.context";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/config/axios";
import { toast } from "sonner";
import { Loader2Icon, CheckCircle2Icon, AlertTriangleIcon, PenLineIcon } from "lucide-react";
import { Link } from "react-router-dom";

type SignatureRole = "operator" | "serviceProvider";
type DeclarationFields = Pick<IApplication,
  | "operatorSignature" | "operatorSignatureToken" | "operatorName" | "operatorDesignation" | "operatorDate"
  | "serviceProviderSignature" | "serviceProviderSignatureToken" | "serviceProviderName" | "serviceProviderDesignation" | "serviceProviderDate"
>;

interface SignatureBlockProps {
  label: string;
  userSignatureUrl: string | undefined;
  signedUrl: string | null | undefined;
  isSigning: boolean;
  onSign: () => void;
}

const SignatureBlock = ({ label, userSignatureUrl, signedUrl, isSigning, onSign }: SignatureBlockProps) => {
  if (!userSignatureUrl) {
    return (
      <div className="space-y-2">
        <Label className="font-semibold text-sm">{label}</Label>
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 text-sm">
          <AlertTriangleIcon className="size-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-amber-700 dark:text-amber-300">
            No signature found on your account. Please{" "}
            <Link to="/settings" className="font-semibold underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-100">
              update your signature in Settings
            </Link>{" "}
            before signing this declaration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="font-semibold text-sm">{label}</Label>
      <div className="rounded-lg border border-border bg-background p-4 space-y-4">
        {/* Signature image preview */}
        <img
          src={userSignatureUrl}
          alt="Your signature"
          className="max-h-20 object-contain"
        />

        {signedUrl ? (
          <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium">
            <CheckCircle2Icon className="size-3.5" />
            Declaration signed — signature attached
          </div>
        ) : (
          <button
            type="button"
            onClick={onSign}
            disabled={isSigning}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigning ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <PenLineIcon className="size-4" />
            )}
            {isSigning ? "Signing…" : "Click to Sign"}
          </button>
        )}
      </div>
    </div>
  );
};

const Declaration = () => {
  const { formData, updateDeclaration } = useApplicationFormContext();
  const { user } = useAuthStore();

  const [signingOp, setSigningOp] = useState(false);
  const [signingSp, setSigningSp] = useState(false);

  const handleChange = (field: keyof DeclarationFields, value: string) => {
    updateDeclaration({ [field]: value } as DeclarationFields);
  };

  const sign = async (role: SignatureRole, setSigning: (v: boolean) => void) => {
    const signatureUrl = user?.signature;
    if (!signatureUrl) {
      toast.error("Please add your signature in Settings first.");
      return;
    }
    setSigning(true);
    try {
      const signRes = await api.post<{ data: { token: string } }>(
        "/users/sign-declaration",
        { signatureUrl, role }
      );
      const token = signRes.data.data.token;

      if (role === "operator") {
        updateDeclaration({ operatorSignature: signatureUrl, operatorSignatureToken: token });
      } else {
        updateDeclaration({ serviceProviderSignature: signatureUrl, serviceProviderSignatureToken: token });
      }
      toast.success("Declaration signed successfully");
    } catch {
      toast.error("Failed to sign declaration. Please try again.");
    } finally {
      setSigning(false);
    }
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
            <SignatureBlock
              label="Signature of Operator authorised Representative (Contract Manager/Contract Holder):"
              userSignatureUrl={user?.signature}
              signedUrl={formData.operatorSignature ?? null}
              isSigning={signingOp}
              onSign={() => sign("operator", setSigningOp)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <FloatingInput
                label="Name"
                className="bg-background"
                value={formData.operatorName ?? ""}
                onChange={(e) => handleChange("operatorName", e.target.value)}
              />
              <FloatingInput
                label="Designation"
                className="bg-background"
                value={formData.operatorDesignation ?? ""}
                onChange={(e) =>
                  handleChange("operatorDesignation", e.target.value)
                }
              />
              <DatePicker
                label="Date"
                value={formData.operatorDate ?? ""}
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

            <SignatureBlock
              label="Signature of Service Provider, if applicable (MD to sign):"
              userSignatureUrl={user?.signature}
              signedUrl={formData.serviceProviderSignature ?? null}
              isSigning={signingSp}
              onSign={() => sign("serviceProvider", setSigningSp)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <FloatingInput
                label="Name"
                className="bg-background"
                value={formData.serviceProviderName ?? ""}
                onChange={(e) =>
                  handleChange("serviceProviderName", e.target.value)
                }
              />
              <FloatingInput
                label="Designation"
                className="bg-background"
                value={formData.serviceProviderDesignation ?? ""}
                onChange={(e) =>
                  handleChange("serviceProviderDesignation", e.target.value)
                }
              />
              <DatePicker
                label="Date"
                value={formData.serviceProviderDate ?? ""}
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
