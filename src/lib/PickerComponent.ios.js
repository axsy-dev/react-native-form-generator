'use strict';

import React from 'react';
import ReactNative from 'react-native';
let { View, StyleSheet, TextInput, Text, Picker} = ReactNative;
import {Field} from '../lib/Field';

var PickerItem = Picker.Item;

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

    handleValueChange(value){

      this.setState({value:value});

      if(this.props.onChange)      this.props.onChange(value);
      if(this.props.onValueChange) this.props.onValueChange(value);
      if(this.props.autoclose)     this._togglePicker();
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
    _togglePicker(event){
        this.setState({isPickerVisible:!this.state.isPickerVisible});
        this.props.onPress && this.props.onPress(event);
    }

    render(){
      let picker = <Picker ref='picker'
        {...this.props.pickerProps}
        selectedValue={this.state.value}
        onValueChange={this.handleValueChange.bind(this)}
        mode='dropdown'
        >
        {Object.keys(this.props.options).map((value) => (
          <PickerItem
            key={value}
            value={value}
            label={this.props.options[value]}
          />
      ), this)}

      </Picker>;
      let pickerWrapper = React.cloneElement(this.props.pickerWrapper,{ onHidePicker:()=>{this.setState({isPickerVisible:false})}}, picker);
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
      return(<View><Field
        {...this.props}
        ref='inputBox'
        onPress={this._togglePicker.bind(this)}>
        <View style={this.props.containerStyle}
          onLayout={this.handleLayoutChange.bind(this)}>
          {(iconLeft)
            ? iconLeft
            : null
          }
          <Text style={this.props.labelStyle}>{this.props.label}</Text>
          <View style={this.props.valueContainerStyle}>
            <Text style={this.props.valueStyle}>
              {(this.state.value)?this.props.options[this.state.value]:''}
            </Text>

          </View>
          {(this.props.iconRight)
              ? this.props.iconRight
              : null
            }

        </View>
        </Field>
        {(this.state.isPickerVisible)?
          pickerWrapper : null
        }

    </View>
      )
    }

  }

  PickerComponent.propTypes = {
    pickerWrapper: React.PropTypes.element,
  }

  PickerComponent.defaultProps = {
    pickerWrapper: <View/>
  }
