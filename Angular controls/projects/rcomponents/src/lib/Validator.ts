type ValidatorType = 'any' | 'size' | 'object' | 'objectarray' | 'enum' | 'color' | 'colorarray' | 'colororcolorarray' | 'number' | 'numberarray' | 'boolean' | 'label' | 'stringarray' | 'stringorstringarray';

const SIZE_KEYWORDS = [
  'auto',
  'fit-content',
  'min-content',
  'max-content',
  'stretch'
] as const;

export function validateValue(type: ValidatorType, value: any, config?: any): any {

  switch (type) {

    case 'size':
      return getValidSize(value);
    
    case 'object':
      return sanitizeObject(value, config);

    case 'objectarray':
      return sanitizeObjectArray(value, config);

    case 'any':
      return getValidAny(value, config);

    case 'enum':
      return validateEnum(value, config);

    case 'color':
      return getValidColor(value);

    case 'colororcolorarray':
       return getValidColorOrColorArray(value);

    case 'colorarray':
      return getValidColorArray(value);

    case 'number':
      return getValidNumber(value);

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

function getValidAny(val: any, config?: any): any {
  
let result: any;

if (typeof val === 'string') {
      result = validateValue("label", val);
    }
    else if (typeof val === 'number') {
      result = validateValue("number", val);
    }
    else if (typeof val === 'boolean') {
      result = validateValue("boolean", val);
    }
    else if (Array.isArray(val)) {

      let data = val.map((item: any) => {
                        
                        if (typeof item === 'string') {
                          return validateValue("label", item);
                        }
                        else if (typeof item === 'number') {
                          return validateValue("number", item);
                        } else if (typeof item === 'boolean') {
                          return validateValue("boolean", item);
                        } else if (typeof item === 'object' && item !== null) {
                          return isValidDate(item) ? item : sanitizeObject(item, config); 
                        }

                        return item;
                  });

      result = data;
    }
    else if (typeof val === 'object') {
      result = isValidDate(val) ? val : sanitizeObject(val, config); 
    }

    return result;
}

function getValidColorOrColorArray(value: any): any {
  if(Array.isArray(value))
    return getValidColorArray(value) 
  else {
    if(isValidColor(value)) {
      return value 
    }
    else {
      console.error("Invalid Color " +value);
      return undefined;
    }
  }
}

function getValidColor(value: any): any {
  if(isValidColor(value)) {
    return value;
  } else {
    console.error("Invalid Color "+value);
    return undefined;
  }
}

function getValidSize(value: any): any {
  if(isValidSize(value)){
    return value;
  } else {
    console.error("Invalid size "+ value);
    return '0px';
  }
}

function getValidNumber(value: any): any {
  if(isValidNumber(value)) {
    return value;
  }
  else {
    console.error("Invalid number "+ value);
    return undefined;
  }
}

function getValidColorArray(value: string[]): any {
  let colors : any = [];

  if(value == undefined || value==null)
    return [];

  for (let index = 0; index < value.length; index++) {
    const element = value[index];
    let _color = undefined;
    
    if(isValidColor(element)) {
      _color = element;
    } else {
      console.error("InValid Color Value " +element);
    }

    colors.push(_color);
  }

  return colors;
}

function getValidNumberArray(value: number[]): any {
  
  if(value == undefined || value==null)
    return [];
  
  return value.map(x=>{
    let _num = undefined;

    if(isValidNumber(x)) 
      _num = x;
    else
      console.error("Invalid Number "+x);

    return _num;
  });
}

function validateEnum(value: any, enumType: any): any {

  if (!enumType) {
    console.error("Invalid Enum Type "+enumType);
    return undefined;
  }

  const enumValues = Object.values(enumType);

  if(enumValues.includes(value)) {
    return value;
  }
  else {
    console.error("Invalid enum value "+value+" for enum type "+enumType+", fallback to first value");
    return enumValues[0]; // fallback to first enum value
  }
}

function sanitizeStringArray(value: any): string[] {

  if(value == undefined || value == null)
    return [];

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => {
      if (item === null || item === undefined) return item;

      let str = String(item);

      str = str.replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#x27;/g, "'")
              .replace(/&#x60;/g, '`') as any;
           
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
  
  return size.test(value) || SIZE_KEYWORDS.includes(value as any);;  // || cssVar.test(value);
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

  str = str.replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#x27;/g, "'")
              .replace(/&#x60;/g, '`') as any;
           
  // Allow safe characters only
  str = str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#x27;')
              .replace(/`/g, '&#x60;');

  return str;
}

function sanitizeObjectArray(value: any[], config?: any) : any {
  
  let result = value.map(x=> {
    return sanitizeObject(x, config);
  });

  return result;
}

function sanitizeObject(value: any, config?: any): any {

  if (!isValidObject(value)) {
    return {}; // fallback
  }

  const result: any = {};

  const allowedKeys = config?.allowedKeys;

  for (const key in value) {

    // Optional: whitelist keys
    if (allowedKeys && !allowedKeys.includes(key)) {
      continue;
    }

    const val = value[key];

    // Basic sanitization
    if (typeof val === 'string') {
      result[key] = validateValue("label", val);
    }
    else if (typeof val === 'number') {
      result[key] = validateValue("number", val);
    }
    else if (typeof val === 'boolean') {
      result[key] = validateValue("boolean", val);
    }
    else if (Array.isArray(val)) {

      let data = val.map((item: any) => {
                        
                        if (typeof item === 'string') {
                          return validateValue("label", item);
                        }
                        else if (typeof item === 'number') {
                          return validateValue("number", item);
                        } else if (typeof item === 'boolean') {
                          return validateValue("boolean", item);
                        } else if (typeof item === 'object' && item !== null) {
                          return isValidDate(item) ? item : sanitizeObject(item, config); 
                        }

                        return item;
                  });

      result[key] = data;
    }
    else if (typeof val === 'object') {
      result[key] = isValidDate(val) ? val : sanitizeObject(val); // recursive
    }
  }

  return result;
}

function isValidObject(value: any): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isValidDate(value: any): boolean {
  return value instanceof Date && !isNaN(value.getTime());
}

export function ValidateCustomTypeInput<T extends object>(Type: new (...args: any[]) => T) {
  return function (target: any, key: string) {
    const privateKey = Symbol(key); // safer than __key

    Object.defineProperty(target, key, {
      get(): T | T[] {
        return this[privateKey];
      },
      set(value: unknown) {
        if (value == null) {
          this[privateKey] = value;
          return;
        }

        const transform = (obj: any): T => {
          // already instance
          if (obj instanceof Type) return obj;

          const instance = new Type() as T;
          return Object.assign(instance, obj);
        };

        let result: T | T[];

        if (Array.isArray(value)) {
          result = value.map(v => transform(v));
        } else if (typeof value === 'object') {
          result = transform(value);
        } else {
          throw new Error(`Invalid type for ${key}`);
        }

        this[privateKey] = result;
      },
      enumerable: true,
      configurable: true
    });
  };
}

export function ValidateInput(type: 'any' | 'size' | 'object' | 'objectarray' | 'enum' | 'color' | 'colorarray' | 'colororcolorarray' | 'number' | 'numberarray' 
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