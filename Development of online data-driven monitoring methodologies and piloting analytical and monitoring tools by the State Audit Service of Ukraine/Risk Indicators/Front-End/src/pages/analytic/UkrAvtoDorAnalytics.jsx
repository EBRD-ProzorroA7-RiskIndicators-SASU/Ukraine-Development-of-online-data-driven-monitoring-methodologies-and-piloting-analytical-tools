import React, {Component} from 'react'
import {connect} from "react-redux";
import {withTranslate} from "react-redux-multilingual";
import Iframe from 'react-iframe'

const WIDTH_HEIGHT_COEFFICIENT = 0.77

class UkrAvtoDor extends Component {

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
        let blockWidth = document.getElementById('report').offsetWidth
        this.setState({frameHeight: (blockWidth * WIDTH_HEIGHT_COEFFICIENT) + 'px'})
    }

    render() {
        return (
            <div id={'report'}>
                <Iframe
                    url="https://datastudio.google.com/embed/reporting/0e3df189-366c-4d44-947e-20f3019a881b/page/RqqBC"
                    width="100%"
                    height={this.state.frameHeight}
                    id="ukr-avto-dor"
                    className="analytics"
                    display="initial"
                    frameBorder={0}
                    onLoad={() => this.updateHeight()}/>
            </div>
        )
    }
}


export default connect()
(withTranslate(UkrAvtoDor))
