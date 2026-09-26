
/*
 * Archivo: 05-indices.js
 *
 * Objetivo:
 * Comparar una consulta antes y después
 * de crear un índice compuesto.
 */

(function () {

const database = db.getSiblingDB("inventario_ventas_db");

const categoria = database.categorias.findOne({
  nombre: "Tecnología"
});

if (!categoria) {
  throw new Error("Categoría no encontrada.");
}

const filtro = {
  categoria_id: categoria._id,
  activo: true
};

const orden = {
  precio_centavos: 1,
  sku: 1
};

const indice = {
  categoria_id: 1,
  activo: 1,
  precio_centavos: 1,
  sku: 1
};

// ==================================================
// 1. CONSULTA ANTES DE CREAR EL INDICE
// ==================================================

print("\n===== ANTES DE OPTIMIZAR =====");

const antes = database.productos
  .find(filtro)
  .sort(orden)
  .explain("executionStats");

printjson({
  documentos_devueltos:
    antes.executionStats.nReturned,

  documentos_examinados:
    antes.executionStats.totalDocsExamined,

  claves_examinadas:
    antes.executionStats.totalKeysExamined,

  tiempo_ms:
    antes.executionStats.executionTimeMillis
});

print("Plan de ejecución anterior:");

printjson(antes.queryPlanner.winningPlan);

// ==================================================
// 2. CREAR INDICE COMPUESTO
// ==================================================

print("\n===== CREANDO INDICE =====");

const nombreIndice = database.productos.createIndex(
  indice,
  {
    name: "idx_categoria_activo_precio_sku"
  }
);

print(`Índice creado: ${nombreIndice}`);

// ==================================================
// 3. CONSULTA DESPUES DE CREAR EL INDICE
// ==================================================

print("\n===== DESPUES DE OPTIMIZAR =====");

const despues = database.productos
  .find(filtro)
  .sort(orden)
  .explain("executionStats");

printjson({
  documentos_devueltos:
    despues.executionStats.nReturned,

  documentos_examinados:
    despues.executionStats.totalDocsExamined,

  claves_examinadas:
    despues.executionStats.totalKeysExamined,

  tiempo_ms:
    despues.executionStats.executionTimeMillis
});

print("Plan de ejecución posterior:");

printjson(despues.queryPlanner.winningPlan);

// ==================================================
// 4. VERIFICAR INDICES
// ==================================================

print("\n===== INDICES DISPONIBLES =====");

printjson(database.productos.getIndexes());

})();
