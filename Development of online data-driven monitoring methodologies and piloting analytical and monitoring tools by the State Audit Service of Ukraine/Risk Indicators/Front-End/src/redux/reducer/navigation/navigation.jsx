import * as NavigationConstants from '../../action/navigation/NavigationConstants'

const initialState = {
  defaultSelectedKey: '1',
  collapsed: true,
  defaultMenuSize: 80,
  breadcrumbOptions: [],
  showDisabledMessage: false,
}

export default function navigationStore(state = initialState, action) {
  switch (action.type) {
    // GET
    case NavigationConstants.CHANGE_NAVIGATION_KEY:
      return {
        ...state,
        defaultSelectedKey: action.data,
      }

      case NavigationConstants.CHANGE_NAVIGATION_MENU_SIZE:
      return {
        ...state,
        collapsed: action.collapsed,
        defaultMenuSize: action.data,
      }

      case NavigationConstants.CHANGE_BREADCRUMB_OPTIONS:
      return {
        ...state,
        breadcrumbOptions: action.data,
      }

      case NavigationConstants.SET_USER_DISABLED_ERROR:
      return {
        ...state,
        showDisabledMessage: action.data,
      }
    default:
      return state
  }
}