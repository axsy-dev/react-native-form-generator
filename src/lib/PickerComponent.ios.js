'use strict';

import React from 'react';
import _ from "lodash";
import PropTypes from 'prop-types';
import ReactNative from 'react-native';
let { View, StyleSheet } = ReactNative;
import {Field} from '../lib/Field';

import { TestPathSegment, TText, TPicker, TPickerItem } from '@axsy/testable';

class RenderedSelector extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value
    }
  }

  handleValueChange(value) {
    this.setState({ value: value });

    if (this.props.onChange) this.props.onChange(value);
  }

  render() {
    let picker = <TPicker
      tid='Picker'
      {...this.props.pickerProps}
      selectedValue={this.state.value}
      onValueChange={this.handleValueChange.bind(this)}
      mode='dropdown'
    >
      {this.props.options.map(({value, label}, idx) => (
        <TPickerItem
          tid={`PickerItem[${idx}]`}
          key={value}
          value={value}
          label={label}
        />
      ), this)}
    </TPicker>;

    return React.cloneElement(this.props.pickerWrapper, { onHidePicker: this.props.onHidePicker }, picker);
  }
}

export class PickerComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        value: props.value,
        isPickerVisible: false
      }
      this.pickerMeasures = {};
    }
    setValue(value){
      this.setState({value:value});
      if(this.props.onChange)      this.props.onChange(value);
      if(this.props.onValueChange) this.props.onValueChange(value);
    }
    handleLayoutChange(e){
      let {x, y, width, height} = {... e.nativeEvent.layout};

      this.setState(e.nativeEvent.layout);
    }

    handleValueChange(value) {
      this.setState({ value: value });

      if (this.props.onChange) this.props.onChange(value);
      if (this.props.onValueChange) this.props.onValueChange(value);
    }

    _scrollToInput (event) {
      if (this.props.onFocus) {
        let handle = ReactNative.findNodeHandle(this.refs.inputBox);

        this.props.onFocus(
          event,
          handle
        )
      }
    }

    _renderContent() {
      const picker = <RenderedSelector
        {...this.props}
        value={this.state.value}
        onChange={this.handleValueChange.bind(this)}
        onHidePicker={() => this.setState({ isPickerVisible: false })}
      />

      return picker;
    }

    _togglePicker(event){
      if (this.context.actionSheet) {
        this.context.actionSheet.showContent(this._renderContent(), "done")
      }
      else {
        this.setState({isPickerVisible:!this.state.isPickerVisible});
      }

      this.props.onPress && this.props.onPress(event);
    }

    render(){
      let iconLeft = this.props.iconLeft,
          iconRight = this.props.iconRight;

      if(iconLeft && iconLeft.constructor === Array){
        iconLeft = (!this.state.isPickerVisible)
                    ? iconLeft[0]
                    : iconLeft[1]
      }
      if(iconRight && iconRight.constructor === Array){
        iconRight = (!this.state.isPickerVisible)
                    ? iconRight[0]
                    : iconRight[1]
      }
      const selectedOption = _.find(this.props.options, o => o.value === this.state.value);
      return(
        <TestPathSegment name={`Field[${this.props.fieldRef}]` || 'Picker'}>
          <View><Field
            {...this.props}
            ref='inputBox'
            onPress={this._togglePicker.bind(this)}>
            <View style={this.props.containerStyle}
              onLayout={this.handleLayoutChange.bind(this)}>
              {(iconLeft)
                ? iconLeft
                : null
              }
              <TText tid='Label' style={this.props.labelStyle}>{this.props.label}</TText>
              <View style={this.props.valueContainerStyle}>
                <TText tid='Value' style={this.props.valueStyle}>
                  {selectedOption ? selectedOption.label : ""}
                </TText>

              </View>
              {(this.props.iconRight)
                  ? this.props.iconRight
                  : null
                }

            </View>
            </Field>
            {(this.state.isPickerVisible)?
              this._renderContent() : null
            }

          </View>
        </TestPathSegment>
      )
    }

  }

  PickerComponent.propTypes = {
    pickerWrapper: PropTypes.element,
  }

  PickerComponent.defaultProps = {
    pickerWrapper: <View/>
  }

  PickerComponent.contextTypes = {
    actionSheet: PropTypes.object
  };
