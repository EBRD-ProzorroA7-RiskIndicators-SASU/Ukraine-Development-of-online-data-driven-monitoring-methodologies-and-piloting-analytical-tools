import * as NavigationConstants from './NavigationConstants'

export function changeNavigationItem(navItemKey) {
  return (dispatch) => dispatch({
    type: NavigationConstants.CHANGE_NAVIGATION_KEY,
    data: navItemKey,
  })
}

export function changeNavigationMenuSize(size, collapsed) {
  return (dispatch) => dispatch({
    type: NavigationConstants.CHANGE_NAVIGATION_MENU_SIZE,
    data: size,
    collapsed: collapsed,
  })
}

export function setBreadCrumbsOptions(breadcrumbsOptions) {
  return (dispatch) => dispatch({
    type: NavigationConstants.CHANGE_BREADCRUMB_OPTIONS,
    data: breadcrumbsOptions,
  })
}


export function setDisabledUserMessage(showStatus) {
  return (dispatch) => dispatch({
    type: NavigationConstants.SET_USER_DISABLED_ERROR,
    data: showStatus,
  })
}