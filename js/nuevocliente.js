(function () {
    // Modo actualización desactivado
    actualizar = false;

    // Selectores
    const formulario = document.querySelector('#formulario');

    // Eventos
    document.addEventListener('DOMContentLoaded', () => {
        // Conectarse a la BD
        conectarBD();

        // Validar los campos del formulario
        formulario.addEventListener('submit', validarCliente);
    })
})();