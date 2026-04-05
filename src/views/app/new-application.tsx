import { useState } from "react";
import {
  Stepper,
  StepperNav,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperPanel,
  StepperContent,
  StepperDescription,
} from "@/components/reui/stepper";
import { FileTextIcon, GraduationCapIcon, ListIcon, PlusIcon, EyeIcon, PenLineIcon } from "lucide-react";
import { Badge } from "@/components/reui/badge";
import { useApplicationStore } from "@/store/application.store";
import { useApplicationFormStore } from "@/store/application-form.store";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import SectionA from "./application/section-a";
import SectionB from "./application/section-b";
import SectionC from "./application/section-c";
import Declaration from "./application/declaration";
import ApplicationPreview from "./application/preview";

// Helper function to count filled fields recursively
const countFilledFields = (obj: unknown): { filled: number; total: number } => {
  if (obj === null || obj === undefined) {
    return { filled: 0, total: 0 };
  }

  if (typeof obj !== "object") {
    // Primitive value: count as total 1, filled if truthy (non-empty string, non-zero number, etc.)
    return { filled: obj ? 1 : 0, total: 1 };
  }

  if (Array.isArray(obj)) {
    // Array: sum up counts from each element
    return obj.reduce(
      (acc, item) => {
        const result = countFilledFields(item);
        return { filled: acc.filled + result.filled, total: acc.total + result.total };
      },
      { filled: 0, total: 0 }
    );
  }

  // Object: sum up counts from each property
  return Object.entries(obj as Record<string, unknown>).reduce(
    (acc: { filled: number; total: number }, [key, value]) => {
      if (key === "id" || key === "_id") return acc;
      const result = countFilledFields(value);
      return { filled: acc.filled + result.filled, total: acc.total + result.total };
    },
    { filled: 0, total: 0 } as { filled: number; total: number }
  );
};

// Calculate overall completion percentage
const calculateCompletionPercentage = (formData: unknown): number => {
  const { filled, total } = countFilledFields(formData);
  if (total === 0) return 0;
  return Math.round((filled / total) * 100);
};

