import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Search';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Search view={'list'} query={''} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
