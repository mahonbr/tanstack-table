import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';

import ErrorBoundary from '@/components/feedback/ErrorBoundary';

const cellRenderer = (cell) => {
	const context = cell.getContext();

	const { align, cellClass, cellStyle, getCellClass, getCellStyle, wrapText } = context.column.getMeta() ?? {};
	const { classes, onCellClicked, onCellDoubleClicked } = context.table.getMeta() ?? {};

	return (
		<td
			key={cell.id}
			onClick={(event) => onCellClicked?.(event, context)}
			onDoubleClick={(event) => onCellDoubleClicked?.(event, context)}
			className={clsx(cellClass, `ag-${align}-aligned-cell`, getCellClass?.(context), {
				[classes.wrapText]: wrapText,
			})}
			style={{
				...cellStyle,
				...getCellStyle?.(context),
			}}
		>
			{flexRender(context.column.columnDef.cell, context)}
		</td>
	);
};

const createRowRenderer = (props) => {
	const { table } = props;
	const {
		classes,
		enableCheckboxSelection,
		enableClickSelection,
		getRowClass,
		getRowStyle,
		onRowClicked,
		onRowDoubleClicked,
		rowClass,
		rowStyle,
	} = table.getMeta();

	return (row) => {
		const onClickCallback = (event) => {
			if (onRowClicked?.(event, { row, table }) !== false) {
				/**
				 * If the row is selectable and checkbox selection is disabled, "force" toggle selection
				 * on row click.
				 */
				if (row.getCanSelect() && enableCheckboxSelection && !enableClickSelection) return;

				row.getToggleSelectedHandler()(event);
			}
		};

		return (
			<tr
				key={row.id}
				onClick={onClickCallback}
				onDoubleClick={(event) => onRowDoubleClicked?.(event, { row, table })}
				className={clsx(rowClass, getRowClass?.({ row, table }), {
					[classes.selectable]: row.getCanSelect(),
					[classes.selected]: row.getIsSelected(),
				})}
				style={{
					...rowStyle,
					...getRowStyle?.({ row, table }),
				}}
			>
				{row.getVisibleCells().map(cellRenderer)}
			</tr>
		);
	};
};

const TableBody = (props) => {
	const { table } = props;
	const rowRenderer = createRowRenderer(props);

	return (
		<ErrorBoundary>
			<tbody>{table.getRowModel().rows.map(rowRenderer)}</tbody>
		</ErrorBoundary>
	);
};

export default TableBody;
