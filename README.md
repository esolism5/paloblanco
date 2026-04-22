# Sistema de Gestión de Inversionistas

Aplicación web full stack para registrar, consultar y administrar inversionistas, desarrollada con React, Node.js, Express y MySQL.

---

# Tecnologías utilizadas

## Frontend

* React (Vite)
* Axios
* React Router DOM

## Backend

* Node.js
* Express
* MySQL

---

# Estructura del proyecto

```plaintext
inversionistas-app/
├── backend/
└── frontend/
```

---

# Instalación paso a paso

## 1. Clonar repositorio

```bash
git clone https://github.com/esolism5/paloblanco.git
cd inversionistas-app
```

---

## 2. Configurar base de datos (MySQL)

Ejecutar en MySQL:

```sql
CREATE DATABASE inversionistas_db;
USE inversionistas_db;

CREATE TABLE categoria_inversion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inversionista (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  email VARCHAR(150),
  inversion DECIMAL(10,2),
  categoria_id INT,
  estado VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Insertar categorías

```sql
INSERT INTO categoria_inversion (nombre, descripcion) VALUES
('Bienes Raíces', 'Inversión inmobiliaria'),
('Bolsa de Valores', 'Acciones'),
('Criptomonedas', 'Crypto'),
('Startups', 'Emprendimientos'),
('Fondos Mutuos', 'Fondos');
```

---

## Insertar inversionistas (datos de prueba)

```sql
INSERT INTO inversionista 
(nombre, apellido, email, inversion, categoria_id, estado, created_at, updated_at)
VALUES
('Juan', 'Pérez', 'juan.perez@mail.com', 25000.00, 1, 'activo', NOW(), NOW()),
('María', 'González', 'maria.gonzalez@mail.com', 8500.00, 2, 'activo', NOW(), NOW()),
('Carlos', 'Ramírez', 'carlos.ramirez@mail.com', 120000.00, 1, 'activo', NOW(), NOW()),
('Ana', 'López', 'ana.lopez@mail.com', 3000.00, 3, 'activo', NOW(), NOW()),
('Luis', 'Martínez', 'luis.martinez@mail.com', 55000.00, 4, 'activo', NOW(), NOW()),
('Sofía', 'Herrera', 'sofia.herrera@mail.com', 18000.00, 5, 'activo', NOW(), NOW()),
('Pedro', 'Sánchez', 'pedro.sanchez@mail.com', 7500.00, 2, 'activo', NOW(), NOW()),
('Laura', 'Díaz', 'laura.diaz@mail.com', 200000.00, 1, 'activo', NOW(), NOW()),
('Elias', 'Solis', 'eliassolis315@gmail.com', 120000.00, 1, 'activo', NOW(), NOW()),
('Elias', 'Solis', 'adidasgt@rimet.com', 12000.00, 2, 'activo', NOW(), NOW());
```

---

# Funcionalidades avanzadas en Base de Datos

## Procedimiento almacenado

Retorna inversionistas con inversión mayor a 15,000:

```sql
DELIMITER //

CREATE PROCEDURE sp_inversionistas_mayor()
BEGIN
  SELECT * 
  FROM inversionista
  WHERE inversion > 15000;
END //

DELIMITER ;
```

Ejecutar:

```sql
CALL sp_inversionistas_mayor();
```

---

## Función personalizada

Evalúa estado basado en ID:

```sql
DELIMITER //

CREATE FUNCTION fn_estado_inversionista(inversionista_id INT)
RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
  DECLARE resultado VARCHAR(10);

  IF MOD(inversionista_id, 2) = 0 THEN
    SET resultado = 'activo';
  ELSE
    SET resultado = 'inactivo';
  END IF;

  RETURN resultado;
END //

DELIMITER ;
```

Ejemplo:

```sql
SELECT id, fn_estado_inversionista(id) AS estado
FROM inversionista;
```

---

## 3. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=inversionistas_db
```

Ejecutar:

```bash
npm run dev
```

---

## 4. Configurar Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Abrir en navegador:

```plaintext
http://localhost:5173
```

---

# Funcionalidades

## Dashboard

* Listado de inversionistas
* Filtro por categoría
* Filtro por rango de inversión
* Ordenamiento por monto

## Formulario

* Crear inversionista
* Editar inversionista
* Validaciones en frontend
* Manejo de errores 422

## Backend

* API REST
* Validación de datos
* Consultas dinámicas

---

# Endpoints

```plaintext
GET    /api/inversionistas
GET    /api/inversionistas/:id
POST   /api/inversionistas
PUT    /api/inversionistas/:id
PATCH  /api/inversionistas/:id/estado

GET    /api/categorias
```

---

# Decisiones técnicas

* Arquitectura por capas (routes, controllers, models)
* Uso de query params para filtros
* Prepared statements para seguridad SQL
* Uso de React Hooks para manejo de estado

---

# Notas importantes

* MySQL debe estar activo
* Backend debe ejecutarse antes que frontend
* Verificar credenciales en el archivo `.env`

---

# Autor

Desarrollado por Elias Solis

---

# Estado del proyecto

Proyecto funcional, cumple con todos los requerimientos de la prueba técnica y listo para evaluación.
