/* Para login/logout y dispara evento "userChanged" para que otras partes del sitio se actualicen.
 */

const CURRENT_USER_KEY = "currentUser";

function getCurrentUser() {
  // fallback a nombreUsuario (existente en tu contacto) por compatibilidad
  return localStorage.getItem(CURRENT_USER_KEY) || null;
}
function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, user);
    // Si existía una key legacy "favoritas", migrarla al usuario actual (solo la primera vez)
    const legacy = JSON.parse(localStorage.getItem("favoritas") || "[]");
    if (legacy.length > 0) {
      const destKey = `favoritas_${user}`;
      const existing = JSON.parse(localStorage.getItem(destKey) || "[]");
      const merged = Array.from(new Set([...existing, ...legacy.map(String)]));
      localStorage.setItem(destKey, JSON.stringify(merged));
      // opcional: eliminar legacy global
      localStorage.removeItem("favoritas");
    }
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  // Avisamos al resto de la app que cambió el usuario
  window.dispatchEvent(new Event("userChanged"));
}

function promptLogin() {
  // Si SweetAlert está disponible lo usamos, si no, usamos prompt()
  if (window.Swal) {
    return Swal.fire({
      title: "Iniciar sesión",
      input: "text",
      inputLabel:
        "Elegí un nombre de usuario (no es seguro, se guarda en localStorage)",
      inputPlaceholder: "Tu nombre",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || value.trim().length < 2)
          return "Ingresá al menos 2 caracteres";
        return null;
      },
    }).then((res) => {
      if (res.isConfirmed) {
        const user = res.value.trim();
        setCurrentUser(user);
        updateUserUI();
        Swal.fire("Listo", `Ingresaste como ${user}`, "success");
      }
    });
  } else {
    const u = prompt("Ingresá tu nombre de usuario (2+ caracteres)");
    if (u && u.trim().length >= 2) {
      setCurrentUser(u.trim());
      updateUserUI();
      alert(`Ingresaste como ${u.trim()}`);
    }
  }
}

function logoutUser() {
  setCurrentUser(null);
  updateUserUI();
  if (window.Swal) Swal.fire("Cerraste sesión", "", "success");
  else alert("Cerraste sesión");
}

function updateUserUI() {
  const display = document.getElementById("userDisplay");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const user = getCurrentUser();
  if (user) {
    if (display) {
      display.textContent = `Usuario: ${user}`;
      display.style.display = "inline"; //se ve cuando hay usuario
    }
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    if (display) {
      display.textContent = "";
      display.style.display = "none"; //ocultar cuando no hay usuario
    }

    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

// Hacemos accesibles algunas funciones globalmente (para que cards.js las use)
window.getCurrentUser = getCurrentUser;
window.promptLogin = promptLogin;
window.setCurrentUser = setCurrentUser;
window.logoutUser = logoutUser;
window.updateUserUI = updateUserUI;

document.addEventListener("DOMContentLoaded", () => {
  // Atamos botones si existen en el DOM
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  if (loginBtn) loginBtn.addEventListener("click", promptLogin);
  if (logoutBtn)
    logoutBtn.addEventListener("click", () => {
      if (window.Swal) {
        Swal.fire({
          title: "¿Cerrar sesión?",
          showCancelButton: true,
          confirmButtonText: "Sí, cerrar",
        }).then((res) => {
          if (res.isConfirmed) logoutUser();
        });
      } else {
        if (confirm("Cerrar sesión?")) logoutUser();
      }
    });

  updateUserUI();
});
