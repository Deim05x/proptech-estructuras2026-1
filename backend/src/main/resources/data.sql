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

ALTER TABLE inmueble ADD COLUMN IF NOT EXISTS imagen_url VARCHAR(255);

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

INSERT IGNORE INTO inmueble (
    codigo, direccion, ciudad, barrio_zona, tipo_inmueble, finalidad,
    precio, area, habitaciones, banos, estado, disponible, asesor_id_responsable
) VALUES
(
    'INM-006', 'Cra 14 #18-25', 'Armenia', 'Centro', 'Apartamento', 'Venta',
    245000000, 88, 3, 2, 'Disponible', true, 'ASE-001'
),
(
    'INM-007', 'Calle 21 #12-40', 'Armenia', 'Centro', 'Casa', 'Venta',
    295000000, 130, 4, 3, 'Disponible', true, 'ASE-CEN-002'
),
(
    'INM-008', 'Cra 18 #16-08', 'Armenia', 'Centro', 'Local', 'Arriendo',
    2600000, 58, 1, 1, 'Disponible', true, 'ASE-CEN-003'
),
(
    'INM-009', 'Calle 15 #19-33', 'Armenia', 'Centro', 'Apartamento', 'Arriendo',
    1450000, 72, 2, 2, 'Disponible', true, 'ASE-CEN-004'
),
(
    'INM-010', 'Cra 11 #22-14', 'Armenia', 'Centro', 'Casa', 'Venta',
    340000000, 150, 5, 3, 'Reservado', false, 'ASE-CEN-005'
),
(
    'INM-011', 'Calle 18 #10-52', 'Armenia', 'Centro', 'Apartamento', 'Venta',
    198000000, 76, 2, 2, 'Disponible', true, 'ASE-001'
),
(
    'INM-012', 'Cra 13 #24-09', 'Armenia', 'Centro', 'Oficina', 'Arriendo',
    2100000, 64, 1, 1, 'Disponible', true, 'ASE-CEN-002'
),
(
    'INM-013', 'Calle 20 #17-60', 'Armenia', 'Centro', 'Apartamento', 'Venta',
    275000000, 94, 3, 2, 'Disponible', true, 'ASE-CEN-003'
),
(
    'INM-014', 'Cra 16 #13-44', 'Armenia', 'Centro', 'Local', 'Venta',
    390000000, 82, 1, 2, 'Disponible', true, 'ASE-CEN-004'
),
(
    'INM-015', 'Calle 23 #11-27', 'Armenia', 'Centro', 'Casa', 'Arriendo',
    2300000, 118, 4, 2, 'Disponible', true, 'ASE-CEN-005'
),
(
    'INM-016', 'Av Bolivar #12-80', 'Armenia', 'Norte', 'Apartamento', 'Venta',
    360000000, 105, 3, 2, 'Disponible', true, 'ASE-002'
),
(
    'INM-017', 'Cra 19 #35-16', 'Armenia', 'Norte', 'Casa', 'Venta',
    420000000, 170, 4, 4, 'Disponible', true, 'ASE-NOR-002'
),
(
    'INM-018', 'Calle 38 #18-22', 'Armenia', 'Norte', 'Apartamento', 'Arriendo',
    2100000, 86, 3, 2, 'Disponible', true, 'ASE-NOR-003'
),
(
    'INM-019', 'Av Centenario #28-45', 'Armenia', 'Norte', 'Casa', 'Arriendo',
    2800000, 145, 4, 3, 'Disponible', true, 'ASE-NOR-004'
),
(
    'INM-020', 'Cra 21 #40-30', 'Armenia', 'Norte', 'Apartamento', 'Venta',
    315000000, 92, 3, 2, 'Reservado', false, 'ASE-NOR-005'
),
(
    'INM-021', 'Calle 44 #17-11', 'Armenia', 'Norte', 'Local', 'Arriendo',
    3600000, 74, 1, 1, 'Disponible', true, 'ASE-002'
),
(
    'INM-022', 'Cra 23 #31-09', 'Armenia', 'Norte', 'Casa', 'Venta',
    510000000, 210, 5, 4, 'Disponible', true, 'ASE-NOR-002'
),
(
    'INM-023', 'Calle 36 #20-18', 'Armenia', 'Norte', 'Apartamento', 'Venta',
    285000000, 89, 3, 2, 'Disponible', true, 'ASE-NOR-003'
),
(
    'INM-024', 'Av Bolivar #45-72', 'Armenia', 'Norte', 'Oficina', 'Arriendo',
    3200000, 96, 1, 2, 'Disponible', true, 'ASE-NOR-004'
),
(
    'INM-025', 'Cra 25 #39-06', 'Armenia', 'Norte', 'Casa', 'Venta',
    455000000, 185, 4, 3, 'Disponible', true, 'ASE-NOR-005'
),
(
    'INM-026', 'Calle 10 #31-20', 'Armenia', 'Occidente', 'Casa', 'Venta',
    190000000, 115, 3, 2, 'Disponible', true, 'ASE-OCC-001'
),
(
    'INM-027', 'Cra 32 #12-55', 'Armenia', 'Occidente', 'Apartamento', 'Venta',
    155000000, 68, 2, 1, 'Disponible', true, 'ASE-OCC-002'
),
(
    'INM-028', 'Calle 14 #35-08', 'Armenia', 'Occidente', 'Local', 'Arriendo',
    1800000, 52, 1, 1, 'Disponible', true, 'ASE-OCC-003'
),
(
    'INM-029', 'Cra 34 #16-41', 'Armenia', 'Occidente', 'Casa', 'Arriendo',
    1600000, 104, 3, 2, 'Disponible', true, 'ASE-OCC-004'
),
(
    'INM-030', 'Calle 17 #37-19', 'Armenia', 'Occidente', 'Apartamento', 'Venta',
    178000000, 74, 3, 2, 'Reservado', false, 'ASE-OCC-005'
),
(
    'INM-031', 'Cra 29 #18-63', 'Armenia', 'Occidente', 'Casa', 'Venta',
    235000000, 140, 4, 3, 'Disponible', true, 'ASE-OCC-001'
),
(
    'INM-032', 'Calle 20 #33-47', 'Armenia', 'Occidente', 'Oficina', 'Arriendo',
    1500000, 48, 1, 1, 'Disponible', true, 'ASE-OCC-002'
),
(
    'INM-033', 'Cra 36 #21-10', 'Armenia', 'Occidente', 'Apartamento', 'Venta',
    205000000, 80, 3, 2, 'Disponible', true, 'ASE-OCC-003'
),
(
    'INM-034', 'Calle 24 #39-32', 'Armenia', 'Occidente', 'Casa', 'Arriendo',
    1950000, 128, 4, 2, 'Disponible', true, 'ASE-OCC-004'
),
(
    'INM-035', 'Cra 38 #26-18', 'Armenia', 'Occidente', 'Local', 'Venta',
    260000000, 76, 1, 2, 'Disponible', true, 'ASE-OCC-005'
),
(
    'INM-036', 'Calle 30 #7-22', 'Armenia', 'Sur', 'Casa', 'Venta',
    175000000, 112, 3, 2, 'Disponible', true, 'ASE-003'
),
(
    'INM-037', 'Cra 8 #33-45', 'Armenia', 'Sur', 'Apartamento', 'Venta',
    145000000, 64, 2, 1, 'Disponible', true, 'ASE-SUR-002'
),
(
    'INM-038', 'Calle 35 #9-16', 'Armenia', 'Sur', 'Casa', 'Arriendo',
    1350000, 98, 3, 2, 'Disponible', true, 'ASE-SUR-003'
),
(
    'INM-039', 'Cra 10 #37-28', 'Armenia', 'Sur', 'Local', 'Arriendo',
    1700000, 55, 1, 1, 'Disponible', true, 'ASE-SUR-004'
),
(
    'INM-040', 'Calle 39 #6-50', 'Armenia', 'Sur', 'Casa', 'Venta',
    215000000, 135, 4, 3, 'Reservado', false, 'ASE-SUR-005'
),
(
    'INM-041', 'Cra 12 #41-11', 'Armenia', 'Sur', 'Apartamento', 'Arriendo',
    1200000, 60, 2, 1, 'Disponible', true, 'ASE-003'
),
(
    'INM-042', 'Calle 42 #8-37', 'Armenia', 'Sur', 'Casa', 'Venta',
    198000000, 126, 4, 2, 'Disponible', true, 'ASE-SUR-002'
),
(
    'INM-043', 'Cra 14 #44-09', 'Armenia', 'Sur', 'Oficina', 'Arriendo',
    1400000, 46, 1, 1, 'Disponible', true, 'ASE-SUR-003'
),
(
    'INM-044', 'Calle 45 #11-26', 'Armenia', 'Sur', 'Apartamento', 'Venta',
    168000000, 70, 3, 2, 'Disponible', true, 'ASE-SUR-004'
),
(
    'INM-045', 'Cra 16 #47-58', 'Armenia', 'Sur', 'Casa', 'Arriendo',
    1750000, 122, 4, 2, 'Disponible', true, 'ASE-SUR-005'
);

