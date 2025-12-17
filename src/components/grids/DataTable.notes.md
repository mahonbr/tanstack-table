```javascript
const ColumnTypesFeature = {
	createCell: (cell, column, row, table) => {},
	createColumn: (column, table) => {},
	createHeader: (header, table) => {},
	createRow: (row, table) => {},
	createTable: (table) => {},
	// getDefaultColumnDef: () => {},
	// getDefaultOptions: (table) => {},
	getInitialState: (initialState) => {},
	getDefaultColumnDef: () => {
		console.log('getDefaultColumnDef'); // Runs before createColumn.
		return {};
	},
	getDefaultOptions: () => {
		console.log('getDefaultOptions'); // Runs before createTable.
		return {};
	},
};
```

```javascript
const columnHelper = createColumnHelper();
const columns = [
	columnHelper.accessor('id', {
		header: 'ID',
		cell: (info) => info.getValue(),
	}),
];

const columns = [
	{
		accessorKey: 'firstName',
		header: 'First Name',
		cell: (info) => info.getValue(),
	},
	{
		accessorFn: (row) => row.firstName,
		header: 'First Name',
		cell: (info) => info.getValue(),
	},
	columnHelper.accessor('firstName', {
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
	}),
];
```

```css
/* overrides */
--ag-border-color: #d9d9d9;
--ag-cell-horizontal-padding: 10px;
--ag-font-family: 'Open Sans', 'Roboto', 'Helvetica', 'Arial', sans-serif;
--ag-font-size: 11px;
--ag-foreground-color: #231e33;
--ag-header-background-color: #ffffff;
--ag-header-font-weight: 600;
--ag-header-foreground-color: #231e33;
--ag-header-height: var(--ag-row-height);
--ag-odd-row-background-color: #f7f7f8;
--ag-range-selection-border-color: transparent;
--ag-row-border-color: transparent;
--ag-row-height: 28px;
--ag-wrapper-border: 0px solid #d9d9d9;
--ag-palette-error-main: #d90026;
--ag-palette-info-main: #6a97df;
--ag-palette-primary-main: #1a3673;
--ag-palette-secondary-main: #44b8f3;
--ag-palette-success-main: #53b1a3;
--ag-palette-warning-main: #f3c246;

/* default */
--ag-alpine-active-color: #2196f3;
--ag-selected-row-background-color: rgba(33, 150, 243, 0.3);
--ag-row-hover-color: rgba(33, 150, 243, 0.1);
--ag-column-hover-color: rgba(33, 150, 243, 0.1);
--ag-input-focus-border-color: rgba(33, 150, 243, 0.4);
--ag-range-selection-background-color: rgba(33, 150, 243, 0.2);
--ag-range-selection-background-color-2: rgba(33, 150, 243, 0.36);
--ag-range-selection-background-color-3: rgba(33, 150, 243, 0.49);
--ag-range-selection-background-color-4: rgba(33, 150, 243, 0.59);
--ag-row-numbers-selected-color: color-mix(in srgb, transparent, var(--ag-alpine-active-color) 50%);
--ag-background-color: #fff;
--ag-foreground-color: #181d1f;
--ag-border-color: #babfc7;
--ag-secondary-border-color: #dde2eb;
--ag-header-background-color: #f8f8f8;
--ag-tooltip-background-color: #f8f8f8;
--ag-odd-row-background-color: #fcfcfc;
--ag-control-panel-background-color: #f8f8f8;
--ag-subheader-background-color: #fff;
--ag-invalid-color: #e02525;
--ag-checkbox-unchecked-color: #999;
--ag-advanced-filter-join-pill-color: #f08e8d;
--ag-advanced-filter-column-pill-color: #a6e194;
--ag-advanced-filter-option-pill-color: #f3c08b;
--ag-advanced-filter-value-pill-color: #85c0e4;
--ag-find-match-color: var(--ag-foreground-color);
--ag-find-match-background-color: #ffff00;
--ag-find-active-match-color: var(--ag-foreground-color);
--ag-find-active-match-background-color: #ffa500;
--ag-checkbox-background-color: var(--ag-background-color);
--ag-checkbox-checked-color: var(--ag-alpine-active-color);
--ag-range-selection-border-color: var(--ag-alpine-active-color);
--ag-secondary-foreground-color: var(--ag-foreground-color);
--ag-input-border-color: var(--ag-border-color);
--ag-input-border-color-invalid: var(--ag-invalid-color);
--ag-input-focus-box-shadow: 0 0 2px 0.1rem var(--ag-input-focus-border-color);
--ag-panel-background-color: var(--ag-header-background-color);
--ag-menu-background-color: var(--ag-header-background-color);
--ag-disabled-foreground-color: rgba(24, 29, 31, 0.5);
--ag-chip-background-color: rgba(24, 29, 31, 0.07);
--ag-input-disabled-border-color: rgba(186, 191, 199, 0.3);
--ag-input-disabled-background-color: rgba(186, 191, 199, 0.15);
--ag-borders: solid 1px;
--ag-border-radius: 3px;
--ag-borders-side-button: none;
--ag-side-button-selected-background-color: transparent;
--ag-header-column-resize-handle-display: block;
--ag-header-column-resize-handle-width: 2px;
--ag-header-column-resize-handle-height: 30%;
--ag-grid-size: 6px;
--ag-icon-size: 16px;
--ag-row-height: calc(var(--ag-grid-size) * 7);
--ag-header-height: calc(var(--ag-grid-size) * 8);
--ag-list-item-height: calc(var(--ag-grid-size) * 4);
--ag-column-select-indent-size: var(--ag-icon-size);
--ag-set-filter-indent-size: var(--ag-icon-size);
--ag-advanced-filter-builder-indent-size: calc(var(--ag-icon-size) + var(--ag-grid-size) * 2);
--ag-cell-horizontal-padding: calc(var(--ag-grid-size) * 3);
--ag-cell-widget-spacing: calc(var(--ag-grid-size) * 2);
--ag-widget-container-vertical-padding: calc(var(--ag-grid-size) * 2);
--ag-widget-container-horizontal-padding: calc(var(--ag-grid-size) * 2);
--ag-widget-vertical-spacing: calc(var(--ag-grid-size) * 1.5);
--ag-toggle-button-height: 18px;
--ag-toggle-button-width: 28px;
--ag-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell,
	'Helvetica Neue', sans-serif;
--ag-font-size: 13px;
--ag-icon-font-family: agGridAlpine;
--ag-selected-tab-underline-color: var(--ag-alpine-active-color);
--ag-selected-tab-underline-width: 2px;
--ag-selected-tab-underline-transition-speed: 0.3s;
--ag-tab-min-width: 240px;
--ag-card-shadow: 0 1px 4px 1px rgba(186, 191, 199, 0.4);
--ag-popup-shadow: var(--ag-card-shadow);
--ag-side-bar-panel-width: 250px;
```
