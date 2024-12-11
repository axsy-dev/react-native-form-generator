"use strict";

import React from "react";

import { SwitchComponent } from "../lib/SwitchComponent";

export class SwitchField extends React.Component {
  constructor(props) {
    super(props);
    this.switchFieldRef = React.createRef();
  }
  setValue(value) {
    if (this.switchFieldRef.current) {
      this.switchFieldRef.current.setValue(value);
    }
  }
  render() {
    return (
      <SwitchComponent
        {...this.props}
        ref={this.switchFieldRef}
        containerStyle={this.props.containerStyle}
        labelStyle={this.props.labelStyle}
        switchStyle={this.props.switchStyle}
      />
    );
  }
}
