import Head from 'next/head'
import Navigation from './Navigation'
import "antd/dist/antd.min.css"
import React, {Component} from 'react';
import {
    Layout
} from 'antd'
const {
    Header, Content, Footer, Sider,
} = Layout;

class Container extends Component {
    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Head>
                    <title>next demo page</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    {/* <link href="/static/css/antd.min.css" rel='stylesheet'></link> */}
                </Head>
                <Sider>
                    <Navigation></Navigation>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content>{this.props.children}</Content>
                    <Footer>@copyright 2018</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default Container