import chroma from 'chroma-js';

export const alpha = (color, alpha) => {
	return chroma(color).alpha(alpha).hex();
};

/**
 * The relative brightness of any point in a color space normalized to 0 for darkest black
 * and 1 for lightest white.
 *
 * @param {String} color The specifier string.
 * @return {String} The relative brightness.
 */
export const getBrightness = (color) => {
	return chroma(color).luminance();
};

/**
 * Creates a random color by generating a random hexadecimal string.
 *
 * @return {String} The random color.
 */
export const getRandomColor = () => {
	return chroma.random().hex();
};

/**
 * Parses the specified CSS Color Module Level 3 specifier string, returning an RGB or HSL color, along with
 * CSS Color Module Level 4 hex specifier strings.
 *
 * @param {String} color The specifier string.
 * @param {Number} alpha The transparency (0.0-1.0).
 * @return {String} The alpha color.
 */
export const rgba = alpha;

/**
 * Darkens the base color by mixing it with black as specified by weight.
 *
 * @param {String} color The specifier string.
 * @param {Number} weight The weight of white to mix in.
 * @return {String} The tinted color.
 */
export const shade = (color, weight) => {
	return chroma(color).darken(weight).hex();
};

export const darken = shade;

/**
 * Returns `true` if a color argument can be correctly parsed as color by chroma.js.
 *
 * @param {String} color The specifier string.
 * @return {Bool} The color validity.
 */
export const valid = chroma.valid;
