type ValidatorType = 'size' | 'color' | 'number' | 'boolean' | 'label' | 'stringarray';

export function validateValue(type: ValidatorType, value: any): any {

  switch (type) {

    case 'size':
      return isValidSize(value) ? value : 'auto';

    case 'color':
      return isValidColor(value) ? value : undefined;

    case 'number':
      return isValidNumber(value) ? value : 0;

    case 'boolean':
      return toBoolean(value);

    case 'label':
        return sanitizeLabel(value);

    case 'stringarray':
        return sanitizeStringArray(value);

    default:
      return value;
  }
}

function sanitizeStringArray(value: any): string[] {

  if (!Array.isArray(value)) {
    return [];
  }

  const MAX_ITEMS = 50;
  const MAX_LENGTH = 50;

  return value
    .map(item => {
      if (item === null || item === undefined) return '';

      let str = String(item).trim();

      // limit length
      if (str.length > MAX_LENGTH) {
        str = str.substring(0, MAX_LENGTH);
      }

      // remove unsafe chars
      str = str.replace(/[<>]/g, '');

      return str;
    })
    .filter(str => str.length > 0)   // remove empty
    .slice(0, MAX_ITEMS);            // limit array size
}

// 🔹 Size
function isValidSize(value: string): boolean {
  const size = /^(\d+(\.\d+)?)(px|%|em|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc)$/;
  
  // const cssVar = /^var\(--[a-zA-Z0-9-_]+\)$/;
  
  return size.test(value) ;  // || cssVar.test(value);
}

// 🔹 Color
function isValidColor(value: string): boolean {
  const named = /^[a-zA-Z]+$/;
  const hex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  const rgb = /^rgb\(.+\)$/;
  const rgba = /^rgba\(.+\)$/;
  const hsl = /^hsl\(.+\)$/;
  const hsla = /^hsla\(.+\)$/;
  // const cssVar = /^var\(--[a-zA-Z0-9-_]+\)$/;

  return named.test(value) || hex.test(value) || rgb.test(value) ||
         rgba.test(value) || hsl.test(value) || hsla.test(value); // cssVar.test(value);
}

// 🔹 Number
function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

// 🔹 Boolean (SMART PARSER)
function toBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;

  if (typeof value === 'string') {
    const v = value.toLowerCase().trim();
    return v === 'true' || v === '1' || v === 'yes';
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  return false;
}

function sanitizeLabel(value: any, maxLength = 100): string {

  if (value === null || value === undefined) {
    return '';
  }

  let str = String(value);

  // Limit length
  if (str.length > maxLength) {
    str = str.substring(0, maxLength);
  }

  // Allow safe characters only
  str = str.replace(/[^a-zA-Z0-9\s.,\-_()]/g, '');

  return str;
}

export function ValidateInput(type: 'size' | 'color' | 'number' | 'boolean' | 'label' | 'stringarray') {
  return function (target: any, propertyKey: string) {

    const privateKey = `__${propertyKey}`;

    Object.defineProperty(target, propertyKey, {

      set(value: any) {
        this[privateKey] = validateValue(type, value);
      },

      get() {
        return this[privateKey];
      },

      enumerable: true,
      configurable: true
    });
  };
}