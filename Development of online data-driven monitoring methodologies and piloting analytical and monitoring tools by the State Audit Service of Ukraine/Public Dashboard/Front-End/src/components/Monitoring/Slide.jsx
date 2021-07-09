import React from 'react';
import { Tooltip } from "antd";
import * as numeral from 'numeral';

numeral.locale('ua');

const Slide = ({ slide, index }) => {
  const { name, amount, outerId } = slide;
  const newTitle = name.length >= 50 ? `${name.slice(0, 50)}...` : name;

  return (
    <div key={index} className="department-content">
      <div className="department-content__title">
        <Tooltip
          title={name}
          color="#FFFFFF"
          borderRadius="5px"
          border='2px'
        >
          {newTitle}
        </Tooltip>
      </div>
      <div className="department-content__currency">
        <span className="code">
          ЄДРПОУ: {outerId}
        </span>
        <div className="department-currency-wrapper">
          <span className="currency">
            {numeral(amount).format('0.00 a').split(' ')[0]}
          </span>
          <span className="label">
            {`${numeral(amount).format('0.00 a').split(' ')[1]} грн`}
          </span>
        </div>
      </div>
      <div className="department-content__description">
        Загальна вартість закупівель замовника, в яких Державна аудиторська служба України виявила порушення 
      </div>
    </div>
  )
}

export default Slide;
