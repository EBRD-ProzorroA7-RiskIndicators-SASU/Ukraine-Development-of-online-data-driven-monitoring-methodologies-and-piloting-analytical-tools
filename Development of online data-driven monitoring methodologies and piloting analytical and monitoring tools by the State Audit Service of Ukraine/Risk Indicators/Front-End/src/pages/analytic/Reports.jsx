import React, {Component} from 'react'
import {connect} from "react-redux";
import {withTranslate} from "react-redux-multilingual";
import Iframe from 'react-iframe'

const WIDTH_HEIGHT_COEFFICIENT = 0.77

class Reports extends Component {

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
                <Iframe
                    url="https://datastudio.google.com/embed/reporting/ec3dd5d4-e02f-4fba-80c7-f33bfc083f1c/page/sLI6B"
                    id="report_1"
                    width="100%"
                    height={this.state.frameHeight}
                    className="analytics"
                    display="initial"
                    frameBorder={0}
                    onLoad={() => this.updateHeight()}
                />
                <Iframe
                    url="https://datastudio.google.com/embed/reporting/679aeeb7-5f2f-4f1c-96ea-a6ad87e6cdd4/page/2WV6B"
                    id="report_2"
                    width="100%"
                    height={this.state.frameHeight}
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
(withTranslate(Reports))
