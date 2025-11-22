import dayjs from 'dayjs';
import numeral from 'numeral';

import {
	castArray,
	each,
	every,
	get,
	isArray,
	isBoolean,
	isEmpty,
	isFunction,
	isNumber,
	isPlainObject,
	memoize,
	omitBy,
	sumBy,
	toNumber,
} from 'lodash';

/**
 * This method creates an object composed of properties that the predicate doesn't return truthy for.
 *
 * @param {Object} object The source object.
 * @param {Function} predicate The empty checker function invoked per property.
 * @return {Object} Returns the new object.
 */
export const clean = (object, predicate = isEmptyValue) => {
	if (isArray(object)) {
		return object.filter((item) => {
			return !predicate(item);
		});
	}

	return omitBy(object, (item) => {
		return predicate(item);
	});
};

/**
 * @method coerce
 * Coerces the first value if possible so that it is comparable to the second value.
 *
 * Coercion only works between the basic atomic data types String, Boolean, Number, Date, null
 * and undefined. Numbers and numeric strings are coerced to Dates using the value
 * as the millisecond era value.
 *
 * Strings are coerced to Dates by parsing using dayjs.
 *
 * @examples
 * console.log(coerce(1, '1'));
 * console.log(coerce('1', 1));
 * console.log(coerce('false', true));
 * console.log(coerce('2025-01-01', new Date()));
 *
 * @param {Mixed} from The value to coerce
 * @param {Mixed} to The value it must be compared against
 * @return The coerced value.
 */
export const coerce = (from, to) => {
	const fromType = getTypeOf(from);
	const toType = getTypeOf(to);
	const isString = typeof from === 'string';

	if (fromType !== toType) {
		switch (toType) {
			case 'string':
				return String(from);
			case 'number':
				return Number(from);
			case 'boolean':
				return isString && (!from || from === 'false' || from === '0') ? false : Boolean(from);
			case 'null':
				return isString && (!from || from === 'null') ? null : false;
			case 'undefined':
				return isString && (!from || from === 'undefined') ? undefined : false;
			case 'date':
				return isString && isNaN(from) ? dayjs(from)?.$d : Date(Number(from));
		}
	}

	return from;
};

/**
 * Checks whether or not the given `array` contains the specified `item`.
 *
 * @param {Array} array The array to check.
 * @param {Object} item The item to find.
 * @return {Boolean} `true` if the array contains the item, `false` otherwise.
 */
export const contains = (array, item) => {
	return array.indexOf(item) !== -1;
};

/**
 * The default parsing formats added to DayJS.
 */
export const dateParseFormats = ['YYYY-MM-DD', 'YYYY-MM', 'YYYYMMDD', 'YYYYMM', 'YYYY', 'MMM D YYYY'];

/**
 * Deeply merges two objects. For each property:
 * - If both values are plain objects, they are recursively merged.
 * - If both values are arrays, the second array replaces the first.
 * - Otherwise, the value from the second object is used.
 *
 * @param {Object} destination - The destination object.
 * @param {Object} source - The source object whose properties will override or merge into the target.
 * @returns {Object} A new object resulting from the deep merge of `destination` and `source`.
 */
export const deepMerge = (destination, source) => {
	const out = { ...destination };

	for (const key of Object.keys(source)) {
		const dv = destination[key];
		const sv = source[key];

		if (isPlainObject(dv) && isPlainObject(sv)) {
			out[key] = deepMerge(dv, sv);
		} else if (Array.isArray(dv) && Array.isArray(sv)) {
			// Replace arrays with the closer value "winning".
			out[key] = sv.slice();
		} else {
			// Replace primitives and functions with the closer value "winning".
			out[key] = sv;
		}
	}
	return out;
};

