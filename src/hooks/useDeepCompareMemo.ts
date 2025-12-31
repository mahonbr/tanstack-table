/**
 * The normal useMemo hook does a shallow compare of dependencies but sometime we want to pass a more complex
 * dependency.
 *
 * Please note, if a function is listed as a dependency then it is compared with strict equality.
 */
import { useMemo, useRef } from 'react';
import fastDeepEqual from 'react-fast-compare';

interface useDeepCompareMemoProps<T = unknown> {
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

const useDeepCompareMemo = (callback, dependencies, equalityFn = fastDeepEqual): useDeepCompareMemoProps => {
	const ref = useRef(null);

	if (!ref.current || !equalityFn(dependencies, ref.current)) {
		ref.current = dependencies;
	}

	// eslint-disable-next-line
	return useMemo(callback, ref.current);
};

export default useDeepCompareMemo;
