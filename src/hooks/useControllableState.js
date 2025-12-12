import { useCallback, useEffect, useRef, useState } from 'react';

const useControllableState = ({ value, defaultValue, onChange }) => {
	const isDev = process.env.NODE_ENV !== 'production';

	// Is this component controlled on *first render*?
	const isControlledRef = useRef(value !== undefined);
	const isControlled = isControlledRef.current;

	// Internal state only used in uncontrolled mode
	const [internalValue, setInternalValue] = useState(defaultValue);

	// Dev-only warning if the component switches between controlled/uncontrolled
	useEffect(() => {
		if (!isDev) return;

		const wasControlled = isControlledRef.current;
		const isNowControlled = value !== undefined;

		if (wasControlled !== isNowControlled) {
			console.error(
				[
					'useControllableState: A component changed from ' +
						(wasControlled ? 'controlled' : 'uncontrolled') +
						' to ' +
						(isNowControlled ? 'controlled' : 'uncontrolled') +
						'.',
					'This is not supported. Decide between using a controlled or uncontrolled value',
					'for the lifetime of the component.',
				].join(' ')
			);
		}
	}, [value, isDev]);

	const currentValue = isControlled ? value : internalValue;

	const setValue = useCallback(
		(next) => {
			if (!isControlled) {
				setInternalValue(next);
			}

			if (onChange) {
				onChange(next);
			}
		},
		[isControlled, onChange]
	);

	return [currentValue, setValue];
};

export default useControllableState;
