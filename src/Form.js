import React, { Component } from "react";
import { View } from "react-native";

export class Form extends Component {
  constructor(props) {
    super(props);

    this.values = {};
  }

  handleFieldFocused(event, inputHandle) {
    this.props.onFocus?.(event, inputHandle);
  }

  handleFieldChange(field_ref, value) {
    const name = typeof field_ref === "function" ? field_ref() : field_ref;
    this.values[name] = value;
    this.props.onChange?.(this.values);
    this.props.onFieldChange?.(name, value);
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
      children: React.Children.map(element.props.children, (child, index) =>
        callback(child, index)
      )
    });
  }

  addPropsToSection(sectionElement, isTestable) {
    const target = isTestable ? sectionElement.props.children : sectionElement;
    const connectedTarget = this.mapChildren(target, columnElement =>
      this.mapChildren(columnElement, (fieldElement, key) =>
        this.addProps(fieldElement, isTestable, key)
      )
    );
    return isTestable
      ? React.cloneElement(sectionElement, { children: connectedTarget })
      : connectedTarget;
  }

  addProps(element, isTestable, key) {
    const target = isTestable ? element.props.children : element;
    const targetWithProps = React.cloneElement(target, {
      key,
      fieldRef: target.ref,
      ref: target.ref,
      onFocus: this.handleFieldFocused.bind(this),
      onChange: this.handleFieldChange.bind(this, target.ref)
    });
    return isTestable
      ? React.cloneElement(element, { children: targetWithProps })
      : targetWithProps;
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
        const isSection = (isTestable ? child.props.children : child).props
          .isSection;
        const formElement = isSection
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
