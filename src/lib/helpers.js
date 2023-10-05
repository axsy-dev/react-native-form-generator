/**
 * Truncate a date object when using date mode.
 */
function formatDateResult(date, mode) {
  return mode === "date"
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
    : date;
}

/**
 * Convert missing date to current date then format.
 */
function normalizeAndFormat(props) {
  const { date, mode } = props;
  const dateNormalized = date ? new Date(date) : new Date();
  return formatDateResult(dateNormalized, mode);
}

/**
 * Formats a date if pretty print is specified.
 */
function formatOnPretty(date, props) {
  const { prettyPrint, dateTimeFormat } = props;
  return prettyPrint ? dateTimeFormat(date) : date;
}

/**
 * If an onValueChange handler exists then invoke it with the date.
 * If an onChange handler exists then invoke it with a formatted date.
 */
function handleSetDate(date, props) {
  const { onChange, onValueChange } = props;

  if (onChange) {
    const value = formatOnPretty(date, props);

    onChange(value);
  }
  if (onValueChange) {
    onValueChange(date);
  }
}

function dateTimeFormat(date, mode) {
  if (!date) {
    return "";
  }

  switch (mode) {
    case "datetime":
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    case "time":
      return date.toLocaleTimeString();
    case "countdown":
      return date.getHours() + ":" + date.getMinutes();
    case "date":
    default:
      return date.toLocaleDateString();
  }
}

/**
 * A picklist value can be null or 0-many values either in a string separated by a semicolon or an array.
 * 
 * This will return the value as an array - null is turned into an empty array.
 */
function normalisePicklistValue(value){
  return Array.isArray(value)
      ? value
      : !value || value === ""
      ? []
      : value.split(";");
}

module.exports = {
  formatDateResult,
  normalizeAndFormat,
  handleSetDate,
  dateTimeFormat,
  formatOnPretty,
  normalisePicklistValue
};
