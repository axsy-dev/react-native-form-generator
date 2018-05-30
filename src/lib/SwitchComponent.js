'use strict';

import React from 'react';
let { View, StyleSheet, Text, Switch, ViewPropTypes } = require('react-native');

import { Field } from './Field';

import { TestPathSegment } from '@axsy/testable';

export class SwitchComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          value: props.value
        }
    }

    handleLayoutChange(e) {
        let {x, y, width, height} = {... e.nativeEvent.layout};

        this.setState(e.nativeEvent.layout);
    }

    setValue(value) {
        this.setState({value:value});
        if (this.props.onChange)      this.props.onChange(value);
        if (this.props.onValueChange) this.props.onValueChange(value);
    }

    handleValueChange(value) {
        this.setState({value:value});

        if (this.props.onChange)      this.props.onChange(value);
        if (this.props.onValueChange) this.props.onValueChange(value);
    }


    render() {
        return (
            <TestPathSegment name={`Field[${this.props.fieldRef}]` || 'Switch'}>
                <Field {...this.props}>
                    <View style={this.props.containerStyle}
                        onLayout={this.handleLayoutChange.bind(this)}>
                        <Text style={this.props.labelStyle}>{this.props.label}</Text>
                    <Switch
                        onValueChange={this.handleValueChange.bind(this)}
                        style={this.props.switchStyle}
                        value={this.state.value} />
                    </View>
                </Field>
            </TestPathSegment>
        )
    }
}

SwitchComponent.propTypes = {
    labelStyle: Text.propTypes.style,
    containerStyle: ViewPropTypes.style,
    switchStyle: Switch.propTypes.style
}
