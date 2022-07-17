// Referencia global de la BD
let BD;
let actualizar;
let idCliente;

function conectarBD() {
    const abrirConexion = window.indexedDB.open('crm', 1);

    // Chequear errores y si todo está bien, guardar referencia global a la BD
    abrirConexion.onerror = () => console.error('Error al conectarse a la BD');
    abrirConexion.onsuccess = () => BD = abrirConexion.result;
}

function imprimirAlerta(mensaje, tipo, tiempo) {
    // Eliminar alertas previas
    const alertaPrevia = document.querySelector('.alerta');

    if (alertaPrevia) {
        alertaPrevia.remove();
        return imprimirAlerta(mensaje, tipo, tiempo);
    }

    // Crear el elemento HTML
    const divAlerta = document.createElement('DIV');
    divAlerta.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
    divAlerta.textContent = mensaje;

    // Tipos de alertas
    if (tipo === 'error') {
        divAlerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700',);
    } else {
        divAlerta.classList.add('bg-green-100', 'border-green-400', 'text-green-700',);
    }

    // Imprimir dentro del HTML
    formulario.appendChild(divAlerta);

    // Eliminar la alerta luego de cierto tiempo
    setTimeout(() => divAlerta.remove(), tiempo * 1000);
}

function validarCliente(e) {
    e.preventDefault(); // Prevenir submit predeteminado

    // Leer inputs
    const nombre = document.querySelector('#nombre').value;
    const email = document.querySelector('#email').value;
    const telefono = document.querySelector('#telefono').value;
    const empresa = document.querySelector('#empresa').value;

    // Validar strings vacíos
    if (nombre === '' || email === '' || telefono === '' || empresa === '') {
        imprimirAlerta('Todos los campos son obligatorios', 'error', 3);
        return;
    }

    // Validar email con Regex -> Tomado de https://emailregex.com
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        imprimirAlerta('Por favor ingrese un correo válido', 'error', 3);
        return;
    }


    // Dependiendo de la acción crear/actualizar cliente
    if (actualizar) {
        const clienteActualizado = { nombre, email, telefono, empresa, id: Number(idCliente) }
        actualizarCliente(clienteActualizado);

    } else {
        // Crear un objeto con la información del cliente y pasarlo a la función de crear
        const clienteNuevo = { nombre, email, telefono, empresa, id: Date.now() }
        crearNuevoCliente(clienteNuevo);
    }
}

function crearNuevoCliente(cliente) {
    // Transacción de la BD
    const transaction = BD.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');

    // Insertar cliente en la BD
    objectStore.add(cliente);

    // Chequear estado de la transacción e imprimir una alerta por cada caso
    transaction.onerror = () => {
        imprimirAlerta('El correo que estás ingresando ya se encuantra en uso por otro cliente', 'error', 3);
    };

    transaction.oncomplete = () => {
        imprimirAlerta('El cliente se agregó correctamente', 'correcto', 3);

        // Redirigir a la página de clientes luego de 3 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000)
    };
}

function actualizarCliente(cliente) {
    // Transacción de la BD
    const transaction = BD.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');

    // Actualizar el valor en la BD
    objectStore.put(cliente);

    // Chequear estado de la transacción e imprimir una alerta por cada caso
    transaction.onerror = () => {
        imprimirAlerta('Hubo un error al actualizar el cliente', 'error', 3);
    };

    transaction.oncomplete = () => {
        imprimirAlerta('El cliente se actualizó correctamente', 'correcto', 3);

        // Redirigir a la página de clientes luego de 3 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000)
    };
}

function eliminarCliente(e) {
    // Verificar por Delegation si se le dió click al botón eliminar
    if (e.target.classList.contains('eliminar')) {
        // Leer el ID del cliente
        const idEliminar = Number(e.target.dataset.cliente);

        // Pregunta de confirmación
        const confirmar = confirm('¿Deseas eliminar este cliente?');

        if (confirmar) {
            // Transacción de la BD
            const transaction = BD.transaction(['crm'], 'readwrite');
            const objectStore = transaction.objectStore('crm');

            // Actualizar el valor en la BD
            objectStore.delete(idEliminar);

            // Chequear estado de la transacción e imprimir una alerta por cada caso
            transaction.onerror = () => console.error('Error al eliminar el cliente');

            transaction.oncomplete = () => {
                // Eliminar del HTML el registro eliminado
                e.target.parentElement.parentElement.remove();
            };
        }
    }
}