//elemento general
const cargando = document.getElementById('cargando');

//event listeners
document.getElementById('icon-cerrar').addEventListener('click', () => {
    document.getElementById('alerta').classList.toggle('visible');
});

document.getElementById('icon-cerrar-nuevo').addEventListener('click', () => {
    document.getElementById('nuevo-empleado').classList.toggle('visible');
});

document.getElementById('icon-cerrar-actualizar').addEventListener('click', () => {
    document.getElementById('actualizar-empleado').classList.toggle('visible');
});

document.getElementById('form-inicio-sesion').addEventListener('submit', (event) => {
    event.preventDefault();
    iniciarSesion();
});

document.getElementById('form-nuevo-empleado').addEventListener('submit', (event) => {
    event.preventDefault();
    peticionEmpleadoNuevo();
});

document.getElementById('form-actualizar-empleado').addEventListener('submit', (event) => {
    event.preventDefault();
    peticionActualizarEmpleado();
});

document.getElementById('form-registro').addEventListener('submit', (event) => {
    event.preventDefault();
    registrarUsuario();
});

document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
    peticionCerrarSesion();
});

document.getElementById('btn-nuevo-empleado').addEventListener('click', () => {
    document.getElementById('nuevo-empleado').classList.toggle('visible');
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
    peticionEmpleados();
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
        peticionEmpleados();
    }
}

