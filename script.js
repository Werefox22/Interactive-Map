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
	console.log(coords)

	// build the map
	const map = L.map('map', {
		center: coords,
		zoom: 12,
	});

	// get the tiles for the map
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15'
	}).addTo(map)

	// get places from foursquare

	// drop a marker at the user's location
	const usersLocation = L.marker(coords).addTo(map).bindPopup('You are Here').openPopup()

	// drop markers at different locations

	// group markers

	// add overlay selection

}