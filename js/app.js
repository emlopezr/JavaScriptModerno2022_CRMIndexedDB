(function () {
    // Selectores
    const listadoClientes = document.querySelector('#listado-clientes');

    // Eventos
    document.addEventListener('DOMContentLoaded', () => {
        // Crear la BD de IndexDB
        crearBD();

        // Verificar que ya exita la BD de IndexDB
        if (window.indexedDB.open('crm', 1)) {
            // Listar los clientes ya creados en la BD
            imprimirClientes();
        }

        // Eliminar un cliente
        listadoClientes.addEventListener('click', eliminarCliente)
    });

    function crearBD() {
        const crearBD = window.indexedDB.open('crm', 1);

        // Chequear errores y si todo está bien, guardar referencia global a la BD
        crearBD.onerror = () => console.error('Error al crear la BD');
        crearBD.onsuccess = () => BD = crearBD.result;

        // Creación de las tablas
        crearBD.onupgradeneeded = e => {
            const bd = e.target.result;
            const objectStore = bd.createObjectStore('crm', { keyPath: 'id', autoIncrement: true }); // Clave primaria: ID

            // Creación de las columnas
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            // Mensaje de confirmación de la BD
            console.log('BD lista y creada');
        }
    }

    function imprimirClientes() {
        // Abrir conexión a la BD
        const abrirConexion = window.indexedDB.open('crm', 1);

        // Chequear errores y si todo está bien, guardar referencia global a la BD
        abrirConexion.onerror = () => console.error('Error al conectarse a la BD');
        abrirConexion.onsuccess = () => {
            // Guardar referencia global a la BD y crear la transacción
            BD = abrirConexion.result
            const objectStore = BD.transaction('crm').objectStore('crm');

            // Cursor que recorre toda la BD
            objectStore.openCursor().onsuccess = e => {
                const cursor = e.target.result;

                // Verificar si queda algún elemento en la BD
                if (cursor) {
                    // Destructuring del objeto del cliente
                    const { nombre, email, telefono, empresa, id } = cursor.value;

                    // Crear el elemento HTML del cliente y agregarlo a la tabla

                    listadoClientes.innerHTML += `
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `;

                    // Ir al siguiente elemento
                    cursor.continue();
                }
            }
        };
    }
})();