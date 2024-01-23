// Conditional import/require for Node.js built-in modules
let path, os, crypto;

if (
  typeof process !== 'undefined' &&
  process.versions &&
  process.versions.node
) {
  // Node.js environment
  path = require('path');
  os = require('os');
  crypto = require('crypto');
} else {
  // Browser environment
  // Implement browser-compatible functionality or leave them undefined
}

// Importing dotenv

// Importing dotenv

// Importing dotenv

document.querySelector("[activity-data='image']").removeAttribute('srcset');
document.querySelector("[activity-data='liked']").removeAttribute('srcset');

function getDestinationIdFromActivityId(activityId, dataStore) {
  console.log(dataStore);
  // Loop through guide recommendations to find the matching activity
  for (const guide of dataStore.data._guide_of_trips) {
    for (const recommendation of guide._guide_recommendations) {
      const place = recommendation._place;
      if (place && place.id === activityId) {
        // Return the destination ID related to this activity
        return guide.id;
      }
    }
  }
  // If no matching destination is found, return null or some default value
  return null;
}

let closeFlag = false;

const isInitiallyLoaded = false; // This flag will be outside the scope

function updateActivityUI(activity) {
  // Check if 'activity' is what you expect it to be. You can remove this line after debugging.
  console.log('Activity: ', activity);

  // Query for the div with the correct 'activity-data-place-id'
  const favoriteElementDiv = document.querySelector(
    `[activity-data-place-id='${activity.id}']`
  );

  if (favoriteElementDiv) {
    // Query for the child img tag within this div
    const favoriteElementImg = favoriteElementDiv.querySelector('img');
    if (favoriteElementImg) {
      if (activity.isFavorited) {
        favoriteElementImg.src =
          'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/646356c55116c668dfccf4ae_heart-filled.svg';
      } else {
        favoriteElementImg.src =
          'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643568f2cf264582be96a5ce_heart.svg';
      }
    } else {
      console.log('Child img element not found');
    }
  } else {
    console.log('Favorite element div not found');
  }
}

function findActivityByIdInDataStore(dataStore, relatedActivityId) {
  for (const guide of dataStore.data._guide_of_trips) {
    for (const activity of guide._guide_recommendations) {
      if (String(activity.place_id) === relatedActivityId) {
        return activity;
      }
      console.error(`Activity with ID ${relatedActivityId} not found.`);
    }
  }
  return null;
}

