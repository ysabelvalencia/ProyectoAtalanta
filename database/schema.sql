CREATE DATABASE atalanta_db;
USE atalanta_db;

CREATE TABLE users (
  idUser INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('cliente','trabajador','jefe','admin') DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);