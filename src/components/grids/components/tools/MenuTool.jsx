import { useEffect, useState } from 'react';

import { Menu } from '@base-ui/react/menu';
import { useUpdateEffect } from 'react-use';

import {
	IconArrowNarrowDown,
	IconArrowNarrowUp,
	IconCheck,
	IconChevronRight,
	IconDotsVertical,
	IconSelector,
} from '@tabler/icons-react';

import styles from './MenuTool.module.css';

function getOffset({ side }) {
	return side === 'top' || side === 'bottom' ? 4 : -4;
}

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
	const { Icon = IconCheck, label, value } = props;

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
	const { classes, className, header, Icon = IconDotsVertical, onClick: onClickProp, ...rest } = props;
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
								Icon={IconArrowNarrowUp}
								label={'Sort Ascending'}
								onClick={onSortChange}
								value={'asc'}
							/>
						)}
						{sorted !== 'desc' && (
							<MenuItem
								Icon={IconArrowNarrowDown}
								label={'Sort Descending'}
								onClick={onSortChange}
								value={'desc'}
							/>
						)}
						{sorted !== false && (
							<MenuItem onClick={onSortChange} label={'Clear Sort'} value={false} Icon={IconSelector} />
						)}
						<Menu.Separator className={styles.Separator} />
						<Menu.Item disabled className={styles.Item}>
							Choose Columns
						</Menu.Item>
						<Menu.Item className={styles.Item}>Reset Columns</Menu.Item>
						<Menu.Separator className={styles.Separator} />
						<Menu.SubmenuRoot>
							<Menu.SubmenuTrigger className={styles.SubmenuTrigger}>
								Pin Column
								<IconChevronRight style={{ height: 16, width: 16 }} />
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
