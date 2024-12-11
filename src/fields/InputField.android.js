"use strict";

import React from "react";
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
      />
    );
  }
}
