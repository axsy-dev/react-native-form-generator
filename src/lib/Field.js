"use strict";

import React from "react";
import PropTypes from "prop-types";
import { HelpText } from "./HelpText";
import { View, TouchableOpacity } from "react-native";

export class Field extends React.Component {
  render() {
    let fieldHelpText =
      this.props.helpTextComponent ||
      (this.props.helpText ? (
        <HelpText text={this.props.helpText} color={this.props.helpTextColor} />
      ) : null);

    if (this.props.onPress) {
      return (
        <TouchableOpacity onPress={this.props.onPress} testID="TapTarget" accessible={false}>
          <View>
            {this.props.children}
            {fieldHelpText}
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View testID="Wrapper">
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
