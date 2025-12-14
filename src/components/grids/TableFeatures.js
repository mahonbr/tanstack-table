import { omit } from 'lodash';

/**
 * TableFeatures is a custom feature that injects helper methods to the table and column instances.
 *
 * - `createTable(table)`: Adds a `getMeta()` method to the table instance, returning `table.options.meta`.
 * - `createColumn(column)`: Adds a `getMeta()` method to the column instance, returning `column.columnDef?.meta`.
 *
 * This allows convenient access to custom metadata (such as classes or value formatters) throughout
 * the table and column lifecycle, especially in cell/column renderers.
 */
const TableFeatures = {
	createTable: (table) => {
		table.getMeta = () => table.options.meta;
	},

	createRow: (row, table) => {
		row.getContext = () => ({ row, table });
	},

	createColumn: (column, table) => {
		column.getMeta = () => column.columnDef?.meta;

		/**
		 * In order to implement resizing on "flex" columns I need to override the default getSize so
		 * TanStack's column sizing API works as expected. The column sizing doesn't work if getSize
		 * returns NaN. Now, if you resize a "flex" column, it converts it to pixel based width.
		 */
		const _getSize = column.getSize;

		column.getSize = () => {
			const size = _getSize();

			if (Number.isNaN(size)) {
				const { tableRef } = table.getMeta();
				const el = tableRef.current.querySelector?.(`[data-id=${column.id}]`);

				if (el) {
					return el.clientWidth;
				}
			}

			return size;
		};

		/**
		 * If the column contains leaves, then we want to reset the leaf columns. Instead of iterating
		 * through the columns, I'm updating state directly.
		 */
		const _resetSize = column.resetSize;

		column.resetSize = () => {
			if (column.columns.length > 0) {
				const ids = column.columns.map((column) => column.id);
				table.setColumnSizing((prevState) => omit({ ...prevState }, ids));
			} else {
				_resetSize();
			}
		};
	},
};

export default TableFeatures;
