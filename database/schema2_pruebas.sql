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
CREATE TABLE roles (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO roles (id_role, role_name) VALUES
(1, 'cliente'),
(2, 'trabajador'),
(3, 'jefe'),
(4, 'admin');


CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_role INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role
        FOREIGN KEY (id_role) REFERENCES roles(id_role)
);


-- =========================================
-- 🎫 TABLA TICKETS
-- =========================================
CREATE TABLE tickets (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('abierto', 'en_proceso', 'cerrado') DEFAULT 'abierto',
    id_cliente INT NOT NULL,
    id_trabajador INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_cliente
        FOREIGN KEY (id_cliente) REFERENCES users(id_user),
    CONSTRAINT fk_ticket_trabajador
        FOREIGN KEY (id_trabajador) REFERENCES users(id_user)
);

-- =========================================
-- 💬 TABLA COMMENTS
-- =========================================
CREATE TABLE comments (
    id_comment INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    id_ticket INT NOT NULL,
    id_user INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_ticket
        FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket),
    CONSTRAINT fk_comment_user
        FOREIGN KEY (id_user) REFERENCES users(id_user)
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