import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import {
  findByTestAttr,
  storeFactory,
  checkProps
} from "../../../tests/testUtils";
import FormTab from "../formtab";

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  createEvents: {
    tabs: {},
    location: {
      text: '',
    },
    details: {
      help: true,
      public: false,
      title: 'title',
      eventType: 'fire',
      anonymous: false,
      description: 'description',
    },
    form: {
      loading: false,
      isFreezed: false,
      validationErrors: false,
      message: {
        header: '',
        body: '',
      },
    },
  },
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<FormTab {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
	const expectedProps = {
		tabs: reduxPiece.createEvents.tabs,
		location: reduxPiece.createEvents.location,
		details: reduxPiece.createEvents.details,
		reportForm: reduxPiece.createEvents.form,
		handleInputChange: jest.fn(),
		handleSubmit: jest.fn(),
		handleTabChange: jest.fn()
	};

	checkProps(FormTab, expectedProps);
});

describe('renders', () => {
	let wrapper;
	beforeEach(() => {
		wrapper = setup({}, reduxPiece).dive();
	});

	test('renders report incident button', () => {
		expect(findByTestAttr(wrapper, 'btn-report-incident').length).toBe(1);
	});

	test('renders public help field', () => {
		expect(findByTestAttr(wrapper, 'cb-public-help').length).toBe(1);
	});

	test('renders report anonymously field', () => {
		expect(findByTestAttr(wrapper, 'cb-report-anonm').length).toBe(1);
	});

	test('renders public visibility field', () => {
		expect(findByTestAttr(wrapper, 'cb-public-visibility').length).toBe(1);
	});

	test('renders description field', () => {
		expect(findByTestAttr(wrapper, 'field-event-desc').length).toBe(1);
	});

	test('renders input title', () => {
		expect(findByTestAttr(wrapper, 'input-title').length).toBe(1);
	});

	test('renders select event type', () => {
		expect(findByTestAttr(wrapper, 'select-event-type').length).toBe(1);
	});

	test('renders location text', () => {
		expect(findByTestAttr(wrapper, 'location-text').dive().text()).toBe(reduxPiece.createEvents.location.text);
	});

	test('renders change location link', () => {
		expect(findByTestAttr(wrapper, 'link-change').length).toBe(1);
	});

	test('does not render form validation error', () => {
		expect(findByTestAttr(wrapper, 'form-validation-error').length).toBe(0);
	});

	test('renders without errors', () => {
		expect(findByTestAttr(wrapper, 'component-formtab').length).toBe(1);
	});

	test('renders redirect', () => {
		const rp = reduxPiece;
		rp.createEvents.form.isFreezed = true;
		rp.createEvents.form.loading = false;
		const wrapper = setup({}, rp).dive();
		expect(findByTestAttr(wrapper, 'redirect-images').length).toBe(1);
	});

	test('does not render component', () => {
		let rp = reduxPiece;
		rp.createEvents.form.isFreezed = true;
		rp.createEvents.form.loading = false;
		const wrapper = setup({}, rp).dive();
		expect(findByTestAttr(wrapper, 'component-formtab').length).toBe(0);
	});
});

describe('redux props', () => {
	let wrapper;
	beforeEach(() => {
		wrapper = setup({}, reduxPiece);
	});

	test('has redux piece of state', () => {
		const reduxProps = {
			createEvents: {
				tabs: wrapper.props().tabs,
				location: wrapper.props().location,
				details: wrapper.props().details,
				form: wrapper.props().reportForm
			}
		};

		expect(reduxProps).toEqual(reduxPiece);
	});

	test('"handleInputChange" action creator', () => {
		const handleInputChangeProps = wrapper.props().handleInputChange;
		expect(handleInputChangeProps).toBeInstanceOf(Function);
	});

	test('"handleSubmit" action creator', () => {
			const handleSubmitProps = wrapper.props().handleSubmit;
			expect(handleSubmitProps).toBeInstanceOf(Function);
	});

	test('"handleTabChange" action creator', () => {
			const handleTabChangeProps = wrapper.props().handleTabChange;
			expect(handleTabChangeProps).toBeInstanceOf(Function);
	});
});