/* eslint-disable max-len */
/* eslint-disable no-undef */
import db from '../../utils/cacheAPI';
import { EVENT_FETCH_EVENT_DATA, EVENT_FETCH_EVENT_DATA_FINISHED, EVENT_FETCH_DIRECTIONS_FINISHED, EVENT_FETCH_DIRECTIONS_ERROR } from './actionTypes';
import { updateMapCenter, updateMapZoom, updateMapPolyline } from '../../components/Map/actions';
import { fetchReverseGeocode, fetchDirections } from './actions';


const fetchEventDataMiddleware = store => next => (action) => {
  const { dispatch } = store;
  const state = store.getState();
  if (action.type === EVENT_FETCH_EVENT_DATA && process.env.BROWSER) {
    const { eventid, fromNetwork } = action.payload;
    if (fromNetwork !== true) {
      db.get(eventid)
        .then((doc) => {
          console.log('Using cache', eventid);
          const newPayload = {
            cached: true,
            ...doc,
          };
          delete newPayload._id;
          delete newPayload._rev;

          // This is going to set isLoading to false and use cached incident data
          dispatch(fetchEventDataFinished(newPayload));
        }).catch(() => {});
    }
    next(action);
  } else if (action.type === EVENT_FETCH_EVENT_DATA_FINISHED) {
    const { payload } = action;
    let formattedImages = [];
    const { images } = payload;
    if (images) {
      formattedImages = Object.keys(images).map(key => images[key]);
    }
    const newAction = {
      ...action,
      payload: {
        ...action.payload,
        images: formattedImages,
      },
    };
    if (formattedImages.length) {
      // Dispatch Image URL Fetch

    }
    const lat = payload.location.coords.latitude;
    const lng = payload.location.coords.longitude;
    // Update Map Center
    dispatch(updateMapCenter({
      lat,
      lng,
      zoom: 16,
      fetch: false,
    }));
    dispatch(updateMapZoom({
      lat,
      lng,
      zoom: 16,
      fetch: false,
    }));

    if (typeof window !== 'undefined') {
      /*
      Only dispatch this action in the browser.
      When rendering the app on server, fetchReverseGeocode(lat, lng)
      action is dispatched after fetchEventData({ eventid, shouldRefresh }) finishes
      in the then callback inside loadData function of ViewEvent container.
      */

      dispatch(fetchReverseGeocode(lat, lng));

      const { locationHistory } = state.geoLocator;
      if (locationHistory.length !== 0) {
        const recentCoords = locationHistory[0];
        if (recentCoords.lat !== undefined && recentCoords.lng !== undefined) {
          dispatch(fetchDirections(recentCoords.lat, recentCoords.lng, lat, lng));
        }
      } else {
        console.log('Location history is empty. Using home location');
        if (state.geoLocator.homeLocation.lat !== undefined &&
          state.geoLocator.homeLocation.lng !== undefined) {
          dispatch(fetchDirections(state.geoLocator.homeLocation.lat, state.geoLocator.homeLocation.lng, lat, lng));
        }
      }

      if (payload.cancelSync !== true) {
        db.get(payload.eventid)
          .then(doc => db.put({
            _id: payload.eventid,
            _rev: doc._rev,
            ...payload,
          }))
          .catch(() => {
            db.put({
              _id: payload.eventid,
              ...payload,
            })
              .then((response) => {
                if (!response.ok) {
                  console.error('Failed to save the doc');
                }
              }).catch(() => {});
          });
      } 
    }

    next(newAction);
  } else if (action.type === EVENT_FETCH_DIRECTIONS_FINISHED) {
    const { payload } = action;
    if (payload.status === 'error') {
      dispatch(updateMapPolyline({
        isVisible: false,
        bounds: null,
        fitBounds: false,
        data: [{ lat: -34.397, lng: 150.644 }, { lat: -35.397, lng: 151.644 }],
        distance: null,
        force: false,
      }));
      next(action);
    } else {
      // eslint-disable-next-line camelcase
      const { polyline_points, html_instructions, distance } = payload;
      const bounds = new google.maps.LatLngBounds();
      for (let i = 0; i < polyline_points.length; i += 1) {
        bounds.extend(polyline_points[i]);
      }

      dispatch(updateMapPolyline({
        data: polyline_points,
        bounds,
        fitBounds: false,
        isVisible: true,
        htmlInstructions: html_instructions,
        distance,
      }));
      next(action);
    }
  } else if (action.type === EVENT_FETCH_DIRECTIONS_ERROR) {
    dispatch(updateMapPolyline({
      isVisible: false,
      bounds: null,
      fitBounds: false,
      data: [{ lat: -34.397, lng: 150.644 }, { lat: -35.397, lng: 151.644 }],
      distance: null,
      force: false,
    }));
    next(action);
  } else {
    next(action);
  }
};

export default fetchEventDataMiddleware;
