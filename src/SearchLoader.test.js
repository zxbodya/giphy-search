import React from 'react';
import ReactDOM from 'react-dom';
import SearchLoader from './SearchLoader';
import * as giphy from './giphy';

describe('SearchLoader', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SearchLoader query={''}>{() => null}</SearchLoader>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('works for normal case', async () => {
    const div = document.createElement('div');
    let renderProps;

    ReactDOM.render(
      <SearchLoader query={'test'}>
        {props => {
          renderProps = props;
          return null;
        }}
      </SearchLoader>,
      div
    );

    // verify initial state
    expect(renderProps.query).toBe('test');
    expect(renderProps.getItem(0)).toBe(undefined);
    expect(renderProps.isItemLoaded(0)).toBe(false);
    expect(renderProps.totalCount).toBe(50);

    const mockLoadSearchResults = jest
      .spyOn(giphy, 'loadSearchResults')
      .mockImplementation((query, limit, offset) => {
        return Promise.resolve({
          data: {
            data: new Array(50).fill(true).map((_, i) => i),
            pagination: { total_count: 100, count: 50 },
          },
        });
      });

    await renderProps.loadMoreItems(0, 20);

    // verify state after fisrt page was loaded
    expect(mockLoadSearchResults).toHaveBeenCalledTimes(1);
    expect(renderProps.getItem(0)).toBe(0);
    expect(renderProps.isItemLoaded(0)).toBe(true);
    expect(renderProps.totalCount).toBe(100);

    // check if page loaded previosly is not reloaded
    await renderProps.loadMoreItems(0, 20);
    await renderProps.loadMoreItems(21, 45);
    expect(mockLoadSearchResults).toHaveBeenCalledTimes(1);

    // check that only first page is loaded
    expect(renderProps.getItem(51)).toBe(undefined);
    expect(renderProps.isItemLoaded(51)).toBe(false);

    // load next page, check data
    await renderProps.loadMoreItems(21, 52);
    expect(mockLoadSearchResults).toHaveBeenCalledTimes(2);
    expect(renderProps.getItem(51)).toBe(1);
    expect(renderProps.isItemLoaded(51)).toBe(true);

    // change search query
    ReactDOM.render(
      <SearchLoader query={'test2'}>
        {props => {
          renderProps = props;
          return null;
        }}
      </SearchLoader>,
      div
    );

    // check that state was changed to new query
    expect(renderProps.query).toBe('test2');
    expect(renderProps.getItem(0)).toBe(undefined);
    expect(renderProps.isItemLoaded(0)).toBe(false);
    expect(renderProps.totalCount).toBe(50);

    ReactDOM.unmountComponentAtNode(div);
  });

  it('works for incorrect total count in result', async () => {
    const div = document.createElement('div');
    let renderProps;

    ReactDOM.render(
      <SearchLoader query={'test'}>
        {props => {
          renderProps = props;
          return null;
        }}
      </SearchLoader>,
      div
    );

    const mockLoadSearchResults = jest
      .spyOn(giphy, 'loadSearchResults')
      .mockImplementation((query, limit, offset) => {
        let data;
        if (offset === 50) {
          // actual last page
          data = {
            data: new Array(20).fill(true).map((_, i) => i),
            pagination: { total_count: 300, count: 20 },
          };
        } else if (offset > 100) {
          // missing pages
          data = {
            data: [],
            pagination: { total_count: 0, count: 0 },
          };
        } else {
          data = {
            data: new Array(50).fill(true).map((_, i) => i),
            pagination: { total_count: 300, count: 50 },
          };
        }

        return Promise.resolve({
          data: data,
        });
      });

    // verify state after fisrt page was loaded
    await renderProps.loadMoreItems(0, 20);
    expect(mockLoadSearchResults).toHaveBeenCalledTimes(1);
    expect(renderProps.totalCount).toBe(300);

    // load missing page
    await renderProps.loadMoreItems(200, 250);
    expect(mockLoadSearchResults).toHaveBeenCalledTimes(2);
    expect(renderProps.getItem(201)).toBe(undefined);
    expect(renderProps.totalCount).toBe(200);

    // load next page, check data
    await renderProps.loadMoreItems(21, 52);
    expect(mockLoadSearchResults).toHaveBeenCalledTimes(3);
    expect(renderProps.totalCount).toBe(70);

    ReactDOM.unmountComponentAtNode(div);
  });
});
