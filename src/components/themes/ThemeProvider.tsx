import { ThemeProvider as ThemeProviderRoot } from '@emotion/react';
import { Theme } from '@emotion/react';

export interface ThemeProps extends Theme {
	/**
	 * Spacing helper from the theme.
	 *
	 * Accepts one or more numeric arguments (e.g. `spacing(1)`, `spacing(1, 2)`)
	 * and returns a CSS spacing string.
	 */
	spacing: (value: number, ...rest: number[]) => string;
}

const baseTheme = {
	options: {
		spacing: 8,
	},
	palette: {
		common: {
			black: '#000',
			white: '#fff',
		},
		primary: {
			main: '#1976d2',
			contrastText: '#fff',
		},
		secondary: {
			main: '#9c27b0',
			contrastText: '#fff',
		},
		error: {
			main: '#f44336',
			contrastText: '#fff',
		},
		warning: {
			main: '#ff9800',
			contrastText: '#fff',
		},
		info: {
			main: '#2196f3',
			contrastText: '#fff',
		},
		success: {
			main: '#4caf50',
			contrastText: '#fff',
		},
		grey: {
			50: '#fafafa',
			100: '#f5f5f5',
			200: '#eeeeee',
			300: '#e0e0e0',
			400: '#bdbdbd',
			500: '#9e9e9e',
			600: '#757575',
			700: '#616161',
			800: '#424242',
			900: ' #212121',
			A100: '#f5f5f5',
			A200: '#eeeeee',
			A400: '#bdbdbd',
			A700: '#616161',
		},
		text: {
			primary: 'rgba(0, 0, 0, 0.87)',
			secondary: 'rgba(0, 0, 0, 0.54)',
			disabled: 'rgba(0, 0, 0, 0.38)',
		},
		divider: 'rgba(0, 0, 0, 0.12)',
		background: {
			paper: '#fff',
			default: '#fff',
		},
		action: {
			active: 'rgba(0, 0, 0, 0.54)',
			hover: 'rgba(0, 0, 0, 0.04)',
			selected: 'rgba(0, 0, 0, 0.08)',
			disabled: 'rgba(0, 0, 0, 0.26)',
			disabledBackground: 'rgba(0, 0, 0, 0.12)',
			focus: 'rgba(0, 0, 0, 0.12)',
		},
	},
	shape: {
		borderRadius: 'var(--ag-border-radius)',
	},
	spacing(...argsInput: (number | string)[]): string {
		const { spacing = 8 } = this.options;

		const callback = (arg: number | string) => (typeof arg === 'number' ? `${arg * spacing}px` : arg);
		return argsInput.map(callback).join(' ');
	},
};

const ThemeProvider = (props: { children: React.ReactNode; theme?: ThemeProps }) => {
	const { children, theme = baseTheme } = props;
	return <ThemeProviderRoot theme={theme}>{children}</ThemeProviderRoot>;
};

export default ThemeProvider;
