'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {HelpText} from './HelpText';
let { View, StyleSheet } = require('react-native');

import { TTouchableOpacity } from '@axsy/testable';

export class Field extends React.Component{
  render(){
    let fieldHelpText =
      this.props.helpTextComponent
      || ((this.props.helpText)
          ? <HelpText text={this.props.helpText} />
          : null);

    if(this.props.onPress){
      return <TTouchableOpacity onPress={this.props.onPress} tid={'OnPress'}>
        <View>
          {this.props.children}
          {fieldHelpText}
        </View>
      </TTouchableOpacity>
    }
    return   <View>
      {this.props.children}
      {fieldHelpText}
    </View>;


  }
}
Field.propTypes = {
  helpTextComponent: PropTypes.element,
  helpText: PropTypes.string
}
