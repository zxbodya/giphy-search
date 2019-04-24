import React from 'react';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import SearchLoader from './SearchLoader';
import Preview, { estimatePreviewSize } from './Preview';

function Search({ query, view }) {
  return (
    <SearchLoader query={query}>
      {({ totalCount, isItemLoaded, loadMoreItems, getItem, query }) => {
        const Row = ({ index, style }) => {
          const data = getItem(index);
          return (
            <div style={style}>
              <Preview data={data} />
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
              // key to force recreating loader component after query changed
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
                    {Row}
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
