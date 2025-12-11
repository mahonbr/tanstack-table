import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { number } from '@/utils';

const ColumnTypes = [
	[
		'expander',
		{
			cellClass: 'ag-left-aligned-cell',
			headerClass: 'ag-left-aligned-header',
			cell: (info) => {
				const { getValue, column, row, table } = info;
				const { classes } = table.getMeta();
				const { valueFormatter } = column.getMeta();

				return (
					<div
						style={{
							overflow: 'hidden',
							paddingLeft: `${row.depth * 2}rem`,
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{row.getCanExpand() && (
							<button
								className={classes?.headerMenuTool}
								onClick={(event) => {
									event.stopPropagation();
									row.getToggleExpandedHandler()(event);
								}}
								style={{
									alignItems: 'baseline',
									display: 'inline-flex',
									padding: 3,
									verticalAlign: 'middle',
								}}
							>
								{row.getIsExpanded() ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
							</button>
						)}
						{valueFormatter?.(info) ?? getValue()}
					</div>
				);
			},
			meta: {
				valueFormatter: ({ getValue }) => getValue(),
			},
		},
	],
	[
		'number',
		{
			cellClass: 'ag-right-aligned-cell',
			headerClass: 'ag-right-aligned-header',
			cell: (info) => {
				const { format = '0,0' } = info.column.getMeta();
				return number(info.getValue(), format);
			},
		},
	],
	[
		'text',
		{
			cellClass: 'ag-left-aligned-cell',
			headerClass: 'ag-left-aligned-header',
		},
	],
];

export default ColumnTypes;
