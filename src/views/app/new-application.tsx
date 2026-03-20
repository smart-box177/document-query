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
import { FileTextIcon, GraduationCapIcon, ListIcon } from "lucide-react";
import { Badge } from "@/components/reui/badge";
import { useApplicationStore } from "@/store/application.store";
import type { IApplication } from "@/interface/application";

import SectionA from "./application/section-a";
import SectionB from "./application/section-b";
import SectionC from "./application/section-c";

const NewApplicationSubmission = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [activeBTab, setActiveBTab] = useState("b1");
  const [activeB1SubTab, setActiveB1SubTab] = useState("b1-0");
  const [activeCTab, setActiveCTab] = useState("c1");

  const {
    createApplication,
    saveAsDraft,
    saveAndSubmit,
    currentApplication,
    isLoading,
    error,
  } = useApplicationStore();

  // Mock function to get form data (in real scenario, this would collect data from all sections)
  const getFormData = (): Partial<IApplication> => {
    // This is a mock implementation - in real app, you would collect data from all sections
    return {
      sectionA: {
        contractType: "CALL-OUT",
        currency: "USD",
        referenceNumber: "REF-2024-001",
        totalContractValue: "1000000",
        operatorOrProjectPromoter: "Example Operator",
        contractProjectTitle: "Example Project",
        mainContractor: "Example Contractor",
        operatorName: "John Doe",
        operatorDesignation: "Contract Manager",
        operatorDate: new Date().toISOString().split("T")[0],
        dateAndRefIncPlanApproval: "",
        dateAndRefNCDMBTechEvaluation: "",
        totalNCValue: "",
        dateAndRefNCDMBCommEvaluation: "",
        onePercentNCDF: "",
        contractProjectNumber: "",
        commencementDate: "",
        ncdmbHcdTrainingBudgetPercent: "",
        bidCommencementDate: "",
        contractCompletionDate: "",
        singleSourceApprovalDateAndRef: "",
        contractDuration: "",
        subContractors: "",
        totalNCPercentSpend: "",
        totalNCPercentManhours: "",
      },
      sectionB: {
        b1: {
          b1_0: {
            id: "1",
            jobPosition: "",
            companyName: "",
            totalPersonnel: "",
            nigerianNationality: "",
            foreignNationality: "",
            inCountryNigerian: "",
            inCountryExpat: "",
            outCountryNigerian: "",
            outCountryExpat: "",
            ncManhours: "",
            ncSpendValue: "",
            foreignSpendValue: "",
            totalSpendValue: "",
            ncSpendPercent: "",
          },
          b1_1: {
            id: "2",
            jobPosition: "",
            companyName: "",
            totalPersonnel: "",
            nigerianNationality: "",
            foreignNationality: "",
            inCountryNigerian: "",
            inCountryExpat: "",
            outCountryNigerian: "",
            outCountryExpat: "",
            ncManhours: "",
            ncSpendValue: "",
            foreignSpendValue: "",
            totalSpendValue: "",
            ncSpendPercent: "",
          },
          b1_2: {
            id: "3",
            jobPosition: "",
            companyName: "",
            totalPersonnel: "",
            nigerianNationality: "",
            foreignNationality: "",
            inCountryNigerian: "",
            inCountryExpat: "",
            outCountryNigerian: "",
            outCountryExpat: "",
            ncManhours: "",
            ncSpendValue: "",
            foreignSpendValue: "",
            totalSpendValue: "",
            ncSpendPercent: "",
          },
        },
        b2: {
          id: "1",
          procurementItem: "",
          manufacturedInCountry: "",
          inCountryVendor: "",
          outCountryVendor: "",
          uom: "",
          procuredInCountry: "",
          procuredOutCountry: "",
          ncPercent: "",
          ncValue: "",
          foreignValue: "",
          totalValue: "",
          ncSpendPercent: "",
        },
        b3: {
          id: "1",
          equipmentName: "",
          availableInCountry: "",
          inCountryOwner: "",
          outCountryOwner: "",
          nigerianOwnership: "",
          foreignOwnership: "",
          ncPercent: "",
          ncValue: "",
          foreignValue: "",
          totalValue: "",
          ncSpendPercent: "",
        },
        b4: {
          id: "1",
          itemName: "",
          inCountryFabricationYard: "",
          outCountryFabricationYard: "",
          uom: "",
          fabricatedInCountry: "",
          fabricatedOutCountry: "",
          ncPercentTonage: "",
          ncValue: "",
          foreignValue: "",
          totalValue: "",
          ncSpendPercent: "",
        },
        b5: {
          id: "1",
          itemName: "",
          inCountryVendor: "",
          outCountryVendor: "",
          uom: "",
          executedInCountry: "",
          executedOutCountry: "",
          ncPercent: "",
          ncValue: "",
          foreignValue: "",
          totalValue: "",
          ncSpendPercent: "",
        },
        b6: {
          id: "1",
          itemName: "",
          inCountryFirm: "",
          outCountryFirm: "",
          uom: "",
          executedInCountry: "",
          executedOutCountry: "",
          ncPercent: "",
          ncValue: "",
          foreignValue: "",
          totalValue: "",
          ncSpendPercent: "",
        },
      },
      sectionC: {
        c1: { id: "1", trainingScope: "", hcdPercentage: "" },
        c2: {
          id: "1",
          scopeDetails: "",
          projectLocation: "",
          activityDuration: "",
          numberOfPersonnel: "",
          primaryActivity: "",
          outcome: "",
          costOfActivity: "",
        },
        c3: {
          id: "1",
          typeOfResearch: "",
          projectLocation: "",
          activityDuration: "",
          numberOfResearcher: "",
          typeOfResearcher: "",
          briefScopeOfWork: "",
          costOfActivity: "",
        },
      },
    };
  };

  const handleCreateApplication = async () => {
    const formData = getFormData();
    const success = await createApplication(formData);
    if (success) {
      // Move to next step
      setActiveStep(2);
    }
  };

  const handleSaveAsDraft = async () => {
    const formData = getFormData();
    await saveAsDraft(formData, currentApplication?.id);
  };

  const handleSubmit = async () => {
    const formData = getFormData();
    const success = await saveAndSubmit(formData, currentApplication?.id);
    if (success) {
      // Show success message and redirect
      console.log("Application submitted successfully");
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
      <h1 className="text-xl font-bold my-2">
        NCCC New Application Submission
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
                      activeStep === 1
                        ? handleCreateApplication
                        : activeStep === steps.length && activeCTab === "c3"
                        ? handleSubmit
                        : handleNext
                    }
                    disabled={
                      isLoading ||
                      (activeStep === steps.length &&
                        activeCTab === "c3" &&
                        isLoading)
                    }
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                  >
                    {activeStep === 1
                      ? "Create Application"
                      : activeStep === steps.length && activeCTab === "c3"
                      ? "Submit"
                      : activeStep === 2 && activeBTab === "b6"
                      ? "Next Section"
                      : activeStep === 3 && activeCTab === "c3"
                      ? "Submit"
                      : "Next"}
                  </button>
                </div>
              </div>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
};

export default NewApplicationSubmission;
