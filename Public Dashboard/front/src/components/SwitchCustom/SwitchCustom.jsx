import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Select, Switch, Space } from 'antd'
import { MAX_MOBILE_WIDTH, REGIONS_LIST } from '../../constants'
import './styles.scss'
import useWidth from '../../hooks/useWidth'

const SwitchCustom = (props) => {
  const {
    defaultValue,
    regionsOff,
    switchOff,
    regionIds,
    setRegion,
    handleSwitch,
    onBlur,
    onChange,
  } = props

  const w = useWidth()
  const mobile = w <= MAX_MOBILE_WIDTH

  const [checked, setCheck] = useState(defaultValue)

  const selectProps = {
    mode: 'multiple',
    style: {
      width: '100%',
    },
    region: regionIds,
    options: REGIONS_LIST,
    onChange: (newValue) => {
      setRegion(newValue)
    },
    placeholder: 'Вибрані регіони',
    maxTagCount: 'responsive',
  }

  const handleSwitchChange = (value) => {
    setCheck(value)
    handleSwitch(value)
  }

  return (
    <div className={cx('monitoring-types-regions', switchOff && 'to-right')} style={{ height: !regionsOff ? '130px' : (mobile ? '65px' : '130px')}}>
      {!switchOff && <div className="monitoring-types-switcher">
        <span className={cx('switcher__sum', { 'checked': !checked })}>{props.amountText}</span>
        <Switch
          defaultChecked={defaultValue}
          onChange={handleSwitchChange}
        />
        <span className={cx('switcher__count', { 'checked': checked })}>{props.countText}</span>
      </div>}
      {!regionsOff && <div className='monitoring-types-regions-select'>
        <span className="select-label">{props.selectorText}</span>
        <Space
          className="region-selector-wrapper"
          id="wrapper"
          style={{
            // width: 365,
            position: 'relative',
          }}
        >
          <Select
            getPopupContainer={() => document.getElementById('wrapper')}
            className="regions-select"
            dropdownClassName="regions-drop-down"
            placeholder="Вибрані регіони"
            {...selectProps}
            style={{
              width: mobile ? 265 : 300,
            }}
            // onChange={(value) => { handleChangeRegion(value) }}
            onChange={onChange && onChange}
            onBlur={onBlur && onBlur}
          />
        </Space>
      </div>}
    </div>
  )
}

SwitchCustom.propTypes = {
  defaultValue: PropTypes.bool,
  countText: PropTypes.string,
  amountText: PropTypes.string,
  selectorText: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  regionsOff: PropTypes.bool,
  switchOff: PropTypes.bool,
}

// Set default props
SwitchCustom.defaultProps = {
  defaultValue: true,
  countText: 'Кількість',
  amountText: 'Сума',
  selectorText: 'Регіон:',
  regionsOff: false,
  switchOff: false,
}

export default SwitchCustom

