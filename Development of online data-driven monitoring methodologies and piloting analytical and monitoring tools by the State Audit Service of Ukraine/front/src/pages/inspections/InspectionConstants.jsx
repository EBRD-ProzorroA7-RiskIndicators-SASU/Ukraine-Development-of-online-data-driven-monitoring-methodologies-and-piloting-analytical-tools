import React from 'react'
import { getLocalizationPropByKey, getMapByKey } from '../../utils/MappingUtils'
import _ from 'lodash'
import { Icon, Tooltip } from 'antd'

export const MAX_VALUE = 9999999999999
export const BUYER_INSPECTION_FORM_NAME = 'BuyerInspectionFormName'
export const TENDER_INSPECTION_FORM_NAME = 'TenderInspectionFormName'
export const INSPECTION_NEW_CONTRACT_FORM_NAME = 'InspectionNewContractFormName'

export const INDICATORS_BY_TENDER_TABLE = [
  {
    title: '',
    dataIndex: 'name',
    translateKey: 'indicator_name',
    sorter: false,
    // sorter: (a, b) => {
    //   return a.name.localeCompare(b.name)
    // },
    align: 'center',
    // width: '3%',
  },
  {
    title: '',
    dataIndex: 'description',
    translateKey: 'indicator_description_name',
    sorter: false,
    // sorter: (a, b) => {
    //   return a.description.localeCompare(b.description)
    // },
    align: 'left',
    width: '15%',
    className: 'header-text-align-center',
  },
  {
    title: '',
    dataIndex: 'risks',
    translateKey: 'indicator_risks',
    sorter: false,
    // sorter: (a, b) => {
    //   return a.risks.localeCompare(b.risks)
    // },
    align: 'left',
    width: '15%',
    className: 'header-text-align-center',
  },
  {
    title: '',
    dataIndex: 'lawViolation',
    translateKey: 'indicator_law_violation',
    sorter: false,
    // sorter: (a, b) => {
    //   return a.lawViolation.localeCompare(b.lawViolation)
    // },
    align: 'left',
    width: '25%',
    className: 'header-text-align-center',
  },
  {
    title: '',
    dataIndex: 'riskLevelText',
    translateKey: 'indicator_risk_level_text',
    sorter: false,
    // sorter: (a, b) => {
    //   return a.riskLevelText.localeCompare(b.riskLevelText)
    // },
    align: 'left',
    width: '7%',
    className: 'header-text-align-center',
  },
  {
    title: '',
    dataIndex: 'indicatorAnswers',
    translateKey: 'indicator_confirmed_by_testing',
    align: 'center',
    width: '10%',
  },
  {
    title: '',
    dataIndex: 'indicatorComment',
    translateKey: 'indicator_comment_text',
    align: 'center',
    width: '15%',
  },
  {
    title: '',
    dataIndex: 'componentImpacts',
    translateKey: 'indicator_component_impacts',
    align: 'center',
    width: '13%',
  },

]

