import React from "react";
import { View, Platform, findNodeHandle } from "react-native";
import { Field } from "./Field.js";
import { TestPathSegment, TText, TTextInput } from "@axsy-dev/testable";
import type {
  TextInputProps,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInput,
  TextInputFocusEventData
} from "react-native";

type ValidationFunction = (
  value: State["value"],
  scope: InputComponent
) => boolean;

type Props = TextInputProps & {
  height: number;
  containerStyle: Record<string, any>;
  isDecimal: boolean;
  numberSeparators: { decimalSeparator: string; groupingSeparator: string };
  validationFunction: ValidationFunction | ValidationFunction[];
  iconLeft?: any;
  iconRight?: any;
  label?: string;
  inputStyle: Record<string, any>;
  labelStyle: Record<string, any>;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  onValidation?: (isValid: boolean) => void;
  onFocus?: (
    event: NativeSyntheticEvent<TextInputFocusEventData>,
    handle: ReturnType<typeof findNodeHandle>
  ) => void;
};

type State = {
  labelWidth: number;
  value: TextInputProps["value"];
  minFieldHeight: number;
  inputHeight: number;
  displayValue: string;
  isValid: boolean;
};

function validateEmail(email: State["value"]) {
  if (!email) {
    return "Invalid email";
  }

  var re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email)) {
    return true;
  }

  return "Invalid email";
}

const DefaultNumberFormats: Props["numberSeparators"] = {
  decimalSeparator: ".",
  groupingSeparator: ","
};

export class InputComponent extends React.Component<Props, State> {
  static defaultProps: Pick<Props, "isDecimal" | "numberSeparators"> = {
    isDecimal: false,
    numberSeparators: {
      decimalSeparator: DefaultNumberFormats.decimalSeparator,
      groupingSeparator: DefaultNumberFormats.groupingSeparator
    }
  };

  state: State;
  validationErrors: boolean | string[] = [];
  valid = true;
  inputBox: React.LegacyRef<TextInput> | null = null;

  constructor(props: Props) {
    super(props);

    this.validate(props.value);

    this.state = {
      labelWidth: 0,
      value: props.value,
      minFieldHeight: props.height || 44,
      inputHeight: Math.max(props.height || 44),
      displayValue: props.value || "",
      isValid: true
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.state.value !== nextProps.value) {
      this.handleChange(nextProps.value || "");
    }
  }

  setValue = (value: string) => {
    this.setState({ value: value });
    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onValueChange) this.props.onValueChange(value);
  };

  focus = () => {
    this.inputBox?.focus();
  };

  triggerValidation = () => {
    this.setState({ isValid: this.validate(this.state.value) });
  };

  validate = (value: State["value"]): boolean => {
    let validationResult;
    this.validationErrors = [];

    if (!!this.props.validationFunction) {
      if (Array.isArray(this.props.validationFunction)) {
        /*
          validationFunction has to return an object in case of error,
          true in case of successful validation
         */
        this.props.validationFunction.forEach(valFn => {
          let validationResult = valFn(value, this);
          if (validationResult === true) {
            this.valid = this.valid !== false ? validationResult : this.valid;
          } else {
            this.validationErrors.push(validationResult);
            this.valid = false;
          }
        });
      } else {
        let validationResult = this.props.validationFunction(value, this);
        if (validationResult === true) {
          this.valid = true;
        } else {
          this.validationErrors.push(validationResult);
          this.valid = false;
        }
      }
    } else if (this.props.keyboardType) {
      switch (this.props.keyboardType) {
        case "email-address":
          validationResult = validateEmail(value);
          break;
      }
      if (validationResult === true) {
        this.valid = true;
      } else {
        this.validationErrors.push(validationResult);
        this.valid = false;
      }
    }
    this.props.onValidation?.(this.valid, this.validationErrors);

    return this.valid;
  };

  handleLayoutChange = (e: LayoutChangeEvent) => {
    if (Platform.OS === "ios") {
      let { x, y, width, height } = { ...e.nativeEvent.layout };

      this.setState(e.nativeEvent.layout);
    }
  };

  handleLabelLayoutChange = e => {
    if (Platform.OS === "ios") {
      let { x, y, width, height } = { ...e.nativeEvent.layout };

      this.setState({ labelWidth: width });
    }
  };

  handleChangeFromInput  = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    this.handleChange(event.nativeEvent.text);
    this.setState({
        inputHeight: Math.max(
          this.state.minFieldHeight,
          event.nativeEvent.contentSize && this.props.multiline
            ? event.nativeEvent.contentSize.height
            : 0
        )
      });
  }

  handleChange = (value: string) => {

    if (value === this.state.displayValue) {
      // Skip changeEvent if value is unchanged
      return;
    }

    let displayValue: string | undefined = undefined;

    if (this.props.isDecimal) {
      const localedValues = this.handleLocale(value);
      value = localedValues.converted;
      displayValue = localedValues.display;
    }

    this.validate(value);

    this.setState({
      value,
      displayValue: displayValue ?? value
    });

    this.props.onChange?.(value, this.valid);
    this.props.onValueChange?.(value, this.valid);
  };

  private handleLocale = (value: string) => {
    const { decimalSeparator, groupingSeparator } = this.props.numberSeparators;
    const {
      decimalSeparator: defaultDecimal,
      groupingSeparator: defaultGrouping
    } = DefaultNumberFormats;

    let converted = value;

    if (decimalSeparator !== defaultDecimal) {
      // Here we swap , and . to form a correct decimal
      // e.g. for a european number: 120.000,99 would become 120,000.99
      converted = value
        .replace(groupingSeparator, "___")
        .replace(decimalSeparator, defaultDecimal)
        .replace("___", defaultGrouping);
    }

    return {
      display: value,
      converted: converted.replace(defaultGrouping, "") // Ensure a valid parsable number
    };
  };

  _scrollToInput = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (this.props.onFocus) {
      const handle = findNodeHandle(this);
      this.props.onFocus(event, handle);
    }
  };

  handleFieldPress = event => {
    this.inputBox?.focus();
  };

  render() {
    return (
      <TestPathSegment name={`Field[${this.props.fieldRef}]` || "Input"}>
        <Field {...this.props}>
          <View
            onLayout={this.handleLayoutChange}
            style={this.props.containerStyle}
          >
            {this.props.iconLeft ? this.props.iconLeft : null}
            {this.props.label ? (
              <TText
                tid="Label"
                style={this.props.labelStyle}
                onLayout={this.handleLabelLayoutChange}
                onPress={this.handleFieldPress}
                suppressHighlighting={true}
              >
                {this.props.label}
              </TText>
            ) : null}
            <TTextInput
              {...this.props}
              handleRef={ref => (this.inputBox = ref)}
              tid="TextInput"
              keyboardType={this.props.keyboardType}
              style={this.props.inputStyle}
              onChange={this.handleChangeFromInput}
              onFocus={this._scrollToInput}
              placeholder={this.props.placeholder}
              value={this.state.displayValue}
            />
            {this.props.iconRight ? this.props.iconRight : null}
          </View>
        </Field>
      </TestPathSegment>
    );
  }
}
