'use strict';

import React from 'react';
import { DatePickerComponent } from '../lib/DatePickerComponent';

export class DatePickerField extends React.Component{
    setDate(date) {
        this.refs.datePickerComponent.setDate(date);
    }
    
    render() {
        return (
            <DatePickerComponent
              ref='datePickerComponent'
              {...this.props}
              labelStyle={this.props.labelStyle}
              valueStyle = {this.props.valueStyle}
              valueContainerStyle = {this.props.valueContainerStyle}
              containerStyle={this.props.containerStyle}
              />
        )
    }

  }