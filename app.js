let currentPokemon = null;

function searchPokemon() {
  const nombre = document.getElementById("pokemonInput").value.toLowerCase().trim();
  if (!nombre) return alert("Escribe un nombre");

  fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
    .then(response => {
      if (!response.ok) throw new Error("No encontrado");
      return response.json();
    })
    .then(data => {
      currentPokemon = {
        name: data.name,
        image: data.sprites.front_default
      };

      mostrarPokemon(currentPokemon);
      document.getElementById("guardarBtn").disabled = false;
    })
    .catch(error => {
      alert("¡Error! Pokémon no encontrado");
      currentPokemon = null;
      document.getElementById("resultado").innerHTML = "";
      document.getElementById("guardarBtn").disabled = true;
    });
}


function mostrarPokemon(pokemon) {
  document.getElementById("resultado").innerHTML = `
    <h3>${pokemon.name}</h3>
    <img src="${pokemon.image}" alt="${pokemon.name}">
  `;
}


function saveFavorite() {
  if (!currentPokemon) return;

  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  const yaExiste = favoritos.some(poke => poke.name === currentPokemon.name);
  if (!yaExiste) {
    favoritos.push(currentPokemon);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    updateFavoritesList();
  }
}

function deleteFavorite(index) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos.splice(index, 1);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  updateFavoritesList();
}

function updateFavoritesList() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const contenedor = document.getElementById("favoritos");
  contenedor.innerHTML = "";

  favoritos.forEach((pokemon, index) => {
    const div = document.createElement("div");
    div.classList.add("favorito");
    div.innerHTML = `
      <h4>${pokemon.name}</h4>
      <img src="${pokemon.image}" alt="${pokemon.name}">
      <button onclick="deleteFavorite(${index})">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
}


document.addEventListener("DOMContentLoaded", updateFavoritesList);
