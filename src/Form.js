import React, { Component } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    ScrollView,
    Text,
    SliderIOS,
    TouchableWithoutFeedback
} from 'react-native';

export class Form extends Component {
    constructor(props) {
        super(props);

        this.values = {};
    }

    handleFieldFocused(event, inputHandle) {
        this.props.onFocus && this.props.onFocus(event, inputHandle);
    }

    handleFieldChange(field_ref, value) {
        if (typeof field_ref === 'function') {
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
        var words = str.split('_');  
        var res=[];

        words.map(function(word, i) {
          res.push(word.charAt(0).toUpperCase() + word.slice(1));
        });

        return res.join(' ');
    }

    render() {
        let wrappedChildren = [];

        React.Children.map(this.props.children, (child, i) => {
            if (!child) {
                return;
            }

    
            const { isTestWrapped } = child.props;
            
            let testableComponent = isTestWrapped ? child.props.testableComponent : child; 

            testableComponent = React.cloneElement(testableComponent, {
                key: testableComponent.props.fieldKey ? testableComponent.props.fieldKey : testableComponent.type+i,
                fieldRef : testableComponent.ref,
                ref: testableComponent.ref,
                onFocus:this.handleFieldFocused.bind(this),
                onChange:this.handleFieldChange.bind(this, testableComponent.ref)
            })

            if(isTestWrapped){
                child = React.cloneElement(child, {
                    children: testableComponent
                })
            }

            wrappedChildren.push(child);
        }, this);

        return (
        <View style={this.props.style}>
            {wrappedChildren}
        </View>
        );
    }
}
