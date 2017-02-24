// @flow

import React, { PropTypes } from 'react'
import { TextInput, View, Text, ListView } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'

// For empty lists
import AlertMessage from '../Components/AlertMessage'

// Styles
import styles from './Styles/CarMakeStyle'

import {MakeLookup, ModelLookup} from '../Fixtures/obj'

import { COLOR, ListItem, Subheader, Toolbar } from 'react-native-material-ui';

class CarMake extends React.Component {

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

    if (props.make) {
      this.ma = new ModelLookup(props.make)
    }
    else {
      this.ma = new MakeLookup()
    }


    // Datasource is always in state
    this.state = {
      dataSource: this.ds.cloneWithRows(this.ma.find_words('')),
      text: ''
    }
  }

  popScreen(rowData) {
    if (this.props.make) {
      NavigationActions.pop({refresh: {model: rowData}})
    }
    else {
      NavigationActions.pop({refresh: {make: rowData, model: "Model"}})
    }

  }

  /* ***********************************************************
  * STEP 3
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/
  renderRow (rowData) {
    return (
      <ListItem
        divider

        centerElement={{
            primaryText: rowData,
        }}
        onPress={this.popScreen.bind(this, rowData)}/>
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

  onChangeText(text) {
    this.setState({text,
      dataSource: this.ds.cloneWithRows(this.ma.find_words(text))});
    // this.setState({...this.state,
    //   dataSource: this.ma.find_words(this.state.text)})
  }

  render () {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={this.onChangeText.bind(this)}
          placeholder={"Make"}
          value={this.state.text}
          autoFocus={true}
        />
        <ListView
          initialListSize={1}
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
          pageSize={15}
          keyboardShouldPersistTaps="always"

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

export default connect(mapStateToProps, mapDispatchToProps)(CarMake)
