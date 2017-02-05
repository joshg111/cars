// @flow

import React, { PropTypes } from 'react'
import { View, Image, Text, ListView, Linking } from 'react-native'
import { connect } from 'react-redux'
// import { Actions as NavigationActions } from 'react-native-router-flux'

// For empty lists
import AlertMessage from '../Components/AlertMessage'

// Styles
import styles from './Styles/CarResultsStyle'

// Joshs
import { graphql, ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
// import { Button, Card } from 'react-native-material-design';
import { View as ViewUI, Caption, Subtitle, Card, Image as ImageUI, Tile, Title, Button, Text as TextUI, ListView as ListViewUI, Divider, Row } from '@shoutem/ui';

class CarResults extends React.Component {

  state: {
    dataSource: Object
  }

  constructor (props) {
    super(props)
    // If you need scroll to bottom, consider http://bit.ly/2bMQ2BZ

    /* ***********************************************************
    * STEP 1
    * This is an array of objects with the properties you desire
    * Usually this should come from Redux mapStateToProps
    *************************************************************/
    const dataObjects = [
      {title: 'First Title', description: 'First Description'},
      {title: 'Second Title', description: 'Second Description'},
      {title: 'Third Title', description: 'Third Description'},
      {title: 'Fourth Title', description: 'Fourth Description'},
      {title: 'Fifth Title', description: 'Fifth Description'},
      {title: 'Sixth Title', description: 'Sixth Description'},
      {title: 'Seventh Title', description: 'Seventh Description'}
    ]

    /* ***********************************************************
    * STEP 2
    * Teach datasource how to detect if rows are different
    * Make this function fast!  Perhaps something like:
    *   (r1, r2) => r1.id !== r2.id}
    *************************************************************/
    const rowHasChanged = (r1, r2) => r1 !== r2

    // DataSource configured
    this.ds = new ListView.DataSource({rowHasChanged})

    // Datasource is always in state
    this.state = {
      dataSource: this.ds.cloneWithRows(dataObjects)
    }
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

  /* ***********************************************************
  * STEP 4
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRows` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
    componentWillReceiveProps (newProps) {
      if (newProps.someData) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newProps.someData)
        })
      }
    }
  *************************************************************/

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  // Render a footer.
  renderFooter = () => {
    return (
      <Text> - Footer - </Text>
    )
  }

  render () {
    if (this.props.loading)
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
        <AlertMessage title='Nothing to See Here, Move Along' show={this.noRowData()} />
        <ListViewUI
          data={this.props.cars}
          renderRow={this.renderRow.bind(this)}
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
  options: ({ make, model }) => ({ variables: { make, model } }),
  // ownProps are the props that are passed into the `ProfileWithData`
  // when it is used by a parent component
  props: ({ ownProps, data: { loading, cars } }) => ({
    loading: loading,
    cars: cars
  }),
})(CarResults);

export default CarResultsWithData
