'use strict';

import React, { Component } from 'react';

import {
    View,
    Text,
    Picker
} from 'react-native'

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';

const moment = extendMoment(Moment);

function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

class DateSelector extends Component {
    _renderPickerItems() {
        const { minimumDate, maximumDate } = this.props;

        const range = moment.range(minimumDate, maximumDate);

        const days = Array.from(range.by('days')).map((day) => {
            const date = day.format('YYYY-MM-DD');
            const dateFormat = day.format('ddd MMM D');
            return {label: dateFormat, value: date}
        });

        return days.map((day) => {
            return <Picker.Item key={`date-${day.value}`} label={day.label} value={day.value} />;
        });
    }

    render() {
        return (
            <Picker
                style={{flex: 1, height: 50, maxWidth: 120}}
                selectedValue={this.props.selectedDate}
                onValueChange={(date) => this.props.onChange(date)}>
                {this._renderPickerItems()}
            </Picker>
        );
    }
}

class TimeSelector extends Component {
    state: {
        hours: 'string',
        minutes: 'string',
        ampm: 'string'
    };

    constructor(props: Object) {
        super(props);

        this.state = {
            hours: '',
            minutes: '',
            ampm: ''
        }
    }

    componentWillMount() {
        const { selectedTime } = this.props;
        
        if (selectedTime) {
            const m = moment(selectedTime, 'h:mm A');
            const hour = m.hour();
            const hours = hour > 12 ? hour - 12 : hour;
            const minutes = m.minute();
            const ampm = hour > 12 ? 'PM' : 'AM';

            this.setState({hours: String(hours), minutes: String(minutes), ampm});
        }
    }

    _renderMinutes() {
        const { minuteSelector } = this.props;
        const minuteInterval = minuteSelector && minuteSelector !== undefined ? minuteSelector : 1;
        const minutes = _.range(0, 60, minuteInterval);
        return minutes.map((minute) => {
            let min = str_pad_left(minute, '0', 2);
            return <Picker.Item key={`minute-${minute}`} label={min} value={min} />;
        });
    }

    _renderHours() {
        const hours = _.range(1, 13);
        return hours.map((hour) => {
            let h = String(hour);
            return <Picker.Item key={`hour-${hour}`} label={h} value={h} />;
        });
    }

    _renderAMPM() {
        const AMPM = ['AM', 'PM'];

        return AMPM.map((meridiem) => {
            return <Picker.Item key={`${meridiem}`} label={meridiem} value={meridiem} />;
        });
    }

    _constructTime() {
        const { hours, minutes, ampm } = this.state;
        const time = `${hours}:${minutes} ${ampm}`;

        this.props.onChange(time);
    }

    _onHourChange(hour: string) {
        this.setState({hours: hour}, this._constructTime);
    }

    _onMinuteChange(minute: string) {
        this.setState({minutes: minute}, this._constructTime);
    }

    _onAmPmChange(meridiem: string) {
        this.setState({ampm: meridiem}, this._constructTime);
    }

    render() {
        const { hours, minutes, ampm } = this.state;

        return (
            <View style={{flex: 1, height: 50, flexDirection: 'row'}}>
                <Picker
                    style={{flex: 1, height: 50}}
                    selectedValue={hours}
                    onValueChange={(hour) => this._onHourChange(hour)}>
                    {this._renderHours()}
                </Picker>
                <Picker
                    selectedValue={minutes}
                    style={{flex: 1, height: 50}}
                    onValueChange={(minute) => this._onMinuteChange(minute)}>
                    {this._renderMinutes()}
                </Picker>
                <Picker
                    selectedValue={ampm}
                    style={{flex: 1, height: 50}}
                    onValueChange={(meridiem) => this._onAmPmChange(meridiem)}>
                    {this._renderAMPM()}
                </Picker>
            </View>
        );
    }
}

class DateTimeSelector extends Component {
    state: {
        selectedDate: '',
        selectedTime: '',
        setDate: null
    };

    constructor(props: Object) {
        super(props);

        this.state = {
            selectedTime: '',
            selectedDate: '',
            setDate: null
        }
    }

    componentWillMount() {
        const { date } = this.props;

        if (date) {
            const m = moment(date);

            const selectedDate = m.format('YYYY-MM-DD');
            const selectedTime = m.format('h:mm A');
            const setDate = m.format('MMMM DD, YYYY, h:mm A');

            this.setState({selectedDate, selectedTime, setDate});
        }
    }

    _setDate(selectedDate: string) {
        this.setState({selectedDate}, this._setDateResult);
    }

    _setTime(selectedTime: string) {
        this.setState({selectedTime}, this._setDateResult);
    }

    _setDateResult() {
        const { selectedDate, selectedTime } = this.state;
        const setDate = moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD h:mm A').toDate();

        this.setState({setDate}, this._updateResult);
    }

    _updateResult() {
        this.props.onDateChange && this.props.onDateChange(this.state.setDate);
    }

    render() {
        const { minimumDate, maximumDate, minuteSelector, mode, date, timeZoneOffsetInMinutes, onDateChange } = this.props;
        const { selectedDate, selectedTime, setDate } = this.state;

        if (mode !== 'datetime') {
            console.warn("Only 'datetime' mode is supported at the moment");
        }

        if (timeZoneOffsetInMinutes) {
            console.warn("'timeZoneOffsetInMinutes' property is not supported on Windows (yet)")
        }

        return (
            <View style={{height: 50, minWidth: 350, backgroundColor: '#fff', flexDirection: 'row'}}>
                <DateSelector minimumDate={minimumDate}
                              maximumDate={maximumDate}
                              selectedDate={selectedDate || moment().format('YYYY-MM-DD')}
                              onChange={this._setDate.bind(this)}/>
                <TimeSelector minimumDate={minimumDate}
                              maximumDate={maximumDate}
                              minuteSelector={minuteSelector}
                              selectedTime={selectedTime || moment().format('h:mm A')}
                              onChange={this._setTime.bind(this)}/>                              
            </View>
        );
    }
}

export default DateTimeSelector;
