import * as React from "react";
import { Text } from "react-native";

const DatePickerPlaceholder = props => (
  <Text testID={`Label`} style={props.placeholderStyle}>
    {props.placeholder}
  </Text>
);

export { DatePickerPlaceholder };
