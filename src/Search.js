import React from 'react';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import SearchLoader from './SearchLoader';
import Preview, { estimatePreviewSize } from './Preview';
import { Col, Row } from 'antd';

function Search({ query, view }) {
  return (
    <SearchLoader query={query}>
      {({ totalCount, isItemLoaded, loadMoreItems, getItem, query }) => {
        const PreviewRow = ({ index, style }) => {
          const data = getItem(index);
          return (
            <div style={style}>
              {view === 'list' ? (
                <Preview data={data} />
              ) : (
                <Row>
                  <Col span={8}>
                    <Preview data={data} />
                  </Col>
                  <Col span={8}>
                    <Preview data={data} />
                  </Col>
                  <Col span={8}>
                    <Preview data={data} />
                  </Col>
                </Row>
              )}
            </div>
          );
        };

        function getItemSize(index) {
          const data = getItem(index);
          return estimatePreviewSize(data);
        }

        return (
          <AutoSizer>
            {({ width, height }) => (
              // key to force recreating loader component after query or view changed
              <InfiniteLoader
                key={query}
                isItemLoaded={isItemLoaded}
                itemCount={totalCount}
                loadMoreItems={loadMoreItems}
              >
                {({ onItemsRendered, ref }) => (
                  <VariableSizeList
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                    height={height}
                    width={width}
                    itemCount={totalCount}
                    itemSize={getItemSize}
                  >
                    {PreviewRow}
                  </VariableSizeList>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        );
      }}
    </SearchLoader>
  );
}

export default Search;
