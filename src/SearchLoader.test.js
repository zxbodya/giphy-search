import React from 'react';
import ReactDOM from 'react-dom';
import SearchLoader from './SearchLoader';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <SearchLoader view={'list'} query={''}>
      {() => null}
    </SearchLoader>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
