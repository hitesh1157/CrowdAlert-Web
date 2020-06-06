import {
  GEOLOCATOR_MODAL_CLOSE,
  GEOLOCATOR_MODAL_OPEN,
  GEOLOCATOR_LOCATION_DENIED,
  GEOLOCATOR_LOCATION_FAILED,
  GEOLOCATOR_LOCATION_SUCCESS,
  GEOLOCATOR_UPDATE_HOME_LOCATION,
} from './actionTypes';

/* UI texts */
const PERMISSION_REQUIRED_TEXT = 'We need to access your location';
const PERMISSION_DENIED_TEXT = 'You need to enable location permissions';
const LOCATION_FAILED_TEXT = 'You need enable location services. Current location is based on your network connection.';

const initialState = {
  modalText: PERMISSION_REQUIRED_TEXT,
  isOpen: false,
  locationHistory: [],
  homeLocation: {},
};

let newLocationHistory;

export default function geoLocatorReducer(state = initialState, action) {
  switch (action.type) {
    case GEOLOCATOR_MODAL_OPEN:
      return {
        ...state,
        modalText: PERMISSION_REQUIRED_TEXT,
        isOpen: true,
      };
    case GEOLOCATOR_LOCATION_SUCCESS:
      if (state.locationHistory.length === 0) {
        newLocationHistory = [action.payload];
      } else if (action.payload.lat === state.locationHistory[0].lat &&
        action.payload.lng === state.locationHistory[0].lng) {
        newLocationHistory = state.locationHistory;
      } else {
        newLocationHistory = state.locationHistory;
        newLocationHistory.unshift(action.payload);
      }
      return {
        ...state,
        locationHistory: newLocationHistory,
      };
    case GEOLOCATOR_MODAL_CLOSE:
      return {
        ...state,
        modalText: PERMISSION_REQUIRED_TEXT,
        isOpen: false,
      };
    case GEOLOCATOR_LOCATION_DENIED:
      return {
        ...state,
        modalText: PERMISSION_DENIED_TEXT,
        isOpen: true,
      };
    case GEOLOCATOR_LOCATION_FAILED:
      return {
        ...state,
        modalText: LOCATION_FAILED_TEXT,
        isOpen: true,
      };
    case GEOLOCATOR_UPDATE_HOME_LOCATION:
      return {
        ...state,
        homeLocation: action.payload,
      };
    default:
      return state;
  }
}
