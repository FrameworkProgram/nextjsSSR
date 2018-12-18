import React from 'react'
// 继承react component生命周期
export default class extends React.Component {
    static async getInitialProps({ req }) {
        const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
        return { userAgent }
    }

    render() {
        return (
            <div>
                Hello World {this.props.userAgent}
            </div>
        )
    }
}
