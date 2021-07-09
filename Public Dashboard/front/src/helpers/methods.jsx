import React from 'react';
import { useDispatch } from 'react-redux';
import { Space, Select, Radio } from 'antd';
import { PERIOD_LIST } from '../constants/index';
import * as dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { getDataForResourcesPage } from '../redux/actions/resourcesPageActions';
import 'dayjs/locale/uk';

dayjs.extend(relativeTime);

export const renderPeriodButtons = (mobile, setPeriod, period) => {
  const options = PERIOD_LIST;
  const currentYear = dayjs().format('YYYY');
  const previousYear = dayjs().subtract(1, 'year').format('YYYY');
  const lastTwelveMonth = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
  const currentDay = dayjs().format('YYYY-MM-DD');

  const selectProps = {
    style: {
      width: '100%',
    },
    period,
    options,
    onChange: (newValue) => {
      setPeriod(newValue);
    },
  }

  return !mobile ? (
    <div className="period-buttons">
      <Radio.Group defaultValue="a" optionType="button">
        <Radio.Button className="left-button group-button" value="a">{previousYear}</Radio.Button>
        <Radio.Button className="middle-button group-button" value="b">{currentYear}</Radio.Button>
        <Radio.Button className="right-button group-button" value="c">Останні повні 12 місяців</Radio.Button>
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
        defaultValue="Останні повні 12 місяців"
        style={{
          width: 230,
        }}
        {...selectProps}
        />
    </Space> 
    )
}