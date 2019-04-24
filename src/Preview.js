import React from 'react';
import { Avatar, Card, Skeleton, Spin } from 'antd';
import styles from './Preview.module.css';

function Preview({ data }) {
  return (
    <div className={styles.container}>
      {data ? (
        <Card
          cover={
            <picture>
              <source
                srcSet={data.images.fixed_height.webp}
                type="image/webp"
              />
              <source srcSet={data.images.fixed_height.url} type="image/jpeg" />
              <img
                alt={data.title}
                src={data.images.fixed_height.url}
                width={data.images.fixed_height.width}
                height={data.images.fixed_height.height}
              />
            </picture>
          }
        >
          <Card.Meta
            avatar={data.user && <Avatar src={data.user.avatar_url} />}
            title={data.user && data.user.display_name}
            description={data.title}
          />
        </Card>
      ) : (
        <Card
          cover={
            <div className={styles.imagePlaceholder}>
              <Spin size={'large'} />
            </div>
          }
        >
          <Skeleton active avatar title paragraph={{ rows: 1 }} />
        </Card>
      )}
    </div>
  );
}

export default Preview;
