import * as React from "react";
import { TTouchableOpacity } from "@axsy-dev/testable";

const style = {
  flex: 1,
  flexGrow: 0,
  justifyContent: "center",
  alignItems: "center",
  height: 44,
  minWidth: 44
};

const TouchableContainer = props => (
  <TTouchableOpacity tid={props.tid} style={style} onPress={props.onPress}>
    {props.children}
  </TTouchableOpacity>
);

export { TouchableContainer };
