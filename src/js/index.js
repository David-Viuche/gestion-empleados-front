//event listeners
document.getElementById('icon-cerrar').addEventListener('click', () => {
    document.getElementById('alerta').classList.toggle('visible');
});

document.getElementById('form-inicio-sesion').addEventListener('submit', (event) => {
    event.preventDefault();
    iniciarSesion();
});

document.getElementById('form-registro').addEventListener('submit', (event) => {
    event.preventDefault();
    registrarUsuario();
});

document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
    peticionCerrarSesion();
});

//funciones

function generarAlerta(texto) {
    const alert = document.getElementById('alerta');
    alert.classList.toggle('visible');
    const mensaje = document.getElementById('texto-alerta');
    mensaje.innerText = texto;
}

function cambiarAListaEmpleados(token) {
    sessionStorage.setItem('token', token);
    document.getElementById("seccion-iniciar-sesion").classList.toggle('invisible');
    document.getElementById("seccion-lista-empleados").classList.toggle('visible');
    document.getElementById("cerrar-sesion").classList.toggle('invisible');
    peticionDatosUsuario();
}

function mostrarFormularioRegistro() {
    document.getElementById('form-registro').classList.toggle('visible');
}

function verificarSesionIniciada() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        document.getElementById("seccion-iniciar-sesion").classList.toggle('invisible');
        document.getElementById("seccion-lista-empleados").classList.toggle('visible');
        document.getElementById("cerrar-sesion").classList.toggle('invisible');
        document.getElementById("nombreUsuario").innerText = user.nombre + " " + user.apellido;
    }
}

//verificacion incial 
verificarSesionIniciada();

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

const peticionDatosUsuario = () => {
    var myHeaders = new Headers();
    const token = sessionStorage.getItem('token');
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://gestion-empleados.herokuapp.com/usuarios", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (!result.error) {
                sessionStorage.setItem('user', JSON.stringify(result));
                const user = JSON.parse(sessionStorage.getItem('user'));
                document.getElementById("nombreUsuario").innerText = user.nombre + " " + user.apellido;
            } else {
                sessionStorage.clear();
                window.location.reload();
            }
        })
        .catch(error => console.log('error', error));
}

const peticionCerrarSesion = () => {
    var myHeaders = new Headers();
    const token = sessionStorage.getItem('token');
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://gestion-empleados.herokuapp.com/usuarios/logout", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (!result.error) {
                sessionStorage.clear();
                window.location.reload();
            } else {
                sessionStorage.clear();
                window.location.reload();
            }
        })
        .catch(error => console.log('error', error));
}

const registrarUsuario = () => {
    const nombre = document.getElementById('nombre-registrarse').value;
    const apellido = document.getElementById('apellido-registrarse').value;
    const correo = document.getElementById('correo-registrarse').value;
    const contraseña = document.getElementById('contraseña-registrarse').value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "nombre": nombre,
        "apellido": apellido,
        "correo": correo,
        "contraseña": contraseña
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://gestion-empleados.herokuapp.com/usuarios", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (!result.error) {
                generarAlerta('Usuario Creado Correctamente');
                document.getElementById('form-registro').classList.toggle('visible');
            }
        })
        .catch(error => console.log('error', error));
}