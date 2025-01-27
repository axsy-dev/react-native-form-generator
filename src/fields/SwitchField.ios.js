"use strict";

import React from "react";

import { SwitchComponent } from "../lib/SwitchComponent";

export class SwitchField extends React.Component {
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
      <SwitchComponent
        {...this.props}
        ref={this.fieldComponentRef}
        containerStyle={this.props.containerStyle}
        labelStyle={this.props.labelStyle}
        switchStyle={this.props.switchStyle}
      />
    );
  }
}
