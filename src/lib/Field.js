'use strict';

import React from 'react';
import {HelpText} from './HelpText';
let { View, StyleSheet, Text, TouchableOpacity} = require('react-native');

export class Field extends React.Component{
  render(){
    let fieldHelpText =
      this.props.helpTextComponent
      || ((this.props.helpText)
          ? <HelpText text={this.props.helpText} />
          : null);

    if(this.props.onPress){
      return <TouchableOpacity onPress={this.props.onPress}>
        <View>
          {this.props.children}
          {fieldHelpText}
        </View>
      </TouchableOpacity>
    }
    return   <View>
      {this.props.children}
      {fieldHelpText}
    </View>;


  }
}
Field.propTypes = {
  helpTextComponent: React.PropTypes.element,
  helpText: React.PropTypes.string
}
