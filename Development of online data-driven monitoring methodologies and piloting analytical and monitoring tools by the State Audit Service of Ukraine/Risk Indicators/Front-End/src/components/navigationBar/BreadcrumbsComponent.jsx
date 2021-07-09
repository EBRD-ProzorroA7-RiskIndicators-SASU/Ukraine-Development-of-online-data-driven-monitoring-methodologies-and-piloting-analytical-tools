import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Breadcrumb } from 'antd'

class BreadcrumbsComponent extends Component {
  render() {
    const { translate, breadcrumbOptions } = this.props
    return (
      <Breadcrumb style={{ paddingTop: 20 }}>
        {breadcrumbOptions.map((item, index) => {
          let itemValue = translate(item.translateKey)
          if (item.linkStatus) {
            itemValue = <a href={item.path}>{translate(item.translateKey)}</a>
          }

          return (
            <Breadcrumb.Item key={`breadcrumbs_${index}`}>{itemValue}</Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
    )
  }
}

function mapStateToProps({
                           navigationStore,
                         }) {
  return {
    breadcrumbOptions: navigationStore.breadcrumbOptions,
  }
}

export default connect(
  mapStateToProps,
)(withTranslate(BreadcrumbsComponent))