//Instrucciones para identificar al usuario
let UserName = localStorage.getItem("nombreUsuario");
if (!UserName) {
  UserName = prompt("Hola, ¿me dirías tu nombre?");
  localStorage.setItem("nombreUsuario", UserName);
}
// Paso el nombre del usuario al HTML para presentar el mensaje de bienvenida
document.getElementById("UsuarioIdentificado").textContent = UserName;

//Que el DOM este cargado
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formularioContacto");

  //Arrow para validar el formulario
  const validarFormulario = (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (nombre === "") {
      alert("Por favor, ingresá tu nombre");
      return;
    }

    if (!validarEmail(email)) {
      alert("Por favor, ingresá un email válido");
      return;
    }
    if (telefono === "") {
      alert("Por favor, ingresá un número de teléfono.");
      return;
    }
    if (mensaje.length < 10) {
      alert("El mensaje debe tener al menos 10 caracteres.");
      return;
    }

    //Si valida todo, mostrar msj
    alert(
      `Gracias por enviarnos tu consulta, ${nombre}. Te responderemos a la brevedad.`
    );
    formulario.reset();
  };

  const validarEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  formulario.addEventListener("submit", validarFormulario);
});
