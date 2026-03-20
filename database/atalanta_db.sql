
-- =======================================================================
-- Para poder conectar el servidor con la base de datos debemos previamente:
-- =======================================================================
-- En cmd:
-- >path c:\Program Files\MySQL\MySQL Server 8.3\bin
-- >mysql -u root -p
-- >contraseña de usuario: AlumnoIFP

-- =================================
-- BORRAR BASE DE DATOS SI EXISTE
-- =================================
-- drop database if exists atalanta_db;

-- =================================
-- CREAR BASE DE DATOS
-- =================================
-- create database atalanta_db;
-- use atalanta_db;
 
-- =================================
-- BORRAR USUARIO SI EXISTE
-- =================================
-- drop user if exists tarantola;

-- =================================
-- CREAR USUARIO --> tarantola
-- =================================
--create user 'tarantola'@'%' identified by '1234';
--grant all privileges on atalanta_db.* to 'tarantola'@'%';
--flush privileges;

-- Si queremos utilizar myql workbench, una vez realizados los cambios anteriores:
-- En mysql, Mysql connections (+)
-- name: el que quieras
-- user: tarantola
-- password: 1234
-- default schema: atalanta_db

-- ==========================================
--  BORRAR TABLAS SI EXISTEN
-- ==========================================
drop table if exists comments;
drop table if exists tickets;
drop table if exists users;

-- =========================================
-- CREAR BASE DE DATOS
-- =========================================
CREATE DATABASE atalanta_db;
USE atalanta_db;


-- =========================================
--  TABLA USERS
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
--  TABLA TICKETS
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
--  TABLA COMMENTS
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


INSERT INTO users (user_name, email, password_hash, id_role) VALUES
('kyle', 'kyle@email.com', 'hash123', 1),       -- cliente
('ysa', 'ysa@email.com', 'hash123', 1),         -- cliente
('irene', 'irene@email.com', 'hash123', 2),     -- trabajador
('krystian', 'krystian@email.com', 'hash123', 3), -- jefe
('laura', 'laura@email.com', 'hash123', 4);     -- admin


INSERT INTO tickets (title, description, status, id_cliente, id_trabajador) VALUES
('No funciona el login', 'No puedo acceder a mi cuenta', 'abierto', 1, NULL),
('Error en la web', 'La página se queda en blanco', 'en_proceso', 2, 3),
('Problema con contraseña', 'No puedo resetearla', 'cerrado', 1, 3),
('Fallo en el servidor', 'El backend da error 500', 'en_proceso', 2, 3);


INSERT INTO comments (content, id_ticket, id_user) VALUES
('Estoy revisando el problema', 2, 3),
('Ya he solucionado el error', 3, 3),
('Sigue sin funcionar', 1, 1),
('Puedes dar más detalles?', 4, 3),
('Claro, ocurre al iniciar sesión', 4, 2);


SELECT * FROM users;
SELECT * FROM tickets;
SELECT * FROM comments;