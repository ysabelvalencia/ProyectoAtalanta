# PROYECTO WEB ATALANTA

Proyecto desarrollado como parte de las prácticas FFE (DAM), cuyo objetivo es la creación de una aplicación web full stack basada en una empresa de ciberseguridad.

---

## 👥 Equipo
Krystian Gut
Irene De La Banda
Laura Villalba
Kyle Wenceslao
Ysabel Valencia


## 📌 Descripción

Este proyecto consiste en el desarrollo de una aplicación web que combina:

- 🌐 Web corporativa informativa  
- 🔐 Sistema de autenticación de usuarios  
- 🎫 Sistema de gestión de incidencias (tickets)  

La aplicación permite a distintos tipos de usuarios interactuar con el sistema según su rol, simulando un entorno real de trabajo.

---

## 🎯 Objetivos

- Desarrollar una web corporativa funcional  
- Implementar un sistema de login y registro seguro  
- Diseñar una base de datos relacional  
- Crear una API REST para la gestión de datos  
- Aplicar control de acceso basado en roles  
- Desarrollar un sistema completo de tickets  

---

## 🧩 Funcionalidades principales

- Registro y login de usuarios  
- Autenticación mediante JWT  
- Gestión de roles (cliente, trabajador, jefe, admin)  
- Creación de tickets por parte del cliente  
- Asignación de tickets (backend preparado)  
- Gestión de incidencias por trabajadores  
- Sistema de comentarios en tickets  
- Control de acceso según rol  

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura **full stack**:

- **Frontend** → interfaz de usuario  
- **Backend** → lógica de negocio y API  
- **Base de datos** → almacenamiento de datos  

La comunicación se realiza mediante peticiones HTTP (Fetch API) en formato JSON.

---

## 💻 Tecnologías utilizadas

### Frontend
- HTML5  
- CSS3  
- JavaScript (ES6)  
- Fetch API  

### Backend
- Node.js  
- Express.js  
- mysql2  

### Seguridad
- JSON Web Token (JWT)  
- bcrypt  
- validator  
- xss  

### Base de datos
- MySQL  

---

## 🔐 Seguridad

Se han implementado medidas básicas de seguridad:

- Contraseñas cifradas con bcrypt  
- Autenticación mediante JWT  
- Control de acceso por roles  
- Validación y sanitización de datos  
- Uso de consultas preparadas (prevención de SQL Injection)  

---

## 🗄️ Base de datos

El sistema se compone de las siguientes tablas:

- `roles`  
- `users`  
- `tickets`  
- `comments`  

Relaciones principales:
- Un usuario tiene un rol  
- Un ticket pertenece a un cliente  
- Un ticket puede asignarse a un trabajador  
- Un comentario pertenece a un ticket  

---

## 📁 Estructura del proyecto

```bash
project/
│
├── docs/            # Frontend (HTML, CSS, JS)
├── backend/         # API y lógica de negocio
├── atalanta_db.sql  # Base de datos
└── README.md
```


## 🚀 Instalación y ejecución

## ⚙️ Requisitos previos

Para ejecutar el proyecto es necesario tener instalado:

- Node.js (incluye npm)  
- MySQL o MariaDB  
- Live Server (extensión de VS Code recomendada)  


### 🌐 Frontend

El frontend puede visualizarse fácilmente utilizando Live Server.

Acceder a la carpeta del proyecto:
```bash
cd docs
```

### 🗄️ Base de datos

Para que la aplicación funcione correctamente con el backend, es necesario crear previamente la base de datos.

En el archivo `atalanta_db.sql` se incluye:

- Creación de usuario de base de datos  
- Creación de tablas  
- Inserción de datos de prueba  

⚠️ **Importante:**

- Es recomendable registrar los usuarios desde la interfaz web para que las contraseñas se almacenen correctamente en formato hash  
- Todos los usuarios se crean por defecto con rol **Cliente**  
- El rol **Admin** debe asignarse manualmente desde la base de datos  
- Revisar que los datos de conexión están correctamente configurados en el archivo `.env`  

### ⚙️ Backend

El proyecto requiere la instalación de Node.js. Para comprobarlo se puede ejecutar:
```bash
node -v
npm -v
```
Para descargar el entorno: https://nodejs.org/es/download

El proyecto utiliza dependencias npm que ya están instaladas en el archivo package-lock.json y en node_modules.

Para inicializar el proyecto:

```bash
cd backend
npm start
```

Si la carpeta node_modules no está presente, ejecutar:
```bash
cd backend
npm install 
```