export const CHECKLISTS_TABLE_COLUMNS = [
  {
    title: '',
    translate_key: 'checklist_for_table_name',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: '15%',
    sorter: (a, b) => {
      return a.name.localeCompare(b.name)
    },
  },
  {
    title: '',
    translate_key: 'checklist_document_number_name',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    width: '9%',
    sorter: (a, b) => {
      return a.id - b.id
    },
  },
  {
    title: '',
    translate_key: 'checklist_scores_result_name',
    dataIndex: 'manualScore.nameEn',
    align: 'center',
    width: '10%',
    sorter: (a, b) => {
      if (a.autoScore) {
        return b.autoScore ? a.autoScore.name.localeCompare(b.autoScore.name) : 1
      } else if (b.autoScore) {
        return a.autoScore ? b.autoScore.name.localeCompare(a.autoScore.name) : -1
      }
    },
    render: (text) => {
      if (text) {
        let checklistScores = getMapByKey('checklistScores')
        let checklistScoreKey = getLocalizationPropByKey('checklistScoreKey')
        return _.find(checklistScores, { nameEn: text })[checklistScoreKey]
      } else {
        return ''
      }
    },
  },
  {
    title: '',
    translate_key: 'checklist_date_of_completion_name',
    dataIndex: 'modifiedDate',
    align: 'center',
    width: '9%',
    sorter: (a, b) => {
      if (a.modifiedDate) {
        return b.modifiedDate ? a.modifiedDate.localeCompare(b.modifiedDate) : 1
      } else if (b.modifiedDate) {
        return a.modifiedDate ? b.modifiedDate.localeCompare(a.modifiedDate) : -1
      }
    },
  },
  {
    title: '',
    translate_key: 'checklist_status_name',
    dataIndex: 'status.name',
    align: 'center',
    width: '10%',
    sorter: (a, b) => {
      if (a.status) {
        return b.status ? a.status.name.localeCompare(b.status.name) : 1
      } else if (b.status) {
        return a.status ? b.status.name.localeCompare(a.status.name) : -1
      }
    },
    render: (text) => {
      if (text) {
        let checklistStatuses = getMapByKey('checklistStatuses')
        let checklistStatusesKey = getLocalizationPropByKey('checklistStatusesKey')
        return _.find(checklistStatuses, { name: text })[checklistStatusesKey]
      } else {
        return ''
      }
    },
  },
  {
    title: '',
    translate_key: 'checklist_inspection_initiated_name',
    dataIndex: 'auditor.name',
    align: 'center',
    width: '9%',
    sorter: (a, b) => {
      if (a.auditor.name) {
        return b.auditor.name ? a.auditor.name.localeCompare(b.auditor.name) : 1
      } else if (b.auditor.name) {
        return a.auditor.name ? b.auditor.name.localeCompare(a.auditor.name) : -1
      }
    },
  },
  {
    translate_key: 'checklist_auditor_office',
    dataIndex: 'auditor.office.name',
    align: 'center',
    width: '9%',
    sorter: true,
  },
  {
    title: '',
    translate_key: 'template_actions',
    dataIndex: 'editButton',
    key: 'editButton',
    align: 'center',
    width: '10%',
  },
]


export const CONTROL_TABLE = [
  {
    title: '',
    dataIndex: 'amount_category_title',
    translateKey: '',
    align: 'left',
    width: '20%',
  },
  {
    title: '',
    dataIndex: 'stateBudget',
    translateKey: 'state_budget',
    align: 'center',
    width: '16%',
  },
  {
    title: '',
    dataIndex: 'covidFund',
    translateKey: 'covid_fund',
    align: 'center',
    width: '16%',
  },
  {
    title: '',
    dataIndex: 'localBudget',
    translateKey: 'local_budget',
    align: 'center',
    width: '16%',
  },
  {
    title: '',
    dataIndex: 'others',
    translateKey: 'others',
    align: 'center',
    width: '16%',
  },
  {
    title: '',
    dataIndex: 'totalAmount',
    translateKey: 'total_amount',
    align: 'center',
    width: '16%',
  },
]

