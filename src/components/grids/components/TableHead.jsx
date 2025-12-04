import { flexRender } from '@tanstack/react-table';
import { IconDotsVertical } from '@tabler/icons-react';
import clsx from 'clsx';

import SortIndicatorTool from './tools/SortIndicatorTool';
import Spacer from '@/components/toolbars/Spacer';

const onMenuClick = (event) => {
	event.stopPropagation();
	alert('Menu clicked!');
};

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
									onClick={header.column.getToggleSortingHandler()}
									{...headerProps}
									className={clsx(header.column.columnDef?.headerClass, {
										[classes?.sortable]: header.column.getCanSort(),
										'ag-header-row-column-group': !isLeafRow,
									})}
								>
									<div className={clsx(classes?.headerCellWrapper)}>
										{flexRender(header.column.columnDef.header, header.getContext())}

										{(isLeafRow || forceSortIndicator) && (
											<>
												{header.column.getCanSort() && (
													<SortIndicatorTool sorted={header.column.getIsSorted()} />
												)}

												{header.column.columnDef.suppressHeaderMenuButton !== true && (
													<>
														<Spacer />

														<button
															className={classes?.headerMenuTool}
															onClick={onMenuClick}
														>
															<IconDotsVertical size={16} />
														</button>
													</>
												)}
											</>
										)}
									</div>
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