function mostrarFormuarioActualizarEmpleado(idEmpleado) {
    document.getElementById('actualizar-empleado').classList.toggle('visible');
    document.getElementById('empleadoActualizar').innerText = idEmpleado;
    peticionDatosEmpleadoIdActualizar(idEmpleado);
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

    cargando.classList.toggle('visible');

    fetch("https://gestion-empleados.herokuapp.com/usuarios/login", requestOptions)
        .then(response => response.json())
        .then(result => {
            cargando.classList.toggle('visible')
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

    cargando.classList.toggle('visible');

    fetch("https://gestion-empleados.herokuapp.com/usuarios", requestOptions)
        .then(response => response.json())
        .then(result => {
            cargando.classList.toggle('visible');
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

    cargando.classList.toggle('visible');

    fetch("https://gestion-empleados.herokuapp.com/usuarios/logout", requestOptions)
        .then(response => response.json())
        .then(result => {
            cargando.classList.toggle('visible');
            sessionStorage.clear();
            window.location.reload();
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

    cargando.classList.toggle('visible');

    fetch("https://gestion-empleados.herokuapp.com/usuarios", requestOptions)
        .then(response => response.json())
        .then(result => {
            cargando.classList.toggle('visible');
            if (!result.error) {
                generarAlerta('Usuario Creado Correctamente');
                document.getElementById('form-registro').classList.toggle('visible');
            } else {
                sessionStorage.clear();
                window.location.reload();
            }
        })
        .catch(error => console.log('error', error));
}

const peticionEmpleados = () => {
    var myHeaders = new Headers();
    const token = sessionStorage.getItem('token');
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    cargando.classList.toggle('visible');

    fetch("https://gestion-empleados.herokuapp.com/empleados", requestOptions)
        .then(response => response.json())
        .then(result => {
            cargando.classList.toggle('visible');
            if (!result.error) {
                const contenedor = document.getElementById('tabla-empleados');
                let registro = '';
                result.sort(function (a, b) {
                    if (a.id > b.id) {
                        return 1;
                    }
                    if (a.id < b.id) {
                        return -1;
                    }
                    return 0;
                });
                result.forEach(el => {
                    registro += `
                <tr>
                    <td>${el.nombre}</td>
                    <td>${el.apellido}</td>
                    <td>${el.tipoIdentificacion}</td>
                    <td>${el.numeroIdentificacion}</td>
                    <td>${(el.correo) ? el.correo : 'Sin Correo'}</td>
                    <td>${(el.fechaIngreso) ? new Date(el.fechaIngreso).toISOString().slice(0, 10) : 'Sin Fecha'}</td>
                    <td>$ ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(el.salario)}</td>
                    <td>`;

                    for (let index = 0; index < el.telefonos.length; index++) {
                        const tel = el.telefonos[index];
                        if (tel.telefono == null) {
                            registro += 'Sin telefonos'
                        } else {
                            registro += `${tel.telefono}`
                            if (index != (el.telefonos.length - 1)) {
                                registro += '<br>';
                            }
                        }
                    }

                    registro +=
                        `
                    </td>
                    <td>
                        <input type="button" value="Editar" class="btn" onClick=mostrarFormuarioActualizarEmpleado(${el.id})>
                        <br>
                        <input type="button" value="Eliminar" class="btn" onClick=peticionEliminarEmpleado(${el.id})>
                    </td>
                </tr>
                
                `
                    contenedor.innerHTML = registro;
                });
            } else {
                peticionCerrarSesion();
            }
        })
        .catch(error => console.log('error', error));
}

const peticionEmpleadoNuevo = () => {
    var myHeaders = new Headers();
    const token = sessionStorage.getItem('token');
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const nombre = document.getElementById('nombre-nuevo-empleado').value;
    const apellido = document.getElementById('apellido-nuevo-empleado').value;
    const tipoId = document.getElementById('tipoid-nuevo-empleado').value;
    const identificacion = document.getElementById('identificacion-nuevo-empleado').value;
    const correo = document.getElementById('correo-nuevo-empleado').value;
    let fecha = document.getElementById('fecha-ingreso-nuevo-empleado').value;
    const salario = document.getElementById('salario-nuevo-empleado').value;
    const telefono1 = document.getElementById('telefono1-nuevo-empleado').value;
    const telefono2 = document.getElementById('telefono2-nuevo-empleado').value;
    const telefono3 = document.getElementById('telefono3-nuevo-empleado').value;

    let telefonos = null;

    if (telefono1 || telefono2 || telefono3) {
        telefonos = [];
        if (telefono1) {
            telefonos.push(
                {
                    "telefono": telefono1
                }
            )
        }
        if (telefono2) {
            telefonos.push(
                {
                    "telefono": telefono2
                }
            )
        }
        if (telefono3) {
            telefonos.push(
                {
                    "telefono": telefono3
                }
            )
        }
    }

    if (!fecha) {
        fecha = null;
    }

    var raw = JSON.stringify(
        {
            "nombre": nombre,
            "apellido": apellido,
            "tipoIdentificacion": tipoId,
            "numeroIdentificacion": identificacion,
            "correo": correo,
            "fechaIngreso": fecha,
            "salario": salario,
            "telefonos": telefonos
        }
    );

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    cargando.classList.toggle('visible');

    fetch("https://gestion-empleados.herokuapp.com/empleados", requestOptions)
        .then(response => response.json())
        .then(result => {
            cargando.classList.toggle('visible');
            if (!result.error) {
                window.location.reload();
            } else {
                sessionStorage.clear();
                window.location.reload();
            }
        })
        .catch(error => console.log('error', error));
}


const peticionDatosEmpleadoIdActualizar = (idEmpleado) => {
    var myHeaders = new Headers();
    const token = sessionStorage.getItem('token');
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    cargando.classList.toggle('visible');

    fetch(`https://gestion-empleados.herokuapp.com/empleados/${idEmpleado}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            cargando.classList.toggle('visible');
            if (!result.error) {
                document.getElementById('nombre-actualizar-empleado').value = result.nombre;
                document.getElementById('apellido-actualizar-empleado').value = result.apellido;
                document.getElementById('tipoid-actualizar-empleado').value = result.tipoIdentificacion;
                document.getElementById('identificacion-actualizar-empleado').value = result.numeroIdentificacion;
                if (result.correo) {
                    document.getElementById('correo-actualizar-empleado').value = result.correo;
                }
                if (result.fechaIngreso) {
                    document.getElementById('fecha-ingreso-actualizar-empleado').value = new Date(result.fechaIngreso).toISOString().slice(0, 10);
                }
                document.getElementById('salario-actualizar-empleado').value = result.salario;
                if (result.telefonos) {
                    if (result.telefonos[0]) {
                        document.getElementById('telefono1-actualizar-empleado').value = result.telefonos[0].telefono;
                    }
                    if (result.telefonos[1]) {
                        document.getElementById('telefono2-actualizar-empleado').value = result.telefonos[1].telefono;
                    }
                    if (result.telefonos[2]) {
                        document.getElementById('telefono3-actualizar-empleado').value = result.telefonos[2].telefono;
                    }
                }
            } else {
                sessionStorage.clear();
                window.location.reload();
            }
        })
        .catch(error => console.log('error', error));
}

const peticionActualizarEmpleado = () => {
    var myHeaders = new Headers();
    const token = sessionStorage.getItem('token');
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const nombre = document.getElementById('nombre-actualizar-empleado').value;
    const apellido = document.getElementById('apellido-actualizar-empleado').value;
    const tipoId = document.getElementById('tipoid-actualizar-empleado').value;
    const identificacion = document.getElementById('identificacion-actualizar-empleado').value;
    const correo = document.getElementById('correo-actualizar-empleado').value;
    let fecha = document.getElementById('fecha-ingreso-actualizar-empleado').value;
    const salario = document.getElementById('salario-actualizar-empleado').value;
    const telefono1 = document.getElementById('telefono1-actualizar-empleado').value;
    const telefono2 = document.getElementById('telefono2-actualizar-empleado').value;
    const telefono3 = document.getElementById('telefono3-actualizar-empleado').value;
    const idEmpleado = document.getElementById('empleadoActualizar').innerText;

    let telefonos = null;

    if (telefono1 || telefono2 || telefono3) {
        telefonos = [];
        if (telefono1) {
            telefonos.push(
                {
                    "telefono": telefono1
                }
            )
        }
        if (telefono2) {
            telefonos.push(
                {
                    "telefono": telefono2
                }
            )
        }
        if (telefono3) {
            telefonos.push(
                {
                    "telefono": telefono3
                }
            )
        }
    }

    if (!fecha) {
        fecha = null;
    }

    var raw = JSON.stringify(
        {
            "nombre": nombre,
            "apellido": apellido,
            "tipoIdentificacion": tipoId,
            "numeroIdentificacion": identificacion,
            "correo": correo,
            "fechaIngreso": fecha,
            "salario": salario,
            "telefonos": telefonos
        }
    );

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    cargando.classList.toggle('visible');

    fetch(`https://gestion-empleados.herokuapp.com/empleados/${idEmpleado}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            cargando.classList.toggle('visible');
            if (!result.error) {
                window.location.reload();
            } else {
                sessionStorage.clear();
                window.location.reload();
            }
        })
        .catch(error => console.log('error', error));
}

const peticionEliminarEmpleado = (idEmpleado) => {
    var myHeaders = new Headers();
    const token = sessionStorage.getItem('token');
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    cargando.classList.toggle('visible');

    fetch(`https://gestion-empleados.herokuapp.com/empleados/${idEmpleado}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            cargando.classList.toggle('visible');
            if (!result.error) {
                window.location.reload();
            } else {
                sessionStorage.clear();
                window.location.reload();
            }
        })
        .catch(error => console.log('error', error));
}

//verificacion incial 
verificarSesionIniciada();