import React, { useState } from "react";
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
  // StepperDescription,
} from "@/components/reui/stepper";
import { FileTextIcon, GraduationCapIcon, ListIcon } from "lucide-react";
import { Badge } from "@/components/reui/badge";

import SectionA from "./application/section-a";
import SectionB from "./application/section-b";
import SectionC from "./application/section-c";

const NewApplicationSubmission = () => {
  const [activeStep, setActiveStep] = useState(1);

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
              <div className="h-[calc(100vh-520px)] min-h-[400px] w-full overflow-y-auto overflow-x-hidden custom-scrollbar">
                {step.id === 1 && <SectionA />}
                {step.id === 2 && <SectionB />}
                {step.id === 3 && <SectionC />}
              </div>

              <div className="flex justify-between mt-6 pt-4 border-t">
                <button
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  disabled={activeStep === 1}
                  className="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
                  disabled={activeStep === steps.length}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activeStep === steps.length ? 'Submit' : 'Next'}
                </button>
              </div>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
};

export default NewApplicationSubmission;