UPDATE inmueble
SET imagen_url = CONCAT('/inmuebles/', LOWER(codigo), '.jpg')
WHERE imagen_url IS NULL OR imagen_url = '';

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
    'ASE-003', 'Camila Torres', 'camila@inmobiliaria.com', 'Sur', 5
),
(
    'ASE-CEN-002', 'Daniela Castro', 'daniela.castro@inmobiliaria.com', 'Centro', 9
),
(
    'ASE-CEN-003', 'Santiago Rios', 'santiago.rios@inmobiliaria.com', 'Centro', 7
),
(
    'ASE-CEN-004', 'Valentina Moreno', 'valentina.moreno@inmobiliaria.com', 'Centro', 11
),
(
    'ASE-CEN-005', 'Andres Salazar', 'andres.salazar@inmobiliaria.com', 'Centro', 6
),
(
    'ASE-NOR-002', 'Natalia Mejia', 'natalia.mejia@inmobiliaria.com', 'Norte', 10
),
(
    'ASE-NOR-003', 'Felipe Cardenas', 'felipe.cardenas@inmobiliaria.com', 'Norte', 8
),
(
    'ASE-NOR-004', 'Laura Medina', 'laura.medina@inmobiliaria.com', 'Norte', 13
),
(
    'ASE-NOR-005', 'Jorge Pineda', 'jorge.pineda@inmobiliaria.com', 'Norte', 4
),
(
    'ASE-SUR-002', 'Paula Gutierrez', 'paula.gutierrez@inmobiliaria.com', 'Sur', 7
),
(
    'ASE-SUR-003', 'Miguel Herrera', 'miguel.herrera@inmobiliaria.com', 'Sur', 12
),
(
    'ASE-SUR-004', 'Carolina Rojas', 'carolina.rojas@inmobiliaria.com', 'Sur', 6
),
(
    'ASE-SUR-005', 'Esteban Vargas', 'esteban.vargas@inmobiliaria.com', 'Sur', 9
),
(
    'ASE-OCC-001', 'Camilo Vargas', 'camilo.vargas@inmobiliaria.com', 'Occidente', 5
),
(
    'ASE-OCC-002', 'Juliana Ospina', 'juliana.ospina@inmobiliaria.com', 'Occidente', 8
),
(
    'ASE-OCC-003', 'Ricardo Marin', 'ricardo.marin@inmobiliaria.com', 'Occidente', 6
),
(
    'ASE-OCC-004', 'Manuela Quintero', 'manuela.quintero@inmobiliaria.com', 'Occidente', 10
),
(
    'ASE-OCC-005', 'Tomas Londono', 'tomas.londono@inmobiliaria.com', 'Occidente', 7
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
