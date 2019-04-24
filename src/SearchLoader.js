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

    let limit = PAGE_SIZE;
    let offset = Math.floor(startIndex / PAGE_SIZE) * PAGE_SIZE;

    const results = [];

    while (offset < stopIndex) {
      if (!pages.has(offset)) {
        const loadPromise = loadSearchResults(query, limit, offset).then(
          res => {
            const {
              data,
              pagination: { total_count, offset },
            } = res.data;

            data.forEach((item, index) => {
              cache.set(index + offset, item);
            });

            if (total_count !== totalCount) {
              // replace initial count
              this.setState({ totalCount: total_count });
            }
          }
        );
        pages.set(offset, loadPromise);
        results.push(loadPromise);
      }
      offset += PAGE_SIZE;
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
