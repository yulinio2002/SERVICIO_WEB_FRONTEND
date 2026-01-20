# Panel Administrativo

## Descripción

El panel administrativo es una interfaz completa para gestionar todos los recursos de la aplicación. Permite crear, editar y eliminar:

- **Empresas**: Información principal de la empresa
- **Marcas**: Marcas de productos
- **Servicios**: Servicios ofrecidos
- **Productos**: Catálogo de productos
- **Proyectos**: Proyectos completados o en portafolio

## Acceso al Panel

1. Navega a `/admin` en la aplicación
2. Se requiere estar autenticado (token JWT válido)
3. Si no estás autenticado, serás redirigido a la página de login

## Características

### 1. Navegación por Pestañas
El panel cuenta con una navegación superior que permite cambiar entre diferentes secciones:
- Empresas
- Marcas
- Servicios
- Productos
- Proyectos

### 2. Operaciones CRUD Completas

Cada sección permite:
- **Crear**: Botón "+ Nuevo [Recurso]" en cada sección
- **Editar**: Botón "Editar" en cada tarjeta
- **Eliminar**: Botón "Eliminar" con confirmación
- **Ver**: Listado completo de todos los recursos

### 3. Formularios Modales

Los formularios se abren en un modal con:
- Validación de campos requeridos
- Indicador de carga durante la operación
- Botones de Guardar y Cancelar

### 4. Alertas

- **Alertas de éxito** (verde): Operación completada exitosamente
- **Alertas de error** (rojo): Problemas durante la operación
- Se muestran automáticamente y se cierran después de 3 segundos

### 5. Confirmación de Eliminación

Antes de eliminar cualquier recurso, se muestra un diálogo de confirmación con:
- Nombre del recurso a eliminar
- Botón de confirmación roja
- Opción de cancelar la operación

## Estructura de Componentes

```
src/components/admin/
├── AdminNav.tsx           # Navegación superior entre secciones
├── AdminModal.tsx         # Modal genérico para formularios
├── DeleteConfirmation.tsx # Diálogo de confirmación de eliminación
├── Alert.tsx             # Componente de alertas
├── MarcasSection.tsx     # Gestión de marcas
├── ServiciosSection.tsx  # Gestión de servicios
├── ProductosSection.tsx  # Gestión de productos
├── ProyectosSection.tsx  # Gestión de proyectos
└── EmpresasSection.tsx   # Gestión de empresas
```

## Campos por Recurso

### Empresas
- Nombre
- RUC
- Dirección
- Número de contacto
- Nosotros (descripción)
- Misión
- Visión
- URL 1 (página web)
- URL 2 (redes sociales)

### Marcas
- Nombre
- URL de imagen

### Servicios
- Nombre
- Descripción
- URL de imagen

### Productos
- Nombre
- Marca
- Descripción
- URL de imagen
- Categorías (checkboxes múltiples)
  - LIMPIEZA
  - PLOMERIA
  - ELECTRICIDAD
  - PINTURA
  - CARPINTERIA

### Proyectos
- Nombre
- Descripción
- URL de imagen

## Integración con API

Todos los componentes utilizan la arquitectura existente:

1. **Servicio Api**: Clase singleton para todas las peticiones HTTP
2. **Servicios específicos**: Cada recurso tiene su servicio en `src/services/`
3. **Caché**: Se invalida automáticamente al crear/editar/eliminar
4. **Autenticación**: Token JWT se envía automáticamente en el header

### Ejemplo de flujo:

```typescript
// 1. Cargar datos iniciales
const marcas = await listarMarcas();

// 2. Crear o editar
await api.post(formData, { url: "/api/marcas" });

// 3. Invalidar caché
cacheDel("marcas:list");

// 4. Recargar datos
await loadMarcas();
```

## Estilos

Se utiliza **Tailwind CSS** para todos los estilos:
- Colores consistentes (azul para acciones, rojo para eliminar, amarillo para editar)
- Hover effects en botones
- Transiciones suaves
- Diseño responsive (móvil, tablet, desktop)
- Grid layout para tarjetas (1 columna en móvil, 3 en desktop)

## Validaciones

### Frontend
- Campos requeridos validados antes de enviar
- Mensajes de error específicos
- Prevención de envíos duplicados (isSubmitting)

### Backend
- Token JWT validado
- Datos validados en el servidor
- Errores devueltos al cliente

## Manejo de Errores

- **Error de carga**: Muestra mensaje "Error al cargar [recurso]"
- **Error de guardado**: Muestra "Error al guardar [recurso]"
- **Error de eliminación**: Muestra "Error al eliminar [recurso]"
- Los errores se muestran en alerts automáticas con desvanecimiento

## Botón de Cerrar Sesión

En la esquina superior derecha del panel hay un botón rojo "Cerrar sesión" que:
1. Limpia el token de autenticación
2. Redirecciona al login
3. Invalida toda la sesión

## Uso Típico

1. **Para crear un nuevo recurso**:
   - Click en "+ Nuevo [Recurso]"
   - Completar el formulario
   - Click en "Guardar"
   - Ver alerta de éxito

2. **Para editar un recurso**:
   - Click en "Editar" en la tarjeta
   - Modificar los campos
   - Click en "Guardar"
   - Ver alerta de éxito

3. **Para eliminar un recurso**:
   - Click en "Eliminar" en la tarjeta
   - Confirmar en el diálogo
   - Ver alerta de éxito

## Performance

- **Caché**: 5-10 minutos para la mayoría de recursos
- **Lazy loading**: Componentes se cargan cuando se selecciona la pestaña
- **Paginación**: Posibilidad de agregar en futuro si muchos registros
- **Optimización**: Evita requests innecesarias con invalidación selectiva de caché

## Futuras Mejoras

- [ ] Paginación para listas grandes
- [ ] Búsqueda y filtros
- [ ] Edición en línea
- [ ] Importación/exportación masiva
- [ ] Auditoría de cambios
- [ ] Roles y permisos diferenciados
- [ ] Gráficas y estadísticas
