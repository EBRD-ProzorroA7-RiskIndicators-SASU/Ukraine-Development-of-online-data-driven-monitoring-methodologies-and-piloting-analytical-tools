import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'
import {Checkbox, Col, Divider, Input, message, Pagination, Row, Table} from 'antd'
import {searchBuyers, updateBuyers} from '../../redux/action/administration/BuyerManageActions'
import BuyerProcessedCountInfoCard from '../../components/infoCard/BuyerProcessedCountInfoCard'

import {BUYERS_TABLE_COLUMNS} from "./BuyerManagePageConstats";
import './BuyerManagePage.css'
import _ from "lodash";

const {Search} = Input

const PAGE_SIZE = 20

class BuyerManagePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            page: 0,
            keyword: '',
            tableKey: _.uniqueId(),
            sortDirection: null,
            sortField: null
        }

        // this.handleSearch = _.debounce(this.handleSearch, 300)
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        this.getData()
    }

    handleSearch = value => {
        this.setState({
            keyword: value,
            page: 0
        }, () => this.getData())
    }

    handlePage = value => {
        this.setState({
            page: value - 1
        }, () => this.getData())
    }

    handleBuyerProcessedChange = (event, buyerId) => {
        Promise.resolve(this.props.updateBuyers({
            id: buyerId, processed: event.target.checked
        })).then(() => {
            if (this.props.buyersUpdatesHasError) {
                message.error(this.props.buyersUpdatesErrorMessage ? this.props.buyersUpdatesErrorMessage : 'Bad request')
                this.setState({
                    tableKey: _.uniqueId()
                })
            }
        })
    }

    handleSorting = fieldName => {
        let newSortDirection = null
        if (this.state.sortDirection) {
            if (this.state.sortDirection === 'ASC') {
                newSortDirection = 'DESC'
            }
        } else {
            newSortDirection = 'ASC'
        }
        this.setState({
            sortField: newSortDirection ? fieldName : null,
            sortDirection: newSortDirection
        }, () => this.getData())
    }

    getData = () => {
        this.props.searchBuyers(this.collectRequestBody())
    }

    collectRequestBody = () => {
        let body = {
            keyword: this.state.keyword,
            page: this.state.page,
            size: PAGE_SIZE
        }

        if (this.state.sortDirection) {
            body = {...body, sortDirection: this.state.sortDirection}
        }
        if (this.state.sortField) {
            body = {...body, sortField: this.state.sortField}
        }

        return body
    }

    prepareTableColumns = () => {
        const {translate} = this.props
        return BUYERS_TABLE_COLUMNS.map((column) => {
            column.hasOwnProperty('translate_key') && (column.title = translate(column.translate_key))
            if (column.onHeaderCell) {
                column.onHeaderCell = (column) => {
                    return {
                        onClick: () => {
                            this.handleSorting(column.dataIndex);
                        }
                    };
                }
            }
            return column
        })
    }

    prepareTableData = () => {
        return this.props.buyersPage.buyers.map(buyer => {
            return _.merge({}, buyer, {
                processed: <Checkbox defaultChecked={buyer.processed}
                                     onChange={(event) => this.handleBuyerProcessedChange(event, buyer.id)}/>
            })
        })
    }

    render() {
        const {translate} = this.props

        return (
            <div className="components-grid-buyers">
                <Row>
                    <Row>
                        <Col span={24}>
                            <BuyerProcessedCountInfoCard
                                totalBuyerCount={this.props.buyersPage.totalBuyerCount}
                                processedBuyerCount={this.props.buyersPage.processedBuyerCount}
                                notProcessedBuyerCount={this.props.buyersPage.notProcessedBuyerCount}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Search
                                allowClear
                                placeholder={`${translate('buyer_identifier')}/${translate('buyer_name')}`}
                                onSearch={this.handleSearch}
                                style={{width: 300}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Divider>{translate('buyers_list')}</Divider>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table
                                key={this.state.tableKey}
                                // bordered
                                rowKey='id'
                                // size="small"
                                pagination={false}
                                indentSize={150}
                                columns={this.prepareTableColumns()}
                                dataSource={this.prepareTableData()}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <div style={{display: 'flex', alignItem: 'center', justifyContent: 'flex-end'}}>
                                <Pagination current={this.props.buyersPage.currentPage + 1}
                                            pageSize={PAGE_SIZE}
                                            total={this.props.buyersPage.totalElements}
                                            onChange={this.handlePage}
                                />
                            </div>
                        </Col>
                    </Row>
                </Row>
            </div>
        )
    }
}

function mapStateToProps({
                             administrationStore
                         }) {
    return {
        buyersPage: administrationStore.buyersPage,
        buyersUpdatesErrorMessage: administrationStore.buyersUpdatesErrorMessage,
        buyersUpdatesHasError: administrationStore.buyersUpdatesHasError
    }
}

function mapDispatchToProps(dispatch) {
    return {
        searchBuyers: bindActionCreators(searchBuyers, dispatch),
        updateBuyers: bindActionCreators(updateBuyers, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslate(BuyerManagePage))
