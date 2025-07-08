// src/components/Navbar.tsx
import React from "react";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {Briefcase, ChevronDown, UserCircle} from "lucide-react";
import Button from "./Button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {useAuthContext} from "@contexts/AuthContext.tsx";

interface NavbarProps {
    onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, userInfo } = useAuthContext();

    const handleLogout = () => {
        logout();
        onLogout?.();
        navigate(`/auth/login?from=${encodeURIComponent(location.pathname)}`, {
            replace: true,
        });
    };

    // Determinar el rol del usuario
    const isCliente = userInfo?.role?.includes("ROLE_CLIENTE");
    const isProveedor = userInfo?.role?.includes("ROLE_PROVEEDOR");

    // Obtener el nombre del usuario
    const userName = userInfo?.nombre || "Usuario";

    // Obtener el label del badge
    const badgeLabel = isProveedor ? "Proveedor" : isCliente ? "Cliente" : "Usuario";

    return (
        <nav className="bg-indigo-600">
            <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Briefcase className="w-6 h-6 text-white"/>
                    <span className="text-white font-bold text-lg">ServiMarket</span>
                </div>

                {/* Botones de navegación */}
                <div className="hidden sm:flex space-x-4">
                    {isCliente ? (
                        <>
                            <Button message="Buscar Servicios" to="/serviciosCliente" />
                            <Button message="Mis Reservas" to="/reservasCliente" />
                        </>
                    ) : isProveedor ? (
                        <>
                            <Button message="Mis Servicios" to="/servicios" />
                            <Button message="Mis Reservas" to="/reservas" />
                        </>
                    ) : null}
                </div>

                {/* Perfil */}
                <div className="flex items-center space-x-4">
          <span className="bg-indigo-800 text-white text-sm font-semibold px-3 py-1 rounded-full">
            {badgeLabel}
          </span>

                    <Menu as="div" className="relative">
                        <MenuButton className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 rounded-md px-2 py-1">
                            <UserCircle className="w-8 h-8 text-white"/>
                            <span className="text-white font-medium">{userName}</span>
                            <ChevronDown className="w-4 h-4 text-white"/>
                        </MenuButton>

                        <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 focus:outline-none z-10">
                            <MenuItem>
                                {({active}) => (
                                    <Link
                                        to="/perfil"
                                        className={`block px-4 py-2 text-sm ${
                                            active ? "bg-gray-100" : ""
                                        } text-gray-700`}
                                    >
                                        Mi perfil
                                    </Link>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({active}) => (
                                    <button
                                        onClick={handleLogout}
                                        className={`w-full text-left px-4 py-2 text-sm ${
                                            active ? "bg-gray-100" : ""
                                        } text-gray-700`}
                                    >
                                        Cerrar sesión
                                    </button>
                                )}
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </nav>
    );
};