/* eslint-disable no-unused-vars */
import React from 'react';

import {
  Button
} from 'antd';

class DetailPage extends React.PureComponent {
  state = {
    num: 1
  }
  componentDidMount() {
    console.log(this.props.match);
  }
  onBack = () => {
    this.props.history.goBack();
  }
  onGotoDetail = () => {
    const index = (Math.random() + '')[2]
    this.props.history.push(`/detail/${index}`)
  }

  render() {
    const { num } = this.state
    return (
      <div style={styles.container}>
        <h1 style={styles.titleText}>This is DetailPage</h1>
        <h1 style={styles.titleText} onClick={() => this.setState({ num: num + 1 })}>{num}</h1>
        <div style={styles.btnGroup}>
          <Button onClick={this.onGotoDetail} type="primary">goTo Other Detail</Button>
        </div>
        <div style={styles.btnGroup}>
          <Button onClick={this.onBack}>return</Button>
        </div>
      </div>
    );
  }
}
export default DetailPage

const styles = {
  container: {
    // position: 'absolute',
    // left: 0,
    // top: 0,
    // width: '100vw',
    height: '100vh',
    padding: '0 20px',
    backgroundColor: '#80D4AC'
  },
  titleText: {
    paddingTop: 20,
    color: '#FFF',
    textAlign: 'center'
  },
  btnGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  }
}