'use strict';

import React from 'react';
let { View, StyleSheet, Text, ViewPropTypes} = require('react-native');

export class Separator extends React.Component{
  render(){
     return(<View style={this.props.containerStyle}>
       {
         (this.props.label)?
         <Text style={this.props.labelStyle}>{this.props.label.toUpperCase()}</Text>
       : null
     }
       </View>
    )
  }
}

Separator.propTypes = {
  labelStyle: Text.propTypes.style,
  containerStyle: ViewPropTypes.style
}
