import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';

import ErrorBoundary from '@/components/feedback/ErrorBoundary';

const TableCell = (props) => {
	const { cell, ...rest } = props;
	const context = cell.getContext();

	return <td {...rest}>{flexRender(context.column.columnDef.cell, context)}</td>;
};

const cellRenderer = (cell) => {
	const context = cell.getContext();

	const { align, cellClass, cellStyle, getCellClass, getCellStyle, wrapText } = context.column.getMeta() ?? {};
	const { classes, onCellClicked, onCellDoubleClicked } = context.table.getMeta() ?? {};

	return (
		<TableCell
			key={`cell-${cell.id}`}
			cell={cell}
			onClick={(event) => onCellClicked?.(event, context)}
			onDoubleClick={(event) => onCellDoubleClicked?.(event, context)}
			className={clsx(cellClass, `ag-${align}-aligned-cell`, getCellClass?.(context), {
				[classes.wrapText]: wrapText,
			})}
			style={{
				...cellStyle,
				...getCellStyle?.(context),
			}}
		/>
	);
};

const TableRow = (props) => {
	const { row, ...rest } = props;
	return <tr {...rest}>{row.getVisibleCells().map(cellRenderer)}</tr>;
};

const rowRenderer = (row) => {
	const { table } = row.getContext();

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
		<TableRow
			key={`row-${row.id}`}
			row={row}
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
		/>
	);
};

const TableBody = (props) => {
	const { table } = props;

	return (
		<ErrorBoundary>
			<tbody>{table.getRowModel().rows.map(rowRenderer)}</tbody>
		</ErrorBoundary>
	);
};

export default TableBody;
