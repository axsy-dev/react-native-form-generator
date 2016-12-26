'use strict';

import React from 'react';
let { View, StyleSheet, Text, Switch} = require('react-native');

import {SwitchComponent} from '../lib/SwitchComponent';

export class SwitchField extends React.Component{
  setValue(value){
    this.refs.fieldComponent.setValue(value)
  }
  render(){

    return(<SwitchComponent
      {...this.props}
      ref='fieldComponent'
      containerStyle={this.props.containerStyle}
      labelStyle = {this.props.labelStyle}
      switchStyle={this.props.switchStyle}
      />

    )
  }

}
