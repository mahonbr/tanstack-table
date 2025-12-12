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
												[classes.headerRowColumnGroup]: !isLeafRow,
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
											[classes.headerRowColumnGroup]: !isLeafRow,
											[classes?.resizing]: header.column.getIsResizing(),
										})}
									>
										<div
											onClick={header.column.getToggleSortingHandler()}
											className={clsx(classes.headerCellLabelContainer, {
												[classes?.sortable]: header.column.getCanSort(),
											})}
										>
											<div className={clsx(classes.headerCellLabel)}>
												<div
													className={clsx(classes.headerCellText, {
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
										{header.column.getCanResize() && <ResizeHandle {...header.getContext()} />}
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
