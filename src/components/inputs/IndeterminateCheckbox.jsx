import { useEffect, useRef } from 'react';

const IndeterminateCheckbox = ({ indeterminate, ...rest }) => {
	const ref = useRef();

	useEffect(() => {
		if (typeof indeterminate === 'boolean') {
			ref.current.indeterminate = !rest.checked && indeterminate;
		}
	}, [ref, indeterminate]);

	return (
		<input
			ref={ref}
			type={'checkbox'}
			onClick={(event) => event.stopPropagation()}
			style={{ cursor: 'pointer' }}
			{...rest}
		/>
	);
};

export default IndeterminateCheckbox;
