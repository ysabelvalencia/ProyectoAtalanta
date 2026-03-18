-- =========================================
-- 🗑️ BORRAR BD SI EXISTE (opcional)
-- =========================================
DROP DATABASE IF EXISTS atalanta_db;

-- =========================================
-- 🆕 CREAR BASE DE DATOS
-- =========================================
CREATE DATABASE atalanta_db;
USE atalanta_db;


-- =========================================
-- 👤 TABLA USERS
-- =========================================
CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    rol ENUM('Cliente', 'Trabajador', 'Jefe', 'Admin') 
        NOT NULL DEFAULT 'Cliente',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- 🎫 TABLA TICKETS
-- =========================================
CREATE TABLE tickets (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,

    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,

    estado ENUM('abierto', 'en_proceso', 'cerrado') 
        DEFAULT 'abierto',

    -- Usuario que crea el ticket (cliente)
    id_cliente INT NOT NULL,

    -- Usuario asignado (trabajador)
    id_trabajador INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 🔗 RELACIONES
    FOREIGN KEY (id_cliente) REFERENCES users(id_user)
        ON DELETE CASCADE,

    FOREIGN KEY (id_trabajador) REFERENCES users(id_user)
        ON DELETE SET NULL
);


-- =========================================
-- 💬 TABLA COMMENTS
-- =========================================
CREATE TABLE comments (
    id_comment INT AUTO_INCREMENT PRIMARY KEY,

    contenido TEXT NOT NULL,

    id_ticket INT NOT NULL,
    id_user INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 🔗 RELACIONES
    FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket)
        ON DELETE CASCADE,

    FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON DELETE CASCADE
);


-- =========================================
-- 📊 DATOS DE PRUEBA (IMPORTANTE)
-- =========================================

-- ⚠️ Password: 123456 (hasheada con bcrypt)
INSERT INTO users (email, password_hash, rol) VALUES
('cliente@test.com', '$2b$10$7QJ6z6Z4Zz5zXy1QX0u7eO9hQ9R2Q8fZkGk5G3wYx8yQ2rKj9v0eK', 'Cliente'),
('trabajador@test.com', '$2b$10$7QJ6z6Z4Zz5zXy1QX0u7eO9hQ9R2Q8fZkGk5G3wYx8yQ2rKj9v0eK', 'Trabajador'),
('jefe@test.com', '$2b$10$7QJ6z6Z4Zz5zXy1QX0u7eO9hQ9R2Q8fZkGk5G3wYx8yQ2rKj9v0eK', 'Jefe'),
('admin@test.com', '$2b$10$7QJ6z6Z4Zz5zXy1QX0u7eO9hQ9R2Q8fZkGk5G3wYx8yQ2rKj9v0eK', 'Admin');


-- =========================================
-- 🎫 TICKETS DE PRUEBA
-- =========================================

INSERT INTO tickets (titulo, descripcion, id_cliente) VALUES
('Problema login', 'No puedo iniciar sesión', 1),
('Error web', 'La página se rompe', 1);


-- =========================================
-- 💬 COMENTARIOS DE PRUEBA
-- =========================================

INSERT INTO comments (contenido, id_ticket, id_user) VALUES
('Estamos revisando el problema', 1, 2),
('Se ha solucionado', 1, 3);