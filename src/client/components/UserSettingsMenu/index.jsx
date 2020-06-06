/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import React, { Component } from 'react';
import { Dropdown, Image, Segment, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from '../../../helpers/history';
import userImage from './man-user.svg';
import { logoutUserAuthencation } from '../../containers/Auth/actions';

class UserSettingsMenu extends Component {
  constructor(props) {
    super(props);
    this.routeChange = this.routeChange.bind(this);
  }
  signOut() {
    this.props.signOut();
  }
  routeChange(path) {
    history.push(path);
  }
  render() {
    const { displayName, photoURL, email } = this.props.user;
    return (
      <Dropdown
        // open={this.props.open}
        trigger={
          <span>
            <Image avatar src={photoURL || userImage} />
          </span>
        }
        data-test="component-user-settings-menu"
      >
        <Dropdown.Menu>
          <Segment secondary basic>
            <Header>
              <Image avatar src={photoURL || userImage} data-test="component-image" />
              <Header.Content data-test="component-header-content">
                {displayName}
                <Header.Subheader>
                  {email}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Segment>
          <Dropdown.Item onClick={() => this.routeChange('/user/settings')} icon="settings" text="Settings" description="Review your account settings" data-test="item-settings" />
          <Dropdown.Item onClick={() => this.routeChange('/user/me')} icon="user" text="Your Profile" description="View your profile" data-test="item-user" />
          <Dropdown.Item onClick={() => this.routeChange('/user/privacy')} icon="privacy" text="Privacy" description="Review our privacy policy" data-test="item-privacy" />
          <Dropdown.Item onClick={() => this.routeChange('/user/me/reports')} icon="tasks" text="Your Reports" description="Incidents reported by you" data-test="item-tasks" />
          <Dropdown.Divider />
          <Dropdown.Item icon="sign out" text="Sign out." onClick={() => this.signOut()} data-test="item-sign-out" />
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

UserSettingsMenu.propTypes = {
  signOut: PropTypes.func.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
  isLoggedIn: PropTypes.bool,
  open: PropTypes.bool,
};

UserSettingsMenu.defaultProps = {
  open: false,
};

const mapStateToProps = (state) => {
  const { user, isLoggedIn } = state.auth;
  return {
    isLoggedIn,
    user,
  };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    signOut: logoutUserAuthencation,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingsMenu);
