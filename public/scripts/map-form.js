/* Leaflet: Create Map (on map-form.ejs) */
const createMap = L.map("leaflet-map").setView([49.280571, -123.11378], 15);
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbGl0dGxlYmxhY2tzbWl0aCIsImEiOiJjazZlMnExanYwaXU0M2tsb2I5cDRzcTQwIn0.bwS19as5AZCy7I-y3w-Tkw",
  {
    maxZoom: 19,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11"
  }
).addTo(createMap);

const tempPointsArray = [];

/* Create Map Form Submit */
$("#createMapForm").submit(function(e) {
  e.preventDefault();
  if (!createMap) {
    return false;
  } else {
    const query = $(this).serialize();
    const center = createMap.getCenter();
    const formValues = { ...center };
    console.log("formValues to be sent", formValues, query);
    return formValues;
  }
});

const renderPopupDetails = function(details) {
  // param: details is an object { img, name, detail }
  const $placeImg = $("<img>").attr({ src: "https://picsum.photos/300/150" });
  const $placeName = $("<p>").text("[Cool Place Name]");
  const $placeDescription = $("<p>").text("[Cool Place Description]");
  const $place = $("<div>");

  $place.append($placeImg, $placeName, $placeDescription);
  return $place.prop("outerHTML");
};

const renderPopupForm = function() {
  return `
      <form id="addPlace">
        <div class="form-group">
          <label for="place-name" class="form-label">Name</label>
          <input type="text" class="form-input" id="place-name" name="place-name" />
        </div>
        <div class="form-group">
          <label for="place-img" class="form-label">Image URL</label>
          <input type="text" class="form-input" id="place-img" name="place-img" />
        </div>
        <div class="form-group">
          <label for="place-desc" class="form-label">Description</label>
          <textarea class="form-input" name="place-desc" id="place-desc" placeholder="Textarea" rows="3"></textarea>
        </div>
      <button type="submit" class="btn btn-primary">Add</button>
      </form>
      `;
};

/* Create Point Submit Function */
const addPointOnMap = function({ query, lat, lng }) {
  tempPointsArray.push({ lat, lng, query });
  console.log("hellooooooo", tempPointsArray);
  // todo: write a POST request
  // add the marker
  const marker = L.marker([lat, lng]).addTo(createMap);
  // bind the popup to the marker
  marker.bindPopup(renderPopupDetails).openPopup();
  // close the popup form
  createMap.closePopup();
};

const onMapClick = function(e) {
  const { lat, lng } = e.latlng;

  const popup = L.popup({
    minWidth: 250,
    keepInView: true
  });
  // on click open this popup
  popup
    .setLatLng(e.latlng)
    // put a form in here to submit stuff
    .setContent(renderPopupForm)
    .openOn(createMap);

  // submit handler for the form
  if ($("#addPlace")) {
    console.log("popup is alive!");
    $("#addPlace").submit(function(event) {
      event.preventDefault();
      const query = $(this).serialize();
      addPointOnMap({ query, lat, lng });
    });
  }
};

createMap.on("click touchstart", onMapClick);