import React from 'react'
import {Redirect, Route, Switch,} from 'react-router-dom'
import _ from 'lodash'
import {NAVIGATION_BAR_ITEMS} from './components/navigationBar/NavigationBarConstants'
import {isAdmin, isAuditor, isHead, isSupervisor, hasUrkAvtoDorAnalyticsPermission} from './utils/Permissions'
import BuyerInspectionHistory from './pages/inspections/BuyerInspectionHistory'
import TemplateConstructor from './pages/templates/TemplateConstructor'
import TemplateAuditorConstructor from './pages/templates/TemplateAuditorConstructor'
import InspectionPage from './pages/inspections/InspectionPage'
import Templates from './pages/templates/Templates'
import LoginPage from './pages/login/LoginPage'
import AdministrationPage from './pages/administration/AdministrationPage'
import PrioritizationTender from './pages/prioritization/PrioritizationTender'
import PrioritizationBuyer from './pages/prioritization/PrioritizationBuyer'
import SupervisorAnalytics from './pages/analytic/SupervisorAnalytics'
import SettingsPage from './pages/settings/SettingsPage'
import HomePageSwitcher from './HomePageSwitcher'
import OptionalUserAnalytics from "./pages/analytic/AuditorHeadAnalytics";
import ChecklistsIMF from "./pages/analytic/ChecklistsIMF";
import RateAnalytics from "./pages/analytic/RateAnalytics";
import CommonChecklistsIMF from "./pages/analytic/CommonChecklistsIMF";
import Report from "./pages/analytic/Reports";
import BuyerManagePage from "./pages/administration/BuyerManagePage";
import UkrAvtoDorAnalytics from "./pages/analytic/UkrAvtoDorAnalytics";

export const PublicRoutes = () => (
    <Switch>
        <Route path="/login" component={LoginPage}/>
        <Redirect to="/login"/>
    </Switch>
)

const getMenuKeyByPath = (routPath) => {
    let searchMenuObject = {}

    _.forEach(NAVIGATION_BAR_ITEMS, (item) => {
        if (!_.isEmpty(item.subMenu)) {
            _.forEach(item.subMenu, (subItem) => {
                (subItem.path === routPath) && (searchMenuObject = subItem)
            })
        } else {
            (item.path === routPath) && (searchMenuObject = item)
        }
    })

    return searchMenuObject
}

export const AuthenticatedRoutes = () => (
    <Switch>

        <Route exact path="/login" render={() => <Redirect to='/'/>}/>
        <Route exact path='/' render={(props) => <HomePageSwitcher/>}/>

        {(isAuditor() || isSupervisor()) && <Route exact path='/home'
                                                   render={(props) =>
                                                       <PrioritizationTender {...props}
                                                                             menuKey={getMenuKeyByPath('/home')}/>}/>}

        {(isSupervisor() || isHead()) && <Route exact path='/analytics'
                                                render={(props) =>
                                                    <SupervisorAnalytics {...props}
                                                                         menuKey={getMenuKeyByPath('/analytics')}/>}/>}

        {isHead() && <Route exact path='/analytics/head'
                            render={(props) =>
                                <OptionalUserAnalytics {...props}
                                                       menuKey={getMenuKeyByPath('/analytics/head')}/>}/>}

        <Route exact path='/analytics/imf'
               render={(props) =>
                   <ChecklistsIMF {...props}
                                  menuKey={getMenuKeyByPath('/analytics/imf')}/>}/>

        <Route exact path='/analytics/common-imf-checklist'
               render={(props) =>
                   <CommonChecklistsIMF {...props}
                                        menuKey={getMenuKeyByPath('/analytics/common-imf-checklist')}/>}/>

        {(isSupervisor() || isAdmin()) && <Route exact path='/analytics/rate'
                                                 render={(props) =>
                                                     <RateAnalytics {...props}
                                                                    menuKey={getMenuKeyByPath('/analytics/rate')}/>}/>}


        <Route exact path='/templates'
               render={(props) => <Templates {...props} menuKey={getMenuKeyByPath('/templates')}/>}/>
        <Route exact path='/inspections/buyer'
               render={(props) => <BuyerInspectionHistory {...props}
                                                          menuKey={getMenuKeyByPath('/inspections/buyer')}/>}/>
        <Route path='/inspections/buyer/add'
               render={(props) => <InspectionPage {...props}
                                                  menuKey={getMenuKeyByPath('/inspections/buyer')}/>}/>} />

        <Route exact path='/templates/constructor' component={TemplateConstructor}/>
        <Route exact path='/templates/constructor/custom' component={TemplateAuditorConstructor}/>
        <Route exact path='/prioritization/tenders' render={(props) => <PrioritizationTender {...props}
                                                                                             menuKey={getMenuKeyByPath('/prioritization/tenders')}/>}/>
        <Route exact path='/prioritization/buyers' render={(props) => <PrioritizationBuyer {...props}
                                                                                           menuKey={getMenuKeyByPath('/prioritization/buyers')}/>}/>
        <Route exact path='/prioritization/settings'
               render={(props) => <SettingsPage {...props} menuKey={getMenuKeyByPath('/prioritization/settings')}/>}/>


        {isAdmin() && <Route exact path='/administration/users'
                             render={(props) => <AdministrationPage {...props}
                                                                    menuKey={getMenuKeyByPath('/administration/users')}/>}/>}

        {isAdmin() && <Route exact path='/administration/buyers'
                             render={(props) => <BuyerManagePage {...props}
                                                                    menuKey={getMenuKeyByPath('/administration/buyers')}/>}/>}

        <Route exact path='/analytics/reports'
               render={(props) =>
                   <Report {...props}
                           menuKey={getMenuKeyByPath('/analytics/reports')}
                   />}/>

        {hasUrkAvtoDorAnalyticsPermission() && <Route exact path='/analytics/ukr-avto-dor'
                             render={(props) => <UkrAvtoDorAnalytics {...props}
                                                                 menuKey={getMenuKeyByPath('/analytics/ukr-avto-dor')}/>}/>}
    </Switch>
)
