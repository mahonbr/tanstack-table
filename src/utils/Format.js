import { isDate, isNaN, isNil } from 'lodash';
import numeral from 'numeral';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { dateParseFormats } from './Global';

/**
 * Since it is a peerDependencies, they will need to install dayjs within their application.
 */
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

/**
 * @override
 * Providing updated configurations for the numeral.js library.
 */
numeral.nullFormat('');

/**
 * @override
 * Providing updated configurations for the numeral.js library.  We don't want the percent format to multiply by 100.
 */
numeral.options.scalePercentBy100 = false;

/**
 * @override
 * Providing updated configurations for the numeral.js library.  We want to customize the abbreviations to be
 * consistent with Insights Central.
 */
numeral.locales.en.abbreviations = {
	thousand: 'k',
	million: 'M',
	billion: 'B',
	trillion: 'T',
};

/**
 * When using 's' (e.g. '0,0.00s') then values >= 1M will have 2 decimals, thousands will have 1 and < 1k will
 * follow the format string.
 *
 * @example
 * '0,0.00s' = 1.11T, 1.11B, 1.11M,  1.1k, 1.11
 *
 * When using a % format, you can choose to have the value multiplied by 100 so that 0.673 can render as "67.3%"".
 * To have the value automatically multiplied, use "(%)" vs. "%" (for the above example the format string would
 * be "0,0.0(%)").
 *
 * @important
 * We do NOT want to register our format if it has already been registered.
 */
if (!numeral.formats.number) {
	numeral.register('format', 'number', {
		regexps: {
			/**
			 * This formatter will be used whenever the format string contains an "s".
			 */
			format: /(s)/,
		},
		format: (valueIn, format) => {
			const number = numeral(valueIn);
			const value = number.value();
			const abs = Math.abs(value);

			/**
			 * If the absolute value is greater than 1,000 then we want to use abbreviated formatting.
			 */
			if (abs >= 1e3) {
				/**
				 * Since we need to update the precision of the format string, we need to separate
				 * that which is before and after the decimal point. Since we are adding the "a"
				 * token to the end, we need to remove the token if contained in the prefix.
				 */
				const prefix = format.split('.')[0]?.replace(/(s)/g, '') || '0,0';
				const precision = abs >= 1e6 ? '.00a' : '.0a';

				format = `${prefix}${precision}`;
			}

			return number.format(format.replace(/(s)/g, 'a'));
		},
	});

	/**
	 * NumeralJS will not let me use currency symbols in my custom format (e.g. '$0,0.00s). As a simple
	 * hack, I'm updating the currency formatter's format regex so that it will only be used when the
	 * format string does NOT contain an "s".
	 *
	 * I'm adding the guard because of an issue that we are seeing in ciievolve-visualization-ui.
	 */
	if (numeral.formats.currency) {
		numeral.formats.currency.regexps.format = /^\$(?!.*s).*$/;
	}
}

/**
 * Format a number as a currency.
 *
 * @param {Number/String} value The numeric value to format.
 * @param {String} format The format string.
 * @return {String} The formatted currency string.
 */
export const currency = (value, format = '$0,0') => {
	/**
	 * Numeral will return 0 for undefined values, this guard clause protects against that.
	 */
	if (isNil(value)) return numeral.options.nullFormat;

	return numeral(value).format(format);
};

/**
 * Formats the passed date using the specified format tokens.
 *
 * @param {String/Date} value The value to format.
 * @param {String} format The format string.
 * @param {Mixed} options.nilValue The optional returned value for nil dates.
 * @return {String} The formatted date string.
 */
export const date = (value, format = 'MMM Y', options = {}) => {
	const { invalidValue = 'Invalid Date', nilValue = '', parseFormat = dateParseFormats, strict = true } = options;

	if (isNil(value)) {
		return nilValue;
	} else {
		const date = isDate(value) ? dayjs(value) : dayjs(value, parseFormat, strict);

		if (date.isValid()) {
			return date.format(format);
		} else if (strict) {
			return dayjs(value, parseFormat, false).format(format);
		}

		return invalidValue;
	}
};

/**
 * Format a number.
 *
 * @param {Number/String} value The numeric value to format.
 * @param {String} format The format string.
 * @return {String} The formatted string.
 */
export const number = (value, format = '0,0') => {
	/**
	 * Numeral will return 0 for undefined values, this guard clause protects against that.
	 */
	if (isNil(value) || isNaN(value)) return numeral.options.nullFormat;

	const number = numeral(value);

	if (format.search(/\(%\)/) >= 0) {
		format = format.replace(/\(%\)/, '%');
		number.multiply(100);
	}

	return number.format(format);
};

export { numeral };
