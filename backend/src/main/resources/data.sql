INSERT IGNORE INTO inmueble (
    codigo, direccion, ciudad, barrio_zona, tipo_inmueble, finalidad,
    precio, area, habitaciones, banos, estado, disponible, asesor_id_responsable
) VALUES
(
    'INM-001', 'Cra 12 #10-20', 'Armenia', 'Centro', 'Apartamento', 'Venta',
    220000000, 85, 3, 2, 'Disponible', true, 'ASE-001'
),
(
    'INM-002', 'Calle 8 #15-40', 'Armenia', 'Norte', 'Casa', 'Arriendo',
    1800000, 120, 4, 3, 'Disponible', true, 'ASE-002'
);


INSERT IGNORE INTO cliente (
    id, nombre, correo, telefono, tipo_cliente, presupuesto,
    zonas_interes, tipo_inmueble_deseado, habitaciones_minimas, estado_busqueda
) VALUES
(
    'CLI-001', 'Laura Gómez', 'laura@gmail.com', '3100000001', 'Comprador',
    250000000, 'Centro,Norte', 'Apartamento', 2, 'Buscando'
),
(
    'CLI-002', 'Carlos Pérez', 'carlos@gmail.com', '3100000002', 'Arrendatario',
    2000000, 'Norte,Occidente', 'Casa', 3, 'Interesado'
);

INSERT IGNORE INTO asesor (
    id, nombre, contacto, especialidad_zona, cantidad_cierres
) VALUES
(
    'ASE-001', 'María Rodríguez', 'maria@inmobiliaria.com', 'Centro', 12
),
(
    'ASE-002', 'Juan López', 'juan@inmobiliaria.com', 'Norte', 8
);

INSERT IGNORE INTO visita (
    id, cliente_id, inmueble_codigo, asesor_id, fecha, hora, estado, observacion
) VALUES
(
    1, 'CLI-001', 'INM-001', 'ASE-001', '2026-03-30', '10:00:00', 'Programada',
    'Cliente interesado en apartamento'
),
(
    2, 'CLI-002', 'INM-002', 'ASE-002', '2026-04-01', '15:30:00', 'Programada',
    'Cliente quiere revisar patio y habitaciones'
); 

INSERT IGNORE INTO favorito (id, cliente_id, inmueble_codigo, fecha_registro) VALUES
(1, 'CLI-001', 'INM-001', CURRENT_TIMESTAMP),
(2, 'CLI-002', 'INM-002', CURRENT_TIMESTAMP);

INSERT IGNORE INTO interaccion (id, cliente_id, inmueble_codigo, tipo_interaccion, fecha) VALUES
(1, 'CLI-001', 'INM-001', 'FAVORITO', CURRENT_TIMESTAMP),
(2, 'CLI-002', 'INM-002', 'VISITA', CURRENT_TIMESTAMP);

INSERT IGNORE INTO inmueble (
    codigo, direccion, ciudad, barrio_zona, tipo_inmueble, finalidad,
    precio, area, habitaciones, banos, estado, disponible, asesor_id_responsable
) VALUES
(
    'INM-003', 'Av Bolivar #22-18', 'Armenia', 'Norte', 'Apartamento', 'Venta',
    310000000, 96, 3, 2, 'Reservado', false, 'ASE-001'
),
(
    'INM-004', 'Calle 19 #8-55', 'Armenia', 'Occidente', 'Local', 'Arriendo',
    3200000, 70, 1, 1, 'Disponible', true, 'ASE-003'
),
(
    'INM-005', 'Cra 6 #30-12', 'Armenia', 'Sur', 'Casa', 'Venta',
    165000000, 110, 4, 2, 'Disponible', true, 'ASE-002'
);

INSERT IGNORE INTO cliente (
    id, nombre, correo, telefono, tipo_cliente, presupuesto,
    zonas_interes, tipo_inmueble_deseado, habitaciones_minimas, estado_busqueda
) VALUES
(
    'CLI-003', 'Ana Torres', 'ana@gmail.com', '3100000003', 'Comprador',
    330000000, 'Norte,Centro', 'Apartamento', 3, 'Buscando'
),
(
    'CLI-004', 'Sofia Ramirez', 'sofia@gmail.com', '3100000004', 'Arrendatario',
    3500000, 'Occidente,Norte', 'Local', 1, 'Interesado'
);

