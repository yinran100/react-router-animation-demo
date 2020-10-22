import React from 'react';
import {
  List,
  Button
} from 'antd';

const LIST_DATA = new Array(15).fill(1);

class ListPage extends React.PureComponent {

  onBack = () => {
    this.props.history.goBack();
  }

  onClickListItem = index => {
    this.props.history.push({pathname: `/detail/${index}`});
  }

  renderListItem = (item, index) => {
    return (
      <List.Item onClick={() => this.onClickListItem(index)}>
        <span style={styles.listItemText}>Item {index + 1}</span>
      </List.Item>
    );
  }

  render() {
    return (
      <div style={styles.container}>
        <h1 style={styles.titleText}>This is ListPage</h1>
        <div style={styles.btnGroup}>
          <Button onClick={this.onBack}>return</Button>
        </div>
        <List
          bordered
          dataSource={LIST_DATA}
          renderItem={this.renderListItem}
        />
      </div>
    );
  }
}
export default ListPage

const styles = {
  container: {
    // position: 'absolute',
    // left: 0,
    // top: 0,
    // width: '100vw',
    // height: '100vh',
    padding: '0 20px 20px',
    backgroundColor: '#9A4538'
  },
  titleText: {
    paddingTop: 20,
    color: '#FFF',
    textAlign: 'center'
  },
  listItemText: {
    color: '#FFF'
  },
  btnGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '20px 20px'
  }
}