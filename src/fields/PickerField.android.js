'use strict';

import React from 'react';
import ReactNative from 'react-native';
let { StyleSheet } = ReactNative;


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