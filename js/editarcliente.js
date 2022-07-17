(function () {
    // Modo actualización activado
    actualizar = true;

    // Selectores
    const formulario = document.querySelector('#formulario');

    // Eventos
    document.addEventListener('DOMContentLoaded', () => {
        // Conectarse a la BD
        conectarBD();

        // Verificar ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');

        // Si tenemos un ID del cliente, lo obtenemos de la BD
        if (idCliente) {
            // Esperar 100ms mientras se conecta a la BD -> Más adelante se puede soluncionar con asincronismo
            setTimeout(() => obtenerCliente(idCliente), 100);
        }

        // Validar los campos del formulario
        formulario.addEventListener('submit', validarCliente);
    })

    function obtenerCliente(id) {
        // Transacción de la BD
        const transaction = BD.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');

        // Obtener cliente de la BD, iterar sobre los resultados hasta encontrar al cliente deseado
        const cliente = objectStore.openCursor();
        cliente.onsuccess = e => {
            const cursor = e.target.result;

            if (cursor) {
                // Verificar si encontramos al cliente
                if (cursor.value.id === Number(id)) {
                    // Rellenar el formulario con los datos del cliente
                    llenarFormulario(cursor.value);
                    return;
                }

                // Ir al siguiente elemento si no se encontró en esta iteración
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {
        // Destructuring del objeto del cliente
        const { nombre, email, telefono, empresa } = datosCliente;

        // Inputs
        document.querySelector('#nombre').value = nombre;
        document.querySelector('#email').value = email;
        document.querySelector('#telefono').value = telefono;
        document.querySelector('#empresa').value = empresa;
    }
})();