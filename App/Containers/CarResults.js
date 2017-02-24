// @flow

import React, { PropTypes } from 'react'
import { InteractionManager, View, Image, Text, ListView, Linking } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'

// For empty lists
import AlertMessage from '../Components/AlertMessage'

// Styles
import styles from './Styles/CarResultsStyle'

// Joshs
import { graphql, ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
// import { Button, Card } from 'react-native-material-design';
import { View as ViewUI, Caption, Subtitle, Card, Image as ImageUI, Tile, Title, Button, Text as TextUI, ListView as ListViewUI, Divider, Row } from '@shoutem/ui';

import {
  MKButton,
  MKColor
} from 'react-native-material-kit';

// colored button with default theme (configurable)
const ColoredRaisedButton = MKButton.accentColoredButton()
  .withBackgroundColor(MKColor.LightBlue)
  .withText("Refresh")
  .withStyle({
      borderRadius: 20,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: .7,
      shadowColor: 'black',
      elevation: 4,
    })

  .build();

class CarResults extends React.Component {

  state: {
    renderPlaceholderOnly: boolean
  }

  constructor (props) {
    super(props)
    // If you need scroll to bottom, consider http://bit.ly/2bMQ2BZ
    this.state = {
      renderPlaceholderOnly: true,
    };
  }

  onRight()
  {
    console.log("Calling onRight()");
    this.props.refetch();
    this.forceUpdate();
    console.log("this.props.loading = " + this.props.loading.toString());
    console.log("Leaving onRight()");
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        renderPlaceholderOnly: false,
      });
    });
  }

  componentWillMount()
  {
    // NavigationActions.refresh({ onRight: this.onRight.bind(this), rightTitle: 'Refresh' });

  }

  listing_press(url) {
    Linking.openURL(url);
  }

  rowStyle(percentage) {
    var res = {paddingLeft:10, paddingBottom:10, paddingRight:10};
    var color = "red";
    if (percentage <= 0) {
      color = "green"
    }

    res["color"] = color

    return res;
  }

  renderPercentage(percentage)
  {
    var modifierText = " above ";
    if (percentage <= 0 )
    {
      modifierText = " below ";
    }

    var percentageText = Math.abs(percentage).toString() + "%" + modifierText;
    percentageText += "kelley blue book"

    return (
      <Title style={this.rowStyle(percentage)}>
        {percentageText}
      </Title>
    );
  }

  renderRow (rowData) {
    return (
      <Row style={{backgroundColor:"silver"}}>
        <Tile style={{}}>
          <ViewUI styleName="vertical space-between">
            <Title style={{paddingLeft:10, paddingTop:10, paddingRight:10}}>
              {rowData.desc} ${rowData.price}
            </Title>
            {this.renderPercentage(rowData.percent_above_kbb)}
          </ViewUI>
          <ImageUI
            styleName="large-wide"
            source={{ uri: rowData.thumbnail }}
          />
          <ViewUI styleName="content">
            <ViewUI styleName="vertical space-between">
              <ViewUI styleName="horizontal" style={{paddingBottom: 10}}>
                <TextUI style={{color:"blue"}}>Odometer: </TextUI>
                <TextUI>{rowData.odometer} </TextUI>
                <TextUI style={{color:"blue"}}>Location: </TextUI>
                <TextUI>{rowData.location} </TextUI>
              </ViewUI>
              <Button styleName="dark" onPress={this.listing_press.bind(this, rowData.url)}>
                <TextUI>Go To Listing</TextUI>
              </Button>
            </ViewUI>


          </ViewUI>
        </Tile>
      </Row>
    )
  }

  render () {
    if (this.props.loading || this.state.renderPlaceholderOnly)
    {
      return (
        <View style={styles.container}>
          <Text>
            Loading
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ListViewUI
          initialListSize={1}
          data={this.props.cars}
          renderRow={this.renderRow.bind(this)}
          pageSize={2}
          scrollRenderAheadDistance={2}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const CarResultsQuery = gql`
  query get_cars($make: String!, $model: String!){
    cars(make: $make, model: $model) {
      desc,
      year,
      odometer,
      thumbnail,
      url,
      location,
      price,
      percent_above_kbb
    }
  }
`;

const CarResultsWithData = graphql(CarResultsQuery, {
  options: ({ make, model }) => (
    {
      variables: { make, model }
    }),
  // ownProps are the props that are passed into the `ProfileWithData`
  // when it is used by a parent component
  props: ({ ownProps, data: { loading, cars, refetch } }) => ({
    loading: loading,
    cars: cars,
    refetch: refetch
  }),
})(CarResults);

export default CarResultsWithData