async function renderRelatedActivities(activityId, destinationId, dataStore) {
  console.log('destination id --------', destinationId);
  console.log('activityId', activityId);
  console.log('datastoreeeee', dataStore);
  console.log('guide id', dataStore.data._guide_of_trips);
  // Step 1: Find the destination in _guide_of_trips by its id
  const targetDestination = dataStore.data._guide_of_trips.find(
    (guide) => String(guide.id) === String(destinationId)
  );

  console.log('Target dest', targetDestination);

  // Step 2: If the destination is found, then filter out activities that are not the current one
  let relatedActivities = [];
  if (targetDestination && targetDestination._guide_recommendations) {
    relatedActivities = targetDestination._guide_recommendations.filter(
      (activity) => String(activity.place_id) !== String(activityId)
    );
  }

  console.log('Target dest', targetDestination);

  console.log('Related Activities', relatedActivities);

  // No need for Step 3, we're showing all activities

  // Step 4: Render these in HTML
  const relatedActivitiesContainer = document.querySelector(
    "[activity-data='related-activity']"
  );

  relatedActivitiesContainer.innerHTML = ''; // Clear the container before appending new elements

  relatedActivities.forEach((activity) => {
    const activityElement = document.createElement('div');
    activityElement.className = 'mini-card_component is-related-activity';
    activityElement.setAttribute('related-activity-id', activity.place_id);

    const place = activity._place;

    // Image wrapper with margin
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'margin-bottom margin-xsmall';

    const image = document.createElement('img');
    image.src = place.oa_place_image.url;
    image.className = 'mini-card_image';
    imageWrapper.appendChild(image);

    activityElement.appendChild(imageWrapper);

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'mini-card_content';

    // Activity name with margin
    const activityNameWrapper = document.createElement('div');
    activityNameWrapper.className = 'margin-bottom margin-xxsmall';

    const activityNameDiv = document.createElement('div');
    activityNameDiv.className = 'text-weight-bold';
    activityNameDiv.innerText = place.google_name;

    activityNameWrapper.appendChild(activityNameDiv);
    contentWrapper.appendChild(activityNameWrapper);

    // Category with margin
    const categoryWrapper = document.createElement('div');
    categoryWrapper.className = 'margin-bottom margin-xxsmall';

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'mini-card_tag-wrapper';
    categoryDiv.innerHTML = `<img src="${place._place_category.category_icon.url}" class="mini-card_tag-icon">
                              <div class="text-size-small text-color-grey">${place._place_category.category_name}</div>`;

    categoryWrapper.appendChild(categoryDiv);
    contentWrapper.appendChild(categoryWrapper);

    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'rating-stars_component';

    const rating = Math.floor(activity._place.google_rating); // Floor the rating to the nearest integer
    for (let i = 1; i <= 5; i++) {
      const starImage = document.createElement('img');
      starImage.className = `activity-star`;
      starImage.setAttribute('activity-data', `star-${i}`);

      if (i <= rating) {
        starImage.src =
          'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cbcc2d93ee2563a85e_star-blue.svg';
      } else {
        starImage.src =
          'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg';
      }

      ratingDiv.appendChild(starImage);
    }
    contentWrapper.appendChild(ratingDiv);

    activityElement.appendChild(contentWrapper);

    relatedActivitiesContainer.appendChild(activityElement);
  });
}

const markersMap = [];

function updateMarkerFromUrl() {
  // const urlParams = new URLSearchParams(window.location.search);
  const activityId = Number(Wized.data.n.parameter.activity_id);

  // Reset all markers to default appearance
  Object.values(markersMap).forEach((marker) => {
    marker.style.border = '2px solid grey';
    marker.style.zIndex = '0';

    // Get the original background image URL from some storage, or a default image URL
    const originalImageUrl =
      marker.getAttribute('original-image-url') || 'default_image_url_here';
    marker.style.backgroundImage = `url("${originalImageUrl}")`;
  });

  // If activity_id is found in URL, change corresponding marker's appearance
  if (activityId && markersMap[activityId]) {
    markersMap[activityId].style.border = '2px solid #636BFF';
    markersMap[activityId].style.zIndex = '1';
    // Set the background to the active image
    const activeImageUrl =
      markersMap[activityId].getAttribute('active-image-url') ||
      'active_image_url_here';
    markersMap[activityId].style.backgroundImage = `url("${activeImageUrl}")`;
  }
}

// On load code

