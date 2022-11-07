function isStringNotNumberAndNotEmpty(value) {
  const isValueString = typeof value === 'string';
  const isValueNotOnlyNumber = !/^(\s+)?\d+(\s+)?$/.test(value.trim());
  return isValueString && isValueNotOnlyNumber && value.length > 0;
}

export {isStringNotNumberAndNotEmpty};