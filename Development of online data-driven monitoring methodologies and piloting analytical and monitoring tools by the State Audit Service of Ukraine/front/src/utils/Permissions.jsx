import _ from 'lodash'
import {PERMISSIONS} from "../components/secutiry/PermissionConstants";

export function hasPermission (permission) {
  // let userInfo = jwt_decode(localStorage.getItem('kg_risks_token'))
  let userInfo = JSON.parse(localStorage.getItem('kg_risks_user_info'))
  return userInfo && _.includes(userInfo.permissions, permission)
}

export function isSupervisor() {
  let userInfo = JSON.parse(localStorage.getItem('kg_risks_user_info'))
  return userInfo && _.includes(userInfo.permissions, PERMISSIONS.supervisor)
}

export function isAdmin() {
  let userInfo = JSON.parse(localStorage.getItem('kg_risks_user_info'))
  return userInfo && _.includes(userInfo.permissions, PERMISSIONS.adminBase)
}

export function isAuditor() {
  let userInfo = JSON.parse(localStorage.getItem('kg_risks_user_info'))
  return userInfo && _.includes(userInfo.permissions, PERMISSIONS.auditorBase)
}

export function isHead() {
  let userInfo = JSON.parse(localStorage.getItem('kg_risks_user_info'))
  return userInfo && _.includes(userInfo.permissions, PERMISSIONS.head)
}

export function hasUrkAvtoDorAnalyticsPermission() {
  let userInfo = JSON.parse(localStorage.getItem('kg_risks_user_info'))
  return userInfo && userInfo.enableUrkAvtoDorAnalytics
}
