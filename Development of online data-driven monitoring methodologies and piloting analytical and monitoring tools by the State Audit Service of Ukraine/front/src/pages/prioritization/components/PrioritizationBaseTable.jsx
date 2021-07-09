import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import _ from 'lodash'
import { Table, Spin } from 'antd'
import TableSortedHeader from './TableSortedHeader'

import './PrioritizationBaseTable.css'

class PrioritizationBaseTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedRow: props.defaultSelectedRow ? props.defaultSelectedRow : {},
      selectedPriority: 'none',
      selectedAll: false,
      selectedIds: [],
    }
  }

  componentDidUpdate() {
    if (this.props.resetSelectedRows) {
      this.setState({
        selectedAll: false,
        selectedIds: [],
        selectedPriority: 'none',
      }, this.props.handleAfterReset())
    }
  }

  renderCustomSelectedView = () => {
    const { selectedPriority, selectedAll } = this.state
    let selectAllLabelClasses, selectAllSpanClasses

    switch (selectedPriority) {
      case 'all':
        selectAllLabelClasses = 'ant-checkbox-wrapper ant-checkbox-wrapper-checked'
        selectAllSpanClasses = 'ant-checkbox ant-checkbox-checked'
        break
      case 'some':
        selectAllLabelClasses = 'ant-checkbox-wrapper'
        selectAllSpanClasses = 'ant-checkbox ant-checkbox-indeterminate'
        break
      case 'none':
        selectAllLabelClasses = 'ant-checkbox-wrapper'
        selectAllSpanClasses = 'ant-checkbox'
        break

      default:
        selectAllLabelClasses = 'ant-checkbox-wrapper'
        selectAllSpanClasses = 'ant-checkbox'
        break
    }

    return (
      <div>
        <span className="ant-table-column-title">
          <div className="ant-table-selection">
            <label className={selectAllLabelClasses}>
              <span className={selectAllSpanClasses}>
                <input type="checkbox" className="ant-checkbox-input" value=""
                       onClick={() => this.rowAllSelectionOnChange(!selectedAll)} />
                  <span className="ant-checkbox-inner" />
              </span>
            </label>
          </div>
        </span>
        <span className="ant-table-column-sorter" />
      </div>
    )
  }

  renderTableColumns = () => {
    const { translate, sortOptions, columns } = this.props
    let tenderTableColumns = _.cloneDeep(columns)

    return _.map(tenderTableColumns, (column) => {
      let sortOption = _.find(sortOptions, { field: column.dataIndex })

      if (column.customSort) {
        if (!_.isEmpty(sortOption)) {
          column.title = () => (
            <TableSortedHeader
              headerTitle={translate(column.translateKey)}
              sortOptions={sortOption}
            />
          )
          column.sortOrder = sortOption.type
        } else {
          column.title = () => (
            <TableSortedHeader
              headerTitle={translate(column.translateKey)}
              sortOptions={{}}
            />
          )
        }
      } else {
        column.title = translate(column.translateKey)
      }

      if (column.hasOwnProperty('onHeaderCell')) {
        column.onHeaderCell = (column) => {
          return {
            onClick: () => {
              this.props.handleHeaderCellClick(column)
            },
          }
        }
      }

      return column
    })
  }

  handleRowSelection = (record) => {
    this.setState({
      selectedRow: record,
    }, () => {
      this.props.rowSelectable && this.props.onSelectRow(record)
    })
  }

  rowSelectionOnChange = (record, selected, selectedRows) => {
    let { selectedPriority, selectedAll } = this.state
    let newSelectedIds = []

    if (this.state.selectedIds.length > selectedRows) {
      if (!selected) {
        newSelectedIds = _.filter(this.state.selectedIds, (itemId) => (itemId !== record.id))
      } else {
        newSelectedIds.push(record.id)
      }
    } else {
      newSelectedIds = _.map(selectedRows, (row) => {
        return row.id
      })
    }

    if (newSelectedIds.length === this.props.dataSource.length) {
      selectedPriority = 'all'
      selectedAll = true
    } else if (_.isEmpty(newSelectedIds)) {
      selectedPriority = 'none'
      selectedAll = false
    } else {
      selectedPriority = 'some'
      selectedAll = false
    }

    this.setState({
      selectedIds: newSelectedIds,
      selectedPriority: selectedPriority,
      selectedAll: selectedAll,
    }, () => {
      this.props.handleSelectIdToExport(newSelectedIds)
    })
  }

  rowAllSelectionOnChange = (selected) => {
    let { selectedPriority } = this.state
    let selectedIds = []
    let selectedAll = true
    if (selected) {
      selectedIds = _.map(this.props.dataSource, (dataItem) => {
        return dataItem.id
      })
      selectedPriority = 'all'
    } else {
      selectedAll = false
      selectedPriority = 'none'
    }

    this.setState({
      selectedIds: selectedIds,
      selectedAll: selectedAll,
      selectedPriority: selectedPriority,
    }, () => {
      this.props.handleSelectIdToExport(selectedIds)
    })
  }

  render() {
    const {
      bordered,
      size,
      rowKey,
      pagination,
      dataSource,
      rowSelectable,
      allowCheckboxes,
      defaultScrollX,
      spinnerStatus,
    } = this.props
    const { selectedIds } = this.state

    const rowSelection = {
      columnWidth: '0.2%',
      columnTitle: this.renderCustomSelectedView(),
      selectedRowKeys: selectedIds,
      onSelect: this.rowSelectionOnChange,
      onSelectAll: this.rowAllSelectionOnChange,
    }


    return (
      <Spin spinning={spinnerStatus} size="large">
        <Table
          scroll={{ x: defaultScrollX }}
          bordered={bordered}
          rowKey={rowKey}
          size={size}
          pagination={pagination}
          // indentSize={150}
          columns={this.renderTableColumns()}
          dataSource={dataSource}
          rowSelection={allowCheckboxes && rowSelection}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                this.handleRowSelection(record, rowIndex)
              },
            }
          }}
          rowClassName={(record, index) => {
            if (rowSelectable) {
              if (!_.isEmpty(this.state.selectedRow)) {
                return (record.id === this.state.selectedRow.id) ? 'selected-row cursor-pointer' : 'cursor-pointer'
              } else {
                return 'cursor-pointer'
              }
            }
          }}
          onChange={this.props.handleTableChange}
        />
      </Spin>
    )
  }
}

PrioritizationBaseTable.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  bordered: PropTypes.bool,
  spinnerStatus: PropTypes.bool,
  size: PropTypes.string,
  rowKey: PropTypes.string,
  pagination: PropTypes.object,
  defaultSelectedRow: PropTypes.object,
  sortOptions: PropTypes.array,
  rowSelectable: PropTypes.bool,
  allowCheckboxes: PropTypes.bool,
  resetSelectedRows: PropTypes.bool,
  defaultScrollX: PropTypes.number,
  onSelectRow: PropTypes.func,
  handleTableChange: PropTypes.func,
  handleHeaderCellClick: PropTypes.func,
  handleSelectIdToExport: PropTypes.func,
  handleAfterReset: PropTypes.func,
}

PrioritizationBaseTable.defaultProps = {
  bordered: true,
  size: 'small',
  rowKey: 'id',
  pagination: { pageSize: 10 },
  rowSelectable: false,
  sortOptions: [],
  allowCheckboxes: true,
  defaultSelectedRow: {},
  defaultScrollX: 1900,
  spinnerStatus: false,
}

export default withTranslate(PrioritizationBaseTable)
