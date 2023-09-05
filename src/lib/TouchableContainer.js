import * as React from "react";
import { TouchableOpacity } from "react-native";

const style = {
  flex: 1,
  flexGrow: 0,
  justifyContent: "center",
  alignItems: "center",
  height: 44,
  minWidth: 44
};

const TouchableContainer = props => (
  <TouchableOpacity testID={props.tid} style={style} onPress={props.onPress} accessible={false}>
    {props.children}
  </TouchableOpacity>
);

export { TouchableContainer };
