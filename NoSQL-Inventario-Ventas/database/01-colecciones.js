
/*
 * Proyecto: Sistema de Inventario y Ventas
 * Base de datos: MongoDB
 * Archivo: 01-colecciones.js
 *
 * Objetivo:
 * Crear las colecciones y sus reglas de validación.
 */

const database = db.getSiblingDB("inventario_ventas_db");

// ==================================================
// 1. CATEGORÍAS
// ==================================================

const categoriasSchema = {
  bsonType: "object",

  required: [
    "nombre",
    "descripcion",
    "activo"
  ],

  properties: {
    _id: {
      bsonType: "objectId"
    },

    nombre: {
      bsonType: "string",
      minLength: 2
    },

    descripcion: {
      bsonType: "string"
    },

    activo: {
      bsonType: "bool"
    }
  }
};

// ==================================================
// 2. PROVEEDORES
// ==================================================

const proveedoresSchema = {
  bsonType: "object",

  required: [
    "nombre",
    "correo",
    "telefono",
    "activo"
  ],

  properties: {
    _id: {
      bsonType: "objectId"
    },

    nombre: {
      bsonType: "string",
      minLength: 2
    },

    correo: {
      bsonType: "string",
      pattern: "^[^@]+@[^@]+\\.[^@]+$"
    },

    telefono: {
      bsonType: "string"
    },

    activo: {
      bsonType: "bool"
    }
  }
};

// ==================================================
// 3. PRODUCTOS
// ==================================================

const productosSchema = {
  bsonType: "object",

  required: [
    "sku",
    "nombre",
    "categoria_id",
    "proveedor_id",
    "precio_centavos",
    "stock",
    "stock_minimo",
    "activo",
    "fecha_actualizacion"
  ],

  properties: {
    _id: {
      bsonType: "objectId"
    },

    sku: {
      bsonType: "string",
      minLength: 3
    },

    nombre: {
      bsonType: "string",
      minLength: 2
    },

    categoria_id: {
      bsonType: "objectId"
    },

    proveedor_id: {
      bsonType: "objectId"
    },

    precio_centavos: {
      bsonType: "long",
      minimum: 0
    },

    stock: {
      bsonType: "int",
      minimum: 0
    },

    stock_minimo: {
      bsonType: "int",
      minimum: 0
    },

    activo: {
      bsonType: "bool"
    },

    fecha_actualizacion: {
      bsonType: "date"
    }
  }
};

// ==================================================
// 4. VENTAS
// ==================================================

const ventasSchema = {
  bsonType: "object",

  required: [
    "numero_venta",
    "fecha",
    "cliente",
    "productos",
    "total_centavos",
    "estado"
  ],

  properties: {
    _id: {
      bsonType: "objectId"
    },

    numero_venta: {
      bsonType: "string"
    },

    fecha: {
      bsonType: "date"
    },

    cliente: {
      bsonType: "object",

      required: ["nombre", "correo"],

      properties: {
        nombre: {
          bsonType: "string"
        },

        correo: {
          bsonType: "string"
        }
      }
    },

    productos: {
      bsonType: "array",
      minItems: 1,

      items: {
        bsonType: "object",

        required: [
          "producto_id",
          "sku",
          "nombre",
          "cantidad",
          "precio_unitario_centavos",
          "subtotal_centavos"
        ],

        properties: {
          producto_id: {
            bsonType: "objectId"
          },

          sku: {
            bsonType: "string"
          },

          nombre: {
            bsonType: "string"
          },

          cantidad: {
            bsonType: "int",
            minimum: 1
          },

          precio_unitario_centavos: {
            bsonType: "long",
            minimum: 0
          },

          subtotal_centavos: {
            bsonType: "long",
            minimum: 0
          }
        }
      }
    },

    total_centavos: {
      bsonType: "long",
      minimum: 0
    },

    estado: {
      enum: [
        "PENDIENTE",
        "CONFIRMADA",
        "CANCELADA"
      ]
    }
  }
};

// ==================================================
// FUNCIÓN PARA CREAR O ACTUALIZAR COLECCIONES
// ==================================================

function configurarColeccion(nombre, esquema) {

  const configuracion = {
    validator: {
      $jsonSchema: esquema
    },
    validationLevel: "strict",
    validationAction: "error"
  };

  let resultado;

  if (database.getCollectionNames().includes(nombre)) {

    resultado = database.runCommand({
      collMod: nombre,
      ...configuracion
    });

    if (resultado.ok !== 1) {
      throw new Error(`No se pudo actualizar ${nombre}`);
    }

    print(`ACTUALIZADA: ${nombre}`);

  } else {

    resultado = database.createCollection(
      nombre,
      configuracion
    );

    if (resultado.ok !== 1) {
      throw new Error(`No se pudo crear ${nombre}`);
    }

    print(`CREADA: ${nombre}`);
  }
}

// ==================================================
// EJECUCIÓN
// ==================================================

configurarColeccion(
  "categorias",
  categoriasSchema
);

configurarColeccion(
  "proveedores",
  proveedoresSchema
);

configurarColeccion(
  "productos",
  productosSchema
);

configurarColeccion(
  "ventas",
  ventasSchema
);

// ==================================================
// ÍNDICES DE UNICIDAD
// ==================================================

database.categorias.createIndex(
  { nombre: 1 },
  { unique: true }
);

database.proveedores.createIndex(
  { correo: 1 },
  { unique: true }
);

database.productos.createIndex(
  { sku: 1 },
  { unique: true }
);

database.ventas.createIndex(
  { numero_venta: 1 },
  { unique: true }
);

print("\nColecciones configuradas correctamente.");

printjson(database.getCollectionNames());
