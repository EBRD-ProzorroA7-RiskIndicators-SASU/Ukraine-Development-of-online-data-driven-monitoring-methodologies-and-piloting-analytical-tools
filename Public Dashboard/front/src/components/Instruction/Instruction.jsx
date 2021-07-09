import React from 'react'
import { INSTRUCTION } from '../../constants/index'
import _ from 'lodash'
import { useLocation } from 'react-router-dom'
import './styles.scss'
import { Button } from 'antd'
// import { ArrowLeftOutlined } from '../../assets/icons'
import { ArrowLeftOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const Instruction = ({ mobile, onClick, instructionText }) => {
  const location = useLocation()
  const currentPath = location.pathname
  const [renderInstruction] = _.filter(INSTRUCTION, instruction => instruction.path === currentPath)
  const { top, middle, bottom } = renderInstruction

  return (
    <div className="instruction-wrapper">
      <div className="instruction-back-buttons">
        {!mobile &&
        <Button
          className="instruction-button group-button"
          // icon={<ArrowLeftOutlined />}
          onClick={() => onClick()}
        >
          <ArrowLeftOutlined style={{ height: 20, display: 'flex', alignItems: 'center', color: '#1E6592' }} />
          <span>Повернутися</span>
        </Button>
        }
      </div>
      <div className="instruction">
        <h2 className="instruction-title">
          {instructionText}
        </h2>
        <span className="instruction-sections">
        {top}
        </span>
        <span className="instruction-sections">
        {middle}
      </span>
        <span className="instruction-sections">
        {bottom}
        </span>
      </div>
    </div>
  )
}

Instruction.propTypes = {
  mobile: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  instructionText: PropTypes.string,
}

// Set default props
Instruction.defaultProps = {
  instructionText: 'Інструкція',
}

export default Instruction
