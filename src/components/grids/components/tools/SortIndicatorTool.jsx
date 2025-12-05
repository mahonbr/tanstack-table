import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

const SortIndicatorTool = ({ sorted, style, ...rest }) => {
	if (sorted) {
		const Icon = sorted === 'asc' ? IconArrowUp : IconArrowDown;
		return <Icon size={16} style={{ minWidth: 24, ...style }} {...rest} />;
	}
};

export default SortIndicatorTool;
