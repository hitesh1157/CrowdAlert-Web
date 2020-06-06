import React from 'react';
import { Responsive, Segment, Grid, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styleSheet from './style';
import getWidth from '../../utils/width';

// Moved to Bottombar in a later MR

const BottomBar = () => (
  <Responsive fireOnMount getWidth={getWidth} maxWidth={900}>
    <Segment style={styleSheet}>
      <Grid columns="equal" inverted>
        <Grid.Row textAlign="center">
          <Grid.Column data-test="component-grid-map-outline">
            <Icon circular color="teal" name="map outline" />
          </Grid.Column>
          <Grid.Column data-test="component-grid-map-camera">
            <Link to="/create/">
              <Icon circular inverted color="teal" name="camera" />
            </Link>
          </Grid.Column>
          <Grid.Column data-test="component-grid-bell">
            <Icon circular color="teal" name="bell" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  </Responsive>
);

export default BottomBar;
