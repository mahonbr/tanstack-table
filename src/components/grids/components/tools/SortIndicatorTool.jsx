import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

const SortIndicatorTool = (props) => {
	const { AscendingIcon = IconArrowUp, DescendingIcon = IconArrowDown, sorted, style, ...rest } = props;

	if (sorted) {
		const Icon = sorted === 'asc' ? AscendingIcon : DescendingIcon;

		return (
			<Icon
				style={{
					height: 'var(--ag-icon-size)',
					minWidth: 'var(--ag-icon-size)',
					width: 'var(--ag-icon-size)',
					...style,
				}}
				{...rest}
			/>
		);
	}
};

export default SortIndicatorTool;
