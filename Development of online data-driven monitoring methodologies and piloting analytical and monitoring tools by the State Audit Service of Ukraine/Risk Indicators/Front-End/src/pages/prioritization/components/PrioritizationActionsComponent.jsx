import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withTranslate} from 'react-redux-multilingual'
import {Button, Col, Row} from 'antd'

class PrioritizationActionsComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
        }
    }

    handleVisibleChange = (visible) => {
        this.setState({visible})
    }

    renderPopoverContent = () => {
        const {prioritizationData, translate} = this.props
        return (
            <Row>
                <Row>
                    <Col span={24} key={`col_export_button__${prioritizationData.id}`}>
                        <Button
                            icon="right"
                            style={{width: '100%'}}
                            onClick={() => this.props.handleStartAudit(prioritizationData)}
                            key={`export_button_${prioritizationData.id}`}
                        >
                            {translate('start_inspection_from_prioritization_page')}
                        </Button>
                    </Col>
                </Row>
            </Row>
        )
    }

    prepareButtonTitle = () => {
        const {prioritizationData, translate, isTenderAction, userInfo} = this.props
        if (isTenderAction) {
            if (prioritizationData.checklistId) {
                if (prioritizationData.checklistStatus === 1) {
                    if (parseInt(userInfo.jti, 10) === parseInt(prioritizationData.auditorId, 10)) {
                        return translate('continue_inspection_from_prioritization_page')
                    } else {
                        return translate('start_inspection_from_prioritization_page')
                    }
                } else {
                    if (parseInt(userInfo.jti, 10) === parseInt(prioritizationData.auditorId, 10)) {
                        return translate('preview_inspection_from_prioritization_page')
                    } else {
                        return translate('start_inspection_from_prioritization_page')
                    }
                }
            } else {
                return translate('start_inspection_from_prioritization_page')
            }
        } else {
            return translate('start_inspection_from_prioritization_page')
        }
    }

    render() {
        const {prioritizationData, userInfo} = this.props;

        let disabledStartAudit = prioritizationData.checklistId ? parseInt(userInfo.jti, 10) !== parseInt(prioritizationData.auditorId, 10) : false;

        return (
            <Row>
                <Row>
                    <Col span={24} key={`col_export_button__${prioritizationData.id}`}>
                        <Button
                            disabled={disabledStartAudit}

                            icon="right"
                            style={{width: '100%'}}
                            onClick={() => this.props.handleStartAudit(prioritizationData)}
                            key={`export_button_${prioritizationData.id}`}
                        >
                            {this.prepareButtonTitle()}
                        </Button>
                    </Col>
                </Row>
            </Row>
        )
    }


    // render() {
    //   return (
    //     <div className="checklist-action-button">
    //       <Popover
    //         content={this.renderPopoverContent()}
    //         trigger="click"
    //         placement="bottomRight"
    //         visible={this.state.visible}
    //         onVisibleChange={this.handleVisibleChange}
    //       >
    //         <Button icon="setting" />
    //       </Popover>
    //     </div>
    //   )
    // }
}

PrioritizationActionsComponent.propTypes = {
    userInfo: PropTypes.object.isRequired,
    prioritizationData: PropTypes.object.isRequired,
    isTenderAction: PropTypes.bool.isRequired,
    handleStartAudit: PropTypes.func,
}

export default withTranslate(PrioritizationActionsComponent)
