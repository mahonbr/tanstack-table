import { useMemo } from 'react';

import { find } from 'lodash';
import { produce } from 'immer';

import { baseColumnTypes } from '../DataTable.utils';

const useCheckBoxSelection = ({ columns: columnsProp, enableCheckboxSelection, setColumnPinning }) => {
	const columns = useMemo(() => {
		const columnDef = baseColumnTypes.get('__eda_selection_column__');

		/**
		 * We add the selection column if checkbox selection is enabled and the column is not already
		 * present.
		 */
		if (enableCheckboxSelection && !find(columnsProp, { id: columnDef.id })) {
			setColumnPinning?.(
				produce((draft) => {
					if (!draft.left?.includes?.(columnDef.id)) {
						draft.left = [columnDef.id, ...draft.left];
					}
				})
			);

			return [columnDef, ...columnsProp];
		} else if (!enableCheckboxSelection) {
			setColumnPinning?.(
				produce((draft) => {
					if (draft.left?.includes?.(columnDef.id)) {
						draft.left = draft.left.filter((colId) => colId !== columnDef.id);
					}
				})
			);
		}

		return columnsProp;
	}, [columnsProp, enableCheckboxSelection, setColumnPinning]);

	return columns;
};

export default useCheckBoxSelection;
