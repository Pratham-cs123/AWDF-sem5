import React , {Component} from "react";

class LifecycleA extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dept: 'CSE'
        }
        console.log('LifecycleA constructor')
    }
    static getDerivedStateFromProps(props, state) {
        console.log('LifecycleA getDerivedStateFromProps')
        return null
    }

    componentDidMount() {
        console.log('LifecycleA componentDidMount')
    }
    
    shouldComponentUpdate(){
        console.log('LifecycleA shouldComponentUpdate')
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log('LifecycleA getSnapshotBeforeUpdate')
        return null
    }
    componentDidUpdate() {
        console.log('LifecycleA componentDidUpdate')
    }
    changeState() {
        this.setState({
            dept: 'CSPIT'
        })
    }
    render() {
        console.log('LifecycleA render')
        return (
            <div>
                <h1>Lifecycle A</h1>
            </div>
        )
    }
}

export default LifecycleA;