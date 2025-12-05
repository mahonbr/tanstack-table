import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';

import MenuTool from './tools/MenuTool';
import ResizeHandle from './ResizeHandle';
import SortIndicatorTool from './tools/SortIndicatorTool';
import Spacer from '@/components/toolbars/Spacer';

const TableHead = (props) => {
	const { table } = props;
	const { classes } = table.getMeta();

	/**
	 * Since we process header rows "top-down", I'm keeping track of the columns that have rendered
	 * a TH that spans multiple rows. The column ID will appear here when the TH is a placeholder AND
	 * has only ONE descendant with a subheader. We can ignore any placeholder or subheader "descendants"
	 * since they will be "covered" by the rowspan.
	 */
	const rowSpanColumnIds = [];

	return (
		<thead>
			{table.getHeaderGroups().map((headerGroup, i, headerGroups) => {
				const isLeafRow = i === headerGroups.length - 1;

				return (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							const { wrapHeaderText } = header.column.columnDef;
							const headerProps = {};
							const isRowSpanned = rowSpanColumnIds.includes(header.column.id);

							let forceSortIndicator = false; // To show sort indicator on spanned header placeholders.

							if (isRowSpanned) {
								return null;
							} else if (header.isPlaceholder && header.subHeaders.length === 1) {
								headerProps.rowSpan = headerGroups.length - header.depth + 1;
								forceSortIndicator = true;
								rowSpanColumnIds.push(header.column.id);
							} else if (header.isPlaceholder) {
								return (
									<th
										key={header.id}
										className={clsx(classes.headerPlaceholder, {
											'ag-header-row-column-group': !isLeafRow,
										})}
									/>
								);
							}

							return (
								<th
									key={header.id}
									colSpan={header.colSpan}
									{...headerProps}
									className={clsx(classes.header, header.column.columnDef?.headerClass, {
										'ag-header-row-column-group': !isLeafRow,
										[classes?.resizing]: header.column.getIsResizing(),
									})}
								>
									<div
										onClick={header.column.getToggleSortingHandler()}
										className={clsx('ag-header-cell-label-container', {
											[classes?.sortable]: header.column.getCanSort(),
										})}
									>
										<div className={clsx('ag-header-cell-label')}>
											<div
												className={clsx('ag-header-cell-text', {
													[classes.wrapText]: wrapHeaderText,
												})}
											>
												{flexRender(header.column.columnDef.header, header.getContext())}
											</div>

											{(isLeafRow || forceSortIndicator) && (
												<>
													{header.column.getCanSort() && (
														<SortIndicatorTool sorted={header.column.getIsSorted()} />
													)}

													{header.column.columnDef.suppressHeaderMenuButton !== true && (
														<>
															<Spacer style={{ minWidth: 6 }} />
															<MenuTool classes={classes} />
														</>
													)}
												</>
											)}
										</div>
									</div>
									<ResizeHandle {...header.getContext()} />
								</th>
							);
						})}
					</tr>
				);
			})}
		</thead>
	);
};

export default TableHead;