const NewApplicationSubmission = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [activeBTab, setActiveBTab] = useState("b1");
  const [activeB1SubTab, setActiveB1SubTab] = useState("b1-0");
  const [activeCTab, setActiveCTab] = useState("c1");
  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    createApplication,
    saveAsDraft,
    saveAndSubmit,
    clearCurrentApplication,
    currentApplication,
    applications,
    isLoading,
    error,
  } = useApplicationStore();

  const { formData, resetForm } = useApplicationFormStore();

  const completionPercentage = calculateCompletionPercentage(formData);
  const isFormEmpty = completionPercentage === 0;

  const handleNewApplication = () => {
    resetForm();
    clearCurrentApplication();
    setActiveStep(1);
    setActiveBTab("b1");
    setActiveB1SubTab("b1-0");
    setActiveCTab("c1");
    toast.success("Form cleared. You can start a new application.");
  };

  const handleCreateApplication = async () => {
    const success = await createApplication(formData);
    if (success) {
      toast.success("Application created successfully");
      setActiveStep(2);
    } else if (error) {
      toast.error(error);
    }
  };

  const handleSaveAsDraft = async () => {
    const success = await saveAsDraft(formData, currentApplication?.id);
    if (success) {
      toast.success("Application saved as draft");
    } else if (error) {
      toast.error(error);
    }
  };

  const handleSubmit = async () => {
    const success = await saveAndSubmit(formData, currentApplication?.id);
    if (success) {
      toast.success("Application submitted successfully");
      resetForm();
      setActiveStep(1);
      setActiveBTab("b1");
      setActiveB1SubTab("b1-0");
      setActiveCTab("c1");
    } else if (error) {
      toast.error(error);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Summary",
      description: "Section A",
      icon: <FileTextIcon className="size-4" />,
    },
    {
      id: 2,
      title: "Agreed Nigerian Content Scope Breakdown",
      description: "Section B",
      icon: <ListIcon className="size-4" />,
    },
    {
      id: 3,
      title: "TRAINING, GAP CLOSURE INITIATIVES AND RESEARCH & DEVELOPMENT",
      description: "Section C",
      icon: <GraduationCapIcon className="size-4" />,
    },
    {
      id: 4,
      title: "Declaration & Signatures",
      description: "Declaration",
      icon: <PenLineIcon className="size-4" />,
    },
    {
      id: 5,
      title: "Preview",
      description: "Review Application",
      icon: <EyeIcon className="size-4" />,
    },
  ];

  const bTabs = ["b1", "b2", "b3", "b4", "b5", "b6"];
  const cTabs = ["c1", "c2", "c3"];

  const handleNext = () => {
    if (activeStep === 2) {
      // Section B sub-tabs
      if (activeBTab === "b1") {
        // B1 sub-tabs
        const b1SubTabs = ["b1-0", "b1-1", "b1-2"];
        const currentB1Index = b1SubTabs.indexOf(activeB1SubTab);
        if (currentB1Index < b1SubTabs.length - 1) {
          setActiveB1SubTab(b1SubTabs[currentB1Index + 1]);
          return;
        }
      }
      // Main B tabs
      const currentBIndex = bTabs.indexOf(activeBTab);
      if (currentBIndex < bTabs.length - 1) {
        setActiveBTab(bTabs[currentBIndex + 1]);
        // Reset B1 sub-tab to first when moving to a new B tab
        if (bTabs[currentBIndex + 1] === "b1") {
          setActiveB1SubTab("b1-0");
        }
        return;
      }
    } else if (activeStep === 3) {
      // Section C sub-tabs
      const currentCIndex = cTabs.indexOf(activeCTab);
      if (currentCIndex < cTabs.length - 1) {
        setActiveCTab(cTabs[currentCIndex + 1]);
        return;
      }
    }
    // Move to next main step if all sub-tabs are completed
    setActiveStep(Math.min(steps.length, activeStep + 1));
  };

  const handlePrevious = () => {
    if (activeStep === 2) {
      // Section B sub-tabs
      if (activeBTab === "b1") {
        // B1 sub-tabs
        const b1SubTabs = ["b1-0", "b1-1", "b1-2"];
        const currentB1Index = b1SubTabs.indexOf(activeB1SubTab);
        if (currentB1Index > 0) {
          setActiveB1SubTab(b1SubTabs[currentB1Index - 1]);
          return;
        }
      }
      // Main B tabs
      const currentBIndex = bTabs.indexOf(activeBTab);
      if (currentBIndex > 0) {
        setActiveBTab(bTabs[currentBIndex - 1]);
        // Reset B1 sub-tab to first when moving to B1 tab
        if (bTabs[currentBIndex - 1] === "b1") {
          setActiveB1SubTab("b1-0");
        }
        return;
      }
    } else if (activeStep === 3) {
      // Section C sub-tabs
      const currentCIndex = cTabs.indexOf(activeCTab);
      if (currentCIndex > 0) {
        setActiveCTab(cTabs[currentCIndex - 1]);
        return;
      }
    } else if (activeStep === 4) {
      // Moving from Declaration back to Section C
      setActiveStep(3);
      setActiveCTab("c3");
      return;
    } else if (activeStep === 5) {
      // Moving from Preview back to Declaration
      setActiveStep(4);
      return;
    }
    // Move to previous main step
    setActiveStep(Math.max(1, activeStep - 1));
    // Reset sub-tabs to first when moving to a new step
    if (activeStep === 3) {
      setActiveBTab("b1");
      setActiveB1SubTab("b1-0");
    }
  };

  return (
    <div className="container mx-auto pt-2 px-4 overflow-y-hidden">
       <h1 className="text-xl font-bold my-2 flex items-center justify-between">
         <div className="flex items-center gap-2">
           NCCC New Application Submission
           {currentApplication && (
             <span className="text-muted-foreground text-sm">
               (Ref. No.: {applications.find(app => app._id === currentApplication?._id)?.sectionA?.referenceNumber || "N/A"})
             </span>
           )}
         </div>
         <div className="flex items-center gap-3">
           <Badge variant="outline" className="text-sm font-semibold">
             {completionPercentage}% Complete
           </Badge>
           <button
             onClick={() => setPreviewOpen(true)}
             disabled={isFormEmpty}
             className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <EyeIcon className="size-4" />
             Preview
           </button>
           <button
             onClick={handleNewApplication}
             className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground text-sm font-medium"
           >
             <PlusIcon className="size-4" />
             New Application
           </button>
         </div>
       </h1>

      <Stepper
        value={activeStep}
        onValueChange={setActiveStep}
        className="mb-3"
      >
        <StepperNav className="gap-3">
          {steps.map((step, index) => (
            <StepperItem
              key={index}
              step={index + 1}
              className="relative flex-1 items-start"
            >
              <StepperTrigger
                className="flex grow flex-col items-start justify-center gap-2.5"
                asChild
              >
                <StepperIndicator className="data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground data-[state=completed]:bg-success size-8 border-2 data-[state=completed]:text-white data-[state=inactive]:bg-transparent">
                  {step.icon}
                </StepperIndicator>
                <div className="flex flex-col items-start gap-1 pb-4">
                  <StepperTitle className="group-data-[state=inactive]/step:text-muted-foreground uppercase text-start text-base font-semibold">
                    {step.description}
                  </StepperTitle>
                  <StepperDescription className="text-xs">
                    {step.title}
                  </StepperDescription>
                  <div>
                    <Badge
                      size="sm"
                      variant="primary-light"
                      className="hidden group-data-[state=active]/step:inline-flex"
                    >
                      In Progress
                    </Badge>
                    <Badge
                      variant="success-light"
                      size="sm"
                      className="hidden group-data-[state=completed]/step:inline-flex"
                    >
                      Completed
                    </Badge>
                    <Badge
                      variant="secondary"
                      size="sm"
                      className="text-muted-foreground hidden group-data-[state=inactive]/step:inline-flex"
                    >
                      Pending
                    </Badge>
                  </div>
                </div>
              </StepperTrigger>

              {steps.length > index + 1 && (
                <StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-x-0 start-9 top-4 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
              )}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel className="text-sm">
          {steps.map((step, index) => (
            <StepperContent
              key={index}
              value={index + 1}
              className="bg-card text-card-foreground border border-border/50 rounded-lg shadow-md p-6"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
              </div>

              {/* Section body */}
              <div className="h-[calc(100vh-520px)] min-h-100 w-full overflow-y-auto overflow-x-hidden custom-scrollbar">
                {step.id === 1 && <SectionA />}
                {step.id === 2 && (
                  <SectionB
                    activeTab={activeBTab}
                    activeB1SubTab={activeB1SubTab}
                    onTabChange={setActiveBTab}
                    onB1SubTabChange={setActiveB1SubTab}
                  />
                )}
                {step.id === 3 && (
                  <SectionC
                    activeTab={activeCTab}
                    onTabChange={setActiveCTab}
                  />
                )}
                {step.id === 4 && <Declaration />}
                {step.id === 5 && <ApplicationPreview />}
              </div>

              <div className="flex justify-between mt-6 pt-4 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={
                    activeStep === 1 &&
                    activeBTab === "b1" &&
                    activeCTab === "c1"
                  }
                  className="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveAsDraft}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={
                      activeStep === 1 && !currentApplication
                        ? handleCreateApplication
                        : activeStep === steps.length
                        ? handleSubmit
                        : handleNext
                    }
                    disabled={
                      isLoading ||
                      (activeStep === steps.length && isLoading)
                    }
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                  >
                    {activeStep === 1 && !currentApplication
                      ? "Create Application"
                      : activeStep === steps.length
                      ? "Submit"
                      : activeStep === 2 && activeBTab === "b6"
                      ? "Next Section"
                      : activeStep === 3 && activeCTab === "c3"
                      ? "Next Section"
                      : activeStep === 4
                      ? "Preview Application"
                      : "Next"}
                  </button>
                </div>
              </div>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>

      {/* Preview Drawer — opens at any step to show current form progress */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto px-4">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <EyeIcon className="size-4" />
              Application Preview
            </SheetTitle>
            <SheetDescription>
              A read-only snapshot of your application so far.
              {completionPercentage < 100 && (
                <span className="ml-1 text-amber-600 dark:text-amber-400 font-medium">
                  ({completionPercentage}% complete — some fields may be empty)
                </span>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="pt-4 custom-scrollbar">
            <ApplicationPreview />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NewApplicationSubmission;
