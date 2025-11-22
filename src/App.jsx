import Grid from '@/components/grids/Grid';

const PREFIX = 'EdaCustomGrid';

export const classes = {
	root: `${PREFIX}-root`,
	sortable: `${PREFIX}-sortable`,
	hidden: `${PREFIX}-hidden`,
};

function App(props) {
	return <Grid />;
}

export default App;
