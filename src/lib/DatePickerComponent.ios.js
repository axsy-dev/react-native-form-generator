'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TextInput, Text, DatePickerIOS}  from 'react-native';
import {Field} from './Field';


export class DatePickerComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isPickerVisible: false
    }
  }

  componentDidMount() {
    const { date } = this.props;

    this.setState({date: date ? new Date(date) : new Date()});
  }

  setDate(date){
    this.setState({date:date});

    if(this.props.onChange)      this.props.onChange((this.props.prettyPrint)?this.props.dateTimeFormat(date):date);
    if(this.props.onValueChange) this.props.onValueChange(date);
  }
  handleLayoutChange(e){
    let {x, y, width, height} = {... e.nativeEvent.layout};

    this.setState(e.nativeEvent.layout);
  }

  handleValueChange(date){

    this.setState({date:date});

    this.props.onChange && this.props.onChange((this.props.prettyPrint)?this.props.dateTimeFormat(date, this.props.mode):date);
    this.props.onValueChange && this.props.onValueChange(date);

  }

  _togglePicker(event){
    this.setState({isPickerVisible:!this.state.isPickerVisible});
    //this._scrollToInput(event);
    this.props.onPress && this.props.onPress(event);
  }

  render(){
    let { maximumDate,    minimumDate,
          minuteInterval, mode,
          onDateChange,   timeZoneOffsetInMinutes } = this.props;

    let  valueString = this.props.dateTimeFormat(this.state.date, this.props.mode);

    let datePicker= <DatePickerIOS
      maximumDate = {maximumDate}
      minimumDate = {minimumDate}
      minuteInterval = {minuteInterval}
      mode = {mode}
      timeZoneOffsetInMinutes = {timeZoneOffsetInMinutes}
      date = {this.state.date || new Date()}
      onDateChange = {this.handleValueChange.bind(this)}
    />

    let pickerWrapper = React.cloneElement(this.props.pickerWrapper,{onHidePicker:()=>{this.setState({isPickerVisible:false})}},datePicker);

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
    let placeholderComponent = (this.props.placeholderComponent)
                      ? this.props.placeholderComponent
                      : <Text style={this.props.placeholderStyle}>{this.props.placeholder}</Text>
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
          {placeholderComponent}
          <View style={[formStyles.alignRight, formStyles.horizontalContainer, this.props.valueContainerStyle]}>
            <Text style={[formStyles.fieldValue,this.props.valueStyle ]}>{ valueString }</Text>

            {(iconRight)
              ? iconRight
              : null
            }
          </View>

        </View>
      </Field>
      {(this.state.isPickerVisible)?
        pickerWrapper : null
      }

    </View>
  )
}

}

DatePickerComponent.propTypes = {
  dateTimeFormat: PropTypes.func,
  pickerWrapper: PropTypes.element,
  prettyPrint: PropTypes.bool
}

DatePickerComponent.defaultProps = {
  pickerWrapper: <View/>,
  dateTimeFormat: (date, mode)=>{
    if(!date) return "";
    let value='';
    switch(mode){
      case 'datetime':
       value = date.toLocaleDateString()
              + ' '
              + date.toLocaleTimeString()
      break;
      case 'time':
        value = date.toLocaleTimeString()
      break;
        case 'countdown':
            value = date.getHours() + ":" + date.getMinutes();
            break;
      default:
        value = date.toLocaleDateString()
    }
    return value;
  }
};
