import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface FormState {
  isSubmitting: boolean;
  credentials: any | object;
  errors: any | object;
}

interface FormMethods {
  setCredentials: (credentials: FormState["credentials"]) => void;
  setErrors: (errors: FormState["errors"]) => void;
  setCredential: (field: string, value: any) => void;
  setError: (field: string, value: any) => void;
  submitting: (state: boolean) => void;
}

export const useForm = create<FormState & FormMethods>()(
  devtools((set, get) => ({
    isSubmitting: false,
    credentials: {},
    errors: {},
    setCredentials: (credentials) => {
      set({
        credentials: credentials,
      });
    },
    setCredential: (field, value) => {
      set({
        credentials: { ...get().credentials, [field]: value },
        errors: { ...get().errors, [field]: undefined },
      });
    },
    setError: (field, value) => {
      set({
        credentials: { ...get().credentials, [field]: value },
      });
    },
    setErrors: (errors) => {
      set({
        errors: errors,
      });
    },
    submitting: (state) => {
      set({
        isSubmitting: state,
      });
    },
  }))
);
