/**
 * The normal useCallback hook does a shallow compare of dependencies but sometime we want to pass a more complex
 * dependency.
 *
 * Please note, if a function is listed as a dependency then it is compared with strict equality.
 */
import { useCallback, useRef } from 'react';
import fastDeepEqual from 'react-fast-compare';

const useDeepCompareCallback = (callback, dependencies, equalityFn = fastDeepEqual) => {
	const ref = useRef();

	if (!ref.current || !equalityFn(dependencies, ref.current)) {
		ref.current = dependencies;
	}

	// eslint-disable-next-line
	return useCallback(callback, ref.current);
};

export default useDeepCompareCallback;
