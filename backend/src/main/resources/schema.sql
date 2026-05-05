CREATE TABLE IF NOT EXISTS inmueble (
    codigo VARCHAR(20) PRIMARY KEY,
    direccion VARCHAR(150) NOT NULL,
    ciudad VARCHAR(80) NOT NULL,
    barrio_zona VARCHAR(80) NOT NULL,
    tipo_inmueble VARCHAR(50) NOT NULL,
    finalidad VARCHAR(20) NOT NULL,
    precio DOUBLE NOT NULL,
    area DOUBLE NOT NULL,
    habitaciones INT NOT NULL,
    banos INT NOT NULL,
    estado VARCHAR(40) NOT NULL,
    disponible BOOLEAN NOT NULL,
    asesor_id_responsable VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS cliente (
    id VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    tipo_cliente VARCHAR(30) NOT NULL,
    presupuesto DOUBLE NOT NULL,
    zonas_interes VARCHAR(255),
    tipo_inmueble_deseado VARCHAR(50),
    habitaciones_minimas INT NOT NULL,
    estado_busqueda VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS asesor (
    id VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100) NOT NULL,
    especialidad_zona VARCHAR(100) NOT NULL,
    cantidad_cierres INT NOT NULL
);

CREATE TABLE IF NOT EXISTS visita (
    id INT PRIMARY KEY,
    cliente_id VARCHAR(20) NOT NULL,
    inmueble_codigo VARCHAR(20) NOT NULL,
    asesor_id VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(50) NOT NULL,
    observacion VARCHAR(255)
); 

CREATE TABLE IF NOT EXISTS favorito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id VARCHAR(20) NOT NULL,
    inmueble_codigo VARCHAR(20) NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_favorito_cliente_inmueble (cliente_id, inmueble_codigo)
);

CREATE TABLE IF NOT EXISTS interaccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id VARCHAR(20) NOT NULL,
    inmueble_codigo VARCHAR(20) NOT NULL,
    tipo_interaccion VARCHAR(40) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS auth_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    cliente_id VARCHAR(20),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS auth_token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(80) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    cliente_id VARCHAR(20),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expira_en TIMESTAMP NOT NULL,
    revocado BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS operaciones (
    id VARCHAR(30) PRIMARY KEY,
    codigo_inmueble VARCHAR(30) NOT NULL,
    id_cliente VARCHAR(30) NOT NULL,
    id_asesor VARCHAR(30) NOT NULL,
    fecha DATE NOT NULL,
    tipo_operacion VARCHAR(40) NOT NULL,
    valor_acordado DOUBLE NOT NULL,
    comision DOUBLE NOT NULL,
    estado_proceso VARCHAR(40) NOT NULL
);
CREATE TABLE IF NOT EXISTS alertas (
    id VARCHAR(40) PRIMARY KEY,
    tipo VARCHAR(60) NOT NULL,
    descripcion TEXT NOT NULL,
    nivel_atencion VARCHAR(30) NOT NULL,
    fecha_creacion DATETIME NOT NULL,
    estado VARCHAR(30) NOT NULL
);
