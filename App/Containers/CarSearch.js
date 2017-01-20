// @flow

import React from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { Metrics } from '../Themes'
// external libs
import Icon from 'react-native-vector-icons/FontAwesome'
import Animatable from 'react-native-animatable'
import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
import styles from './Styles/CarSearchStyle'

// I18n
import I18n from 'react-native-i18n'

// Joshs
import { Button } from 'react-native-material-design';
import t from 'tcomb-form-native'

const Type = t.struct({
  make: t.String,
  model: t.String,
})

const options = {
  auto: "placeholders",
};

var Form = t.form.Form;

class CarSearch extends React.Component {

  onSubmit() {
    // call getValue() to get the values of the form
    console.log("inside onSubmit");
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of Person
      console.log("Form validated successfully");
      // this.props.attemptActivate(value.activation_code);
      NavigationActions.CarResults({make: value.make, model: value.model})

    }
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior='position'>
          <Form
            ref="form"
            type={Type}
            options={options}
          />
          <Button text="NORMAL RAISED" raised={true} theme="dark" onPress={this.onSubmit.bind(this)} />

        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarSearch)
