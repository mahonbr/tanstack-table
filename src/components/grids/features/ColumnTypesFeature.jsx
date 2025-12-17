import { merge, pickBy } from 'lodash';

import { ConfigMap } from '@/utils';
import ColumnTypes from '../ColumnTypes';

/**
 * Once I convert to TypeScript I can leverage the type, but this is also serving as notes for the
 * TS implementation.
 */
const ColumnDefType = {
	id: 'string',
	accessorFn: 'function',
	accessorKey: 'string',
	aggregatedCell: '?',
	aggregationFn: 'function',
	cell: 'mixed',
	columns: 'array',
	enableColumnFilter: 'boolean',
	enableGlobalFilter: 'boolean',
	enableGrouping: 'boolean',
	enableHiding: 'boolean',
	enableMultiSort: 'boolean',
	enablePinning: 'boolean',
	enableResizing: 'boolean',
	enableSorting: 'boolean',
	filterFn: 'function',
	footer: 'mixed',
	getGroupingValue: 'function',
	header: 'mixed',
	invertSorting: 'boolean',
	maxSize: 'mixed',
	minSize: 'mixed',
	size: 'mixed',
	sortDescFirst: 'boolean',
	sortingFn: 'function',
	sortUndefined: 'boolean',
	meta: {
		align: 'left|right|center',
		cellClass: 'string|string[]',
		cellStyle: 'object',
		format: 'string',
		getCellClass: 'function',
		getCellStyle: 'function',
		headerAlign: 'left|right|center',
		onCellClicked: 'function', // Also available on the table so need to address.
		onCellDoubleClicked: 'function', // Also available on the table so need to address.
		pinned: 'left|right',
		suppressHeaderMenuButton: 'boolean',
		type: 'string|string[]',
		valueFormatter: 'function',
		wrapHeaderText: 'boolean',
		wrapText: 'boolean',
	},
};

/**
 * In order to "ease" the implementation, I'm allowing the user to enter the UI column configs either
 * within the meta section or at the root.
 *
 * This will return a new column definition with all non-standard keys moved to the meta section.
 */
const convertColumnDef = (columnDefIn) => {
	const columnDefOut = { meta: {} };

	for (const [key, value] of Object.entries(columnDefIn)) {
		if (key === 'meta') {
			Object.assign(columnDefOut.meta, value);
		} else if (ColumnDefType[key]) {
			columnDefOut[key] = value;
		} else {
			columnDefOut.meta[key] = value;
		}
	}

	return columnDefOut;
};

/**
 * @todo
 */
const ColumnTypesFeature = {
	createTable: (table) => {
		// console.log('ColumnTypesFeature.createTable');
		const registeredColumnTypes = new ConfigMap([...ColumnTypes, ...table.options.columnTypes]);
		table.getRegisteredColumnTypes = () => registeredColumnTypes;
	},

	createColumn: (column, table) => {
		column.columnDef = convertColumnDef(column.columnDef);

		if (column.columnDef.meta?.type) {
			const { accessorKey = column.id, ...rest } = column.columnDef;

			const defaultColumnDef = table._getDefaultColumnDef();
			const types = table.getRegisteredColumnTypes();
			const nonDefaultProps = pickBy(rest, (value, key) => value !== defaultColumnDef[key]);

			types.set(accessorKey, {
				...nonDefaultProps,
				accessorKey,
				extends: column.columnDef.meta.type,
			});

			// column.columnDef = deepMerge(column.columnDef, types.get(accessorKey));
			column.columnDef = merge({}, defaultColumnDef, column.columnDef, types.get(accessorKey));
		}
	},
};

export default ColumnTypesFeature;
