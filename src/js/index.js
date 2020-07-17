//event listeners
document.getElementById('icon-cerrar').addEventListener('click', () => {
    document.getElementById('alerta').classList.toggle('visible');
});

document.getElementById('form-inicio-sesion').addEventListener('submit', (event) => {
    event.preventDefault();
    iniciarSesion();
});

//funciones

function generarAlerta(texto) {
    const alert = document.getElementById('alerta');
    alert.classList.toggle('visible');
    const mensaje = document.getElementById('texto-alerta');
    mensaje.innerText = texto;
}

function cambiarAListaEmpleados(token) {
    sessionStorage.setItem('token',token)
    document.getElementById("seccion-iniciar-sesion").classList.toggle('invisible')
    document.getElementById("seccion-iniciar-sesion").classList.toggle('invisible')
}

//peticiones al API

const iniciarSesion = () => {

    const correo = document.getElementById('correo-iniciar-sesion').value;
    const contraseña = document.getElementById('contraseña-iniciar-sesion').value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "correo": correo, "contraseña": contraseña });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://gestion-empleados.herokuapp.com/usuarios/login", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log("resultado ", result);
            if (!result.data) {
                generarAlerta(result.msg);
            } else {
                cambiarAListaEmpleados(result.data.token);
            }
        })
        .catch(error => console.log('error', error));
}