import { useEffect, useState } from 'react';

import { flexRender } from '@tanstack/react-table';
import { Menu } from '@base-ui/react/menu';
import { useUpdateEffect } from 'react-use';

import {
	ArrowNarrowDownIcon,
	ArrowNarrowUpIcon,
	CheckIcon,
	ChevronRightIcon,
	DotsVerticalIcon,
	SelectorIcon,
} from '@/components/icons';
import styles from './MenuTool.module.css';

function getOffset({ side }) {
	return side === 'top' || side === 'bottom' ? 4 : -4;
}

const CheckboxItem = (props) => {
	const { label, ...rest } = props;

	return (
		<Menu.CheckboxItem {...rest}>
			<Menu.CheckboxItemIndicator className={styles.CheckboxItemIndicator}>
				<CheckIcon className={styles.CheckboxItemIndicatorIcon} />
			</Menu.CheckboxItemIndicator>
			<span className={styles.CheckboxItemText}>{label}</span>
		</Menu.CheckboxItem>
	);
};

const MenuItem = (props) => {
	const { Icon = IconCheck, label, onClick, value } = props;

	return (
		<Menu.Item
			className={styles.Item}
			closeOnClick
			onClick={() => onClick?.(value)}
			style={{ gap: 8 }}
			value={value}
		>
			<Icon className={styles.RadioItemIndicatorIcon} style={{ height: 16, width: 16 }} />
			<span className={styles.RadioItemText}>{label}</span>
		</Menu.Item>
	);
};

const RadioItem = (props) => {
	const { Icon = CheckIcon, label, value } = props;

	return (
		<Menu.RadioItem closeOnClick className={styles.RadioItem} value={value}>
			<Menu.RadioItemIndicator className={styles.RadioItemIndicator}>
				<Icon className={styles.RadioItemIndicatorIcon} style={{ height: 16, width: 16 }} />
			</Menu.RadioItemIndicator>
			<span className={styles.RadioItemText}>{label}</span>
		</Menu.RadioItem>
	);
};

const MenuTool = (props) => {
	const { classes, className, header, Icon = DotsVerticalIcon, onClick: onClickProp, ...rest } = props;
	const { column, table } = header.getContext();

	const [pin, setPin] = useState(column.getIsPinned());
	const sorted = column.getIsSorted();

	const onClickCallback = (event) => {
		event.stopPropagation();
		onClickProp?.(event);
	};

	useUpdateEffect(() => {
		if (column.getIsPinned() === pin) return;
		column.pin(pin);
	}, [pin]);

	useEffect(() => {
		setPin(column.getIsPinned());
	}, [column.getIsPinned()]);

	const onSortChange = (value) => {
		if (value === false) {
			table.setSorting((prev) => prev.filter((sort) => sort.id !== column.id));
		} else {
			table.setSorting([{ id: column.id, desc: value === 'desc' }]);
		}
	};

	return (
		<Menu.Root>
			<Menu.Trigger className={styles.Button} onClick={onClickCallback}>
				<Icon className={styles.ButtonIcon} />
			</Menu.Trigger>
			<Menu.Portal>
				<Menu.Positioner className={styles.Positioner} sideOffset={8}>
					<Menu.Popup className={styles.Popup} onClick={(event) => event.stopPropagation()}>
						{sorted !== 'asc' && (
							<MenuItem
								Icon={ArrowNarrowUpIcon}
								label={'Sort Ascending'}
								onClick={onSortChange}
								value={'asc'}
							/>
						)}
						{sorted !== 'desc' && (
							<MenuItem
								Icon={ArrowNarrowDownIcon}
								label={'Sort Descending'}
								onClick={onSortChange}
								value={'desc'}
							/>
						)}
						{sorted !== false && (
							<MenuItem onClick={onSortChange} label={'Clear Sort'} value={false} Icon={SelectorIcon} />
						)}
						<Menu.Separator className={styles.Separator} />
						<Menu.SubmenuRoot>
							<Menu.SubmenuTrigger className={styles.SubmenuTrigger}>
								Choose Columns
								<ChevronRightIcon style={{ height: 16, width: 16 }} />
							</Menu.SubmenuTrigger>
							<Menu.Portal>
								<Menu.Positioner
									alignOffset={getOffset}
									className={styles.Positioner}
									sideOffset={getOffset}
								>
									<Menu.Popup className={styles.Popup}>
										{table.getAllLeafColumns().map((column) => {
											return (
												<CheckboxItem
													key={column.id}
													checked={column.getIsVisible()}
													className={styles.CheckboxItem}
													label={flexRender(column.columnDef.header, header.getContext())}
													onCheckedChange={(visible, event) => {
														column.toggleVisibility(visible);
													}}
												/>
											);
										})}
									</Menu.Popup>
								</Menu.Positioner>
							</Menu.Portal>
						</Menu.SubmenuRoot>
						<Menu.Item
							className={styles.Item}
							onClick={() => {
								table.resetColumnVisibility();
							}}
						>
							Reset Columns
						</Menu.Item>
						<Menu.Separator className={styles.Separator} />
						<Menu.SubmenuRoot>
							<Menu.SubmenuTrigger className={styles.SubmenuTrigger}>
								Pin Column
								<ChevronRightIcon style={{ height: 16, width: 16 }} />
							</Menu.SubmenuTrigger>
							<Menu.Portal>
								<Menu.Positioner
									className={styles.Positioner}
									sideOffset={getOffset}
									alignOffset={getOffset}
								>
									<Menu.Popup className={styles.Popup}>
										<Menu.RadioGroup value={pin} onValueChange={setPin}>
											<RadioItem className={styles.RadioItem} label={'No Pin'} value={false} />
											<RadioItem className={styles.RadioItem} label={'Pin Left'} value={'left'} />
											<RadioItem
												className={styles.RadioItem}
												label={'Pin Right'}
												value={'right'}
											/>
										</Menu.RadioGroup>
									</Menu.Popup>
								</Menu.Positioner>
							</Menu.Portal>
						</Menu.SubmenuRoot>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
	);
};

export default MenuTool;
