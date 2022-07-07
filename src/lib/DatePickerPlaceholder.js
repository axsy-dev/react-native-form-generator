import * as React from "react";
import { Text } from "react-native";

const DatePickerPlaceholder = props => (
  <Text testID={`${props.tidRoot ?? ""}/Placeholder`} style={props.placeholderStyle}>
    {props.placeholder}
  </Text>
);

export { DatePickerPlaceholder };
