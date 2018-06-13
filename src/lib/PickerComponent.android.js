'use strict';

import React from 'react';
import ReactNative from 'react-native';
let { View, StyleSheet, Picker} = ReactNative;
import {Field} from '../lib/Field';

import { TestPathSegment, TText, TPicker, TPickerItem } from '@axsy/testable';

var PickerItem = Picker.Item;

  export class PickerComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        value: props.value || props.label,
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

      this.setState({value:(value && value!='')?value:this.props.label});

      if(this.props.onChange)      this.props.onChange(value);
      if(this.props.onValueChange) this.props.onValueChange(value);
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
    }
    render(){

      return(
        <TestPathSegment name={`Field[${this.props.fieldRef}]` || 'Picker'}>
          <View><Field
            {...this.props}
            ref='inputBox'
            onPress={this.props.onPress}
            >
            <View style={this.props.containerStyle}
              onLayout={this.handleLayoutChange.bind(this)}>

              <TText tid='Label' style={this.props.labelStyle}>{this.props.label}</TText>
                <TPicker tid='Picker'
                  {...this.props.pickerProps}
                  selectedValue={this.state.value}
                  onValueChange={this.handleValueChange.bind(this)}
                  >
                  {Object.keys(this.props.options).map((value, idx) => (
                    <TPickerItem
                      tid={`PickerItem[${idx}]`}
                      key={value}
                      value={value}
                      label={this.props.options[value]}
                    />
                ), this)}

                </TPicker>


            </View>
            </Field>


        </View>
      </TestPathSegment>
      )
    }

  }
