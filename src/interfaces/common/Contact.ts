
// src/interfaces/common/Contact.ts
export interface ContactInfo {
	address: string;
	emails: string[];
	phones: string[];
	socialMedia: SocialMedia[];
}

export interface SocialMedia {
	platform: string;
	url: string;
	icon: string;
}
