import CityListPage from "../pages/CityListPage";
import CityDetailPage from "../pages/CityDetailPage";

const routes = [
	{
		path: "/CityDetails/:city",
		component: CityDetailPage
	},
	{
		path: "/",
		component: CityListPage,
		exact: true
	}
];

export default routes;
