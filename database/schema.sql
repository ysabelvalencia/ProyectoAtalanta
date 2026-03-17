DROP TABLE IF EXISTS HISTORIAL_TICKET;
DROP TABLE IF EXISTS COMENTARIOS;
DROP TABLE IF EXISTS TICKET;
DROP TABLE IF EXISTS USERS;
-- ==========================================
--   CREACIÓN DE BASE DE DATOS
-- ==========================================
CREATE DATABASE IF NOT EXISTS sistema_tickets;
USE sistema_tickets;
 
-- ==========================================
--   TABLA USERS
--   Roles posibles: Admin, Cliente, Trabajador, Jefe
-- ==========================================
CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('Admin', 'Cliente', 'Trabajador', 'Jefe') NOT NULL DEFAULT 'Cliente'
);
 
-- ==========================================
--   TABLA TICKETS
-- ==========================================
CREATE TABLE ticket (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Abierto', 'Asignado', 'En progreso', 'Cerrado') DEFAULT 'Abierto',
    id_cliente INT NOT NULL,
    id_trabajador INT DEFAULT NULL,
 
    FOREIGN KEY (id_cliente) REFERENCES users(id_user)
        ON DELETE CASCADE,
 
    FOREIGN KEY (id_trabajador) REFERENCES users(id_user)
        ON DELETE SET NULL
);
 
-- ==========================================
--   TABLA COMENTARIOS
-- ==========================================
CREATE TABLE COMMENTS (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    comentario TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_ticket INT NOT NULL,
    id_usuario INT NOT NULL,
 
    FOREIGN KEY (id_ticket) REFERENCES ticket(id_ticket)
        ON DELETE CASCADE,
 
    FOREIGN KEY (id_usuario) REFERENCES users(id_user)
        ON DELETE CASCADE
);
 
-- ==========================================
--   TABLA HISTORIAL DE TICKETS
-- ==========================================
CREATE TABLE HISTORY_TICKET (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_ticket INT NOT NULL,
    cambiado_por INT NOT NULL,
 
    FOREIGN KEY (id_ticket) REFERENCES ticket(id_ticket)
        ON DELETE CASCADE,
 
    FOREIGN KEY (cambiado_por) REFERENCES users(id_user)
        ON DELETE CASCADE
);
 
-- ==========================================
--   DATOS DE EJEMPLO PARA PRUEBAS
-- ==========================================
 
INSERT INTO users (nombre, email, password_hash, rol) VALUES
('Admin', 'admin@system.com', 'HASH_ADMIN', 'Admin'),
('Laura Cliente', 'cliente@mail.com', 'HASH_CLIENTE', 'Cliente'),
('Pedro Trabajador', 'worker@mail.com', 'HASH_TRABAJADOR', 'Trabajador'),
('Jefa', 'jefa@mail.com', 'HASH_JEFA', 'Jefe');
 
-- Ejemplo de ticket creado por Cliente
INSERT INTO ticket (titulo, descripcion, id_cliente)
VALUES ('Problema con el PC', 'El ordenador no arranca.', 2);
 
-- Historial inicial del ticket creado
INSERT INTO historial_ticket (estado_anterior, estado_nuevo, id_ticket, cambiado_por)
VALUES (NULL, 'Abierto', 1, 2);