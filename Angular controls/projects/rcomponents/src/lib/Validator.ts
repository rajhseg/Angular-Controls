type ValidatorType = 'size' | 'enum' | 'color' | 'colorarray' | 'colororcolorarray' | 'number' | 'numberarray' | 'boolean' | 'label' | 'stringarray' | 'stringorstringarray';

export function validateValue(type: ValidatorType, value: any, config?: any): any {

  switch (type) {

    case 'size':
      return isValidSize(value) ? value : 'auto';

    case 'enum':
      return validateEnum(value, config);

    case 'color':
      return isValidColor(value) ? value : undefined;

    case 'colororcolorarray':
      return Array.isArray(value) ? getValidColorArray(value) : isValidColor(value) ? value : undefined;

    case 'colorarray':
      return getValidColorArray(value);

    case 'number':
      return isValidNumber(value) ? value : undefined;

    case 'numberarray':
      return getValidNumberArray(value);

    case 'boolean':
      return toBoolean(value);

    case 'label':
        return sanitizeLabel(value);

    case 'stringarray':
        return sanitizeStringArray(value);

    case 'stringorstringarray':
        return Array.isArray(value) ? sanitizeStringArray(value) : sanitizeLabel(value);

    default:
      return undefined;
  }
}

function getValidColorArray(value: string[]): any {
  let colors : any = [];

  for (let index = 0; index < value.length; index++) {
    const element = value[index];
    let _color = isValidColor(element) ? element : undefined;
    colors.push(_color);
  }

  return colors;
}

function getValidNumberArray(value: number[]): any {
  return value.map(x=>{
    return isValidNumber(x) ? x : undefined;
  });
}

function validateEnum(value: any, enumType: any): any {

  if (!enumType) return undefined;

  const enumValues = Object.values(enumType);

  return enumValues.includes(value)
    ? value
    : enumValues[0]; // fallback to first enum value
}

function sanitizeStringArray(value: any): string[] {

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => {
      if (item === null || item === undefined) return item;

      let str = String(item);

      //Allow safe characters only
      str = str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#x27;')
              .replace(/`/g, '&#x60;');

      return str;
    });         
}

// 🔹 Size
function isValidSize(value: string): boolean {
  const size = /^(\d+(\.\d+)?)(px|%|em|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc)$/;
  
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
    return value;
  }

  let str = String(value);

  // Allow safe characters only
  str = str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#x27;')
              .replace(/`/g, '&#x60;');

  return str;
}

export function ValidateInput(type: 'size' | 'enum' | 'color' | 'colorarray' | 'colororcolorarray' | 'number' | 'numberarray' 
  | 'boolean' | 'label' | 'stringarray' | 'stringorstringarray', config? : any) {
  return function (target: any, propertyKey: string) {

    const privateKey = `__${propertyKey}`;

    Object.defineProperty(target, propertyKey, {

      set(value: any) {
        this[privateKey] = validateValue(type, value, config);
      },

      get() {
        return this[privateKey];
      },

      enumerable: true,
      configurable: true
    });
  };
}