# TecnoShop Pro

Aplicación web de comercio electrónico desarrollada como proyecto de prueba técnica. Permite consultar un catálogo de productos, administrar productos y categorías, gestionar usuarios mediante autenticación y consultar productos provenientes de una API externa.

## Tecnologías utilizadas

### Backend
- **PHP 8.4:** lenguaje de programación.
- **Laravel 13:** framework para el desarrollo de la API REST.
- **Laravel Sanctum:** autenticación mediante tokens.
- **MySQL:** sistema gestor de base de datos.
- **Eloquent ORM:** administración de modelos y relaciones.

### Frontend
- **React 19:** biblioteca para la construcción de interfaces.
- **React Router 7:** administración de rutas.
- **Vite 8:** herramienta de desarrollo y compilación.
- **JavaScript:** lógica de la aplicación.
- **HTML5 y CSS3:** estructura y estilos de la interfaz.

### Pruebas
- **PHPUnit 12:** ejecución de pruebas automatizadas.
- **Laravel Feature Tests:** validación del comportamiento de los endpoints de la API.

## Requisitos previos

Para ejecutar el proyecto se necesitan las siguientes herramientas:

| Herramienta | Versión utilizada |
|---|---|
| PHP | 8.4.27 |
| Laravel | 13.39.0 |
| Composer | 2.10.3 |
| Node.js | 26.13.0 |
| npm | 11.20.0 |
| MySQL | 26.7.0 |

También se requiere Git para clonar el repositorio.

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/yarapaulina01/TuringIA.git
cd TuringIA
```

### 2. Instalar dependencias del backend

Desde la carpeta raíz del proyecto, ejecutar:

```bash
composer install
```

### 3. Configurar las variables de entorno

Crear el archivo `.env` a partir del archivo de ejemplo:

```bash
copy .env.example .env
```

Generar la clave de la aplicación:

```bash
php artisan key:generate
```

### 4. Configurar la base de datos

Crear una base de datos en MySQL con el nombre:

```sql
CREATE DATABASE turingia;
```

Verificar que las siguientes variables del archivo `.env` tengan los datos correspondientes a la instalación local:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=turingia
DB_USERNAME=root
DB_PASSWORD=
```

Si se utiliza otro usuario o contraseña de MySQL, actualizar los valores correspondientes.

### 5. Ejecutar las migraciones y los seeders

Desde la raíz del proyecto, ejecutar:

```bash
php artisan migrate --seed
```

Este comando crea las tablas necesarias y registra automáticamente datos iniciales para probar el sistema:

- 2 usuarios: un administrador y un usuario normal.
- 4 categorías de productos.
- 8 productos distribuidos entre las categorías.

### 6. Usuarios de prueba

El proyecto incluye las siguientes credenciales para acceder al sistema:

| Rol | Correo electrónico | Contraseña |
|---|---|---|
| Administrador | admin@technoshop.com | Admin12345 |
| Usuario normal | usuario@technoshop.com | User12345 |

El administrador tiene acceso a las operaciones administrativas, mientras que el usuario normal puede consultar el catálogo y utilizar las funcionalidades disponibles para usuarios generales.

**Importante:** estas credenciales son exclusivamente para pruebas locales. No deben utilizarse en un entorno de producción.

### 7. Instalar dependencias del frontend

Abrir una terminal, ingresar a la carpeta `frontend` y ejecutar:

```bash
cd frontend
npm install
```

### 8. Ejecutar el proyecto

Se necesitan dos terminales abiertas.

**Terminal 1: Backend**

Desde la carpeta raíz:

```bash
php artisan serve
```

La API estará disponible en:

```text
http://127.0.0.1:8000/api
```

**Terminal 2: Frontend**

Desde la carpeta `frontend`:

```bash
npm run dev
```

Vite mostrará la dirección local para acceder a la aplicación desde el navegador.

## Funcionalidades

### Catálogo de productos
- Visualización de productos almacenados en la base de datos.
- Consulta de productos provenientes de una API externa.
- Búsqueda de productos por nombre.
- Filtrado por categoría.
- Carga progresiva de productos.

### Autenticación y usuarios
- Registro de usuarios.
- Inicio y cierre de sesión.
- Autenticación mediante tokens.
- Diferenciación de permisos según el rol del usuario.

### Administración
- Registro, consulta, edición y eliminación de productos.
- Gestión de categorías mediante endpoints de la API.
- Restricción de operaciones administrativas para usuarios sin permisos.
- Protección para impedir la eliminación de categorías que tengan productos asociados.

### Integración externa
- Consulta de productos electrónicos mediante una API externa.
- Manejo de errores cuando el servicio externo no está disponible.

### Pruebas automatizadas

Se implementaron pruebas para verificar:
- Registro e inicio de sesión.
- Validación de credenciales.
- Consulta del perfil y cierre de sesión.
- Consulta, creación, actualización y eliminación de productos.
- Consulta y administración de categorías.
- Control de permisos de usuarios y administradores.
- Manejo de respuestas exitosas y errores de la API externa.

