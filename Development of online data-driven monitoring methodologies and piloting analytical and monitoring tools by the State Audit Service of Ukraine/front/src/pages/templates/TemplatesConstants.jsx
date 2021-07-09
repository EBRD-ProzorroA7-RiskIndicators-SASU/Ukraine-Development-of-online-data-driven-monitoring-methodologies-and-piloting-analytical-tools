export const ADD_NEW_TEMPLATE_FORM_NAME = 'addNewTemplateForm'
export const EDIT_CATEGORY_FORM_NAME = 'editCategoryNameForm'

export const TEMPLATE_RADIO_BUTTONS_OPTIONS = [
  {
    translate_key: 'template_as_default',
    value: true,
    isDefault: true,
  },
  {
    translate_key: 'template_for_user',
    value: false,
    isDefault: false,
  },
]

export const TEMPLATES_TABLE_COLUMNS = [
  {
    title: '',
    dataIndex: 'positionNumber',
    sorter: false,
    width: '2%',
    align: 'center',
    render: null,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => {
      return a.name.localeCompare(b.name)
    },
    width: '53%',
    render: null,
  },
  {
    title: '',
    dataIndex: 'modifiedDate',
    sorter: (a, b) => {
      return a.modifiedDate.localeCompare(b.modifiedDate)
    },
    align: 'center',
    width: '15%',
  },
  {
    title: '',
    colSpan: 2,
    dataIndex: 'createChecklist',
    key: 'create_checklist',
    width: '15%',
    render: null
  },
  {
    title: '',
    colSpan: 0,
    dataIndex: 'editButton',
    align: 'center',
    width: '10%',
  },
]
