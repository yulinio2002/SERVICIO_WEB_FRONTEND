// src/interfaces/servicio/QuoteForm.ts
export interface QuoteFormData {
	formTitle: string;
	formType: string;
	formId: number;
	company: string;
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	message: string;
	privacyPolicyAndDataUse: boolean;
}

export interface QuoteFormErrors {
	company?: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	email?: string;
	message?: string;
	privacyPolicyAndDataUse?: string;
}

export interface QuoteFormResponse {
	success: boolean;
	message: string;
	data?: {
		id: number;
		createdAt: string;
	};
}
