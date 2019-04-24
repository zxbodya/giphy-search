import React, { Component } from 'react';
import { Radio, Icon, Input, Layout, Typography, Button } from 'antd';
import styles from './App.module.css';
import Preview from './Preview';

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
            <div style={{ height: '100%', overflow: 'scroll' }}>
              <Preview />
              <Preview
                data={{
                  user: {
                    avatar_url:
                      'https://media4.giphy.com/avatars/leroypatterson/kmR9dQjdzWa3.gif',
                    display_name: 'Leroy Patterson',
                  },
                  images: {
                    fixed_height: {
                      url:
                        'https://media3.giphy.com/media/CjmvTCZf2U3p09Cn0h/200.gif',
                      width: '212',
                      height: '200',
                      size: '847527',
                      mp4:
                        'https://media3.giphy.com/media/CjmvTCZf2U3p09Cn0h/200.mp4',
                      mp4_size: '169611',
                      webp:
                        'https://media3.giphy.com/media/CjmvTCZf2U3p09Cn0h/200.webp',
                      webp_size: '469104',
                    },
                  },
                  title: 'ready lets go GIF by Leroy Patterson',
                }}
              />
              <Preview
                data={{
                  images: {
                    fixed_height: {
                      url:
                        'https://media3.giphy.com/media/JIX9t2j0ZTN9S/200.gif',
                      width: '200',
                      height: '200',
                      size: '632576',
                      mp4:
                        'https://media3.giphy.com/media/JIX9t2j0ZTN9S/200.mp4',
                      mp4_size: '17842',
                      webp:
                        'https://media3.giphy.com/media/JIX9t2j0ZTN9S/200.webp',
                      webp_size: '158680',
                    },
                  },
                  title: 'funny cat GIF',
                }}
              />
              <Preview
                data={{
                  images: {
                    fixed_height: {
                      url:
                        'https://media0.giphy.com/media/WXB88TeARFVvi/200.gif',
                      width: '159',
                      height: '200',
                      size: '103637',
                      mp4:
                        'https://media0.giphy.com/media/WXB88TeARFVvi/200.mp4',
                      mp4_size: '28881',
                      webp:
                        'https://media0.giphy.com/media/WXB88TeARFVvi/200.webp',
                      webp_size: '143970',
                    },
                  },
                }}
              />
            </div>
          )}
        </Layout.Content>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
    );
  }
}

export default App;
