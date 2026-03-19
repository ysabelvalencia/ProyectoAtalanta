
-- Para crear la base de datos en mysql
-- En cmd Copiar el path:
-- >path c:\Program Files\MySQL\MySQL Server 8.3\bin
-- >mysql -u root -p
--contraseña de usuario: AlumnoIFP
 
--create database db_atalanta;
 --use db_atalanta;
 
--create user 'tarantola'@'%' identified by '1234';
--grant all privileges on db_atalanta.* to 'tarantola'@'%’;
--flush privileges;

--En mysql, Mysql connections (+)
-- name: el que quieras
-- username: tarantola
-- password: 1234
-- default schema: db_atalanta

drop table if exists history_ticket;
drop table if exists comments;
drop table if exists tickets;
drop table if exists users;

-- creacion base de datos

create database atalanta_db;
use atalanta_db;
-- ==========================================
--   tabla users
--   roles posibles: admin, cliente, trabajador, jefe
-- ==========================================

create table users (
    id_user int auto_increment,
    nombre varchar(100) not null,
    email varchar(120) not null,
    password_hash varchar(255) not null,
    rol varchar(20)  default 'client' not null,
    creation_date datetime default current_timestamp,
    
    constraint ck_rol check (rol in ('admin','client','employee','manager')),
    
    constraint pk_id_user_rol primary key(id_user,role),
    constraint uq_email unique key(email)
);

-- prueba insertar datos en users

insert into users (name, email, password_hash, rol) values ('laura','laura@laura.es','laura','admin');
insert into users (name, email, password_hash, rol) values ('ysa','ysa@ysa.es','ysa','client');
insert into users (name, email, password_hash, rol) values ('irene','irene@irene.es','irene','employee');
insert into users (name, email, password_hash, rol) values ('krystian','krystian@krystian.es','krystian','manager');

-- ==========================================
--   tabla tickets
-- ==========================================
create table tickets(
    id_ticket int auto_increment,
    status varchar(20) default 'created',
    title varchar(100) not null,
    description varchar(500) not null,
    creation_date datetime default current_timestamp,
    
    id_client int not null,
    rol_client varchar(20) default 'client',
    
    constraint ck_rol_client check (rol_client in ('client')),
    constraint ck_status check (status in('created')),
    
    constraint pk_id_ticket primary key(id_ticket),
    constraint fk_id_client_rol_client foreign key (id_client,rol_client)
        references users (id_user, role) on delete cascade
);
-- prueba insertar datos en tickets
insert into tickets (title,description,id_client,rol_client) values ('error1','busqueda de errores',2,'client');
 
-- ==========================================
--   tabla comentarios
-- ==========================================
create table comments (
    id_comment int auto_increment,
    comment_description varchar(200) not null,
    creation_date_comment datetime default current_timestamp,
    id_ticket int not null,
    id_employee int not null,
    rol_employee varchar(20) not null,
    
    constraint ck_role_employee check (role_employee in ('employee')),
    
    constraint pk_id_comment pgit rimary key (id_comment),
    constraint fk_id_ticket foreign key (id_ticket)
        references tickets (id_ticket) on delete cascade,
    constraint fk_id_employee_rol_employee foreign key (id_employee,rol_employee) 
        references users (id_user,rol) on delete cascade
);

-- prueba insertar datos en comments

insert into comments (comment_description,id_ticket, id_employee,rol_employee) values ('lo que sea',1,3,'employee');
 
-- ==========================================
--   tabla historial de tickets
-- ==========================================
create table history_ticket (
    id_history_ticket int auto_increment,
    preview_status varchar(20) default 'created' not null,
    new_status varchar(20),
    modified_date datetime default current_timestamp,
    id_ticket_created int not null,
    modified_by varchar(20) not null,
    id_rol int not null,
    
    constraint ck_modified_by check (modified_by = 'employee' or modified_by = 'manager'),
    constraint ck_preview_status check (preview_status in('created','asign','in progress', 'closed')),
    constraint ck_new_status check (new_status in('asign','in progress', 'closed')),
    
    constraint pk_id_history_ticket primary key (id_history_ticket),
    constraint fk_id_ticket_created foreign key (id_ticket_created)
        references tickets (id_ticket) on delete cascade,
    constraint fk_id_rol_modified_by foreign key (id_role,modified_by)
        references users (id_user,rol) on delete cascade
);
 
 -- prueba insertar datos en history_ticket

 insert into history_ticket (new_status,id_ticket_created,id_rol,modified_by) values ('asign',1,4,'manager');
