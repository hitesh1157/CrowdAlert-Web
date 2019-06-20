import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { fetchUserLocation, fetchEventsByLocation } from './actions';
import style from './style';
import { MapWrapper, Sonar, EventPreviewCard, GeoLocator } from '../../components';
import { DOMAIN_NAME } from '../../utils/apipaths';
import SEO from '../../components/SEO';

function getEventMarkers(feed, zoom) {
  // Boundary conditions
  if (zoom < 4 || zoom > 18) {
    return [];
  }
  const feedData = {};
  Object
    .keys(feed)
    .forEach((z) => {
      feedData[z] = Object.keys(feed[z]).map(e => feed[z][e]);
    });

  // If current zoom level has some events return them
  if (feedData[zoom] && feedData[zoom].length) {
    return feedData[zoom];
  }

  for (let i = 1; i < 18;) {
    if ((zoom + i > 4 && zoom + i < 18)
      && feedData[zoom + i] && feedData[zoom + i].length) {
      console.log(feedData[zoom + i], i, zoom + i);
      return feedData[zoom + i] || [];
    }
    if ((zoom - i > 4 && zoom - i < 18)
      && feedData[zoom - i] && feedData[zoom - i].length) {
      console.log(feedData[zoom - i], i, zoom - i);
      return feedData[zoom - i];
    }
    i += 1;
  }
  return [];
}

/**
 * [Feed Display events on th map using Sonar components]
 * @extends Component
 */
class Feed extends Component {
  // eslint-disable-next-line class-methods-use-this
  head() {
    let types = [];
    getEventMarkers(this.props.feedProps, this.props.mapProps.zoom)
      .forEach((event) => {
        if (event.isClustered === true) {
          if (types.indexOf('other') === -1) {
            types.push('other');
          }
        } else if (types.indexOf(event.category) === -1) {
          types.push(event.category);
        }
      });

    const count = types.length;
    let ogDesc = `${count} incidents of ${types} have been reported in your area. Stay safe.`;
    if (types.indexOf('other') !== -1) {
      types = types.filter(type => type !== 'other');
      ogDesc = `${count}+ incidents of ${types.join(', ')} and others have been reported in your area. Stay safe.`;
    }

    return <SEO title="Feed | CrowdAlert" url={DOMAIN_NAME} description={ogDesc} />;
  }
  render() {
    // console.log(this.props);
    const Markers =
      getEventMarkers(this.props.feedProps, this.props.mapProps.zoom)
        .map(event => (
          <Sonar
            lat={event.lat}
            lng={event.long}
            key={event.key}
            id={event.key}
            type={event.isClustered ? 'other' : event.category}
            clustered={event.isClustered}
            payload={event}
          />
        ));
    return (
      <div style={style}>
        {this.head()}
        <MapWrapper shouldFetch>
          { Markers }
        </MapWrapper>
        <EventPreviewCard />
        <GeoLocator />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { map } = state;
  const { feed } = state;
  return {
    mapProps: map,
    feedProps: feed,
  };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    fetchUserLocation,
    fetchEventsByLocation,
  }, dispatch)
);

Feed.propTypes = {
  feedProps: PropTypes.object.isRequired,
  mapProps: PropTypes.shape({
    zoom: PropTypes.number,
  }).isRequired,
};

export default {
  component: connect(mapStateToProps, mapDispatchToProps)(Feed),
  loadData: (store, ip = '') => {
    const { dispatch } = store;

    return dispatch(fetchUserLocationSSR(
      {
        oldLat: -26.77,
        oldLng: 135.17,
      },
      ip,
    )).then(() => {
      const { lat, lng, zoom } = store.getState().map;
      return dispatch(fetchEventsByLocationSSR({
        lat,
        lng,
        zoom,
      }));
    });
  },
};
