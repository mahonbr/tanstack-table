import { ArrowDownIcon, ArrowUpIcon } from '@/components/icons';

const SortIndicatorTool = (props) => {
	const { AscendingIcon = ArrowUpIcon, DescendingIcon = ArrowDownIcon, sorted, style, ...rest } = props;

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
