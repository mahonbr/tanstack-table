import { HTMLAttributes, useEffect, useRef } from 'react';

type IndeterminateCheckboxProps = {
	/**
	 * If true, the checkbox will be checked.
	 */
	checked?: boolean;

	/**
	 * If true, the checkbox will be in an indeterminate state.
	 */
	indeterminate?: boolean;
} & HTMLAttributes<HTMLInputElement>;

const IndeterminateCheckbox = ({ checked, indeterminate, ...rest }: IndeterminateCheckboxProps) => {
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (typeof indeterminate === 'boolean') {
			ref.current.indeterminate = !checked && indeterminate;
		}
	}, [checked, indeterminate]);

	return (
		<input
			ref={ref}
			type={'checkbox'}
			checked={checked}
			onClick={(event) => event.stopPropagation()}
			style={{ cursor: 'pointer' }}
			{...rest}
		/>
	);
};

export default IndeterminateCheckbox;
