/**
 * The normal useCallback hook does a shallow compare of dependencies but sometime we want to pass a more complex
 * dependency.
 *
 * Please note, if a function is listed as a dependency then it is compared with strict equality.
 */
import { useCallback, useRef } from 'react';
import fastDeepEqual from 'react-fast-compare';

interface useDeepCompareCallbackProps<T = unknown> {
	/**
	 * The callback function to memoize.
	 */
	callback: (value: T) => unknown;

	/**
	 * The dependencies to be deeply compared.
	 */
	dependencies: T;

	/**
	 * The function to compare dependencies.
	 * @default fastDeepEqual
	 */
	equalityFn?: (a: T, b: T) => boolean;
}

const useDeepCompareCallback = (callback, dependencies, equalityFn = fastDeepEqual): useDeepCompareCallbackProps => {
	const ref = useRef(null);

	if (!ref.current || !equalityFn(dependencies, ref.current)) {
		ref.current = dependencies;
	}

	// eslint-disable-next-line
	return useCallback(callback, ref.current);
};

export default useDeepCompareCallback;
