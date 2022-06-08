import * as React from "react";
import { TText } from "@axsy-dev/testable";

const DatePickerPlaceholder = props => (
  <TText tid="Placeholder" style={props.placeholderStyle}>
    {props.placeholder}
  </TText>
);

export { DatePickerPlaceholder };
