"use strict";

import React from "react";
import PropTypes from "prop-types";

import { View, StyleSheet, Text } from "react-native";
export class HelpText extends React.Component {
  render() {
    const { text, color } = this.props;
    if (!text) return null;

    const textColor = !!color ? { color } : {};
    return (
      <View style={formStyles.helpTextContainer}>
        <Text testID="HelpText" style={[formStyles.helpText, textColor]}>
          {text}
        </Text>
      </View>
    );
  }
}

HelpText.propTypes = {
  text: PropTypes.string
};

let formStyles = StyleSheet.create({
  helpTextContainer: {
    marginTop: 9,
    marginBottom: 25,
    paddingLeft: 20,
    paddingRight: 20
  },
  helpText: {
    color: "#7a7a7a"
  }
});
