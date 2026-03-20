import { useContext } from "react";
import { ApplicationFormContext } from "./application-form.context";

export const useApplicationForm = () => {
  const context = useContext(ApplicationFormContext);
  if (!context) {
    throw new Error('useApplicationForm must be used within an ApplicationFormProvider');
  }
  return context;
};