
/*
 * Proyecto: Sistema de Inventario y Ventas
 * Archivo: 02-datos-iniciales.js
 *
 * Objetivo:
 * Insertar 45 documentos de prueba.
 *
 * 5 categorias
 * 5 proveedores
 * 25 productos
 * 10 ventas
 */

(function () {

const database = db.getSiblingDB("inventario_ventas_db");

// ================================================
// 1. VERIFICAR QUE LAS COLECCIONES ESTEN VACIAS
// ================================================

const colecciones = [
  "categorias",
  "proveedores",
  "productos",
  "ventas"
];

for (const nombre of colecciones) {

  if (database.getCollection(nombre).countDocuments({}) > 0) {
    throw new Error(
      `La colección ${nombre} contiene registros. ` +
      "Se cancela la carga para evitar duplicados."
    );
  }
}

// ================================================
// 2. CATEGORIAS
// ================================================

const categorias = [
  {
    _id: ObjectId(),
    nombre: "Tecnología",
    descripcion: "Productos electrónicos y accesorios",
    activo: true
  },
  {
    _id: ObjectId(),
    nombre: "Hogar",
    descripcion: "Artículos para el hogar",
    activo: true
  },
  {
    _id: ObjectId(),
    nombre: "Papelería",
    descripcion: "Artículos escolares y de oficina",
    activo: true
  },
  {
    _id: ObjectId(),
    nombre: "Alimentos",
    descripcion: "Productos alimenticios",
    activo: true
  },
  {
    _id: ObjectId(),
    nombre: "Deportes",
    descripcion: "Artículos deportivos",
    activo: true
  }
];

// ================================================
// 3. PROVEEDORES
// ================================================

const proveedores = [
  {
    _id: ObjectId(),
    nombre: "Tecno Distribuidora GT",
    correo: "tecnologia@example.com",
    telefono: "22223333",
    activo: true
  },
  {
    _id: ObjectId(),
    nombre: "Hogar Plus",
    correo: "hogar@example.com",
    telefono: "23334444",
    activo: true
  },
  {
    _id: ObjectId(),
    nombre: "Oficina Total",
    correo: "oficina@example.com",
    telefono: "24445555",
    activo: true
  },
  {
    _id: ObjectId(),
    nombre: "Alimentos del Valle",
    correo: "alimentos@example.com",
    telefono: "25556666",
    activo: true
  },
  {
    _id: ObjectId(),
    nombre: "Deportes GT",
    correo: "deportes@example.com",
    telefono: "26667777",
    activo: true
  }
];

// ================================================
// 4. CATALOGO DE PRODUCTOS
// ================================================

/*
 * Formato:
 *
 * SKU, Nombre, Categoria, Proveedor,
 * PrecioCentavos, StockInicial, StockMinimo
 *
 * Los indices de categoria y proveedor
 * corresponden a los arreglos anteriores.
 */

const catalogo = [

  // TECNOLOGIA
  ["TEC-001", "Mouse inalámbrico", 0, 0, 12999, 18, 5],
  ["TEC-002", "Teclado USB", 0, 0, 19900, 12, 4],
  ["TEC-003", "Audífonos", 0, 0, 24900, 5, 3],
  ["TEC-004", "Memoria USB 64GB", 0, 0, 6500, 8, 5],
  ["TEC-005", "Webcam HD", 0, 0, 32900, 7, 2],

  // HOGAR
  ["HOG-001", "Lámpara LED", 1, 1, 17500, 12, 4],
  ["HOG-002", "Termo de acero", 1, 1, 8900, 8, 3],
  ["HOG-003", "Organizador", 1, 1, 12000, 5, 3],
  ["HOG-004", "Cafetera", 1, 1, 45900, 5, 2],
  ["HOG-005", "Vaso de vidrio", 1, 1, 3500, 20, 5],

  // PAPELERIA
  ["PAP-001", "Cuaderno universitario", 2, 2, 2500, 18, 5],
  ["PAP-002", "Bolígrafo azul", 2, 2, 500, 30, 8],
  ["PAP-003", "Carpeta", 2, 2, 1800, 14, 4],
  ["PAP-004", "Marcador permanente", 2, 2, 1200, 5, 3],
  ["PAP-005", "Agenda", 2, 2, 7500, 7, 2],

  // ALIMENTOS
  ["ALI-001", "Café molido", 3, 3, 8500, 10, 4],
  ["ALI-002", "Galletas", 3, 3, 1800, 25, 6],
  ["ALI-003", "Cereal", 3, 3, 4200, 12, 4],
  ["ALI-004", "Té", 3, 3, 3200, 6, 3],
  ["ALI-005", "Miel", 3, 3, 6900, 6, 2],

  // DEPORTES
  ["DEP-001", "Botella deportiva", 4, 4, 7900, 8, 5],
  ["DEP-002", "Cuerda para saltar", 4, 4, 5500, 5, 3],
  ["DEP-003", "Bandas elásticas", 4, 4, 11900, 9, 3],
  ["DEP-004", "Pelota deportiva", 4, 4, 16500, 8, 2],
  ["DEP-005", "Esterilla", 4, 4, 22000, 3, 2]

];

// Crear estructura temporal de productos.

const productos = catalogo.map(p => ({

  _id: ObjectId(),

  sku: p[0],
  nombre: p[1],

  categoria_id: categorias[p[2]]._id,
  proveedor_id: proveedores[p[3]]._id,

  precio: p[4],
  stock: p[5],
  stock_minimo: p[6],

  activo: true

}));

// ================================================
// 5. VENTAS DE PRUEBA
// ================================================

/*
 * Cada venta contiene:
 *
 * Nombre del cliente
 * Correo del cliente
 * Productos y cantidades
 */

const ventasIniciales = [

  {
    cliente: "Carlos López",
    correo: "carlos@example.com",
    items: [
      ["TEC-001", 2],
      ["PAP-001", 3]
    ]
  },

  {
    cliente: "María Pérez",
    correo: "maria@example.com",
    items: [
      ["TEC-001", 1],
      ["TEC-002", 2]
    ]
  },

  {
    cliente: "Ana García",
    correo: "ana@example.com",
    items: [
      ["HOG-002", 2],
      ["ALI-001", 2]
    ]
  },

  {
    cliente: "Luis Hernández",
    correo: "luis@example.com",
    items: [
      ["PAP-002", 5],
      ["PAP-004", 2]
    ]
  },

  {
    cliente: "Sofía Ramírez",
    correo: "sofia@example.com",
    items: [
      ["DEP-001", 3],
      ["DEP-002", 2]
    ]
  },

  {
    cliente: "Pedro Morales",
    correo: "pedro@example.com",
    items: [
      ["TEC-003", 2],
      ["TEC-004", 4]
    ]
  },

  {
    cliente: "Laura Castillo",
    correo: "laura@example.com",
    items: [
      ["HOG-003", 2],
      ["HOG-004", 1]
    ]
  },

  {
    cliente: "José Martínez",
    correo: "jose@example.com",
    items: [
      ["ALI-002", 4],
      ["ALI-003", 3]
    ]
  },

  {
    cliente: "Andrea Gómez",
    correo: "andrea@example.com",
    items: [
      ["TEC-001", 2],
      ["PAP-001", 2],
      ["DEP-001", 1]
    ]
  },

  {
    cliente: "Roberto Díaz",
    correo: "roberto@example.com",
    items: [
      ["ALI-004", 3],
      ["DEP-003", 2],
      ["DEP-005", 1]
    ]
  }

];

// ================================================
// 6. CONSTRUIR DOCUMENTOS DE VENTAS
// ================================================

const ventas = ventasIniciales.map((venta, index) => {

  let total = 0;

  const detalles = venta.items.map(([sku, cantidad]) => {

    const producto = productos.find(p => p.sku === sku);

    if (!producto) {
      throw new Error(`Producto inexistente: ${sku}`);
    }

    if (producto.stock < cantidad) {
      throw new Error(
        `Existencias insuficientes: ${sku}`
      );
    }

    // Descontar existencias en memoria.
    producto.stock -= cantidad;

    // Calcular subtotal.
    const subtotal = producto.precio * cantidad;

    total += subtotal;

    // Guardar informacion historica del producto.
    return {

      producto_id: producto._id,

      sku: producto.sku,

      nombre: producto.nombre,

      cantidad: NumberInt(cantidad),

      precio_unitario_centavos:
        NumberLong(String(producto.precio)),

      subtotal_centavos:
        NumberLong(String(subtotal))

    };

  });

  return {

    _id: ObjectId(),

    numero_venta:
      `VEN-${String(index + 1).padStart(3, "0")}`,

    fecha: new Date(
      Date.UTC(2026, 8, 10 + index, 14, 30)
    ),

    cliente: {
      nombre: venta.cliente,
      correo: venta.correo
    },

    productos: detalles,

    total_centavos: NumberLong(String(total)),

    estado: "CONFIRMADA"

  };

});

// ================================================
// 7. PREPARAR DOCUMENTOS FINALES DE PRODUCTOS
// ================================================

const productosFinales = productos.map(p => ({

  _id: p._id,

  sku: p.sku,

  nombre: p.nombre,

  categoria_id: p.categoria_id,

  proveedor_id: p.proveedor_id,

  precio_centavos: NumberLong(String(p.precio)),

  stock: NumberInt(p.stock),

  stock_minimo: NumberInt(p.stock_minimo),

  activo: p.activo,

  fecha_actualizacion: new Date()

}));

// ================================================
// 8. INSERTAR DOCUMENTOS
// ================================================

print("Insertando categorias...");

database.categorias.insertMany(categorias);

print("Insertando proveedores...");

database.proveedores.insertMany(proveedores);

print("Insertando productos...");

database.productos.insertMany(productosFinales);

print("Insertando ventas...");

database.ventas.insertMany(ventas);

// ================================================
// 9. VERIFICAR RESULTADOS
// ================================================

const cantidades = {

  categorias:
    database.categorias.countDocuments({}),

  proveedores:
    database.proveedores.countDocuments({}),

  productos:
    database.productos.countDocuments({}),

  ventas:
    database.ventas.countDocuments({})

};

const total =
  cantidades.categorias +
  cantidades.proveedores +
  cantidades.productos +
  cantidades.ventas;

print("\n===== RESULTADOS DE LA CARGA =====");

printjson(cantidades);

print(`TOTAL DOCUMENTOS: ${total}`);

if (total !== 45) {
  throw new Error(
    "La cantidad de documentos no coincide."
  );
}

print("Carga inicial completada correctamente.");

})();
