"use strict";

import React from "react";

import { SwitchComponent } from "../lib/SwitchComponent";

export class SwitchField extends React.Component {
  setValue(value) {
    this.refs.fieldComponent.setValue(value);
  }
  render() {
    return (
      <SwitchComponent
        {...this.props}
        ref="fieldComponent"
        containerStyle={this.props.containerStyle}
        labelStyle={this.props.labelStyle}
        switchStyle={this.props.switchStyle}
      />
    );
  }
}
