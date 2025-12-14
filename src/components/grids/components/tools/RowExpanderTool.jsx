import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

const RowExpanderTool = (props) => {
	const { CollapseIcon = IconChevronDown, context, ExpandIcon = IconChevronRight, ...rest } = props;

	const { row, table } = context;
	const { classes } = table.getMeta();

	return (
		<div
			className={classes?.rowExpanderTool}
			onClick={(event) => {
				event.stopPropagation();
				row.getToggleExpandedHandler()(event);
			}}
			{...rest}
		>
			{row.getIsExpanded() ? <CollapseIcon /> : <ExpandIcon />}
		</div>
	);
};

export default RowExpanderTool;
