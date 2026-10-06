--LabMax 
CREATE DATABASE SistemaReservas;
GO

USE SistemaReservas;
GO

CREATE TABLE Usuario (
    ID_Usuario INT IDENTITY(1,1) PRIMARY KEY,
    CPF VARCHAR(14) NOT NULL UNIQUE,
    Nome_Completo VARCHAR(150) NOT NULL,
    Data_Aniversario DATE NOT NULL,
    Celular VARCHAR(20) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Login_Usuario VARCHAR(50) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    Data_Cadastro DATETIME DEFAULT GETDATE(),
    Data_Ultimo_Acesso DATETIME
);

CREATE TABLE Auditoria_Acesso (
    ID_Acesso INT IDENTITY(1,1) PRIMARY KEY,
    ID_Usuario INT NOT NULL,
    Data_Hora_Acesso DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID_Usuario)
);

CREATE TABLE Recurso (
    Codigo_Recurso INT IDENTITY(1,1) PRIMARY KEY,
    Tipo_Recurso VARCHAR(20) NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Capacidade INT NOT NULL,
    Localizacao VARCHAR(150) NOT NULL
);

CREATE TABLE Status_Reserva (
    ID_Status INT PRIMARY KEY,
    Descricao VARCHAR(50) NOT NULL
);

INSERT INTO Status_Reserva (ID_Status, Descricao) VALUES 
(1, 'Livre'),
(2, 'Ocupado'),
(3, 'Bloqueado'),
(4, 'Reservado');

CREATE TABLE Reserva (
    ID_Reserva INT IDENTITY(1,1) PRIMARY KEY,
    Data_Inicial DATE NOT NULL,
    Data_Final DATE NOT NULL,
    Hora_Inicial TIME NOT NULL,
    Hora_Final TIME NOT NULL,
    ID_Usuario INT NOT NULL,
    Codigo_Recurso INT NOT NULL,
    ID_Status INT NOT NULL,
    FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID_Usuario),
    FOREIGN KEY (Codigo_Recurso) REFERENCES Recurso(Codigo_Recurso),
    FOREIGN KEY (ID_Status) REFERENCES Status_Reserva(ID_Status)
);