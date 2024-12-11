"use strict";

import React from "react";
import PropTypes from "prop-types";
import { InputComponent } from "../lib/InputComponent";


export class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.inputFieldRef = React.createRef();
  }

  handleValidation(isValid, validationErrors) {
    this.valid = isValid;
    this.validationErrors = validationErrors;
  }
  setValue(value) {
    if (this.inputFieldRef.current) {
      this.inputFieldRef.current.setValue(value);
    }
  }
  focus() {
    if (this.inputFieldRef.current) {
      this.inputFieldRef.current.focus();
    }
  }
  render() {
    return (
      <InputComponent
        {...this.props}
        ref={this.inputFieldRef}
        onValidation={this.handleValidation.bind(this)}
        labelStyle={this.props.labelStyle}
        inputStyle={this.props.style}
        containerStyle={this.props.containerStyle}
      />
    );
  }
}

InputField.propTypes = {
  multiline: PropTypes.bool,
  placeholder: PropTypes.string
};
