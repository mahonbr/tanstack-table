import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

const SortIndicatorTool = ({ sorted }) => {
	if (sorted) {
		return sorted === 'asc' ? <IconArrowUp size={16} /> : <IconArrowDown size={16} />;
	}
};

export default SortIndicatorTool;
