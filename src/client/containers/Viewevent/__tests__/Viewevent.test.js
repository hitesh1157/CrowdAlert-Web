import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import Viewevent from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  map: {
    lat: 26.2323,
    lng: 80.2322
  },
  event: {
    reverse_geocode: {},
    isLoading: false,
    data: {
        reportedBy: {

        },
        datetime: new Date().getTime(),
        title: 'Title',
        description: 'Description',
        images: [
            {
                isNsfw: false,
                isTrusted: true,
                uuid: 'image uuid'
            }
        ],
        spam: {},
        eventid: 'eventid',
        location: {
            coords: {
                latitude: 43.2321,
                longitude: 34.2312
            }
        },
        category: 'fire'
    }
  },
  auth: {
      isLoggedIn: true,
  }
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<Viewevent.component {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
    const expectedProps = {
        isLoggedIn: reduxPiece.auth.isLoggedIn,
        fetchCommentThreadSuccessViaWebSocket: jest.fn(),
        updateUpvotesLongPollStatus: jest.fn(),
        match: {
            params: {
                eventid: 'eventid'
            }
        },
        fetchEventData: jest.fn(),
        event: reduxPiece.event,
        map: reduxPiece.map
    };

    checkProps(Viewevent.component, expectedProps);
});

describe('render test', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({ match: { params: { eventid: 'eventid' } } }, reduxPiece).dive();
    });

    test('renders without errors', () => {
        expect(findByTestAttr(wrapper, 'component-viewevent').length).toBe(1);
    });

    test('renders map with sonar without errors', () => {
        expect(findByTestAttr(wrapper, 'component-mapwithsonar').length).toBe(2);
    });

    test('does not render loading card without errors', () => {
        expect(findByTestAttr(wrapper, 'component-loadingcard').length).toBe(0);
    });

    test('renders event card without errors', () => {
        expect(findByTestAttr(wrapper, 'component-event-card').length).toBe(2);
    });

    test('renders comments section without errors', () => {
        expect(findByTestAttr(wrapper, 'component-comments-section').length).toBe(2);
    });
});

describe('render test with loading', () => {
    let wrapper;
    const rp = {
        ...reduxPiece,
        event: {
            ...reduxPiece.event,
            isLoading: true,
        }
    }
    beforeEach(() => {
        wrapper = setup({ match:{ params: { eventid: 'eventid' } } }, rp).dive();
    });

    test('renders loading card without errors', () => {
        expect(findByTestAttr(wrapper, 'component-loadingcard').length).toBe(2);
    });

    test('does not render event card without errors', () => {
        expect(findByTestAttr(wrapper, 'component-event-card').length).toBe(0);
    });

    test('does not render comments section without errors', () => {
        expect(findByTestAttr(wrapper, 'component-comments-section').length).toBe(0);
    });
});

describe('redux props', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({ match: { params: { eventid: 'eventid' } } }, reduxPiece);
    });

    test('has redux piece of state', () => {
        const reduxProps = {
            map: wrapper.props().map,
            event: wrapper.props().event,
            auth: {
                isLoggedIn: wrapper.props().isLoggedIn
            }
        };

        expect(reduxProps).toEqual(reduxPiece);
    });

    test('"fetchCommentThreadSuccessViaWebSocket" action creator', () => {
        const fetchCommentThreadSuccessViaWebSocketProps = wrapper.props().fetchCommentThreadSuccessViaWebSocket;
        expect(fetchCommentThreadSuccessViaWebSocketProps).toBeInstanceOf(Function);
    });

    test('"fetchEventData" action creator', () => {
        const fetchEventDataProps = wrapper.props().fetchEventData;
        expect(fetchEventDataProps).toBeInstanceOf(Function);
    });

    test('"updateUpvotesLongPollStatus" action creator', () => {
        const updateUpvotesLongPollStatusProps = wrapper.props().updateUpvotesLongPollStatus;
        expect(updateUpvotesLongPollStatusProps).toBeInstanceOf(Function);
    });
});
