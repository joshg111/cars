// @flow

import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyle'
import NavigationDrawer from './NavigationDrawer'
import NavItems from './NavItems'
import CustomNavBar from '../Navigation/CustomNavBar'

// screens identified by the router
import CarSearch from '../Containers/CarSearch'
import CarResults from '../Containers/CarResults'


/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='CarSearch' component={CarSearch} title='Search Cars'/>
        <Scene key='CarResults' component={CarResults} initial title='Car Results'/>
      </Router>
    )
  }
}

export default NavigationRouter
