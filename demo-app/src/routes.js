import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import FilterableTable from './containers/FilterableTable';
import EnterData from './containers/EnterData';

export default (
	<Route path="/" component={App}>
		<IndexRoute component={FilterableTable} />
		<Route path="/enter-data" component={EnterData} />
	</Route>
);
