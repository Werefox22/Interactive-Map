async function main() {
	// First thing to do is get the user's location
	// Center the map on those coords, and drop a marker there as well
	// make a function to get the user's location
	async function getCoords(){
		pos = await new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject)
		})
		return [pos.coords.latitude, pos.coords.longitude]
	}
	 
	var coords = await getCoords()
	if (!Array.isArray(coords)) {
		console.log("Returned coords is not an array.")
		return
	}

	// build the map
	const map = L.map('map', {
		center: coords,
		zoom: 12
	});

	// get the tiles for the map
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15'
	}).addTo(map)

	// drop a marker at the user's location
	L.marker(coords).addTo(map).bindPopup('<b>You Are Here</b>').openPopup()

	// get places from foursquare
	
	// function for getting locations
	async function getLocations(business) {
		// Foursquare api key:
		// fsq3RuX5dWsMDJPYUuy1jY4NAulEn2hp0c30hZqXr6vXBvc=	
		// katie's api key:
		// fsq3uktwF88fZ6Eq3ihzNKPU1ru0c9PhrTPwIBQktkkyGXg=

		const options = {
			method: 'GET',
			headers: {
			  Accept: 'application/json',
			  Authorization: 'fsq3uktwF88fZ6Eq3ihzNKPU1ru0c9PhrTPwIBQktkkyGXg='
			}
		};
		
		let long = coords[0]
		let lat = coords[1]

		let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?query=${business}&ll=${long}%2C${lat}&limit=5`, options)
		let result = await response.text()
		let parsedResults = JSON.parse(result)
		let locations = parsedResults.results
	
		let markers = []
		for (let i = 0; i < locations.length; i++) {
			// console.log(locations[i])
			let pos = [ locations[i].geocodes.main.latitude, locations[i].geocodes.main.longitude ]
			let marker = L.marker(pos).bindPopup(`<p><b>${locations[i].name}</b></p><p>${locations[i].location.formatted_address}</p>`)
			markers.push(marker)
		}

		return markers
	}

	// drop markers at different locations
	let coffee = L.layerGroup(await getLocations('coffee'))
	let restaurants = L.layerGroup(await getLocations('restaurants'))
	let hotel = L.layerGroup(await getLocations('hotel'))
	let market = L.layerGroup(await getLocations('market'))
	// group markers

	// add overlay selection
	const overlayMaps = {
		"Coffee": coffee,
		"Restaurants": restaurants,
		"Hotel": hotel,
		"Market": market
	}
	
	L.control.layers(null, overlayMaps).addTo(map)
}