import { flexRender } from '@tanstack/react-table';
import { IconArrowDown, IconArrowUp, IconDotsVertical } from '@tabler/icons-react';
import clsx from 'clsx';

const onMenuClick = (event) => {
	event.stopPropagation();
	alert('Menu clicked!');
};

const SortIndicatorTool = ({ sorted }) => {
	if (sorted) {
		return sorted === 'asc' ? <IconArrowUp size={16} /> : <IconArrowDown size={16} />;
	}
};

const Spacer = (props) => {
	return <div className={'spacer'} style={{ flex: 1 }} {...props} />;
};

const TableHead = (props) => {
	const { table } = props;
	const { classes } = table.getMeta();

	return (
		<thead>
			{table.getHeaderGroups().map((headerGroup, i, headerGroups) => {
				const isLeafRow = i === headerGroups.length - 1;

				return (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							// Guard clause for placeholder headers.
							if (header.isPlaceholder) {
								return (
									<th
										key={header.id}
										className={clsx('placeholder', {
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
									className={clsx(header.column.columnDef?.headerClass, {
										[classes?.sortable]: header.column.getCanSort(),
										'ag-header-row-column-group': !isLeafRow,
									})}
								>
									<div className={clsx(classes?.headerCellWrapper)}>
										{flexRender(header.column.columnDef.header, header.getContext())}

										{isLeafRow && (
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
