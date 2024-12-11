"use strict";

import React from "react";
import { InputComponent } from "../lib/InputComponent";


export class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.fieldComponentRef = React.createRef();
  }
  handleValidation(isValid, validationErrors) {
    this.valid = isValid;
    this.validationErrors = validationErrors;
  }
  setValue(value) {
    if (this.fieldComponentRef.current) {
      this.fieldComponentRef.current.setValue(value);
    }
  }
  focus() {
    if (this.fieldComponentRef.current) {
      this.fieldComponentRef.current.focus();
    }
  }
  render() {
    return (
      <InputComponent
        {...this.props}
        ref={this.fieldComponentRef}
        onValidation={this.handleValidation.bind(this)}
      />
    );
  }
}
