import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { ShareModal, UpvoteButton, SpamReport, Directions } from '../';
import s from './footer.css';

/**
 * [EventFooter Footer Bar component for Events Card ]
 * @param {[type]} props [description]
 */
const EventFooter = props => (
  <Button.Group widths={4} basic fluid data-test="component-footer">
    <UpvoteButton uuid={props.uuid} data-test="component-upvote-btn" />
    <Directions htmlInstructions={props.htmlInstructions} data-test="component-directions-modal">
      <Button data-test="modal-trigger">
        <Icon color="black" name="location arrow" />
            Directions
      </Button>
    </Directions>
    <ShareModal title={props.title} uuid={props.uuid} data-test="component-share-modal">
      <Button data-test="jsx-btn-share">
        <Icon color="black" name="external share" />
            Share
      </Button>
    </ShareModal>
    {props.editOption &&
      <Button as={Link} to={`/edit/${props.uuid}/location`}>
        <Icon color="black" name="edit" />
        Edit
      </Button>}
    <SpamReport.Flag uuid={props.uuid} data-test="component-spamreport-flag" />
  </Button.Group>
);
EventFooter.propTypes = {
  // Title of the incident used for sharing incident
  title: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  htmlInstructions: PropTypes.arrayOf(PropTypes.string),
  editOption: PropTypes.bool,
};

EventFooter.defaultProps = {
  htmlInstructions: ['No directions available'],
  editOption: false,
};

export default withStyles(s)(EventFooter);