INSERT IGNORE INTO asesor (
    id, nombre, contacto, especialidad_zona, cantidad_cierres
) VALUES
(
    'ASE-003', 'Camilo Vargas', 'camilo@inmobiliaria.com', 'Occidente', 5
);

INSERT IGNORE INTO operaciones (
    id, codigo_inmueble, id_cliente, id_asesor, fecha, tipo_operacion,
    valor_acordado, comision, estado_proceso
) VALUES
(
    'OP-001', 'INM-001', 'CLI-001', 'ASE-001', '2026-04-20',
    'VENTA', 218000000, 6540000, 'CERRADA'
),
(
    'OP-002', 'INM-002', 'CLI-002', 'ASE-002', '2026-04-25',
    'ARRIENDO', 1800000, 180000, 'EN_PROCESO'
),
(
    'OP-003', 'INM-003', 'CLI-003', 'ASE-001', '2026-05-03',
    'VENTA', 305000000, 9150000, 'EN_PROCESO'
);

INSERT IGNORE INTO contrato (
    id, codigo_inmueble, id_cliente, id_asesor, id_operacion, tipo_contrato,
    fecha_inicio, fecha_fin, valor, estado, observacion
) VALUES
(
    'CON-001', 'INM-001', 'CLI-001', 'ASE-001', 'OP-001', 'VENTA',
    '2026-04-20', '2026-12-31', 218000000, 'ACTIVO', 'Contrato de compraventa activo'
),
(
    'CON-002', 'INM-002', 'CLI-002', 'ASE-002', 'OP-002', 'ARRIENDO',
    '2025-05-20', '2026-05-25', 1800000, 'ACTIVO', 'Contrato proximo a renovar'
),
(
    'CON-003', 'INM-003', 'CLI-003', 'ASE-001', 'OP-003', 'VENTA',
    '2025-04-01', '2026-04-20', 305000000, 'ACTIVO', 'Contrato vencido para prueba de alertas'
);

INSERT IGNORE INTO solicitud_atencion (
    id, id_cliente, codigo_inmueble, tipo_solicitud, descripcion,
    estado, prioridad, fecha_creacion, fecha_atencion, id_asesor_asignado, respuesta
) VALUES
(
    'SOL-001', 'CLI-001', 'INM-001', 'COMPRA',
    'Cliente quiere iniciar proceso de compra', 'PENDIENTE', 'ALTA',
    '2026-05-10 09:00:00', NULL, NULL, NULL
),
(
    'SOL-002', 'CLI-001', 'INM-001', 'ARRIENDO',
    'Cliente solicita alternativa de arriendo con opcion de compra', 'PENDIENTE', 'ALTA',
    '2026-05-10 10:00:00', NULL, NULL, NULL
),
(
    'SOL-003', 'CLI-002', 'INM-001', 'VISITA',
    'Cliente solicita visita al inmueble', 'PENDIENTE', 'MEDIA',
    '2026-05-11 08:30:00', NULL, NULL, NULL
),
(
    'SOL-004', 'CLI-003', 'INM-001', 'INFORMACION',
    'Cliente solicita detalles de disponibilidad', 'PENDIENTE', 'BAJA',
    '2026-05-11 11:15:00', NULL, NULL, NULL
),
(
    'SOL-005', 'CLI-004', 'INM-004', 'ARRIENDO',
    'Cliente interesado en arrendar local comercial', 'EN_ATENCION', 'ALTA',
    '2026-05-12 08:00:00', '2026-05-12 09:00:00', 'ASE-003', 'Asesor asignado'
);

INSERT IGNORE INTO alertas (
    id, tipo, descripcion, nivel_atencion, fecha_creacion, estado
) VALUES
(
    'AL-001', 'CONTRATO', 'Contrato proximo a vencer', 'ALTA',
    '2026-05-12 09:00:00', 'PENDIENTE'
);

INSERT IGNORE INTO eventos_inusuales (
    id, tipo, descripcion, nivel_atencion, fecha_deteccion, estado, entidad_referencia
) VALUES
(
    'EV-001', 'DEMANDA', 'Inmueble con varias solicitudes activas', 'MEDIA',
    '2026-05-12 09:30:00', 'PENDIENTE', 'INM-001'
);
