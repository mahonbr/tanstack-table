import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';

const cellRenderer = (cell) => {
	const context = cell.getContext();
	const { classes, onCellClicked, onCellDoubleClicked } = context.table.getMeta();

	return (
		<td
			key={cell.id}
			onClick={(event) => onCellClicked?.({ event, ...context })}
			onDoubleClick={(event) => onCellDoubleClicked?.({ event, ...context })}
			className={clsx(cell.column.columnDef?.cellClass, {
				[classes.wrapText]: cell.column.columnDef.wrapText,
			})}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</td>
	);
};

const createRowRenderer = (props) => {
	const { table } = props;
	const { classes, enableCheckboxSelection, enableClickSelection, onRowClicked, onRowDoubleClicked } =
		table.getMeta();

	return (row) => {
		const onClickCallback = (event) => {
			if (onRowClicked?.({ event, row, table }) !== false) {
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
				onDoubleClick={(event) => onRowDoubleClicked?.({ event, row, table })}
				className={clsx({
					[classes.selectable]: row.getCanSelect(),
					[classes.selected]: row.getIsSelected(),
				})}
			>
				{row.getVisibleCells().map(cellRenderer)}
			</tr>
		);
	};
};

const TableBody = (props) => {
	const { table } = props;
	const rowRenderer = createRowRenderer(props);

	return <tbody>{table.getRowModel().rows.map(rowRenderer)}</tbody>;
};

export default TableBody;
