
/*
 * Proyecto: Sistema de Inventario y Ventas
 * Archivo: 04-consultas.js
 *
 * Consultas:
 * Q1 - Productos con stock bajo
 * Q2 - Productos por categoría y precio
 * Q3 - Productos más vendidos
 */

(function () {

const database = db.getSiblingDB("inventario_ventas_db");

// ==================================================
// Q1. PRODUCTOS CON EXISTENCIAS BAJAS
// ==================================================

print("\n========================================");
print("Q1 - PRODUCTOS CON STOCK BAJO");
print("========================================");

const productosStockBajo = database.productos.find(
  {
    activo: true,

    $expr: {
      $lte: [
        "$stock",
        "$stock_minimo"
      ]
    }
  },
  {
    _id: 0,
    sku: 1,
    nombre: 1,
    stock: 1,
    stock_minimo: 1
  }
)
.sort({ sku: 1 })
.toArray();

printjson(productosStockBajo);

print(
  `Productos con stock bajo: ${productosStockBajo.length}`
);

// ==================================================
// Q2. PRODUCTOS POR CATEGORIA Y PRECIO
// ==================================================

print("\n========================================");
print("Q2 - PRODUCTOS POR CATEGORIA Y PRECIO");
print("========================================");

const categoria = database.categorias.findOne({
  nombre: "Tecnología"
});

if (!categoria) {
  throw new Error("La categoría no existe.");
}

const productosCategoria = database.productos.find(
  {
    categoria_id: categoria._id,
    activo: true
  },
  {
    _id: 0,
    sku: 1,
    nombre: 1,
    precio_centavos: 1,
    stock: 1
  }
)
.sort({
  precio_centavos: 1,
  sku: 1
})
.toArray();

print(`Categoría: ${categoria.nombre}`);

printjson(productosCategoria);

print(
  `Productos encontrados: ${productosCategoria.length}`
);

// ==================================================
// Q3. CINCO PRODUCTOS MAS VENDIDOS
// ==================================================

print("\n========================================");
print("Q3 - TOP 5 PRODUCTOS MAS VENDIDOS");
print("========================================");

const productosMasVendidos = database.ventas.aggregate([

  // Considerar únicamente ventas confirmadas.

  {
    $match: {
      estado: "CONFIRMADA"
    }
  },

  // Separar los elementos del arreglo productos.

  {
    $unwind: "$productos"
  },

  // Agrupar por producto y sumar cantidades.

  {
    $group: {
      _id: "$productos.producto_id",

      sku: {
        $first: "$productos.sku"
      },

      nombre: {
        $first: "$productos.nombre"
      },

      unidades_vendidas: {
        $sum: "$productos.cantidad"
      }
    }
  },

  // Ordenar de mayor a menor.
  // SKU permite resolver empates.

  {
    $sort: {
      unidades_vendidas: -1,
      sku: 1
    }
  },

  // Mostrar únicamente cinco resultados.

  {
    $limit: 5
  },

  // Seleccionar columnas de salida.

  {
    $project: {
      _id: 0,
      sku: 1,
      nombre: 1,
      unidades_vendidas: 1
    }
  }

]).toArray();

printjson(productosMasVendidos);

print(
  `Productos en el ranking: ${productosMasVendidos.length}`
);

// ==================================================
// VERIFICACION DE RESULTADOS
// ==================================================

print("\n========================================");
print("RESUMEN DE CONSULTAS");
print("========================================");

printjson({
  productos_stock_bajo: productosStockBajo.length,
  productos_categoria: productosCategoria.length,
  productos_ranking: productosMasVendidos.length
});

print("\nConsultas ejecutadas correctamente.");

})();
