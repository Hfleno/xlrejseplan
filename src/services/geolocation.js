export async function getLocation() {
  console.log('getGeolocation')
  if (navigator.geolocation) {
    await navigator.geolocation.getCurrentPosition(
      position => {
        console.log(position.coords)
        //console.log(JSON.stringify(position.coords.coordinates))
        return position.coords
      },
      error => {
        // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        return error
      }
    )
  }
}

function showPosition(position) {
  x.innerHTML = 'Latitude: ' + position.coords.latitude + '<br>Longitude: ' + position.coords.longitude
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = 'Adgang nægtet. Prøv at finde din browser i instillingerne og slå lokalitet til'
      break
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = 'Information om Lokation er ikke tilgængelig.'
      break
    case error.TIMEOUT:
      x.innerHTML = 'The request to get user location timed out.'
      break
    case error.UNKNOWN_ERROR:
      x.innerHTML = 'An unknown error occurred.'
      break
  }
}