window.onload = async () => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoiam9yZGFub25hcnJpdmFsIiwiYSI6ImNsbHY4bW0zaTFxZ3czZ256bjlqODZmNncifQ.1xHX4Xvmvz9KNYmrZdFybA';

  // document.querySelector('[wized=activity_info_modal]').style.display = 'none';

  console.log('Window loaded');

  //Wized.request.awaitAllPageLoad(async () => {
  //Wized.request.await('Load Trip Page');
  //Wized.requests.waitFor('Load_Trip_Page');
  window.Wized = window.Wized || [];
  window.Wized.push(async (Wized) => {
    //const dataStore = await Wized.data.get('r.18.d');
    const dataStore = await Wized.requests.waitFor('Load_Map_Page');
    const dataStoreRelatedActivities = { ...dataStore };
    //setTimeout(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const destinationId = urlParams.get('destination_id');
    const activityId = urlParams.get('activity_id');

    const parentElement = document.querySelector('[wized="destination_nav"]');
    console.log('dataStore:', dataStore);

    dataStore.data._guide_of_trips.forEach((guide) => {
      guide._guide_recommendations = guide._guide_recommendations.filter(
        (destination) => {
          const place = destination._place;
          return place && place.google_lat !== 0 && place.google_lng !== 0;
        }
      );
      const anchorElement = document.createElement('a');
      anchorElement.setAttribute('wized', 'destination_nav_id');
      anchorElement.setAttribute('href', '#');
      anchorElement.setAttribute('data-destination-id', guide.id);
      anchorElement.classList.add('mab_tabs-wrapper', 'w-inline-block');
      console.log(`Starting loop for guide ID: ${guide.id}`);

      const paragraphElement = document.createElement('p');
      paragraphElement.setAttribute('wized', 'destination_nav_name');
      paragraphElement.setAttribute('data-destination-id', guide.id);
      paragraphElement.textContent = guide._destination[0].short_name;
      paragraphElement.classList.add('map_tabs-link');

      anchorElement.appendChild(paragraphElement);
      console.log(`Created anchor element with destination ID: ${guide.id}`);
      parentElement.appendChild(anchorElement);

      renderRelatedActivities(
        activityId,
        destinationId,
        dataStoreRelatedActivities
      ); // Pass the new destinationId

      // Add click event
      anchorElement.addEventListener('click', function () {
        console.log(
          `Clicked on destination ID: ${guide.id}, Place: ${guide.place}`
        );

        // Clear the activity_id from URL parameters
        urlParams.delete('activity_id');
        // history.replaceState({}, '', `${location.pathname}?${urlParams}`);
        Wized.data.n.parameter.activity_id = '';
        console.log('Replaced State');

        // Logic to update 'activeCoordinates' based on clicked 'guide.id'
        const newActiveCoordinates = coordinates.filter(
          (coord) => coord.destinationId === guide.id
        );
        console.log(newActiveCoordinates, guide.id);

        console.log('New active coordsss', newActiveCoordinates);
        console.log('Current coordinates array:', JSON.stringify(coordinates));
        setMapBounds(newActiveCoordinates, map);
      });
    });

    if (destinationId) {
      document.querySelectorAll('[data-destination-id]').forEach((el) => {
        // Remove 'is-active' class from all elements first
        el.classList.remove('is-active');

        // Check if this element's data-destination-id attribute matches destinationId
        if (el.getAttribute('data-destination-id') === destinationId) {
          console.log('tried adding class');
          // Add 'is-active' class
          el.classList.add('is-active');
        }
      });

      // 1. Set is-active class on click of a destination in nav [data-destination-id]
      document.querySelectorAll('[data-destination-id]').forEach((item) => {
        item.addEventListener('click', function (e) {
          // Remove is-active class from all nav items
          document
            .querySelectorAll('[data-destination-id]')
            .forEach((el) => el.classList.remove('is-active'));

          // Add is-active class to the clicked item
          e.currentTarget.classList.add('is-active');

          // Hide the modal with ID 'activity_info_modal'
          const modal = document.querySelector("[wized='activity_info_modal']");
          if (modal) {
            modal.style.display = 'none';
          }
        });
      });
    }

    const closestElements = document.querySelectorAll(
      `[wized="destination_nav"]`
    ); // Selecteer alle elementen met wized="destination_nav"

    closestElements.forEach((element) => {
      console.log(closestElements);
      // Loop door elk element heen
      const dataDestinationId = element.getAttribute('data-destination-id'); // Haal de data-destination-id op van het huidige element

      if (dataDestinationId === destinationId) {
        // Check of deze gelijk is aan destinationId
        element.classList.add('is-active'); // Zo ja, voeg de klasse 'is-active' toe
      } else {
        element.classList.remove('is-active'); // Zo nee, verwijder de klasse (optioneel)
      }
    });

    let startingPoint = [0, 0];
    if (destinationId) {
      for (const guide of dataStore.data._guide_of_trips) {
        if (guide.id.toString() === destinationId) {
          const destination = guide._destination && guide._destination[0];
          startingPoint = [destination.mobi_lng, destination.mobi_lat];
          break;
        }
      }
    } else {
      const firstGuideOfTrip = dataStore.data._guide_of_trips[0];
      const firstDestination =
        firstGuideOfTrip._destination && firstGuideOfTrip._destination[0];
      startingPoint = [firstDestination.mobi_lng, firstDestination.mobi_lat];
    }

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: startingPoint,
      zoom: 17,
    });

    let activeMarker = null; // Initialize activeMarker outside of map.on("load")

    function flyToAndSetActive(place) {
      console.log('Fly to place', place);

      const offsetInRem = 10;
      const offsetInPixels = offsetInRem * 16; // Convert rem to pixels, assuming 1 rem = 16px

      map.flyTo({
        center: [place.google_lng, place.google_lat],
        zoom: 15,
        offset: [offsetInPixels, 0], // Adding the offset here
      });

      const newActiveMarker = document.querySelector(
        `[marker_activity_id="${place.id}"]`
      );

      const imageUrlActive = place._place_category.category_icon_active.url;

      if (newActiveMarker) {
        newActiveMarker.style.border = '2px solid #636BFF';
        newActiveMarker.style.backgroundImage = `url("${imageUrlActive}")`;

        activeMarker = newActiveMarker;
      }
    }
    // Listen for clicks on elements with data-destination-id attribute
    document.querySelectorAll('[data-destination-id]').forEach((item) => {
      item.addEventListener('click', function () {
        // Remove is-active class from all destination nav items
        document.querySelectorAll('[data-destination-id]').forEach((el) => {
          el.classList.remove('is-active');
        });

        // Add is-active class to the clicked destination nav item
        this.classList.add('is-active');

        const destinationId = this.getAttribute('data-destination-id');
        console.log(`Destination ID clicked: ${destinationId}`); // Debugging log

        // Find the corresponding guide using the destinationId
        const guide = dataStore.data._guide_of_trips.find(
          (g) => g.id.toString() === destinationId
        );

        console.log(dataStore.data._guide_of_trips);
        console.log(destinationId);

        if (guide) {
          const destination = guide._destination && guide._destination[0];
          if (destination) {
            // Collect the coordinates of all activities in this destination
            const destinationCoordinates = guide._guide_recommendations.map(
              (recommendation) => {
                return [
                  recommendation._place.google_lng,
                  recommendation._place.google_lat,
                ];
              }
            );

            // Set the bounds of the map to fit these coordinates
            setMapBounds(destinationCoordinates, map);

            // Update the URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            //urlParams.set('destination_id', destinationId);
            urlParams.delete('activity_id');
            //history.replaceState({}, '', `${location.pathname}?${urlParams}`);
            Wized.data.n.parameter.activity_id = '';
            Wized.data.n.parameter.destination_id = destinationId;
            console.log('Replaced State');
          }
        }
      });
    });

    // Function to calculate distance between two coordinates
    function distance(coord1, coord2) {
      const [x1, y1] = coord1;
      const [x2, y2] = coord2;
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    // Listen to map move event
    map.on('moveend', () => {
      const center = map.getCenter().toArray();
      console.log('Map moved, center is: ', center); // Log center coordinates

      let closestDestination = null;
      let minDistance = Infinity;

      // Find the closest destination
      dataStore.data._guide_of_trips.forEach((g) => {
        const destination = g;
        if (destination.id) {
          const destinationCenter = [
            destination._destination[0].mobi_lng,
            destination._destination[0].mobi_lat,
          ];

          console.log(destinationCenter);
          const d = distance(center, destinationCenter);
          console.log('Calculated distance: ', d); // Log the calculated distance

          if (d < minDistance) {
            minDistance = d;
            closestDestination = {
              id: destination.id, // Assuming `id` is the property you want
              mobi_lat: destination._destination[0].mobi_lat,
              mobi_lng: destination._destination[0].mobi_lng,
            };
            console.log('Updated closest destination: ', closestDestination); // Log the new closest destination
          }
        }
      });

      if (closestDestination) {
        console.log('Closest destination is: ', closestDestination); // Log the closest destination

        // Remove is-active class from all destination nav items
        document.querySelectorAll('[data-destination-id]').forEach((el) => {
          console.log('Removing is-active class from: ', el);
          el.classList.remove('is-active');
          // Log elements that should have the class removed
        });

        // Add is-active class to the closest destination nav item
        const closestElement = document.querySelector(
          `[data-destination-id="${closestDestination.id}"]`
        );
        if (closestElement) {
          console.log('Adding is-active class to: ', closestElement); // Log the element that should have the class added
          closestElement.classList.add('is-active');
        } else {
          console.log(
            `No element found for destination_id: ${closestDestination}`
          ); // Log if no element is found
        }
      } else {
        console.log('No closest destination found'); // Log if no closest destination is found
      }
    });

    // End Moovend code

    function isTabletOrMobile() {
      return window.innerWidth <= 1024;
    }

    // Mapbox Control code

    map.addControl(new mapboxgl.NavigationControl());

    function createMarker(activity, map, activeMarker) {
      // Create a marker
      const place = activity._place;
      console.log('Marker added at:', place.google_lng, place.google_lat);

      if (!place) return null;

      const imageUrl = place._place_category.category_icon.url;
      const imageUrlActive = place._place_category.category_icon_active.url;
      const markerHtml = document.createElement('div');
      markerHtml.style.backgroundImage = `url("${imageUrl}")`;
      //markerHtml.setAttribute("src", imageUrl);
      markerHtml.setAttribute('original-image-url', imageUrl);
      markerHtml.setAttribute('active-image-url', imageUrlActive);

      markerHtml.setAttribute('marker_activity_id', activity.place_id);
      markerHtml.style.backgroundRepeat = 'no-repeat';
      markerHtml.style.backgroundPosition = 'center';
      markerHtml.style.backgroundSize = '18px 18px';
      markerHtml.style.width = '41px';
      markerHtml.style.height = '25px';
      markerHtml.style.borderRadius = '12.5px';
      markerHtml.style.backgroundColor = 'var(--primary-white, #FFF)';
      markerHtml.style.boxShadow = '0px 4px 4px 0px rgba(35, 16, 94, 0.10)';
      markerHtml.style.border = '2px solid grey';

      const marker = new mapboxgl.Marker(markerHtml)

        .setLngLat([place.google_lng, place.google_lat])
        .addTo(map);

      const popupHTML = `
        <div class="mini-card_component is-popup" style="z-index: 100 !important;">
        <img src="${place.oa_place_image.url}" alt="" class="mini-card_image">
        <div class="mini-card_content">
        <div class="margin-bottom margin-xxsmall">
        <div class="text-weight-bold">${place.google_name}</div>
        </div>
        <div class="margin-bottom margin-xsmall">
        <div class="mini-card_tag-wrapper">
        <img src="${
          place._place_category.category_icon.url
        }" loading="lazy" alt="" class="mini-card_tag-icon">
        <div class="text-size-small text-color-grey">${
          place._place_category.category_name || 'No description available.'
        }</div>
        </div>
        </div>
        <div class="rating-stars_component">
        <img id="popup-star-1" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-2" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-3" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-4" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-5" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        </div>
        </div>
        <img loading="lazy" alt="" class="popup-card_arrow">
        </div>
        `;

      const popupInstance = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
      }).setHTML(popupHTML);

      // Rating logic
      popupInstance.on('open', () => {
        const rating = Math.floor(place.google_rating);
        for (let i = 1; i <= 5; i++) {
          const starElement = popupInstance._content.querySelector(
            `#popup-star-${i}`
          );
          if (starElement) {
            starElement.src =
              i <= rating
                ? 'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cbcc2d93ee2563a85e_star-blue.svg'
                : 'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg';
          }
        }
      });

      map.on('click', () => {
        // document.querySelector('[wized=activity_info_modal]').style.display = 'none';

        activeMarker = null;
        selectedMarker = null;
        // Delete the 'activity_id' parameter from URLSearchParams object
        //urlParams.delete('activity_id');

        // Create a new URL object from the current URL
        //const url = new URL(window.location.href);

        // Update the search parameters of the URL
        //url.search = urlParams.toString();

        // Update the URL without reloading the page
        // history.replaceState(null, null, url.toString());
        Wized.data.n.parameter.activity_id = '';
        console.log('Replaced State');

        updateMarkerFromUrl();
      });

      function handleMarkerTouchEnd(e) {
        e.stopPropagation();

        // Sla de huidige destination_id op
        const dynamicDestinationId = getDestinationIdFromActivityId(
          activity.place_id,
          dataStore
        );

        // Update alleen de activity_id in de URL
        //urlParams.set('activity_id', activity.place_id);
        //urlParams.set('destination_id', dynamicDestinationId);

        // Zet de destination_id weer terug naar de oorspronkelijke waarde

        //history.pushState({}, '', `${location.pathname}?${urlParams}`);
        Wized.data.n.parameter.activity_id = `${activity.place_id}`;
        Wized.data.n.parameter.destination_id = `${dynamicDestinationId}`;
        // Update active and selected markers
        activeMarker = activity.id;
        selectedMarker = activity.place_id;

        // Overige logica
        updateMarkerFromUrl();
        closeFlag = false;

        flyToAndSetActive(place);
      }

      if (isTabletOrMobile()) {
        markerHtml.addEventListener('touchend', handleMarkerTouchEnd);
      } else {
        markerHtml.addEventListener('mouseenter', () => {
          const activityId = urlParams.get('activity_id');
          markerHtml.style.cursor = 'pointer';

          const markerActivityId =
            markerHtml.getAttribute('marker_activity_id');
          // Controleer of de activity_id actief is
          if (markerActivityId === activityId) {
            markerHtml.style.zIndex = '0';
          } else {
            const activeElement = document.querySelector(
              `[marker_activity_id="${activityId}"]`
            );
            if (activeElement) {
              activeElement.style.zIndex = '0';
            }
            markerHtml.style.zIndex = '0';
          }
          popupInstance.setLngLat(marker.getLngLat()).addTo(map);
        });

        const activityId = urlParams.get('activity_id');

        markerHtml.addEventListener('mouseleave', () => {
          const activityId = urlParams.get('activity_id');
          markerHtml.style.cursor = 'default';

          const activeElement = document.querySelector(
            `[marker_activity_id="${activityId}"]`
          );
          if (activeElement) {
            activeElement.style.zIndex = '1';
          }

          // Haal de activity_id van de marker op uit het data-* attribuut
          const markerActivityId =
            markerHtml.getAttribute('marker_activity_id');

          // Controleer of de activity_id actief is
          if (markerActivityId === activityId) {
            markerHtml.style.zIndex = '1';
          } else {
            console.log('0', markerActivityId, activityId);
            markerHtml.style.zIndex = '0';
          }

          popupInstance.remove();
        });

        markerHtml.addEventListener('click', (e) => {
          e.stopPropagation();

          // Sla de huidige destination_id op
          const dynamicDestinationId = getDestinationIdFromActivityId(
            activity.place_id,
            dataStore
          );

          // Update alleen de activity_id in de URL
          //urlParams.set('activity_id', activity.place_id);
          //urlParams.set('destination_id', dynamicDestinationId);

          // Zet de destination_id weer terug naar de oorspronkelijke waarde

          //history.pushState({}, '', `${location.pathname}?${urlParams}`);
          Wized.data.n.parameter.activity_id = `${activity.place_id}`;
          Wized.data.n.parameter.destination_id = `${dynamicDestinationId}`;
          // Update active and selected markers
          activeMarker = activity.id;
          selectedMarker = activity.place_id;

          // Overige logica
          updateMarkerFromUrl();
          closeFlag = false;

          flyToAndSetActive(place);
        });
      }

      const closeButtons = document.querySelectorAll(
        "[wized='activity_close_button']"
      );

      closeButtons.forEach((button, index) => {
        // Check if the button already has an event listener
        if (button.getAttribute('data-listener') !== 'true') {
          // Attach the event listener
          button.addEventListener('click', function (event) {
            console.log(`Clicked button index: ${index}`);
            console.log('Current closeFlag state:', closeFlag);

            if (!closeFlag) {
              console.log('Inside closeFlag check');

              // document.querySelector(
              //   '[wized=activity_info_modal]'
              // ).style.display = 'none';
              console.log('Modal closed');

              // urlParams.delete('activity_id');
              // console.log('Deleted activity_id');

              const url = new URL(window.location.href);
              url.search = urlParams.toString();
              // history.replaceState(null, null, url.toString());

              Wized.data.n.parameter.activity_id = '';
              Wized.data.n.parameter.destination_id = '';
              console.log('Replaced State');

              closeFlag = true;
              console.log('Updated closeFlag state:', closeFlag);

              updateMarkerFromUrl();
            } else {
              console.log('Skipped due to closeFlag being true');
            }
          });

          // Mark the button as having an event listener
          button.setAttribute('data-listener', 'true');
        }
      });

      return markerHtml;
    }

    const coordinates = [];
    const activeCoordinates = [];
    var selectedMarker = null;

    map.on('load', function () {
      console.log('Map loaded');

      const urlParams = new URLSearchParams(window.location.search);
      const destination_id_param = urlParams.get('destination_id');
      const activity_id_param = urlParams.get('activity_id');

      let activityFound = false;

      dataStore.data._guide_of_trips.forEach((guide) => {
        console.log(`Processing guide ID: ${guide.id}`);

        const destinations = guide._guide_recommendations || [];

        destinations.forEach((destination) => {
          const place = destination._place;
          if (!place) return;

          if (place.google_lng === 0 || place.google_lat === 0) {
            console.log(
              `Skipping place with invalid coordinates: [${place.google_lng}, ${place.google_lat}]`
            );
            return;
          }

          console.log(
            `Adding coordinates: [${place.google_lng}, ${place.google_lat}]`
          );
          coordinates.push([place.google_lng, place.google_lat]);
          console.log(
            'Current coordinates array:',
            JSON.stringify(coordinates)
          );

          if (guide.id.toString() === destination_id_param) {
            activeCoordinates.push([place.google_lng, place.google_lat]);
          }

          const marker = createMarker(destination, map, activeMarker);

          if (marker) {
            activeMarker = marker;
            markersMap[place.id] = marker;
          }

          console.log('This is place', place);
          if (String(place.id) === activity_id_param) {
            activityFound = true; // Activity found based on ID
            flyToAndSetActive(place);
          }
        });
      });

      // Initial call to set the marker based on URL when the page loads
      updateMarkerFromUrl();

      // Listen to popstate event to catch URL changes without page reloads
      window.addEventListener('popstate', updateMarkerFromUrl);

      console.log(`Generated ${coordinates.length} coordinates`);
      console.log('Coordinates:', coordinates);

      // If activity_id parameter was present but no matching activity was found.
      if (activity_id_param && !activityFound) {
        console.log(`No activity found for ID: ${activity_id_param}`);
      }

      // If destination_id parameter was present, set the bounds accordingly.
      if (destination_id_param && !activityFound) {
        console.log(
          `Setting map bounds for destination_id: ${destination_id_param}`
        );
        setMapBounds(activeCoordinates, map);
      } else if (!activityFound) {
        console.log(
          'No destination_id or activity_id found. Using default map settings.'
        );
      }
    });

    function setMapBounds(coordinates, map) {
      if (!coordinates.length) return;
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord),
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
      );
      map.fitBounds(bounds, { padding: 60 });
    }
  });
  //  }, 2000); // Waits for 2 seconds
};

//
