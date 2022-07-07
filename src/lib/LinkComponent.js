"use strict";

import React from "react";
let { View, StyleSheet, Text, ViewPropTypes } = require("react-native");
import { Field } from "./Field";
export class LinkComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleLayoutChange(e) {
    let { x, y, width, height } = { ...e.nativeEvent.layout };

    this.setState(e.nativeEvent.layout);
  }

  render() {
    const { tidRoot } = this.props;
    return (
      <Field {...this.props}>
        <View
          style={this.props.containerStyle}
          onLayout={this.handleLayoutChange.bind(this)}
        >
          {this.props.iconLeft ? this.props.iconLeft : null}
          <Text testID={`${tidRoot ?? ""}/Label`} style={this.props.labelStyle}>
            {this.props.label}
          </Text>

          {this.props.iconRight ? this.props.iconRight : null}
        </View>
      </Field>
    );
  }
}

LinkComponent.propTypes = {
  labelStyle: Text.propTypes.style,
  containerStyle: ViewPropTypes.style
};
