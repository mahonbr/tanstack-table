import { ConfigMap } from '@/utils';
import ColumnTypes from './ColumnTypes';

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
	enableColumnPinning: 'boolean',
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
		/**
		 * @todo Need to handle on column creation.
		 */
		pinned: 'left|right',
		suppressHeaderMenuButton: 'boolean',
		type: 'string|string[]',
		valueFormatter: 'function',
		wrapHeaderText: 'boolean',
		wrapText: 'boolean',
	},
};

/**
 * A ConfigMap seeded from the project's `ColumnTypes` registry that represents the baseline column
 * type definitions available to the data table. Each entry in this map is a named column type (for
 * example: "text", "number", etc.) and contains the default metadata and renderer/helper functions
 * for that type. Use this map to look up type defaults when constructing column definitions or to
 * extend/override available column types at application initialization.
 *
 * @usage
 * - Read defaults: `baseColumnTypes.get('text')`
 * - Add/override: `baseColumnTypes.set('currency', { meta: { format: '$0,0s' } })`
 */
export const baseColumnTypes = new ConfigMap([...ColumnTypes]);

/**
 * In order to "ease" the implementation, I'm allowing the user to enter the UI column configs either
 * within the meta section or at the root.
 */
export const convertColumnDef = (columnDefIn) => {
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
