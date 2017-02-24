// @flow

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import '../I18n/I18n' // keep before root container
import RootContainer from './RootContainer'
import createStore from '../Redux'
import applyConfigSettings from '../Config'
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

import { ThemeProvider, COLOR, ListItem, Subheader, Toolbar } from 'react-native-material-ui';


const uiTheme = {
    palette: {
        primaryColor: COLOR.green500,
        accentColor: COLOR.pink500,
    },
};

// Apply config overrides
applyConfigSettings()
// create our store
const store = createStore()

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {

  constructor(...args) {
    super(...args);

    // const networkInterface = createNetworkInterface({uri:'http://10.0.2.2:8080/graphql'});
    const networkInterface = createNetworkInterface({uri:'http://ec2-54-153-42-75.us-west-1.compute.amazonaws.com:8080/graphql'});
    this.client = new ApolloClient({
      networkInterface,
      dataIdFromObject: r => r.id,
    });
  }

  render () {
    return (
      <ThemeProvider uiTheme={uiTheme}>
        <ApolloProvider client={this.client}>
          <RootContainer />
        </ApolloProvider>
      </ThemeProvider>
    )
  }
}

export default App
