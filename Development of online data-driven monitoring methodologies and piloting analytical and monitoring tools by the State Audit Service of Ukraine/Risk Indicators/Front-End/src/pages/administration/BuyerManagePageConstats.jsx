
export const BUYERS_TABLE_COLUMNS = [
  {
    dataIndex: 'identifierLegalName',
    sorter: false,
    width: '30%',
    align: 'left',
    translate_key: 'buyer_name'
  },
  {
    dataIndex: 'identifierId',
    sorter: false,
    width: '30%',
    align: 'center',
    translate_key: 'buyer_identifier',
  },
  {
    dataIndex: 'processed',
    sorter: true,
    onHeaderCell: (column) => {
      return {
        onClick: () => {
          console.log('onClick');
        }
      };
    },
    width: '20%',
    align: 'center',
    translate_key: 'status'
  },
]
