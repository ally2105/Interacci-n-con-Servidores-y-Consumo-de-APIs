const urlAPi = "http://localhost:3000/Productos";
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const listaProductos = document.getElementById("listaProductos");
const categoriaSelect = document.getElementById("categoria");
const guardarButton = document.getElementById("guardar");
let editandoId = null;

function cargarProductos() {
    fetch(urlAPi)
        .then(res => res.json())
        .then(productos => {
            listaProductos.innerHTML = "";
            productos.forEach(producto => {
                const li = document.createElement("li");
                li.className = "producto";
                const fecha = new Date(producto.FechaCreacion).toLocaleString();
                li.innerHTML = `
          <strong>${producto.Producto}</strong> - $${producto.Precio} - ${producto.Categoria} - <em>${fecha}</em>
          <button class="editar">Editar</button>
          <button class="eliminar">Eliminar</button>
        `;

                li.querySelector(".editar").addEventListener("click", () => cargarParaEditar(producto));
                li.querySelector(".eliminar").addEventListener("click", () => eliminarProducto(producto.id));

                listaProductos.appendChild(li)
            });
        })
        .catch(err => console.error("Error cargando productos:", err));
}

function guardarProducto() {
    const producto = nombreInput.value.trim();
    const precio = Number(precioInput.value);
    const categoria = categoriaSelect.value;

    if (!producto || !precio || !categoria) {
        alert("Por favor rellena todos los campos correctamente");
        return;
    }

    const productoData = {
        Producto: producto,
        Precio: precio,
        Categoria: categoria,
        FechaCreacion: new Date().toISOString()
    };

    if (editandoId) {
        // Actualizar
        fetch(`${urlAPi}/${editandoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productoData)
        })
            .then(res => res.json())
            .then(() => {
                alert("Producto actualizado");
                resetForm();
                cargarProductos();
            })
            .catch(err => console.error("Error actualizando producto:", err));
    } else {
        // Crear nuevo
        fetch(urlAPi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productoData)
        })
            .then(res => res.json())
            .then(() => {
                alert("Producto agregado exitosamente");
                resetForm();
                cargarProductos();
            })
            .catch(err => console.error("Error agregando producto:", err));
    }
}

function cargarParaEditar(producto) {
    nombreInput.value = producto.Producto;
    precioInput.value = producto.Precio;
    categoriaSelect.value = producto.Categoria;
    editandoId = producto.id;
    guardarButton.textContent = "Actualizar producto";
}

function eliminarProducto(id) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        fetch(`${urlAPi}/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                alert("Producto eliminado");
                if (editandoId === id) {
                    resetForm();
                }
                cargarProductos();
            })
            .catch(err => console.error("Error eliminando producto:", err));
    }
}

function resetForm() {
    nombreInput.value = "";
    precioInput.value = "";
    categoriaSelect.value = "Frutas";
    editandoId = null;
    guardarButton.textContent = "Agregar producto";
}

guardarButton.addEventListener("click", guardarProducto);
cargarProductos();