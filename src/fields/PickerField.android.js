"use strict";

import React from "react";

import { PickerComponent } from "../lib/PickerComponent";

export class PickerField extends React.Component {
  constructor(props) {
    super(props);
    this.fieldComponentRef = React.createRef();
  }
  setValue(value) {
    if (this.fieldComponentRef.current) {
      this.fieldComponentRef.current.setValue(value);
    }
  }
  render() {
    return (
      <PickerComponent
        {...this.props}
        ref={this.fieldComponentRef}
        pickerProps={{
          style: this.props.containerStyle
        }}
      />
    );
  }
}
