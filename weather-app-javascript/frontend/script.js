import KEYS from "/./api-key.js";


const card = document.getElementById("card");

const divElement = document.createElement("div");
divElement.id = "show_card";

const input = document.createElement("input");
input.type = "search";
input.id = "search";

const label = document.createElement("label");
label.for = "search";
label.id = "label";
label.textContent = "Choose a city ";

const promptContainer = document.createElement("div");

card.appendChild(label);
card.appendChild(input);
card.appendChild(promptContainer);

const favDiv = document.querySelector("#favourites");
const favListTag = document.createElement("ul");
favListTag.id = "fav-list";
favDiv.appendChild(favListTag);
const favList = document.querySelector("#fav-list");

// List of favourites
const favourites = [];


// Function displays weather data of a chosen city on a card.
function displayCityWeather(input) {
	const date = new Date(input.location.localtime);
	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	const formattedDate = date.toLocaleDateString("en-US", options);

	return `<div class="column-1">
		<div id="day">${formattedDate}</div>
		<div id="country">${input.location.name}, ${input.location.country}</div>
		<div id="temp">${input.current.temp_c}&#8451</div>
		</div>
		<div class="column-2">
		<img class="weather-icon" src="https:${input.current.condition.icon}" alt="Obraz">
		<div id="text-cloud">${input.current.condition.text}</div>
		</div>`;
}

// Function fetches data from weather api then displays data by calling displayCityWeather function
function fetchWeather(city) {
	fetch(
		`https://api.weatherapi.com/v1/current.json?key=${KEYS.APIkeyWeather}&q=${city}`
	)
		.then((response) => response.json())
		.then((data) => {
			divElement.innerHTML = displayCityWeather(data);
			document.getElementById("card").appendChild(divElement);
		})
		.catch((err) => console.error(`Error: ${err}`));
}

const options = {
	method: `GET`,
	headers: {
		Accept: `application/json`,
		Authorization: `${KEYS.APIkeyPexels}`,
	},
};

// Function fetches background image from Pexels Api and displays an image that is matched with chosen city name.
function imageFetch(city) {
	return fetch(`https://api.pexels.com/v1/search?query=${city}`, options)
		.then((response) => response.json())
		.then((data) => {
			if (data.photos.length === 0) {
				document.querySelector(
					"body"
				).style.backgroundImage = `url("https://w0.peakpx.com/wallpaper/456/121/HD-wallpaper-weather-rain-sun-overcast-cold-hot.jpg")`;
				document.querySelector("body").style.backgroundSize = "cover";
			} else {
				document.querySelector(
					"body"
				).style.backgroundImage = `url(${data.photos[0].src.large2x})`;
				document.querySelector("body").style.backgroundSize = "cover";
			}
		})
		.catch((err) => console.error(err));
}

// Function fetches data from weather Api. The awaited response consists of a city with towns in its nearest vicinity.
async function fetchNearestcities(input) {
	const response = await fetch(
		`http://api.weatherapi.com/v1/search.json?key=${KEYS.APIkeyWeather}&q=${input}`
	);
	return await response.json();
}

// Callback function for a "click" listener. Fetches the weather and images from APIs. Clears the previous search history.
function onPromptClick(cityName) {
	fetchWeather(cityName);
	imageFetch(cityName);
	input.value = ``;
	promptContainer.innerHTML = ``;
}

// Function adds a city to favourites list by clicking on a star element. If a city already exists in the list it removes it.
function addToFavourites(event, cityName) {
	event.stopPropagation();
	if (favourites.includes(cityName)) {
		favourites.splice(favourites.indexOf(cityName), 1);
		event.target.classList.remove("notFav");
		event.target.classList.add("isFav");
		event.target.src =
			"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwIDIwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cG9seWdvbiBmaWxsPSIjREREREREIiBwb2ludHM9IjEwLDAgMTMuMDksNi41ODMgMjAsNy42MzkgMTUsMTIuNzY0IDE2LjE4LDIwIDEwLDE2LjU4MyAzLjgyLDIwIDUsMTIuNzY0IDAsNy42MzkgNi45MSw2LjU4MyAiLz48L3N2Zz4=";
		displayFavourites();
	} else {
		favourites.push(cityName);
		event.target.classList.remove("notFav");
		event.target.classList.add("isFav");
		event.target.src =
			"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwIDIwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cG9seWdvbiBmaWxsPSIjRkZERjg4IiBwb2ludHM9IjEwLDAgMTMuMDksNi41ODMgMjAsNy42MzkgMTUsMTIuNzY0IDE2LjE4LDIwIDEwLDE2LjU4MyAzLjgyLDIwIDUsMTIuNzY0IDAsNy42MzkgNi45MSw2LjU4MyAiLz48L3N2Zz4=";
		displayFavourites();
	}

	// Event displays weather details for a selected city from favourites
	const allLi = document.querySelectorAll("li");
	allLi.forEach(li => li.addEventListener("click", () => onPromptClick(li.textContent)));
}

// Function displays cities that were added to favourites.
function displayFavourites() {
	favList.innerHTML = "";
	for (let favourite of favourites) {
		const favListElement = document.createElement("li");
		favListElement.id = favourite;
		favListElement.textContent = favourite;
		favList.appendChild(favListElement);
	}
}

//Function receives an img html element and set its display attributes.
function createStarElement(cityName, favElement) {
	if (document.querySelector(`#${cityName}`)) {
		favElement.classList.add("isFav");
		favElement.src =
			"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwIDIwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cG9seWdvbiBmaWxsPSIjRkZERjg4IiBwb2ludHM9IjEwLDAgMTMuMDksNi41ODMgMjAsNy42MzkgMTUsMTIuNzY0IDE2LjE4LDIwIDEwLDE2LjU4MyAzLjgyLDIwIDUsMTIuNzY0IDAsNy42MzkgNi45MSw2LjU4MyAiLz48L3N2Zz4=";
	} else {
		favElement.classList.add("notFav");
		favElement.src =
			"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDIwIDIwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cG9seWdvbiBmaWxsPSIjREREREREIiBwb2ludHM9IjEwLDAgMTMuMDksNi41ODMgMjAsNy42MzkgMTUsMTIuNzY0IDE2LjE4LDIwIDEwLDE2LjU4MyAzLjgyLDIwIDUsMTIuNzY0IDAsNy42MzkgNi45MSw2LjU4MyAiLz48L3N2Zz4=";
	}
	return favElement;
}

//Listens for any changes done to the input field. Secondary listener checks if a city was added to favourites by clicking a star img.
document.querySelector("#search").addEventListener("input", () => {
	fetchNearestcities(input.value)
		.then((data) => {
			if (input.length < 3) {
				return;
			}
			promptContainer.innerHTML = ``;
			data.forEach((city) => {
				const favElement = document.createElement("img");
				const promptElement = document.createElement("div");
				promptElement.classList.add("cityList");
				promptElement.textContent = city.name;
				promptContainer.appendChild(promptElement);
				createStarElement(city.name, favElement).addEventListener(
					"click",
					(event) => addToFavourites(event, city.name)
				);
				promptElement.appendChild(favElement);
				promptElement.addEventListener("click", () => {
					onPromptClick(city.name);
				});
			});
		})
		.catch((error) => console.error(`Error: ${error}`));
});
