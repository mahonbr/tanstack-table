import { Ref, RefCallback, useMemo } from 'react';

/**
 * Merges an array of refs into a single memoized callback ref or `null`.
 *
 * @example
 * const ref = useRef();
 * const chartRef = useRef();
 * const refs = useMergedRefs(ref, chartRef)
 */

const useMergedRefs = <T,>(...refs: Ref<T>[]): RefCallback<T> | null => {
	return useMemo(() => {
		if (refs.every((ref) => ref == null)) {
			return null;
		}

		return (instance) => {
			refs.forEach((ref) => {
				if (typeof ref === 'function') {
					ref(instance);
				} else if (ref) {
					ref.current = instance;
				}
			});
		};
	}, [refs]);
};

export default useMergedRefs;
