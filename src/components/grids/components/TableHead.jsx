import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';

import ErrorBoundary from '@/components/feedback/ErrorBoundary';
import Spacer from '@/components/toolbars/Spacer';

import MenuTool from './tools/MenuTool';
import ResizeHandle from './ResizeHandle';
import SortIndicatorTool from './tools/SortIndicatorTool';

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
		<ErrorBoundary>
			<thead className={clsx(classes.header)}>
				{table.getHeaderGroups().map((headerGroup, i, headerGroups) => {
					const isLeafRow = i === headerGroups.length - 1;

					return (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const { column } = header;

								const headerContext = header.getContext();
								const headerProps = {};
								const isRowSpanned = rowSpanColumnIds.includes(column.id);
								const isPinned = column.getIsPinned();

								// To show sort indicator on spanned header placeholders.
								let forceSortIndicator = false;

								if (isRowSpanned) {
									return null;
								} else if (header.isPlaceholder && header.subHeaders.length === 1) {
									headerProps.rowSpan = headerGroups.length - header.depth + 1;
									forceSortIndicator = true;
									rowSpanColumnIds.push(column.id);
								} else if (header.isPlaceholder) {
									return (
										<th
											key={header.id}
											className={clsx(classes.headerPlaceholder, {
												[classes.headerRowColumnGroup]: !isLeafRow,
												[classes.pinned]: isPinned,
												[classes.pinnedFirstRight]: column.getIsFirstColumn('right'),
												[classes.pinnedLastLeft]: column.getIsLastColumn('left'),
											})}
										/>
									);
								}

								const { align, headerAlign, headerClass, suppressHeaderMenuButton, wrapHeaderText } =
									column.getMeta() ?? {};

								return (
									<th
										key={header.id}
										colSpan={header.colSpan}
										{...headerProps}
										style={{
											left: isPinned === 'left' ? column.getStart('left') : undefined,
											right: isPinned === 'right' ? column.getAfter('right') : undefined,
											// width: column.getSize(),
										}}
										className={clsx(
											classes.headerCell,
											headerClass,
											`ag-${headerAlign ?? align}-aligned-header`,
											{
												[classes.headerRowColumnGroup]: !isLeafRow,
												[classes.pinned]: column.getIsPinned(),
												[classes.pinnedFirstRight]: column.getIsFirstColumn('right'),
												[classes.pinnedLastLeft]: column.getIsLastColumn('left'),
												[classes.resizing]: column.getIsResizing(),
											}
										)}
									>
										<div
											onClick={column.getToggleSortingHandler()}
											className={clsx(classes.headerCellLabelContainer, {
												[classes.sortable]: column.getCanSort(),
											})}
										>
											<div className={clsx(classes.headerCellLabel)}>
												<div
													className={clsx(classes.headerCellText, {
														[classes.wrapText]: wrapHeaderText,
													})}
												>
													{flexRender(column.columnDef.header, headerContext)}
												</div>

												{(isLeafRow || forceSortIndicator) && (
													<>
														{column.getCanSort() && (
															<>
																<Spacer style={{ maxWidth: 8, minWidth: 8 }} />
																<SortIndicatorTool sorted={column.getIsSorted()} />
															</>
														)}

														{suppressHeaderMenuButton !== true && (
															<>
																<Spacer style={{ minWidth: 6 }} />
																<MenuTool classes={classes} header={header} />
															</>
														)}
													</>
												)}
											</div>
										</div>
										{column.getCanResize() && <ResizeHandle {...headerContext} />}
									</th>
								);
							})}
						</tr>
					);
				})}
			</thead>
		</ErrorBoundary>
	);
};

export default TableHead;
