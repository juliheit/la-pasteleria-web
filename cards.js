const contenedor = document.getElementById("cards-container");

const API_URL =
  "https://687ed010efe65e520087a783.mockapi.io/recetasApi/recetas";

// Ruta de íconos
const iconoFavoritoVacio = "assets/img/favourite.svg";
const iconoFavoritoLleno = "assets/img/favourite-filled.svg";

// Obtener favoritos desde localStorage
const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
let favoritas = currentUser
  ? JSON.parse(localStorage.getItem(`favoritas_${currentUser}`) || "[]")
  : [];

fetch(API_URL)
  .then((respuesta) => {
    if (!respuesta.ok) {
      throw new Error("Error en la respuesta de la API");
    }
    return respuesta.json();
  })
  .then((data) => {
    data.forEach((item) => {
      const tarjeta = document.createElement("a");
      tarjeta.href = `receta${item.id}.html`;
      tarjeta.classList.add("card", "text-decoration-none", "text-reset");
      tarjeta.style.position = "relative";

      // Crear botón de favorito
      const botonFav = document.createElement("button");
      botonFav.classList.add("btn-fav");
      botonFav.style.position = "absolute";
      botonFav.style.top = "7px";
      botonFav.style.right = "7px";
      botonFav.style.background = "rgba(255, 255, 255, 0.3)";
      botonFav.style.border = "none";
      botonFav.style.padding = "5px";
      botonFav.style.borderRadius = "5px";
      botonFav.style.cursor = "pointer";
      botonFav.style.boxShadow = "0 0 4px rgba(0,0,0,0.2)";
      botonFav.style.zIndex = "10";
      botonFav.style.width = "30px";
      botonFav.style.height = "30px";
      botonFav.style.display = "flex";
      botonFav.style.alignItems = "center";
      botonFav.style.justifyContent = "center";

      // Crear imagen del ícono
      const icono = document.createElement("img");
      icono.src = favoritas.includes(item.id)
        ? iconoFavoritoLleno
        : iconoFavoritoVacio;
      icono.alt = "Favorito";
      icono.style.width = "20px";
      icono.style.height = "20px";

      // Evento de clic en el botón
      botonFav.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const index = favoritas.indexOf(item.id);
        if (index === -1) {
          favoritas.push(item.id);
          icono.src = iconoFavoritoLleno;
        } else {
          favoritas.splice(index, 1);
          icono.src = iconoFavoritoVacio;
        }

        if (currentUser) {
          localStorage.setItem(
            `favoritas_${currentUser}`,
            JSON.stringify(favoritas)
          );
        }
      });

      botonFav.appendChild(icono);

      // Contenido de la card
      tarjeta.innerHTML += `
        <img src="${item.img}" class="card-img-top" alt="${item.titulo}">
        <div class="card-body">
          <h5>${item.titulo}</h5>
          <p class="card-text">${item.descripcion}</p>
        </div>
      `;

      tarjeta.appendChild(botonFav);
      contenedor.appendChild(tarjeta);
    });
  })
  .catch((error) => {
    console.error("Hubo un error al obtener los datos:", error);
    contenedor.innerHTML = "<p>Error al cargar los productos.</p>";
  });
