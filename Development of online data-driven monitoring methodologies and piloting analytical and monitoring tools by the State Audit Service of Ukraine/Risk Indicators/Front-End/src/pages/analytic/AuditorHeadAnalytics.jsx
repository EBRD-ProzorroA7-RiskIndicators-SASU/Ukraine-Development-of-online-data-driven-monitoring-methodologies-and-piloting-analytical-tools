import React, {Component} from 'react'
import {connect} from "react-redux";
import {withTranslate} from "react-redux-multilingual";
import Iframe from 'react-iframe'

const WIDTH_HEIGHT_COEFFICIENT = 0.78

class AuditorHeadAnalytics extends Component {

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
                    url="https://datastudio.google.com/embed/reporting/945895f7-51cf-4ffb-85ea-0acbc781a055/page/mxD2B"
                    width="100%"
                    height={this.state.frameHeight}
                    id="supervisor-analytics"
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
(withTranslate(AuditorHeadAnalytics))
