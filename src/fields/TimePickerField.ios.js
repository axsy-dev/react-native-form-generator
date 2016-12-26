'use strict';

import React from 'react';
import ReactNative from 'react-native';
let { View, StyleSheet, TextInput, Text, PickerIOS} = ReactNative;


import {DatePickerComponent} from '../lib/DatePickerComponent';

export class TimePickerField extends React.Component{
  setTime(date){
    this.refs.datePickerComponent.setDate(date);
  }
  render(){
/*

 */
    return(<DatePickerComponent
      {...this.props}
      mode="time"
      labelStyle={this.props.labelStyle}
      valueStyle = {this.props.valueStyle}
      valueContainerStyle = {this.props.valueContainerStyle}
      containerStyle={this.props.containerStyle}
      />)
    }

  }
