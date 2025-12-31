import { useCallback, useRef, useState } from 'react';

interface UseControlledProps<T = unknown> {
	/**
	 * Holds the component value when it's controlled.
	 */
	controlled?: T | undefined;

	/**
	 * The default value when uncontrolled.
	 */
	defaultValue?: T | undefined;

	/**
	 * The callback fired when the value changes.
	 */
	onChange?: (value: T) => void;
}

const useControlled = <T>({ controlled, defaultValue, onChange }: UseControlledProps<T>) => {
	/**
	 * We determine the controlled state on the first render to avoid switching between controlled
	 * and uncontrolled during the component's lifetime.
	 */
	const { current: isControlled } = useRef(controlled !== undefined);

	// We'll use the internal state when in an uncontrolled mode.
	const [internalValue, setInternalValue] = useState(defaultValue);

	// The value that will be used by the component. A warning will be issued if the mode is switched.
	// eslint-disable-next-line react-hooks/refs
	const currentValue = isControlled ? controlled : internalValue;

	const setValue = useCallback(
		(next) => {
			if (!isControlled) {
				setInternalValue(next);
			}

			onChange?.(next);
		},
		[isControlled, onChange]
	);

	return [currentValue, setValue];
};

export default useControlled;
