import store from '../redux/store/store'

export const getMapByKey = (key) => {
  const storeData = store.getState()
  return storeData.mappingsStore.allMappings[key]
}

export const getLocalizationPropByKey = (key) => {
  const storeData = store.getState()
  return storeData.localizationStore[key]
}