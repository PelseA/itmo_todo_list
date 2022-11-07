function localStorageListOf(key, defaultValue = []) {
  const value = localStorage.getItem(key);
  if (value === null) return defaultValue;
  const parsedValue = JSON.parse(value);
  return Array.isArray(parsedValue) ? parsedValue : defaultValue;
}

export {localStorageListOf};