import React, { Component } from 'react';
import { Radio, Icon, Input, Layout, Typography, Button } from 'antd';
import styles from './App.module.css';
import Search from './Search';

const { Title, Paragraph } = Typography;

class App extends Component {
  state = {
    query: '',
    view: 'list',
  };
  render() {
    const { view, query } = this.state;
    return (
      <Layout className={styles.container}>
        <Layout.Header>
          <div className={styles.searchBar}>
            <Input.Search
              key={query}
              className={styles.searchInput}
              placeholder="input search text"
              enterButton="Search"
              size="large"
              defaultValue={query}
              onSearch={value => {
                this.setState({ query: value });
              }}
            />
            <Radio.Group
              className={styles.buttons}
              value={view}
              onChange={e => {
                this.setState({ view: e.target.value });
              }}
              buttonStyle="solid"
              size="large"
            >
              <Radio.Button value="list">
                <Icon type="bars" />
              </Radio.Button>
              <Radio.Button value="grid">
                <Icon type="table" />
              </Radio.Button>
            </Radio.Group>
          </div>
        </Layout.Header>
        <Layout.Content>
          {query === '' ? (
            <div className={styles.placeholderWrap}>
              <Typography>
                <Title>Welcome to Giphy Search</Title>
                <Paragraph>Type your query and hit search!</Paragraph>
                <Paragraph>
                  Or click{' '}
                  <Button
                    onClick={() => {
                      this.setState({ query: 'kittens' });
                    }}
                  >
                    here
                  </Button>{' '}
                  to see some kittens
                </Paragraph>
              </Typography>
            </div>
          ) : (
            <Search query={query} view={view} />
          )}
        </Layout.Content>
      </Layout>
    );
  }
}

export default App;
