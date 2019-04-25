import React from 'react';
import { loadSearchResults } from './giphy';

const PAGE_SIZE = 50;

function createSearchState(query) {
  return {
    totalCount: PAGE_SIZE,

    cache: new Map(),
    pages: new Map(),

    query: query,

    hasError: false,
  };
}

class SearchLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = createSearchState(props.query);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.query !== state.query) {
      // query changed - create clear search state for it
      return createSearchState(props.query);
    }
    return null;
  }

  isItemLoaded = index => this.state.cache.has(index);

  getItem = index => this.state.cache.get(index);

  componentDidMount() {
    // this is not the best way to do it…
    // it would be better to cancel pending requests instead
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadMoreItems = (startIndex, stopIndex) => {
    const { pages, cache, totalCount, query } = this.state;

    const results = [];

    for (
      let offset = Math.floor(startIndex / PAGE_SIZE) * PAGE_SIZE;
      offset < stopIndex;
      offset += PAGE_SIZE
    ) {
      const requestOffset = offset;
      if (!pages.has(requestOffset)) {
        const loadPromise = loadSearchResults(
          query,
          PAGE_SIZE,
          requestOffset
        ).then(
          res => {
            if (!this._isMounted || query !== this.state.query) {
              // ignore results when component was unmounted, or after query was changed
              return;
            }
            const {
              data,
              // offset in response is not reliable,
              // and would equal "0" for non existing pages
              pagination: { total_count, count },
            } = res.data;

            data.forEach((item, index) => {
              cache.set(index + requestOffset, item);
            });

            if (total_count !== totalCount) {
              this.setState({ totalCount: total_count });
            }

            // workaround for giphy api returning wrong total_count
            if (count === 0 && totalCount > requestOffset) {
              // case when reply is for page after last one
              this.setState({ totalCount: requestOffset });
            } else if (
              count !== PAGE_SIZE &&
              totalCount > requestOffset + count
            ) {
              // case when reply is for last page with results
              this.setState({ totalCount: requestOffset + count });
            }
          },
          e => {
            // not best way to handle errors…
            //
            // I think, generally in apps like this it would be better to make global interceptor for network errors
            // and to have some logic for retrying the requests automatically, or interface to inform about network/server issues
            this.setState({ hasError: true });
            console.error('Error from giphy API', e);
          }
        );
        pages.set(requestOffset, loadPromise);
        results.push(loadPromise);
      }
    }

    if (results.length) return Promise.all(results);
  };

  render() {
    const { totalCount, query, hasError } = this.state;
    return this.props.children({
      query,
      totalCount,
      hasError,
      isItemLoaded: this.isItemLoaded,
      loadMoreItems: this.loadMoreItems,
      getItem: this.getItem,
    });
  }
}

export default SearchLoader;
