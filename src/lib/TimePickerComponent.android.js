'use strict';


import React from 'react';
let { View, StyleSheet, TextInput, Text, TimePickerAndroid} = require('react-native');
import {Field} from './Field';


  export class TimePickerComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        date: props.date? new Date(props.date) :'',
        isPickerVisible: false
      }

    }

    handleLayoutChange(e){
      let {x, y, width, height} = {... e.nativeEvent.layout};

      this.setState(e.nativeEvent.layout);
      //e.nativeEvent.layout: {x, y, width, height}}}.
    }

    handleValueChange(date){

      this.setState({date:date});

      if(this.props.onChange)      this.props.onChange(date);
      if(this.props.onValueChange) this.props.onValueChange(date);
    }

    setTime(date){
      this.setState({date:date});
      if(this.props.onChange)      this.props.onChange((this.props.prettyPrint)?this.props.dateTimeFormat(date):date);
      if(this.props.onValueChange) this.props.onValueChange(date);
    }

    async _togglePicker(event){
      try {
        const {action, hour, minute} = await TimePickerAndroid.open({...this.props.options});
        if (action !== TimePickerAndroid.dismissedAction) {
          let date = new Date(0,0,0,hour, minute);

          this.handleValueChange(date);
          // Selected year, month (0-11), day
        }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
      }


    }
    render(){
      let timeValue =this.props.dateTimeFormat(this.state.date);
      let placeholderComponent = (this.props.placeholderComponent)
                        ? this.props.placeholderComponent
                        : <Text style={this.props.placeholderStyle}>{this.props.placeholder}</Text>
      return(<View><Field
        {...this.props}
        ref='inputBox'
        onPress={this._togglePicker.bind(this)}>
        <View style={this.props.containerStyle}
          onLayout={this.handleLayoutChange.bind(this)}>

          {placeholderComponent}
          <View style={formStyles.horizontalContainer}>
            <Text style={this.props.valueStyle}>{
            (this.state.date)?this.state.date.toLocaleDateString():""
          }</Text>


          </View>
          {(this.props.iconRight)
              ? this.props.iconRight
              : null
            }
        </View>
        </Field>
        {(this.state.isPickerVisible)?
          <DatePickerAndroid
            {...this.props}
           date={this.state.date || new Date()}

           onDateChange={this.handleValueChange.bind(this)}
         />

        : null
      }

    </View>
      )
    }

  }
  TimePickerComponent.propTypes = {
    dateTimeFormat: React.PropTypes.func,
    prettyPrint: React.PropTypes.bool
  }

  TimePickerComponent.defaultProps = {
    dateTimeFormat: (date)=>{
      if(!date) return "";
      return date.toLocaleTimeString();
    }
  };
