import { useEffect, useMemo, useState } from "react";
import AdminModal from "./AdminModal"; // mismo modal usado por EmpresasSection
import { Role } from "@interfaces/user/Role";
import type { Persona } from "@interfaces/persona/Persona";
import {
	adminCreateUser,
	adminListUsers,
	adminUpdateUser,
	type AdminUserRow,
} from "@services/auth/adminUsers";

type FormState = {
	id?: number;
	email: string;
	password: string; // solo obligatorio al crear
	address: string;
	persona: Persona;
	role: Role; // seleccion única: ROLE_ADMIN o ROLE_EMPLEADO
};

const emptyForm = (): FormState => ({
	email: "",
	password: "",
	address: "",
	persona: { nombre: "", apellido: "", telefono: "" },
	role: Role.ROLE_EMPLEADO,
});

export default function UsersSection() {
	const [users, setUsers] = useState<AdminUserRow[]>([]);
	const [loading, setLoading] = useState(true);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formData, setFormData] = useState<FormState>(emptyForm());
	const [error, setError] = useState<string | null>(null);

	const loadUsers = async () => {
		try {
			setLoading(true);
			const data = await adminListUsers();
			setUsers(data);
			setError(null);
		} catch (err) {
			console.error(err);
			setError("Error al cargar usuarios");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const normalizedUsers = useMemo(() => {
		return users.map((u) => {
			const rolesArr = Array.isArray(u.roles)
				? u.roles
				: Array.from(u.roles ?? []);
			return {
				...u,
				rolesArr,
				addressNorm: (u.address ?? u.direccion ?? "") as string,
				telefonoNorm: (u.persona?.telefono ?? u.telefono ?? "") as string,
				nombreNorm: u.persona?.nombre ?? "",
				apellidoNorm: u.persona?.apellido ?? "",
			};
		});
	}, [users]);

	const handleOpenModal = (u?: AdminUserRow) => {
		if (u?.id) {
			const rolesArr = Array.isArray(u.roles)
				? u.roles
				: Array.from(u.roles ?? []);
			const mainRole = rolesArr.includes(Role.ROLE_ADMIN)
				? Role.ROLE_ADMIN
				: Role.ROLE_EMPLEADO;

			setFormData({
				id: u.id,
				email: u.email ?? "",
				password: "", // no forzar update de password
				address: (u.address ?? u.direccion ?? "") as string,
				persona: {
					nombre: u.persona?.nombre ?? "",
					apellido: u.persona?.apellido ?? "",
					telefono: (u.persona?.telefono ?? u.telefono ?? "") as string,
				},
				role: mainRole,
			});
			setEditingId(u.id);
		} else {
			setFormData(emptyForm());
			setEditingId(null);
		}

		setError(null);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setFormData(emptyForm());
		setEditingId(null);
		setError(null);
	};

	const validate = (): string | null => {
		if (!formData.email.trim()) return "El email es obligatorio";
		if (!editingId && !formData.password.trim())
			return "La contraseña es obligatoria al crear";
		if (!formData.persona.nombre.trim()) return "El nombre es obligatorio";
		if (!formData.persona.apellido.trim()) return "El apellido es obligatorio";
		if (!formData.persona.telefono.trim()) return "El teléfono es obligatorio";
		if (![Role.ROLE_ADMIN, Role.ROLE_EMPLEADO].includes(formData.role))
			return "El rol debe ser ADMIN o EMPLEADO";
		return null;
	};

	const handleSubmit = async () => {
		const v = validate();
		if (v) {
			setError(v);
			return;
		}

		setIsSubmitting(true);
		try {
			if (editingId) {
				// UPDATE: no enviar password si está vacío
				const payload: any = {
					email: formData.email.trim(),
					roles: [formData.role],
					address: formData.address.trim(),
					direccion: formData.address.trim(),
					persona: {
						nombre: formData.persona.nombre.trim(),
						apellido: formData.persona.apellido.trim(),
						telefono: formData.persona.telefono.trim(),
					},
				};

				if (formData.password.trim())
					payload.password = formData.password.trim();

				await adminUpdateUser(editingId, payload);
			} else {
				// CREATE
				await adminCreateUser({
					email: formData.email.trim(),
					password: formData.password.trim(),
					direccion: formData.address.trim(),
					address: formData.address.trim(),
					persona: {
						nombre: formData.persona.nombre.trim(),
						apellido: formData.persona.apellido.trim(),
						telefono: formData.persona.telefono.trim(),
					},
					roles: [formData.role],
				});
			}

			await loadUsers();
			handleCloseModal();
		} catch (err) {
			console.error(err);
			setError(
				"Error al guardar usuario (revisa endpoint/validaciones del backend)",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading)
		return <div className="text-center py-8">Cargando usuarios...</div>;

	return (
		<div>
			{error && (
				<div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
					{error}
				</div>
			)}

			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Usuarios</h2>
				<button
					onClick={() => handleOpenModal()}
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					+ Nuevo Usuario
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4">
				{normalizedUsers.map((u) => (
					<div
						key={u.id}
						className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h3 className="font-bold text-lg mb-2">
									{u.nombreNorm} {u.apellidoNorm}
								</h3>
								<p className="text-sm text-gray-600 mb-1">
									<strong>Email:</strong> {u.email}
								</p>
								<p className="text-sm text-gray-600 mb-1">
									<strong>Teléfono:</strong> {u.telefonoNorm || "—"}
								</p>
								<p className="text-sm text-gray-600 mb-1">
									<strong>Dirección:</strong> {u.addressNorm || "—"}
								</p>
							</div>

							<div>
								<p className="text-sm text-gray-600 mb-1">
									<strong>Roles:</strong>{" "}
									{(u.rolesArr?.length ? u.rolesArr : ["—"]).join(", ")}
								</p>
								<p className="text-xs text-gray-500">
									Nota: No se permite eliminar usuarios desde el panel.
								</p>
							</div>
						</div>

						<div className="mt-4 flex gap-2">
							<button
								onClick={() => handleOpenModal(u)}
								className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm"
							>
								Editar
							</button>
						</div>
					</div>
				))}
			</div>

			<AdminModal
				isOpen={isModalOpen}
				title={editingId ? "Editar Usuario" : "Nuevo Usuario"}
				onClose={handleCloseModal}
				onSubmit={handleSubmit}
				isLoading={isSubmitting}
			>
				<div className="space-y-4 max-h-96 overflow-y-auto">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="correo@empresa.com"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Contraseña {editingId ? "(opcional)" : "(obligatoria)"}
						</label>
						<input
							type="password"
							value={formData.password}
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder={
								editingId ? "Dejar vacío para no cambiar" : "********"
							}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Nombre
							</label>
							<input
								type="text"
								value={formData.persona.nombre}
								onChange={(e) =>
									setFormData({
										...formData,
										persona: { ...formData.persona, nombre: e.target.value },
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Nombre"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Apellido
							</label>
							<input
								type="text"
								value={formData.persona.apellido}
								onChange={(e) =>
									setFormData({
										...formData,
										persona: { ...formData.persona, apellido: e.target.value },
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Apellido"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Teléfono
							</label>
							<input
								type="tel"
								value={formData.persona.telefono}
								onChange={(e) =>
									setFormData({
										...formData,
										persona: { ...formData.persona, telefono: e.target.value },
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="+51 999 999 999"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Rol
							</label>
							<select
								value={formData.role}
								onChange={(e) =>
									setFormData({ ...formData, role: e.target.value as Role })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value={Role.ROLE_EMPLEADO}>ROLE_EMPLEADO</option>
								<option value={Role.ROLE_ADMIN}>ROLE_ADMIN</option>
							</select>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Dirección
						</label>
						<input
							type="text"
							value={formData.address}
							onChange={(e) =>
								setFormData({ ...formData, address: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Dirección"
						/>
					</div>
				</div>
			</AdminModal>
		</div>
	);
}
