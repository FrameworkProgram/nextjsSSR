import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import Container from '../components/Container'
import {
    increment,
    decrement,
    resetcount
} from '../store/actions/counter'

class Index extends React.Component {
    static getInitialProps({ reduxStore, req }) {
        return {}
    }
    incrementCount = () => {
        let {dispatch} = this.props;
        dispatch(increment())
    }

    decrementCount = () => {
        let {dispatch} = this.props;
        dispatch(decrement())
    }

    resetcountFn = () => {
        let {dispatch} = this.props;
        dispatch(resetcount())
    }

    componentDidMount() {
        this.resetcountFn();
    }

    render() {
        const { counter } = this.props.state
        return (
            <Container>
                <div className="example">
                    hello world!
                </div>
                
                <h1>Count: <span>{counter.count}</span></h1>
                <button onClick={this.incrementCount}>+1</button>
                <button onClick={this.decrementCount}>-1</button>
                <button onClick={this.resetcountFn}>reset</button>
            </Container>
        )
    }
}
function mapStateToProps (state) {
    return { state }
}
// function mapActionToProps (dispatch) {
//     bindActionCreators({ increment, decrement, resetcount }, dispatch)
// }
export default connect(mapStateToProps)(Index)