/**
 * @method getTypeOf
 * Returns the type of the given variable in string format. List of possible values are:
 *
 * - `undefined`: If the given value is `undefined`
 * - `null`: If the given value is `null`
 * - `string`: If the given value is a string
 * - `number`: If the given value is a number
 * - `boolean`: If the given value is a boolean value
 * - `date`: If the given value is a `Date` object
 * - `function`: If the given value is a function reference
 * - `object`: If the given value is an object
 * - `array`: If the given value is an array
 * - `regexp`: If the given value is a regular expression
 * - `element`: If the given value is a DOM Element
 * - `textnode`: If the given value is a DOM text node and contains something other than whitespace
 * - `whitespace`: If the given value is a DOM text node and contains only whitespace
 *
 * @param {Object} value
 * @return {String}
 */
export const getTypeOf = (value) => {
	if (value == null) {
		return 'null';
	}

	const nonWhitespaceRe = /\S/;

	const toStringTypes = {
		'[object Array]': 'array',
		'[object Date]': 'date',
		'[object Boolean]': 'boolean',
		'[object Number]': 'number',
		'[object RegExp]': 'regexp',
	};

	const typeofTypes = {
		number: 1,
		string: 1,
		boolean: 1,
		undefined: 1,
	};

	const type = typeof value;

	if (typeofTypes[type]) {
		return type;
	}

	const typeToString = Object.prototype.toString.call(value);
	const stringType = toStringTypes[typeToString];

	if (stringType) {
		return stringType;
	}

	if (type === 'function') {
		return 'function';
	}

	if (type === 'object') {
		if (value.nodeType !== undefined) {
			if (value.nodeType === 3) {
				return nonWhitespaceRe.test(value.nodeValue) ? 'textnode' : 'whitespace';
			} else {
				return 'element';
			}
		}

		return 'object';
	}

	return typeToString;
};

/**
 * Returns `true` if the array is a collection of certain types.
 *
 * @param {Object[]} value The value to test.
 * @param {Function} value The type checking function.
 * @return {Boolean}
 */
export const isArrayOf = (value, typeChecker = isString) => {
	if (!Array.isArray(value)) {
		return false;
	}

	return every(value, typeChecker);
};

/**
 * Returns true if the passed value is empty, false otherwise. The value is deemed to be
 * empty if it is either:
 *
 * - `null`
 * - `undefined`
 * - a zero-length array
 * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`)
 *
 * @param {Object} value The value to test.
 * @return {Boolean}
 */
export const isEmptyValue = (value, allowEmptyString = false) => {
	if (value === '' && !allowEmptyString) {
		return true;
	} else if (isBoolean(value) || isFunction(value) || isNumber(value) || isString(value)) {
		return false;
	} else if (isArray(value) && value.length > 0) {
		return false;
	}

	return isEmpty(value);
};

/**
 * Export an "alias" of isEmptyValue.
 */
export { isEmptyValue as isEmpty };

/**
 * Checks if value is number-like. A value is considered number-like if it is, or can be converted to, a number.
 *
 * @param {Mixed} value The value to check.
 * @return {Boolean} Returns true if value is array-like, else false.
 */
export const isNumberLike = (value) => {
	return isFinite(toNumber(value));
};

/**
 * Determines if the value being provided is a string representing a percent (e.g. "85%").
 *
 * @param {Mixed} value The value to check.
 * @return {Boolean} Return `true` if the value is in the form of a percent.
 */
export const isPercent = memoize((value) => {
	return isString(value) && value.includes('%') && numeral(value).value();
});

/**
 * Returns `true` if the value is a JavaScript 'primitive', a string, number or boolean.
 *
 * @param {Object} value The value to test.
 * @return {Boolean}
 */
export const isPrimitive = (value) => {
	const type = typeof value;

	return type === 'string' || type === 'number' || type === 'boolean';
};

/**
 * Returns `true` if a value is a simple object, that is, it's a plain Object, or its prototype is a plain Object.
 */
export const isSimpleObject = (value) => {
	return value instanceof Object && value.constructor === Object;
};

/**
 * Returns `true` if the value is a string.
 *
 * @param {Object} value The value to test.
 * @return {Boolean}
 */
