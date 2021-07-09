import React, {Component} from 'react'
import {connect} from "react-redux";
import {withTranslate} from "react-redux-multilingual";
import Iframe from 'react-iframe'

class ChecklistsIMF extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div>

                <Iframe url="https://airtable.com/embed/shrKXWjl4Ra5b9xpQ?backgroundColor=blue"
                        width="89%"
                        height="80%"
                        id="supervisor-analytics"
                        className="analytics"
                        display="initial"
                        position="absolute"/>

            </div>
        )
    }
}


export default connect()
(withTranslate(ChecklistsIMF))
