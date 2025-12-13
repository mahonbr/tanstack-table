import styled from '@emotion/styled';
import clsx from 'clsx';

import ErrorBoundary from '@/components/feedback/ErrorBoundary';

const PREFIX = 'eda-datatable-overlay';

const classes = {
	root: `${PREFIX}-root`,
	overlayText: `${PREFIX}-overlayText`,
};

const OverlayRoot = styled('div')(() => ({
	[`&.${classes.root}`]: {
		alignItems: 'center',
		backgroundColor: 'var(--ag-modal-overlay-background-color)',
		bottom: 0,
		display: 'flex',
		inset: 0,
		justifyContent: 'center',
		position: 'absolute',

		[`.${classes.overlayText}`]: {
			backgroundColor: 'var(--ag-background-color)',
			border: 'var(--ag-borders) var(--ag-border-color)',
			borderRadius: 'var(--ag-border-radius)',
			boxShadow: 'var(--ag-card-shadow)',
			fontFamily: 'var(--ag-font-family)',
			fontSize: 'var(--ag-font-size)',
			padding: 'var(--ag-grid-size)',
		},
	},
}));

const Overlay = (props) => {
	const {
		className,
		overlayText = props.message ?? props.maskMsg ?? 'Loading...',
		overlayTextProps = {},
		...rest
	} = props;

	const { className: overlayTextClassName, ...overlayTextRest } = overlayTextProps;

	return (
		<ErrorBoundary>
			<OverlayRoot className={clsx(classes.root, className)} {...rest}>
				<div className={clsx(classes.overlayText, overlayTextClassName)} {...overlayTextRest}>
					{overlayText}
				</div>
			</OverlayRoot>
		</ErrorBoundary>
	);
};

export default Overlay;
