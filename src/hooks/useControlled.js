import { useCallback, useRef, useState } from 'react';

const useControlled = ({ controlled, default: defaultProp, onChange }) => {
	/**
	 * We determine the controlled state on the first render to avoid switching between controlled
	 * and uncontrolled during the component's lifetime.
	 */
	const { current: isControlled } = useRef(controlled !== undefined);

	// We'll use the internal state when in an uncontrolled mode.
	const [internalValue, setInternalValue] = useState(defaultProp);

	// The value that will be used by the component.
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
