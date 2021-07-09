import { combineReducers } from "redux";
import { mainPageData } from './mainPage';
import { resourcesPageData } from './resourcesPage';
import { currentDate } from './currentDate';
import { comparativeDynamicsPageData } from './сomparativeDynamicsPage';
import { monitoringMarketPageData } from './monitoringMarketPage';
import { monitoringRegionsPageData } from './monitoringRegionsPage';
import { monitoringTypesPageStore } from './monitoringTypesPage';
import { monitoringStore } from './monitoring';
import { mappingsStore } from './mappings';

export default combineReducers({
    mainPageData,
    resourcesPageData,
    currentDate,
    comparativeDynamicsPageData,
    monitoringMarketPageData,
    monitoringRegionsPageData,
    monitoringTypesPageStore,
    monitoringStore,
    mappingsStore,
})