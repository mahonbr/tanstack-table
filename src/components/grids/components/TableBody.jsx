import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';

const TableBody = (props) => {
	const { table } = props;

	const TableBodyCellCallback = (cell) => {
		return (
			<td key={cell.id} className={clsx(cell.column.columnDef?.cellClass)}>
				{flexRender(cell.column.columnDef.cell, cell.getContext())}
			</td>
		);
	};

	const TableBodyCallback = (row) => {
		return <tr key={row.id}>{row.getVisibleCells().map(TableBodyCellCallback)}</tr>;
	};

	return <tbody>{table.getRowModel().rows.map(TableBodyCallback)}</tbody>;
};

export default TableBody;
