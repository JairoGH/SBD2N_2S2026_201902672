
/*
 * Proyecto: Sistema de Inventario y Ventas
 * Archivo: 03-crud.js
 *
 * Objetivo:
 * Demostrar las operaciones CRUD de MongoDB.
 *
 * CREATE - insertOne()
 * READ   - findOne()
 * UPDATE - updateOne()
 * DELETE - deleteOne()
 */

(function () {

const database = db.getSiblingDB("inventario_ventas_db");

const productos = database.productos;

const SKU_PRUEBA = "PRB-001";

// ==============================================
// 1. VERIFICACIONES PREVIAS
// ==============================================

print("\n===== VERIFICACIONES INICIALES =====");

const cantidadInicial = productos.countDocuments({});

print(`Productos iniciales: ${cantidadInicial}`);

// Verificar que no exista el producto de prueba.

if (productos.findOne({ sku: SKU_PRUEBA })) {

  throw new Error(
    "El producto de prueba ya existe. " +
    "Revisa su estado antes de continuar."
  );

}

// Obtener referencias existentes.

const categoria = database.categorias.findOne({
  nombre: "Tecnología"
});

const proveedor = database.proveedores.findOne({
  nombre: "Tecno Distribuidora GT"
});

if (!categoria || !proveedor) {

  throw new Error(
    "No se encontraron la categoría o el proveedor."
  );

}

// ==============================================
// 2. CREATE - INSERTAR PRODUCTO
// ==============================================

print("\n===== CREATE =====");

const nuevoProducto = {

  sku: SKU_PRUEBA,

  nombre: "Producto de prueba CRUD",

  categoria_id: categoria._id,

  proveedor_id: proveedor._id,

  precio_centavos: NumberLong("14900"),

  stock: NumberInt(10),

  stock_minimo: NumberInt(3),

  activo: true,

  fecha_actualizacion: new Date()

};

const resultadoCreate = productos.insertOne(
  nuevoProducto
);

if (!resultadoCreate.acknowledged) {

  throw new Error(
    "No se confirmó la inserción."
  );

}

print("Producto insertado correctamente:");

printjson(resultadoCreate);

print("Documento creado:");

printjson(
  productos.findOne({
    sku: SKU_PRUEBA
  })
);

// ==============================================
// 3. READ - CONSULTAR PRODUCTO
// ==============================================

print("\n===== READ =====");

const productoEncontrado = productos.findOne(
  {
    sku: SKU_PRUEBA
  },
  {
    projection: {
      sku: 1,
      nombre: 1,
      precio_centavos: 1,
      stock: 1,
      stock_minimo: 1,
      activo: 1
    }
  }
);

if (!productoEncontrado) {

  throw new Error(
    "El producto no fue encontrado."
  );

}

print("Producto encontrado:");

printjson(productoEncontrado);

// ==============================================
// 4. UPDATE - ACTUALIZAR PRODUCTO
// ==============================================

print("\n===== UPDATE =====");

/*
 * Modificaciones:
 *
 * Precio anterior: Q149.00
 * Precio nuevo:    Q139.00
 *
 * Stock anterior: 10
 * Stock nuevo:    15
 */

const resultadoUpdate = productos.updateOne(

  {
    sku: SKU_PRUEBA
  },

  {
    $set: {

      precio_centavos: NumberLong("13900"),

      fecha_actualizacion: new Date()

    },

    $inc: {

      stock: NumberInt(5)

    }
  }

);

if (
  resultadoUpdate.matchedCount !== 1 ||
  resultadoUpdate.modifiedCount !== 1
) {

  throw new Error(
    "La actualización no se completó correctamente."
  );

}

print("Resultado de la actualización:");

printjson(resultadoUpdate);

print("Documento actualizado:");

printjson(
  productos.findOne({
    sku: SKU_PRUEBA
  })
);

// ==============================================
// 5. DELETE - ELIMINAR PRODUCTO
// ==============================================

print("\n===== DELETE =====");

/*
 * Se elimina exclusivamente el producto
 * temporal utilizado para esta prueba.
 */

const resultadoDelete = productos.deleteOne({

  sku: SKU_PRUEBA

});

if (resultadoDelete.deletedCount !== 1) {

  throw new Error(
    "No se eliminó el producto de prueba."
  );

}

print("Resultado de la eliminación:");

printjson(resultadoDelete);

// ==============================================
// 6. VERIFICACION FINAL
// ==============================================

print("\n===== VERIFICACION FINAL =====");

const productoEliminado = productos.findOne({

  sku: SKU_PRUEBA

});

const cantidadFinal = productos.countDocuments({});

print("Producto después de eliminar:");

printjson(productoEliminado);

print(`Productos iniciales: ${cantidadInicial}`);

print(`Productos finales: ${cantidadFinal}`);

if (productoEliminado !== null) {

  throw new Error(
    "El producto todavía existe."
  );

}

if (cantidadInicial !== cantidadFinal) {

  throw new Error(
    "La cantidad final de productos no coincide."
  );

}

print("\nCRUD ejecutado correctamente.");

})();
