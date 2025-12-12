import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

import { number } from '@/utils';
import IndeterminateCheckbox from '@/components/inputs/IndeterminateCheckbox';

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
		'selection',
		{
			id: '__eda_selection_column__',
			cellClass: 'ag-center-aligned-cell',
			enableResizing: false,
			headerClass: 'ag-center-aligned-header',
			size: 50,
			suppressHeaderMenuButton: true,
			header: ({ table }) => {
				if (!table.options.enableMultiRowSelection) return;

				return (
					<IndeterminateCheckbox
						{...{
							checked: table.getIsAllRowsSelected(),
							indeterminate: table.getIsSomeRowsSelected(),
							onChange: table.getToggleAllRowsSelectedHandler(),
							onClick: (event) => event.stopPropagation(),
						}}
					/>
				);
			},
			cell: ({ row }) => (
				<IndeterminateCheckbox
					{...{
						checked: row.getIsSelected(),
						disabled: !row.getCanSelect(),
						onChange: row.getToggleSelectedHandler(),
						onClick: (event) => event.stopPropagation(),
					}}
				/>
			),
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
