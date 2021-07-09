import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classname from 'classnames'
import _ from 'lodash'
import { Icon } from 'antd'
import './TableSortedHeader.css'

class TableSortedHeader extends Component {
  getSortIconsOption = () => {
    const { sortOptions } = this.props

    if (_.isEmpty(sortOptions)) {
      return {
        caretUp: 'off',
        caretDown: 'off',
      }
    } else {
      return {
        caretUp: (sortOptions.type === 'ASC') ? 'on' : 'off',
        caretDown: (sortOptions.type === 'DESC') ? 'on' : 'off',
      }
    }
  }

  render() {
    const iconsStatusOptions = this.getSortIconsOption()

    return (
      <div className="customSortingComponent">
        <span className="ant-table-custom-column-title">
          {this.props.headerTitle}
        </span>
        <span className="ant-table-column-sorter" style={{ width: 25 }}>
          <div
            title="Sort"
            className="ant-table-column-sorter-inner ant-table-column-sorter-inner-full ant-table-custom-column-sorter"
          >
            <Icon
              type="caret-up"
              className={classname('anticon', 'anticon-caret-up', 'ant-table-column-sorter-up', iconsStatusOptions.caretUp)}
            />
            <Icon
              type="caret-down"
              className={classname('anticon', 'anticon-caret-down', 'ant-table-column-sorter-down', iconsStatusOptions.caretDown)}
            />
          </div>
        </span>
      </div>
    )
  }
}

TableSortedHeader.propTypes = {
  headerTitle: PropTypes.string,
  sortOptions: PropTypes.object,
}

export default TableSortedHeader