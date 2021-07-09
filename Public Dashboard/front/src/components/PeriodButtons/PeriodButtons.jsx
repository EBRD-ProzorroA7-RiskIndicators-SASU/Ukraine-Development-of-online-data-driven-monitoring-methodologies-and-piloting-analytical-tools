import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Space, Select, Radio } from 'antd';
import * as dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { setCurrentDate } from '../../redux/actions/dateActions';
import { getBarChartInfo } from '../../redux/actions/monitoringRegionsActions';
import _ from 'lodash';
import 'dayjs/locale/uk';

dayjs.extend(relativeTime);

const PeriodButtons = ({ mobile, setPeriod, period, method, handleSelectPeriod, monitoringRegions=false }) => {
  const dispatch = useDispatch();
  const currentDate = useSelector(state => state.currentDate)
  const previousYear = dayjs().subtract(1, 'year').format('YYYY');
  let previousMonth = dayjs().startOf('M').format('YYYY-MM-DD');
  const lastTwelveMonth = dayjs(previousMonth).subtract(1, 'year').format('YYYY-MM-DD');
  let startYear = '2019';
  let years = [];

  while (startYear <= previousYear) {
    years.push(startYear++)
  }

  years = [...years, 'Останні повні 12 місяців']

  let options = _.map(years, year => {
    return {
      label: year,
      value: year
    }
  })

  const selectProps = {
    style: {
      width: '100%',
    },
    period,
    options,
    onChange: (newValue) => {
      setPeriod(newValue);
      if (newValue === 'Останні повні 12 місяців') {
        handleSelectPeriod && handleSelectPeriod([lastTwelveMonth, previousMonth]);
      } else {
        const currentYear = `${newValue}-01-01`;
        const nextYear = dayjs(currentYear).add(1, 'year').format('YYYY-MM-DD');
        handleSelectPeriod && handleSelectPeriod([currentYear, nextYear]);
      }
    },
  }

  const getDataForLastTwelveMonth = () => {
    method && dispatch(method(lastTwelveMonth, previousMonth))
    handleSelectPeriod && handleSelectPeriod([lastTwelveMonth, previousMonth]);
    dispatch(setCurrentDate(lastTwelveMonth, previousMonth))
    monitoringRegions && dispatch(getBarChartInfo(lastTwelveMonth, previousMonth))
  }

  const getDataForYear = (year) => {
    if (year === 'Останні повні 12 місяців') {
      getDataForLastTwelveMonth()
    } else {
      const currentYear = `${year}-01-01`;
      const nextYear = dayjs(currentYear).add(1, 'year').format('YYYY-MM-DD');
      method && dispatch(method(currentYear, nextYear))
      dispatch(setCurrentDate(currentYear, nextYear))
      handleSelectPeriod && handleSelectPeriod([currentYear, nextYear]);
      monitoringRegions && dispatch(getBarChartInfo(currentYear, nextYear))
    }
  }

  const renderDateButtons = () => {
    return _.map(years, (year, index) => (
      <Radio.Button
        key={index}
        className={`group-button`}
        value={year}
        onClick={() => getDataForYear(year)}
      >
        {year}
      </Radio.Button>
    ))
  }

  return !mobile ? (
    <div className="period-buttons">
      {/*<Radio.Group defaultValue={parseFloat(previousYear)} optionType="button">*/}
      <Radio.Group defaultValue={currentDate.defaultPeriod} optionType="button">
        {renderDateButtons()}
      </Radio.Group>
    </div>
  ) : (
      <Space
        id="period-wrapper"
        style={{
          width: 230,
          position: 'relative'
        }}
      >
        <Select
          getPopupContainer={() => document.getElementById("period-wrapper")}
          className="period-select"
          dropdownClassName="drop-down"
          defaultValue={currentDate.defaultPeriod}
          onSelect={(value) => getDataForYear(value)}
          style={{
            width: 230,
          }}
          {...selectProps}
        />
      </Space>
    )
}

export default PeriodButtons;
