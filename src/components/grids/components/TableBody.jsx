import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';

const cellRenderer = (cell) => {
	const { table } = cell.getContext();
	const { classes } = table.getMeta();

	return (
		<td
			key={cell.id}
			className={clsx(cell.column.columnDef?.cellClass, {
				[classes.wrapText]: cell.column.columnDef.wrapText,
			})}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</td>
	);
};

const rowRenderer = (row) => {
	return <tr key={row.id}>{row.getVisibleCells().map(cellRenderer)}</tr>;
};

const TableBody = (props) => {
	const { table } = props;
	return <tbody>{table.getRowModel().rows.map(rowRenderer)}</tbody>;
};

export default TableBody;
