import { number } from '@/utils';
import IndeterminateCheckbox from '@/components/inputs/IndeterminateCheckbox';
import RowExpanderTool from './components/tools/RowExpanderTool';
import Typography from '@/components/typography/Typography';

const ColumnTypes = [
	[
		'expander',
		{
			cell: (context) => {
				const { getValue, column, row } = context;
				const { valueFormatter } = column.getMeta();

				return (
					<div
						style={{
							alignItems: 'center',
							display: 'flex',
							paddingLeft: `calc(calc(var(--ag-cell-widget-spacing) + var(--ag-icon-size)) * ${row.depth})`,
						}}
					>
						{row.getCanExpand() && <RowExpanderTool context={context} />}

						<Typography noWrap style={{ flex: 1 }}>
							{valueFormatter?.(context) ?? getValue()}
						</Typography>
					</div>
				);
			},
			meta: {
				align: 'left',
				headerAlign: 'left',
			},
		},
	],
	[
		'number',
		{
			cell: (context) => {
				const { format = '0,0' } = context.column.getMeta();
				return number(context.getValue(), format);
			},
			meta: {
				align: 'right',
				headerAlign: 'right',
			},
		},
	],
	[
		'text',
		{
			meta: {
				align: 'left',
				headerAlign: 'left',
			},
		},
	],
	/**
	 * This section is for "reserved" columns that have special functionality in the grid, such as
	 * selection checkboxes.
	 */
	[
		'__eda_selection_column__',
		{
			id: '__eda_selection_column__',
			enableResizing: false,
			size: 50,
			header: ({ table }) => {
				if (!table.options.enableMultiRowSelection) return;

				return (
					<IndeterminateCheckbox
						{...{
							checked: table.getIsAllRowsSelected(),
							indeterminate: table.getIsSomeRowsSelected(),
							onChange: table.getToggleAllRowsSelectedHandler(),
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
					}}
				/>
			),
			meta: {
				align: 'center',
				headerAlign: 'center',
				suppressHeaderMenuButton: true,
			},
		},
	],
];

export default ColumnTypes;
