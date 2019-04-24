import React from 'react';
import axios from 'axios';

const PAGE_SIZE = 50;
const API_KEY = 'bGQxvVa3nMcCBo770QLYqqszXmudk6uE&q';

function loadSearchResults(query, limit, offset) {
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}=${query}&limit=${limit}&offset=${offset}&rating=G&lang=en`;
  return axios.get(url);
}

function createSearchState(query) {
  return {
    totalCount: PAGE_SIZE,

    cache: new Map(),
    pages: new Map(),

    query: query,
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
        ).then(res => {
          const {
            data,
            // offset in response is not reliable,
            // and would equals "0" for non existing pages
            pagination: { total_count, count },
          } = res.data;

          data.forEach((item, index) => {
            cache.set(index + requestOffset, item);
          });

          if (total_count !== totalCount) {
            this.setState({ totalCount: total_count });
          }

          // woraround for gliphy api returning wrong total_count
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
        });
        pages.set(requestOffset, loadPromise);
        results.push(loadPromise);
      }
    }

    if (results.length) return Promise.all(results);
  };

  render() {
    const { totalCount, query } = this.state;
    return this.props.children({
      query,
      totalCount,
      isItemLoaded: this.isItemLoaded,
      loadMoreItems: this.loadMoreItems,
      getItem: this.getItem,
    });
  }
}

export default SearchLoader;
