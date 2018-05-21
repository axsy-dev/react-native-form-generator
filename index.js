'use strict';

import {Form as _Form} from './src/Form';
import {Separator} from './src/fields/Separator';
import {InputField} from './src/fields/InputField';
import {LinkField} from './src/fields/LinkField';
import {SwitchField} from './src/fields/SwitchField';
import {PickerField} from './src/fields/PickerField';
import {DatePickerField} from './src/fields/DatePickerField';
import {TimePickerField} from './src/fields/TimePickerField';
// Following not supported by android / windows
// import {CountDownField} from './src/fields/CountDownField';

import { TestPathContainer } from '@axsy/testable';

const Form = TestPathContainer(_Form, 'Form');

export {
        Form,
        Separator, InputField, LinkField,
        SwitchField, PickerField, DatePickerField, TimePickerField
      }
