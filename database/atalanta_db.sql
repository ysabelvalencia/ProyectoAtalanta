
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
create database atalanta_db;
use atalanta_db;
 
-- =================================
-- BORRAR USUARIO SI EXISTE
-- =================================
drop user if exists tarantola;

-- =================================
-- CREAR USUARIO --> tarantola
-- =================================

create database atalanta_db;
use atalanta_db;
create user 'tarantola'@'%' identified by 'wz$}>43Mr.t6ZEa%';
grant all privileges on atalanta_db.* to 'tarantola'@'%';
flush privileges;

-- Si queremos utilizar myql workbench, una vez realizados los cambios anteriores:
-- En mysql, Mysql connections (+)
-- name: el que quieras
-- user: tarantola
-- password: wz$}>43Mr.t6ZEa%
-- default schema: atalanta_db


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
-- Se crean los usarios a través del formulario de registro
-- Después actualizamos los roles

-- Kyle (id_user 1) = jefe (id_role 3)
-- Ysa (id_user 2) = admin (id_role 4)
-- Irene (id_user 3)= cliente (id_role 1)
-- Krystian (id_user 4)= trabajador (id_role 2)
-- Laura (id_user 5)= trabajador (id_role 2)
-- =========================================

UPDATE users
SET id_role = 4
WHERE id_user = 2;

UPDATE users
SET id_role = 3
WHERE id_user = 1;

UPDATE users
SET id_role = 2
WHERE id_user = 4;

UPDATE users
SET id_role = 2
WHERE id_user = 5;


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


INSERT INTO tickets (title, description, status, id_cliente, id_trabajador) VALUES
('Error login', 'No puedo acceder a mi cuenta', 'abierto', 3, 4),
('Página en blanco', 'La web no carga correctamente', 'en_proceso', 3, 4),
('Reset contraseña', 'No recibo email de recuperación', 'cerrado', 3, 5),
('Error 500', 'El servidor falla al enviar formulario', 'en_proceso', 3, 4),
('Bug en dashboard', 'No aparecen mis tickets', 'abierto', 3, 4),
('Problema CSS', 'Los estilos no cargan bien', 'en_proceso', 3, 5),
('Error API', 'Fetch devuelve error 401', 'abierto', 3, 5);

 
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
        FOREIGN KEY (id_ticket) REFERENCES tickets(id_ticket)
        ON DELETE CASCADE,
    CONSTRAINT fk_comment_user
        FOREIGN KEY (id_user) REFERENCES users(id_user)
);

INSERT INTO comments (content, id_ticket, id_user) VALUES
('Estoy revisando el problema', 7, 5),
('Parece un fallo del backend', 7, 5),
('Ya está solucionado', 3, 4),
('Ocurre al enviar el formulario', 4, 4),
('He encontrado el bug', 1, 4),
('Se debe a un error en CSS', 6, 4),
('Estoy trabajando en ello', 6, 4);

SELECT * FROM USERS;
SELECT * FROM TICKETS;
SELECT * FROM COMMENTS;