export const isString = (value) => {
	return typeof value === 'string';
};

/**
 * Converts a Map to an Array.
 *
 * @param {Map} map The Map to convert.
 * @return {Array}
 */
export const mapToArray = (map) => {
	return Array.from(map.entries());
};

/**
 * Find the maximum value in the data collection for a specific field.
 *
 * @param {Object[]} data The data collection
 * @param {String} field The data index used to calculate the max.
 * @return {Number} The field's maxiumum value.
 */
export const max = (data, field) => {
	return castArray(data).reduce((prev, curr) => Math.max(prev, curr[field]), 0);
};

/**
 * Find the minimum value in the data collection for a specific field.
 *
 * @param {Object[]} data The data collection
 * @param {String} field The data index used to calculate the max.
 * @return {Number} The field's minimum value.
 */
export const min = (data, field) => {
	return castArray(data).reduce((prev, curr) => Math.min(prev, curr[field]), Number.MAX_VALUE);
};

/**
 * Finds both the minimum and maximum values in the data collection for a specific field.
 *
 * @param {Object[]} data - The data collection (array of objects).
 * @param {String} field - The property name to evaluate for min and max.
 * @return {[Number|undefined, Number|undefined]} An array containing the minimum and maximum values.
 *
 * If no finite values are found, returns [undefined, undefined].
 */
export const minMax = (data, field) => {
	const [min, max] = castArray(data).reduce(
		(prev, curr) => {
			const rawValue = curr[field];
			const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);

			if (!Number.isFinite(value)) {
				return prev;
			}

			return [Math.min(prev[0], value), Math.max(prev[1], value)];
		},
		[Infinity, -Infinity]
	);

	return min === Infinity ? [undefined, undefined] : [min, max];
};

/**
 * Parses the given value and returns the value as a Day.js wrapper for the Date object.
 *
 * @param {String} value
 * @return {Object}
 */
export const parseDate = (value, options = {}) => {
	const { parseFormat = dateParseFormats, strict = true } = options;

	if (typeof value === 'string') {
		return dayjs(value, parseFormat, strict);
	} else if (!(value instanceof dayjs)) {
		return dayjs(value);
	}
};

/**
 * Check the paths of the source object and return a collection of empty paths.
 *
 * @param {Object} object The source object.
 * @param {String[]} paths The property paths to check.
 * @return {String[]} The empty property paths.
 */
export const pickEmpty = (object, paths) => {
	const props = [];

	each(castArray(paths), (path) => {
		if (isEmptyValue(get(object, path))) {
			props.push(path);
		}
	});

	return props;
};

/**
 * Find the accumulated value in the data collection for a specific field.
 *
 * @param {Object[]} data The data collection
 * @param {String} field The data index used to calculate the sum.
 * @return {Number} The field's accumulated value.
 */
export const sum = (data, field) => {
	// return castArray(data).reduce((prev, curr) => prev + Number(curr[field]), 0);
	return sumBy(data, (record) => record[field]);
};

/**
 * Splits a string based on the requested length. It can return the value as an array or a string.
 *
 * @example:
 * wrap('Hello World', { length: 5 })
 * // => ['Hello', 'World']
 *
 * wrap('Hello World', { length: 5, asArray: false })
 * // => 'Hello\nWorld'
 */
export const wrap = (string, { length = 25, asArray = true }) => {
	const width = Math.max(length, 5);

	const wrapped = string
		// The 1st step is to see if we need to add any spaces after the "/" character.
		.replace(new RegExp(`(?![^\\n]{1,${width}}$)([^\\n]{1,${width}})([,/-])`, 'g'), '$1$2 ')
		// The 2nd step is to actually wrap the lines with breaks based on spaces.
		.replace(new RegExp(`(?![^\\n]{1,${width}}$)([^\\n]{1,${width}})\\s`, 'g'), '$1\n');

	if (asArray) {
		return wrapped.split('\n');
	}

	return wrapped;
};
