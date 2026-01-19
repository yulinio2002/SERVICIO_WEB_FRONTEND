import { LoginRequest } from "@interfaces/auth/LoginRequest";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@contexts/AuthContext";
import { getRoleBasedOnToken } from "../../utils/getRoleBasedOnToken";

export default function LoginForm() {
	const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();
	const { login } = useAuthContext();

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError("");

		try {
			await login(formData);
			const role = getRoleBasedOnToken();
			if (role === "ROLE_ADMIN") {
				navigate("/admin", { replace: true });
			} else {
				setError("Solo se permite el rol ADMIN");
			}
		} catch (err: any) {
			setError(err.response?.data?.message || "Error al iniciar sesión");
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Bienvenido a A&D Oleohidraulicos</h2>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
						<input
							type="email"
							name="email"
							id="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="ejemplo@correo.com"
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
						<input
							type="password"
							name="password"
							id="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="••••••••"
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200">
						Iniciar Sesión
					</button>
					{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
				</form>
			</div>
		</div>
	);
}
