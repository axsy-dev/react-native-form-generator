import * as React from "react";
import { TTouchableOpacity } from "@axsy-dev/testable";

const TouchableContainer = props => {
  const style = React.useMemo(
    () => ({
      flex: 1,
      flexGrow: 0,
      justifyContent: "center",
      alignItems: "center",
      height: 44,
      minWidth: 44
    }),
    []
  );

  return (
    <TTouchableOpacity style={style} onPress={props.onPress}>
      {props.children}
    </TTouchableOpacity>
  );
};

export { TouchableContainer };
