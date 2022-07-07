"use strict";

import React from "react";
import PropTypes from "prop-types";
import { HelpText } from "./HelpText";
let { View, StyleSheet, TouchableOpacity } = require("react-native");

export class Field extends React.Component {
  render() {
    const { tidRoot } = this.props;
    let fieldHelpText =
      this.props.helpTextComponent ||
      (this.props.helpText ? (
        <HelpText tidRoot={tidRoot} text={this.props.helpText} color={this.props.helpTextColor} />
      ) : null);

    if (this.props.onPress) {
      return (
        <TouchableOpacity onPress={this.props.onPress} testID={`${tidRoot ?? ""}/TapTarget`}>
          <View>
            {this.props.children}
            {fieldHelpText}
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View testID={`${tidRoot ?? ""}/Wrapper`}>
        {this.props.children}
        {fieldHelpText}
      </View>
    );
  }
}
Field.propTypes = {
  helpTextComponent: PropTypes.element,
  helpText: PropTypes.string
};
