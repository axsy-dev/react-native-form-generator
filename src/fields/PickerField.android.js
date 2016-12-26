'use strict';

import React from 'react';
import ReactNative from 'react-native';
let { View, StyleSheet, TextInput, Text, PickerIOS} = ReactNative;


import {PickerComponent} from '../lib/PickerComponent';

export class PickerField extends React.Component{
  setValue(value){
    this.refs.fieldComponent.setValue(value)
  }
  render(){
    return(<PickerComponent
      {...this.props}
      ref='fieldComponent'
      pickerProps={{
        style: this.props.containerStyle
      }}
      />)
    }

  }