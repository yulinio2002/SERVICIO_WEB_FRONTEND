/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "var(--color-primary)",
				secondary: "var(--color-secondary)",
				tertiary: "var(--color-tertiary)",
				"backgorund-color": "var(--color-background)",
				"blue-primary": "#293a4a",
				"gray-primary": "#666",
				"orange-primary": "#ff6b35",
				"grad-primary": "#4a90e2",
				"grad-secondary": "#357abd",
			},
			fontFamily: {
				sans: [
					"Nunito",
					"Inter",
					"system-ui",
					"Avenir",
					"Helvetica",
					"Arial",
					"sans-serif",
				],
			},
		},
	},
	plugins: [],
};
