import styled from '@emotion/styled';
import clsx from 'clsx';

const PREFIX = 'eda-datatable-overlay';

const classes = {
	root: `${PREFIX}-root`,
	message: `${PREFIX}-message`,
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

		[`.${classes.message}`]: {
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
	const { className, message = props.maskMsg ?? 'Loading', messageProps = {}, ...rest } = props;
	const { className: messageClassName, ...messageRest } = messageProps;

	return (
		<OverlayRoot className={clsx(classes.root, className)} {...rest}>
			<div className={clsx(classes.message, messageClassName)} {...messageRest}>
				{message}
			</div>
		</OverlayRoot>
	);
};

export default Overlay;
