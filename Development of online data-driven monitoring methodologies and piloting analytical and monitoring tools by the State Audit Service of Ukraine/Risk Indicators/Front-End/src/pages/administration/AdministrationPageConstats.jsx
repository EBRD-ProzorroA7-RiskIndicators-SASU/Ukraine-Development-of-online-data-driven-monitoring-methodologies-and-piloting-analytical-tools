
export const EDIT_AUDITOR_FORM_NAME = 'EditAuditorFormName'
export const AUDITORS_TABLE_COLUMNS = [
  {
    dataIndex: 'name',
    sorter: (a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name)
      } else {
        return -1
      }
    },
    width: '30%',
    align: 'center',
    translate_key: 'table_field_name'
  },
  {
    dataIndex: 'office.name',
    sorter: (a, b) => {
      if (a.office && b.office) {
        return a.office.name.localeCompare(b.office.name)
      } else {
        return -1
      }
    },
    width: '30%',
    align: 'center',
    translate_key: 'dasu_office',
  },
  {
    dataIndex: 'email',
    sorter: (a, b) => { return a.email.localeCompare(b.email)},
    width: '20%',
    align: 'center',
    translate_key: 'email'
  },
  {
    dataIndex: 'statusIcon',
    align: 'center',
    width: '10%',
    translate_key: 'status',
    sorter: (a, b) => { return  a.disabled - b.disabled},
    defaultSortOrder : 'descend'
  },
  {
    dataIndex: 'editButton',
    align: 'center',
    width: '10%',
  },
]
