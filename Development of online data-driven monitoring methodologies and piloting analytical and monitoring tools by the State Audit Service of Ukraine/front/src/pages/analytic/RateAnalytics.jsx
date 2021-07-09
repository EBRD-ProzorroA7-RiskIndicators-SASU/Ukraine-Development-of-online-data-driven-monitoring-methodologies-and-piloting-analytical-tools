import React, {Component} from 'react'
import {connect} from "react-redux";
import {withTranslate} from "react-redux-multilingual";
import Iframe from 'react-iframe'

const WIDTH_HEIGHT_COEFFICIENT = 0.78

class RateAnalytics extends Component {

    constructor(props) {
        super(props)
        this.state = {
            frameHeight: '0px'
        }
    }

    componentDidMount() {
        window.addEventListener("resize", () => {
            this.updateHeight()
        })
    }

    updateHeight() {
        let blockWidth = document.getElementById('reports').offsetWidth
        this.setState({frameHeight: (blockWidth * WIDTH_HEIGHT_COEFFICIENT) + 'px'})
    }

    render() {
        return (
            <div id={'reports'}>
                <Iframe url="https://datastudio.google.com/embed/reporting/e43f171e-b874-47e4-8898-bf5f5b76bb36/page/Uwl1B"
                        width="100%"
                        height={this.state.frameHeight}
                        id="rate-analytics"
                        className="analytics"
                        display="initial"
                        frameBorder={0}
                        onLoad={() => this.updateHeight()}
                />
            </div>
        )
    }
}


export default connect()
(withTranslate(RateAnalytics))
