import React from 'react';
import ReactDOM from 'react-dom';
import Search, { viewProps } from './Search';
import * as previewModule from './Preview';

describe('Search', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('correctly transform props for list view', () => {
    const mockEstimatePreviewSize = jest
      .spyOn(previewModule, 'estimatePreviewSize')
      .mockImplementation(() => {
        return 100;
      });

    const props = {
      getItem: id => ({
        id,
      }),
      query: 'test',
      totalCount: 100,
      isItemLoaded: () => false,
      loadMoreItems: () => {},
    };
    const {
      key,
      totalCount,
      isItemLoaded,
      loadMoreItems,
      getItemSize,
    } = viewProps(props, 'list');

    expect(key).toBe('test__list');
    expect(totalCount).toEqual(props.totalCount);
    expect(isItemLoaded).toEqual(props.isItemLoaded);
    expect(loadMoreItems).toEqual(props.loadMoreItems);
    expect(getItemSize(1)).toEqual(100);
    expect(mockEstimatePreviewSize).toBeCalledWith({ id: 1 });
  });

  it('correctly transform props for grid view', () => {
    const mockEstimatePreviewSize = jest
      .spyOn(previewModule, 'estimatePreviewSize')
      .mockImplementation(({ id }) => {
        if (id === 0) return 100;
        if (id === 1) return 200;
        if (id === 2) return 300;
      });

    const props = {
      getItem: id => ({
        id,
      }),
      query: 'test',
      totalCount: 100,
      isItemLoaded: jest.fn(() => true),
      loadMoreItems: jest.fn(() => false),
    };
    const {
      key,
      totalCount,
      isItemLoaded,
      loadMoreItems,
      getItemSize,
    } = viewProps(props, 'grid');

    expect(key).toBe('test__grid');
    expect(totalCount).toEqual(Math.ceil(props.totalCount / 3));
    isItemLoaded(0);
    expect(props.isItemLoaded).toHaveBeenCalledTimes(3);

    loadMoreItems(0, 1);
    expect(props.loadMoreItems).toBeCalledWith(0, 3);

    expect(getItemSize(0)).toEqual(300);
    expect(mockEstimatePreviewSize).toBeCalledWith({ id: 1 });
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search view={'list'} query={''} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
