import React from 'react'

import './Divider.css'

const Divider = props => {
  const { ...styles } = props
  return <div className="divider" style={styles} />
}

export default Divider
