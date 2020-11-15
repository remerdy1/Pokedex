// List element
const pokedex = document.getElementById("pokedex");
// Search bar
const searchBar = document.getElementById("searchBar");

// Modal elements
const modal = document.getElementById("modal-bg");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalName = document.getElementById("modal-name");
const modalId = document.getElementById("modal-id");
const modalType = document.getElementById("modal-type");
const modalStats = document.getElementById("modal-stats");
const modalMoves = document.getElementById("modal-moves");
const modalImg = document.getElementById("modal-img");

// PokeAPI link
const url = "https://pokeapi.co/api/v2/pokemon/"

const colours = {
    bug: "#A8B820",
    dragon: "#7038F8",
    electric: "#F8D030",
    fighting: "#C03028",
    fire: "#F08030",
    flying: "#A890F0",
    ghost: "#705898",
    grass: "#78C850",
    ground: "#E0C068",
    ice: "#98D8D8",
    normal: "#A8A878",
    poison: "#A040A0",
    psychic: "#F85888",
    rock: "#B8A038",
    water: "#6890F0",
}

class Pokemon {
    constructor(id, name, sprites, types) {
        this.id = id;
        this.name = name;
        this.sprites = sprites;
        this.types = types;
    }
}

// Capitalizes first letter of a string
const capitalizeFirst = string => string[0].toUpperCase() + string.slice(1, string.length);


// Shows the modal when the card is clicked
const showModal = e => {
    if (e.target.classList.contains("card")) {
        const card = e.target;
        createModal(card);
    } else if (e.target.classList.contains("type")) {
        const card = e.target.parentNode.parentNode;
        createModal(card);

    } else {
        const card = e.target.parentNode;
        createModal(card);
    }
}

// Adds the information to the modal
const createModal = async card => {
    // Empty Move and Stats lists
    modalStats.textContent = "";
    modalMoves.textContent = "";

    const name = card.querySelector("#name").textContent;
    const id = card.querySelector("#id").textContent;
    const type = card.querySelector(".type").textContent;
    const img = card.querySelector("#img").src;

    // Add Name, ID & Type to card
    modalName.textContent = name;
    modalId.textContent = id;
    modalType.textContent = type;
    modalImg.src = img;

    // Get stats & moves from API
    const response = await fetch(`${url}${name.toLowerCase()}`);
    const data = await response.json();
    const stats = data.stats;
    const moves = data.moves;

    // Add stats to card
    stats.forEach(stat => {
        const listItem = document.createElement("li");
        listItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        modalStats.appendChild(listItem);
    })

    // Add moves to card
    for (let i = 0; i < 4; i++) {
        const listItem = document.createElement("li");
        listItem.textContent = moves[i].move.name;
        modalMoves.appendChild(listItem);
    }
    modal.style.display = "block";
}

const closeModal = () => modal.style.display = "none";

// Get each pokemon
const getPokemon = async () => {

    for (let i = 1; i <= 151; i++) {
        const response = await fetch(`${url}${i}`);
        const data = await response.json();

        const pokemon = new Pokemon(data.id, data.name, data.sprites, data.types);

        // Create a new card
        const newCard = document.createElement("section");
        newCard.classList.add("card");

        // Create name 
        const newName = document.createElement("h3");
        newName.textContent = capitalizeFirst(pokemon.name);
        newName.id = "name";

        // Create ID
        const newId = document.createElement("h4");
        newId.textContent = `#${pokemon.id}`;
        newId.id = "id";

        // Create <img>
        const newImg = document.createElement("img");
        newImg.src = pokemon.sprites.other.dream_world.front_default;
        newImg.id = "img";

        // Create list of types
        const newTypes = document.createElement("ul");
        // For each type add a new <li>
        pokemon.types.forEach(element => {
            const newLi = document.createElement("li");
            newLi.textContent = capitalizeFirst(element.type.name);
            newLi.classList.add("type");
            newTypes.appendChild(newLi);
        });

        // Add card to pokedex
        newCard.style.backgroundColor = colours[pokemon.types[0].type.name];
        newCard.append(newName, newImg, newTypes, newId);
        newCard.addEventListener("click", showModal); // Show modal when clicked
        pokedex.appendChild(newCard);
    }
}

// Search by name, type or ID
const search = e => {
    // User input
    const input = e.target.value.toLowerCase();
    // Collection of cards
    const cards = pokedex.childNodes;

    // Compare input to the name, id and type of each card
    cards.forEach(card => {
        const name = card.querySelector("#name").textContent.toLowerCase(); // Returns name for each card
        const id = card.querySelector("#id").textContent.toLowerCase(); // Returns id for each card
        const types = card.querySelectorAll(".type"); // Returns list of types for each card
        let matchCount = 0; // Keep track if any of the attributes match user input

        types.forEach(type => {
            if (name.includes(input) || id.includes(input) || type.innerText.toLowerCase().includes(input)) {
                matchCount++;
            }
            if (matchCount > 0) {
                card.style.display = "inline-block";
            } else {
                card.style.display = "none";
            }
        })

    })
}

getPokemon();
searchBar.addEventListener("input", search);
modalCloseBtn.addEventListener("click", closeModal);