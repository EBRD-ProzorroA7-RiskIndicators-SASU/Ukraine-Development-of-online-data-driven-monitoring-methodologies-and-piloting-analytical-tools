import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Monitoring from '../../components/Monitoring/Monitoring'
import AnalyticalModel from '../../components/AnalyticalModel/AnalyticalModel'
import MethodologicalBase from '../../components/MethodologicalBase/MethodologicalBase'
import Advertising from '../../components/Advertising/Advertising'
import AdvertisingSiteCapabilities from '../../components/AdvertisingSiteCapabilities/AdvertisingSiteCapabilities'
import Questions from '../../components/Questions/Questions'
import { getDataForMainPage } from '../../redux/actions/mainPageActions'
import { Helmet } from 'react-helmet'
import './styles.scss'

const MainPage = () => {
  const dispatch = useDispatch()
  const mainPageData = useSelector(state => state.mainPageData.data)
  const [allMainInfo, setAllMainInfo] = useState(null)

  useEffect(() => {
    dispatch(getDataForMainPage())
  }, [dispatch])

  useEffect(() => {
    setAllMainInfo(mainPageData)
  }, [mainPageData])

  return (
    <>
      <Helmet>
        <title>{window.location.href}</title>
      </Helmet>
      <Monitoring
        allMainInfo={allMainInfo}
      />
      <AnalyticalModel
        allMainInfo={allMainInfo}
      />
      <MethodologicalBase />
      <Advertising />
      <AdvertisingSiteCapabilities />
      <Questions />
    </>
  )
}

export default MainPage