Para ejecutar todas las pruebas:

```bash
php artisan test
```

## Compilación del frontend

Para generar la versión optimizada del frontend:

```bash
cd frontend
npm run build
```

Para revisar el código con ESLint:

```bash
npm run lint
```

## Documentación de la API REST

La API REST permite la comunicación entre el frontend y el backend de TecnoShop Pro. Las respuestas se manejan en formato JSON.

**URL base:**

```text
http://127.0.0.1:8000/api
```

### Autenticación

La autenticación se realiza mediante Laravel Sanctum utilizando tokens Bearer.

Para acceder a los endpoints protegidos, se debe incluir el token en el encabezado HTTP:

```http
Authorization: Bearer TOKEN
Accept: application/json
```

#### Endpoints de autenticación

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/register` | Registrar un usuario nuevo. | Público |
| POST | `/login` | Iniciar sesión y obtener un token. | Público |
| GET | `/me` | Consultar los datos del usuario autenticado. | Autenticado |
| POST | `/logout` | Cerrar sesión e invalidar el token actual. | Autenticado |

**Ejemplo de inicio de sesión:**

```http
POST /api/login
```

Cuerpo de la solicitud:

```json
{
    "email": "admin@technoshop.com",
    "password": "Admin12345"
}
```

```json usuario normal
{
    "email": "usuario@technoshop.com",
    "password": "User12345"
}
```

La respuesta incluye los datos del usuario y el token de autenticación.

### Productos

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/products` | Consultar todos los productos. | Público |
| GET | `/products/{id}` | Consultar un producto específico. | Público |
| POST | `/products` | Registrar un producto. | Administrador |
| PUT | `/products/{id}` | Actualizar un producto. | Administrador |
| PATCH | `/products/{id}` | Actualizar parcialmente un producto. | Administrador |
| DELETE | `/products/{id}` | Eliminar un producto. | Administrador |

**Ejemplo de registro de producto:**

```http
POST /api/products
```

Cuerpo de la solicitud:

```json
{
    "category_id": 1,
    "name": "Laptop Lenovo IdeaPad",
    "description": "Laptop para trabajo y estudio.",
    "price": 12500,
    "stock": 10,
    "image_url": "https://example.com/laptop.jpg"
}
```

### Categorías

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/categories` | Consultar todas las categorías y su cantidad de productos. | Público |
| GET | `/categories/{id}` | Consultar una categoría y sus productos. | Público |
| POST | `/categories` | Registrar una categoría. | Administrador |
| PUT | `/categories/{id}` | Actualizar una categoría. | Administrador |
| PATCH | `/categories/{id}` | Actualizar parcialmente una categoría. | Administrador |
| DELETE | `/categories/{id}` | Eliminar una categoría. | Administrador |

**Ejemplo de registro de categoría:**

```http
POST /api/categories
```

Cuerpo de la solicitud:

```json
{
    "name": "Accesorios",
    "description": "Accesorios y periféricos."
}
```

Una categoría no puede eliminarse si tiene productos asociados. En ese caso, la API devuelve el código HTTP `409 Conflict`.

### Productos externos

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/external-products` | Consultar productos electrónicos desde una API externa. | Público |

La integración consulta el siguiente servicio externo:

```text
https://api.testingapis.com/api/Products/category/electronics
```

Si el servicio externo no está disponible o devuelve un error, la API responde con el código HTTP `502 Bad Gateway`.

### Respuestas HTTP

Los principales códigos de respuesta utilizados son:

| Código | Descripción |
|---|---|
| 200 | Solicitud procesada correctamente. |
| 201 | Recurso creado correctamente. |
| 401 | Usuario no autenticado o credenciales incorrectas. |
| 403 | Usuario sin permisos para realizar la operación. |
| 404 | Recurso no encontrado. |
| 409 | Conflicto al intentar eliminar una categoría con productos asociados. |
| 422 | Error de validación de los datos enviados. |
| 502 | Error al comunicarse con la API externa. |

### Consideraciones de seguridad

- Las contraseñas se almacenan mediante hashing.
- La autenticación utiliza tokens de Laravel Sanctum.
- Las operaciones de administración requieren autenticación y rol de administrador.
- Los usuarios normales no pueden ejecutar operaciones administrativas.
- Las solicitudes que modifican información validan los datos recibidos.

## Pruebas automatizadas

Se implementaron pruebas para verificar:
- Registro e inicio de sesión.
- Validación de credenciales.
- Consulta del perfil y cierre de sesión.
- Consulta, creación, actualización y eliminación de productos.
- Consulta y administración de categorías.
- Control de permisos de usuarios y administradores.
- Manejo de respuestas exitosas y errores de la API externa.

Para ejecutar todas las pruebas:

```bash
php artisan test
```

## Compilación del frontend

Para generar la versión optimizada del frontend:

```bash
cd frontend
npm run build
```

Para revisar el código con ESLint:

```bash
npm run lint
```