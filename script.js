const DEFAULT_COORD_1 = -1.8168321;
const DEFAULT_COORD_2 = 109.9860561;
const sugestionWrapperHtml = document.getElementById("search-result");

// initial map
const Map = L.map("map");

// initial osm tile
const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const attribute =
  "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";

const osmTile = new L.TileLayer(osmUrl, {
  minZoom: 2,
  maxZoom: 20,
  attribution: attribute,
});

// add layer
Map.setView(new L.latLng(DEFAULT_COORD_1, DEFAULT_COORD_2), 13);
Map.addLayer(osmTile);

// add marker
const marker = L.marker([DEFAULT_COORD_1, DEFAULT_COORD_2]).addTo(Map);

// click listerner
Map.on("click", (e) => {
  const { lat, lng } = e.latlng;
  // regenerate marker position
  marker.setLatLng([lat, lng]);
});

// seacrch location handler
let typingInterval;

// typing handler
function onTyping(e) {
  clearInterval(typingInterval);
  const { value } = e;

  typingInterval = setInterval(() => {
    clearInterval(typingInterval);
    searchLocation(value);
  }, 500);
}

// search handler
async function searchLocation(keyword) {
  //   console.log("search location", keyword);
  if (keyword.length > 0) {
    // request to api
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${keyword}&format=json`
    );
    const jsonData = await response.json();
    if (jsonData.length > 0) {
      renderSugestion(jsonData);
    } else {
      alert("lokasi tidak ada di bumi");
    }
  }
}

// render sugestion
function renderSugestion(data) {
  let sugestionHtml = "";
  data.map((item) => {
    sugestionHtml += `<li><a href="#" onclick="setLocation(${item.lat} , ${item.lon})">${item.display_name}</a></li>`;
  });
  sugestionWrapperHtml.innerHTML = sugestionHtml;
}

// clear result
function clearResult() {
  sugestionWrapperHtml.innerHTML = "";
}

// set location form search
function setLocation(lat, lon) {
  // set map focus
  Map.setView(new L.latLng(lat, lon), 13);
  // regenerate marker position
  marker.setLatLng([lat, lon]);

  clearResult()
}
