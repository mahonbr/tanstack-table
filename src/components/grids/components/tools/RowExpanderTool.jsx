import { ChevronDownIcon, ChevronRightIcon } from '@/components/icons';

const RowExpanderTool = (props) => {
	const { CollapseIcon = ChevronDownIcon, context, ExpandIcon = ChevronRightIcon, ...rest } = props;

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
