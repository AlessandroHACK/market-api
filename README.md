<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Market API

API REST para la gestión de un catálogo de productos de una tienda (ropa y accesorios). Permite crear, listar, buscar, actualizar y eliminar productos, asociarles imágenes, subir archivos de imagen al servidor y poblar la base de datos con datos de prueba.

## Funcionalidades

- **CRUD de productos**: nombre, precio, descripción, stock, tallas, género (`men`, `women`, `kid`, `unisex`), tags e imágenes.
- **Slug automático**: cada producto genera un slug a partir de su nombre, y se puede buscar por `id` (UUID) o por `slug`.
- **Paginación** en el listado de productos mediante `limit` y `offset`.
- **Imágenes de producto**: relación uno a muchos entre productos e imágenes, con borrado en cascada.
- **Subida de archivos**: carga de imágenes (`jpg`, `jpeg`, `png`, `gif`, `webp`, máx. 5 MB) que se guardan en `static/products` y se sirven desde la API.
- **Seed**: endpoint que reinicia la tabla de productos y la carga con datos de ejemplo.
- **Validación** de los datos de entrada con mensajes de error en español.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/) | Lenguaje y entorno de ejecución |
| [NestJS 11](https://nestjs.com/) | Framework del servidor |
| [PostgreSQL 17](https://www.postgresql.org/) | Base de datos |
| [TypeORM](https://typeorm.io/) | ORM y mapeo de entidades |
| [Docker Compose](https://docs.docker.com/compose/) | Levantar la base de datos en local |
| [class-validator](https://github.com/typestack/class-validator) / [class-transformer](https://github.com/typestack/class-transformer) | Validación y transformación de DTOs |
| [Multer](https://github.com/expressjs/multer) | Subida de archivos |
| [@nestjs/config](https://docs.nestjs.com/techniques/configuration) | Variables de entorno |
| [@nestjs/serve-static](https://docs.nestjs.com/recipes/serve-static) | Servir archivos estáticos (`public/`) |
| [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest) | Pruebas unitarias y e2e |
| ESLint + Prettier | Linter y formato de código |

## Estructura del proyecto

```
src/
├── common/      # DTO de paginación y helper de slug
├── config/      # Configuración de TypeORM
├── files/       # Subida y entrega de imágenes
├── products/    # Módulo de productos (entidades, DTOs, servicio, controlador)
├── seed/        # Datos de prueba y endpoint de seed
├── app.module.ts
└── main.ts
static/products/ # Imágenes subidas por la API
public/assets/   # Imágenes estáticas servidas públicamente
postgres/        # Volumen de datos de PostgreSQL (Docker)
```

## Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior y npm
- [Docker](https://www.docker.com/) y Docker Compose

## Cómo correr la app

### 1. Clonar el repositorio e instalar dependencias

```bash
npm install
```

### 2. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
NODE_ENV=development

POSTGRES_USER=root
POSTGRES_PASSWORD=tu_password
POSTGRES_DB=market_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5433

PORT=3000
HOST_API=http://localhost:3000/api/v1
```

> El contenedor de Docker expone PostgreSQL en el puerto **5433** de tu máquina, por eso `POSTGRES_PORT=5433`.

### 3. Levantar la base de datos

```bash
docker-compose up -d
```

### 4. Iniciar el servidor

```bash
# desarrollo (con recarga automática)
npm run start:dev

# modo normal
npm run start

# producción
npm run build
npm run start:prod
```

La API queda disponible en `http://localhost:3000/api/v1`.

### 5. (Opcional) Cargar datos de prueba

```bash
curl http://localhost:3000/api/v1/seed
```

> ⚠️ El seed elimina los productos existentes antes de insertar los de ejemplo.

## Endpoints

Todas las rutas usan el prefijo `/api/v1`.

### Productos

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/products` | Crear un producto |
| `GET` | `/products?limit=10&offset=0` | Listar productos con paginación |
| `GET` | `/products/:term` | Obtener un producto por `id` (UUID) o `slug` |
| `PATCH` | `/products/:id` | Actualizar un producto |
| `DELETE` | `/products/:id` | Eliminar un producto |

Ejemplo de cuerpo para crear un producto:

```json
{
  "name": "Camiseta Básica",
  "price": 25.5,
  "description": "Camiseta de algodón",
  "stock": 10,
  "sizes": ["S", "M", "L"],
  "gender": "unisex",
  "tags": ["shirt"],
  "images": ["camiseta-1.jpg"]
}
```

### Archivos

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/files/product` | Subir una imagen (campo `file` en `multipart/form-data`). Devuelve `sourceUrl` |
| `GET` | `/files/product/:imageName` | Obtener una imagen subida |

### Seed

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/seed` | Reiniciar y poblar la base de datos con productos de ejemplo |

## Scripts disponibles

| Script | Descripción |
| --- | --- |
| `npm run start:dev` | Servidor en modo desarrollo con watch |
| `npm run start:debug` | Servidor en modo debug con watch |
| `npm run build` | Compila el proyecto a `dist/` |
| `npm run start:prod` | Ejecuta la versión compilada |
| `npm run lint` | Ejecuta ESLint y corrige errores |
| `npm run format` | Formatea el código con Prettier |
| `npm run test` | Pruebas unitarias |
| `npm run test:e2e` | Pruebas end-to-end |
| `npm run test:cov` | Reporte de cobertura |
