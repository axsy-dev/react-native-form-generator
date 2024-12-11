"use strict";

import React from "react";

import { PickerComponent } from "../lib/PickerComponent";

export class PickerField extends React.Component {
  constructor(props) {
    super(props);
    this.pickerFieldRef = React.createRef();
  }
  setValue(value) {
    if (this.pickerFieldRef.current) {
      this.pickerFieldRef.current.setValue(value);
    }
  }
  render() {
    return (
      <PickerComponent
        {...this.props}
        ref={this.pickerFieldRef}
        pickerProps={{
          style: this.props.containerStyle
        }}
      />
    );
  }
}
