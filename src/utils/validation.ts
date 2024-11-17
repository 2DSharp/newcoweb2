// utils/validation.ts
type FormData = {
    firstName: string;
    lastName: string;
    password: string;
    mobile: string;
    otp: string;
    storeName: string;
    email: string;
    state: string;
    otpToken: string;
};

export const isStep1Complete = (formData: Partial<FormData>) => {
    return Boolean(
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.password
    );
};

export const isStep2Complete = (formData: Partial<FormData>) => {
    return Boolean(formData.otpToken);
};
