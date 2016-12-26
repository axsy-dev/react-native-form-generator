'use strict';

import React from 'react';
import ReactNative from 'react-native';
import {InputComponent} from '../lib/InputComponent';

const {StyleSheet} = ReactNative;

export class InputField extends React.Component{
  handleValidation(isValid, validationErrors){
    this.valid = isValid;
    this.validationErrors = validationErrors;
  }
  setValue(value){
    this.refs.fieldComponent.setValue(value)
  }
  focus(){
    this.refs.fieldComponent.focus()
  }
  render(){
    return(<InputComponent
      {...this.props}

      ref='fieldComponent'
      onValidation={this.handleValidation.bind(this)}
      labelStyle={this.props.labelStyle}
      inputStyle={this.props.style}
      containerStyle={this.props.containerStyle}
      />
    )
  }

}

InputField.propTypes = {
  multiline: React.PropTypes.bool,
  placeholder:React.PropTypes.string,
}
