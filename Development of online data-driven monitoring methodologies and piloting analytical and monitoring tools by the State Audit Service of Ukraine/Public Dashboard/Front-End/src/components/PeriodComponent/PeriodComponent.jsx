import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Button, notification, message } from 'antd'
import { QuestionIcon, ShareIcon, XlsIcon } from '../../assets/icons'
import PeriodButtons from '../PeriodButtons/PeriodButtons'
import './styles.scss'

const PeriodComponent = (props) => {
  const {
    mobile,
    instructionTitle,
    downloadTitle,
    selectedPeriod,
    handleSelectPeriod,
    handleClickInstruction,
    methodGetData,
    shareTitle,
    textForCopy,
  } = props

  const textAreaRef = useRef(null)

  const copyToClipboard = (e) => {
    textAreaRef.current.select()

    try {
      document.execCommand('copy')
      message.success('Посилання на цю сторінку скопійовано')
    } catch (err) {
      console.error('Failed to copy!', err)
    }

    e.target.focus()
  }

  return (
    <>
      <div className="period-navigation">
        <div className="buttons-group">
          {!mobile &&
          <Button
            className="instruction-button group-button"
            icon={<QuestionIcon />}
            onClick={() => handleClickInstruction()}
          >
            {instructionTitle}
          </Button>
          }
          <PeriodButtons
            mobile={mobile}
            setPeriod={() => {
            }}
            handleSelectPeriod={handleSelectPeriod && handleSelectPeriod}
            period={selectedPeriod}
            method={methodGetData ? methodGetData : null}
          />
          <div className="download-buttons">
            {/*{!mobile && <Button className="xls-button group-button" icon={<XlsIcon />}>*/}
            {/*  {downloadTitle}*/}
            {/*</Button>}*/}
            <>
              <Button
                className="xls-button group-button"
                icon={<ShareIcon />}
                onClick={copyToClipboard}
              >
                {!mobile ? shareTitle : ''}
              </Button>

            </>
          </div>
        </div>
      </div>
      <textarea
        readOnly={true}
        ref={textAreaRef}
        value={!_.isEmpty(textForCopy) ? textForCopy : window.location.href}
        // style={{ right: '-9999px', position: 'absolute', visibility: 'hidden' }}
        style={{ opacity: 0, position: 'absolute', height: 1 }}
      />
    </>
  )
}

PeriodComponent.propTypes = {
  mobile: PropTypes.bool.isRequired,
  instructionTitle: PropTypes.string,
  downloadTitle: PropTypes.string,
  selectedPeriod: PropTypes.array,
  handleClickInstruction: PropTypes.func,
  handleSelectPeriod: PropTypes.func,
  methodGetData: PropTypes.func,
  textForCopy: PropTypes.string,
}

// Set default props
PeriodComponent.defaultProps = {
  instructionTitle: 'Інструкція',
  downloadTitle: 'Завантажити',
  shareTitle: 'Поділитися',
  textForCopy: '',
  selectedPeriod: [],
  handleClickInstruction: () => {
  },
  handleSelectPeriod: () => {
  },
}

export default PeriodComponent

