function disabledButtonWhenTextInvalid(
  button,
  text,
  validateTextFunction,
  { textWhenEnabled, textWhenDisabled } = {}
) {
  if (!validateTextFunction) throw  new Error('Validate method must be defined');
  if (validateTextFunction(text)) {
    button.disabled = false;
    if (textWhenEnabled) button.textContent = textWhenEnabled;
  } else {
    button.disabled = false;
    if (textWhenDisabled) button.textContent = textWhenDisabled;
  }
}

export { disabledButtonWhenTextInvalid };