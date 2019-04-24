import React from 'react';
import { Avatar, Card, Skeleton, Spin } from 'antd';
import styles from './Preview.module.css';

export function estimatePreviewSize(data) {
  let res = 200; // image
  res += 10 + 2;

  // data is loaded and there are additional information to display
  let titleHeight = 13;
  let avatarHeight = 32;
  let skeletonSize = 86;

  res += 24 * 2; // card padding

  if (!data) {
    res += skeletonSize; // skeleton size
  } else if (data.title || data.user) {
    if (data.title) res += titleHeight; // image title
    if (data.user) res += avatarHeight; // user avatar and name
  }
  return res;
}

function Preview({ data }) {
  return (
    <div className={styles.container}>
      {data ? (
        <Card
          cover={
            <div className={styles.imageWrapper}>
              <picture>
                <source
                  srcSet={data.images.fixed_height.webp}
                  type="image/webp"
                />
                <source
                  srcSet={data.images.fixed_height.url}
                  type="image/jpeg"
                />
                <img
                  alt={data.title}
                  src={data.images.fixed_height.url}
                  width={data.images.fixed_height.width}
                  height={data.images.fixed_height.height}
                  style={{
                    maxWidth: '100%',
                    height: `${(data.images.fixed_height.height * 100) /
                      data.images.fixed_height.width}%`,
                  }}
                />
              </picture>
            </div>
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
