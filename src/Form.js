import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  SliderIOS,
  TouchableWithoutFeedback
} from "react-native";

export class Form extends Component {
  constructor(props) {
    super(props);

    this.values = {};
  }

  handleFieldFocused(event, inputHandle) {
    this.props.onFocus && this.props.onFocus(event, inputHandle);
  }

  handleFieldChange(field_ref, value) {
    if (typeof field_ref === "function") {
      const ref = field_ref && field_ref();
      this.values[ref] = value;
    } else {
      this.values[field_ref] = value;
    }

    this.props.onChange && this.props.onChange(this.values);
  }

  getValues() {
    return this.values;
  }

  underscoreToSpaced(str) {
    var words = str.split("_");
    var res = [];

    words.map(function (word, i) {
      res.push(word.charAt(0).toUpperCase() + word.slice(1));
    });

    return res.join(" ");
  }

  render() {
    let wrappedChildren = [];

    React.Children.map(
      this.props.children,
      (child, i) => {
        if (!child) {
          return;
        }

        const isTestable = this.props.hasTestableWrappers === true;

        let formElement = isTestable ? child.props.children : child;

        formElement = React.cloneElement(formElement, {
          key: formElement.props.fieldKey
            ? formElement.props.fieldKey
            : formElement.type + i,
          fieldRef: formElement.ref,
          ref: formElement.ref,
          onFocus: this.handleFieldFocused.bind(this),
          onChange: this.handleFieldChange.bind(this, formElement.ref)
        });

        if (isTestable) {
          child = React.cloneElement(child, {
            children: formElement
          });
        } else {
          child = formElement;
        }

        wrappedChildren.push(child);
      },
      this
    );

    return <View style={this.props.style}>{wrappedChildren}</View>;
  }
}
