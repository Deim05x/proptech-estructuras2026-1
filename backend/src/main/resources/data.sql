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