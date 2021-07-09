import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withTranslate} from 'react-redux-multilingual'
import _ from 'lodash'
import {Col, Row, Select} from 'antd'
import {isAdmin} from "../../../utils/Permissions";

class BuyerInspectionHistoryFilters extends Component {
    render() {
        const {
            translate,
            templateTypes,
            templateTypesKey,
            checklistStatuses,
            checklistStatusesKey,
            offices,
            auditorSearchedNames,
        } = this.props
        return (
            <Row style={{marginBottom: 15}}>
                <Row>
                    <Col span={6}>{translate('checklist_status_name')}</Col>
                    <Col span={6}>{translate('checklist_template_type_name')}</Col>
                    {isAdmin() && <Col span={6}>{translate('dasu_office')}</Col>}
                    {isAdmin() && <Col span={6}>{translate('checklist_inspection_initiated_name')}</Col>}
                </Row>
                <Row>
                    <Col span={6}>
                        <Select
                            allowClear={true}
                            placeholder={translate('checklist_status_name')}
                            style={{width: '90%'}}
                            onChange={this.props.handleChecklistStatusSelected}
                        >
                            {_.map(checklistStatuses, (checklistStatus) => (
                                <Select.Option
                                    key={checklistStatus.id}>{checklistStatus[checklistStatusesKey]}</Select.Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={6}>
                        <Select
                            allowClear={true}
                            placeholder={translate('checklist_template_type_name')}
                            style={{width: '90%'}}
                            onChange={this.props.handleTemplateTypeSelected}
                        >
                            {_.map(templateTypes, (templateType) => (
                                <Select.Option
                                    key={templateType.id}>{templateType[templateTypesKey]}</Select.Option>
                            ))}
                        </Select>
                    </Col>

                    {isAdmin() && <Col span={6}>
                        <Select
                            allowClear={true}
                            style={{width: '90%'}}
                            placeholder={translate('dasu_office')}
                            onChange={this.props.handleSelectedOffice}
                        >
                            {_.map(offices, (office) => (
                                <Select.Option
                                    key={office.id}>{office.name}</Select.Option>
                            ))}
                        </Select>
                    </Col>}

                    {isAdmin() && <Col span={6}>
                        <Select
                            showArrow
                            allowClear={true}
                            showSearch
                            mode="multiple"
                            optionLabelProp='title'
                            maxTagCount={30}
                            placeholder={translate('checklist_author_name')}
                            style={{width: '100%'}}
                            filterOption={false}
                            onSearch={this.props.handleSearchAuditorByName}
                            onChange={this.props.handleSelectedAuditorByName}
                        >
                            {_.map(auditorSearchedNames, (auditorName) => (
                                <Select.Option
                                    key={auditorName.id}
                                    title={auditorName.name}
                                >
                                    {auditorName.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>}


                </Row>
            </Row>
        )
    }
}

BuyerInspectionHistoryFilters.propTypes = {
    templateTypes: PropTypes.array,
    checklistStatuses: PropTypes.array,
    auditSearchedNames: PropTypes.array,
    auditorSearchedNames: PropTypes.array,
    checklistStatusesKey: PropTypes.string.isRequired,

    handleTemplateSelected: PropTypes.func,
    handleChecklistStatusSelected: PropTypes.func,
    handleSearchAuditorByName: PropTypes.func,
    handleSelectedAuditorByName: PropTypes.func,
    handleTemplateTypeSelected:PropTypes.func
}


export default withTranslate(BuyerInspectionHistoryFilters)
