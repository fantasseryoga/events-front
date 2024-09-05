export function cleanObject (obj: Record<string, any>): Record<string, any> {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== "" &&
      (Array.isArray(value) ? value.length > 0 : true)) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
};