import React, { Component } from "react";
import { Text, View } from "react-native";

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

  mapChildren(element, callback) {
    return React.cloneElement(element, {
      children: React.Children.map(element.props.children, callback)
    });
  }

  addPropsToSection(sectionElement, isTestable) {
    return this.mapChildren(sectionElement, columnElement =>
      this.mapChildren(columnElement, (fieldElement, key) =>
        this.addProps(fieldElement, isTestable, key)
      )
    );
  }

  addProps(element, isTestable, key) {
    const target = isTestable ? element.props.children : element;
    const fieldName =
      target.props.fieldRef ??
      target.props.fieldKey ??
      target.props?.field?.name ??
      "unknown-field-name";
    return React.cloneElement(target, {
      key,
      fieldRef: target.ref,
      ref: target.ref,
      onFocus: this.handleFieldFocused.bind(this),
      onChange: this.handleFieldChange.bind(this, fieldName)
    });
  }

  render() {
    let wrappedChildren = [];

    React.Children.map(
      this.props.children,
      (child, key) => {
        if (!child) {
          return;
        }
        const isTestable = this.props.hasTestableWrappers === true;
        const formElement = child.props.isSection
          ? this.addPropsToSection(child, isTestable)
          : this.addProps(child, isTestable, key);
        wrappedChildren.push(formElement);
      },
      this
    );

    return (
      <View testID="Form" style={this.props.style}>
        {wrappedChildren}
      </View>
    );
  }
}
