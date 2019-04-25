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
      {props => {
        let { getItem, query } = props;
        let totalCount, isItemLoaded, loadMoreItems;
        let PreviewRow, getItemSize;
        if (view === 'list') {
          totalCount = props.totalCount;
          isItemLoaded = props.isItemLoaded;
          loadMoreItems = props.loadMoreItems;

          PreviewRow = ({ index, style }) => (
            <div style={style}>
              <Preview data={getItem(index)} />
            </div>
          );

          getItemSize = index => estimatePreviewSize(getItem(index));
        } else {
          const count = 3;
          totalCount = Math.ceil(props.totalCount / count);
          const getIndices = index => {
            const indices = [];
            for (let i = 0; i < count && index * count + i < totalCount; i += 1)
              indices.push(index * count + i);
            return indices;
          };

          isItemLoaded = index => getIndices(index).every(props.isItemLoaded);

          loadMoreItems = (start, stop) =>
            props.loadMoreItems(start * count, stop * count);

          PreviewRow = ({ index, style }) => (
            <div style={style}>
              <Row>
                {getIndices(index).map(i => (
                  <Col span={24 / count} key={i}>
                    <Preview data={getItem(i)} />
                  </Col>
                ))}
              </Row>
            </div>
          );

          getItemSize = index =>
            Math.max(
              ...getIndices(index).map(i => estimatePreviewSize(getItem(i)))
            );
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