export const AMOUNT_TABLE_FIELDS = [
  {
    groupId: 0,
    translateKey: 'total_contract_amount',
    previousDependence: false,
    translateFrom: '',
    translateTo: '',
    keys: [
      {
        name: 'totalContractAmountStateBudget',
        dependence: null,
        dependenceOn: 'totalContractAmountCovidFund',
        amountOfField: null,
        previousSumDependence: false,
      },
      {
        name: 'totalContractAmountCovidFund',
        dependence: 'totalContractAmountStateBudget',
        dependenceOn: 'totalContractAmountStateBudget',
        amountOfField: 'totalContractAmountStateBudget',
        previousSumDependence: false,
      },
      {
        name: 'totalContractAmountLocalBudget',
        dependence: 'totalContractAmountCovidFund',
        dependenceOn: null,
        amountOfField: null,
        previousSumDependence: false,
      },
      {
        name: 'totalContractAmountOthers',
        dependence: 'totalContractAmountLocalBudget',
        dependenceOn: null,
        amountOfField: null,
        previousSumDependence: false,
      },
    ],
  },
  {
    groupId: 1,
    translateKey: 'revision_period_total_contract_amount',
    previousDependence: true,
    translateFrom: 'revision_period_total_contract_amount',
    translateTo: 'total_contract_amount',
    keys: [
      {
        name: 'revisionPeriodTotalContractAmountStateBudget',
        dependence: null,
        dependenceOn: 'revisionPeriodTotalContractAmountCovidFund',
        amountOfField: null,
        previousSumDependence: true,
      },
      {
        name: 'revisionPeriodTotalContractAmountCovidFund',
        dependence: 'revisionPeriodTotalContractAmountStateBudget',
        dependenceOn: 'revisionPeriodTotalContractAmountStateBudget',
        amountOfField: 'revisionPeriodTotalContractAmountStateBudget',
        previousSumDependence: false,
      },
      {
        name: 'revisionPeriodTotalContractAmountLocalBudget',
        dependence: 'revisionPeriodTotalContractAmountCovidFund',
        dependenceOn: null,
        amountOfField: null,
        previousSumDependence: false,
      },
      {
        name: 'revisionPeriodTotalContractAmountOthers',
        dependence: 'revisionPeriodTotalContractAmountLocalBudget',
        dependenceOn: null,
        amountOfField: null,
        previousSumDependence: false,
      },
    ],
  },
  {
    groupId: 2,
    translateKey: 'budget_amount',
    previousDependence: true,
    translateFrom: 'budget_amount',
    translateTo: 'total_contract_amount',
    keys: [
      {
        name: 'budgetAmountStateBudget',
        dependence: null,
        dependenceOn: 'budgetAmountCovidFund',
        amountOfField: null,
        previousSumDependence: true,
      },
      {
        name: 'budgetAmountCovidFund',
        dependence: 'budgetAmountStateBudget',
        dependenceOn: 'budgetAmountStateBudget',
        amountOfField: 'budgetAmountStateBudget',
        previousSumDependence: false,
      },
      {
        name: 'budgetAmountLocalBudget',
        dependence: 'budgetAmountCovidFund',
        dependenceOn: null,
        amountOfField: null,
        previousSumDependence: false,
      },
      {
        name: 'budgetAmountOthers',
        dependence: 'budgetAmountLocalBudget',
        dependenceOn: null,
        amountOfField: null,
        previousSumDependence: false,
      },
    ],
  },
  {
    groupId: 3,
    translateKey: 'completed_work_amount',
    previousDependence: true,
    translateFrom: 'completed_work_amount',
    translateTo: 'total_contract_amount',
    keys: [
      {
        name: 'completedWorkAmountStateBudget',
        dependence: null,
        dependenceOn: 'completedWorkAmountCovidFund',
        amountOfField: null,
        previousSumDependence: true,
      },
      {
        name: 'completedWorkAmountCovidFund',
        dependence: 'completedWorkAmountStateBudget',
        dependenceOn: 'completedWorkAmountStateBudget',
        amountOfField: 'completedWorkAmountStateBudget',
        previousSumDependence: false,
      },
      {
        name: 'completedWorkAmountLocalBudget',
        dependence: 'completedWorkAmountCovidFund',
        dependenceOn: null,
        amountOfField: null,
        previousSumDependence: false,
      },
      {
        name: 'completedWorkAmountOthers',
        dependence: 'completedWorkAmountLocalBudget',
        dependenceOn: null,
        amountOfField: null,
        previousSumDependence: false,
      },
    ],
  },
  {
    groupId: 4,
    translateKey: 'checked_work_amount',
    previousDependence: true,
    translateFrom: 'checked_work_amount',
    translateTo: 'completed_work_amount',
    keys: [
      {
        name: 'checkedWorkAmountStateBudget',
        dependence: null,
        dependenceOn: 'checkedWorkAmountCovidFund',
        amountOfField: null,
        previousSumDependence: true,
      },
      {
        name: 'checkedWorkAmountCovidFund',
        dependence: 'checkedWorkAmountStateBudget',
        dependenceOn: 'checkedWorkAmountStateBudget',
        amountOfField: 'checkedWorkAmountStateBudget',
        previousSumDependence: false,
      },
      {
        name: 'checkedWorkAmountLocalBudget',
        dependence: 'checkedWorkAmountCovidFund',
        dependenceOn: null,
        amountOfField: null,
        previousSumDependence: false,
      },
      {
        name: 'checkedWorkAmountOthers',
        dependence: 'checkedWorkAmountLocalBudget',
        dependenceOn: null,
        amountOfField: null,
        previousSumDependence: false,
      },
    ],
  },
]