/**
 * Merges an array of refs into a single memoized callback ref or `null`.
 *
 * @example
 * const ref = useRef();
 * const chartRef = useRef();
 * const refs = useMergedRefs(ref, chartRef)
 */
import { useMemo } from 'react';

const useMergedRefs = (...refs) => {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, refs);
};

export default useMergedRefs;
