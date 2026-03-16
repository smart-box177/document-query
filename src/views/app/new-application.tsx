import React, { useState } from 'react'
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
} from '@/components/reui/stepper'

const NewApplicationSubmission = () => {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    { id: 1, title: 'Summary', description: 'Section A' },
    { id: 2, title: 'Agreed Nigerian Content Scope Breakdown', description: 'Section B' },
    { id: 3, title: 'TRAINING, GAP CLOSURE INITIATIVES AND RESEARCH & DEVELOPMENT', description: 'Section C' },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">NCCC New Application Submission</h1>
      
      <Stepper value={activeStep} onValueChange={setActiveStep} className="mb-12">
        <StepperNav className="mb-8">
          {steps.map((step, index) => (
            <StepperItem key={step.id} step={step.id}>
              <StepperTrigger>
                <StepperIndicator>{step.id}</StepperIndicator>
                <div className="flex flex-col">
                  <StepperTitle className='uppercase'>{step.title}</StepperTitle>
                  <StepperDescription className='uppercase'>{step.description}</StepperDescription>
                </div>
              </StepperTrigger>
              {index < steps.length - 1 && <StepperSeparator />}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel>
          {steps.map((step) => (
            <StepperContent key={step.id} value={step.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {/* Empty section body - will be updated later */}
              <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
                <p>This section will be populated with form content.</p>
              </div>
              
              <div className="flex justify-between mt-8">
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
  )
}

export default NewApplicationSubmission