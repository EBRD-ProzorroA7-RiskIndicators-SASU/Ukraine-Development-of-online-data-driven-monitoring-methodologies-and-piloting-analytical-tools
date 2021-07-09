/**
 * This UUID is used to check existed local storage version.
 * This was introduced to solve data keys differences.
 */
const LOCAL_STORAGE_UUID_KEY = 'LocalStorageUUID'
const LOCAL_STORAGE_UUID = 'ea4ce140-0a98-11e9-ab14-d663bd873d93'

class LocalStorageService {

  /**
   * NOTICE: This method should be called once at App container.
   *
   * It checks local storage UUID.
   * It clears all local storage  data and sets UUID if there is no value by key {@code LOCAL_STORAGE_UUID_KEY}.
   * Else it compares existed UUID and {@code LOCAL_STORAGE_UUID} values. If these values are not equal,
   * then it clears all local storage data and sets actual UUID.
   * */
  static checkLocalStorageUUID = () => {
    const uuid = LocalStorageService.get(LOCAL_STORAGE_UUID_KEY)

    if (!uuid || uuid !== LOCAL_STORAGE_UUID) {
      LocalStorageService.clearAll()
      LocalStorageService.set(LOCAL_STORAGE_UUID_KEY, LOCAL_STORAGE_UUID)
    }
  }

  static set = (key, data) => {
    if (!localStorage || !key) {
      return
    }
    localStorage.setItem(key, JSON.stringify(data))
  }

  static get = (key) => {
    try {
      const data = localStorage.getItem(key)
      return JSON.parse(data)
    } catch (e) {
      return undefined
    }
  }

  static getAll = () => {
    let data = {}

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      data[key] = (LocalStorageService.get(key))
    }

    return data
  }

  static remove = (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      return false
    }
  }

  static clearAll = () => {
    try {
      localStorage.clear()
      return true
    } catch (e) {
      return false
    }
  }
}

export default LocalStorageService
