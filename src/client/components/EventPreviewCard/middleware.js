import { EVENT_PREVIEW_OPEN, EVENT_PREVIEW_CLOSE } from './actionTypes';
import { updateMapCenter, updateMapPolyline } from '../../components/Map/actions';
import { fetchEventData } from '../../containers/Viewevent/actions';

const eventPreviewMiddleware = ({ dispatch }) => next => (action) => {
  if (action.type === EVENT_PREVIEW_OPEN) {
    /* If user opens the preview, make sure to update the map center
      just to make sure that the card isn't blocking the incident badge.
      A better solution would be to calculate whether the incident is viewable
      or not. Then update the center only if the viewport is blocked
    */
    dispatch(updateMapCenter({
      // Make sure we aren't fetching incidents every now & then
      fetch: false,
      lat: action.payload.lat,
      lng: action.payload.long,
    }));
    /* Fetch the details of the incident beforehand. Reduces loading time if
      user oepns the detailed view page */
    dispatch(fetchEventData({
      eventid: action.payload.key,
    }));
  }
  if (action.type === EVENT_PREVIEW_CLOSE) {
    // Remove the polyline from the map when the event preview of the incident closes.
    dispatch(updateMapPolyline({
      polyline: null,
      bounds: null,
      fitBounds: false,
      isVisible: false,
    }));
  }

  // Call the next middleware
  next(action);
};

export default eventPreviewMiddleware;
