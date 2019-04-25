import React from 'react';
import ReactDOM from 'react-dom';
import Preview from './Preview';

describe('Preview', () => {
  it('renders without crashing - empty data', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Preview />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  it('renders without crashing - full data', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Preview
        data={{
          user: {
            avatar_url:
              'https://media4.giphy.com/avatars/leroypatterson/kmR9dQjdzWa3.gif',
            display_name: 'Leroy Patterson',
          },
          images: {
            fixed_height: {
              url: 'https://media3.giphy.com/media/CjmvTCZf2U3p09Cn0h/200.gif',
              width: '212',
              height: '200',
              size: '847527',
              mp4: 'https://media3.giphy.com/media/CjmvTCZf2U3p09Cn0h/200.mp4',
              mp4_size: '169611',
              webp:
                'https://media3.giphy.com/media/CjmvTCZf2U3p09Cn0h/200.webp',
              webp_size: '469104',
            },
          },
          title: 'ready lets go GIF by Leroy Patterson',
        }}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
  it('renders without crashing - no user', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Preview
        data={{
          images: {
            fixed_height: {
              url: 'https://media3.giphy.com/media/JIX9t2j0ZTN9S/200.gif',
              width: '200',
              height: '200',
              size: '632576',
              mp4: 'https://media3.giphy.com/media/JIX9t2j0ZTN9S/200.mp4',
              mp4_size: '17842',
              webp: 'https://media3.giphy.com/media/JIX9t2j0ZTN9S/200.webp',
              webp_size: '158680',
            },
          },
          title: 'funny cat GIF',
        }}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
  it('renders without crashing - image only', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Preview
        data={{
          images: {
            fixed_height: {
              url: 'https://media0.giphy.com/media/WXB88TeARFVvi/200.gif',
              width: '159',
              height: '200',
              size: '103637',
              mp4: 'https://media0.giphy.com/media/WXB88TeARFVvi/200.mp4',
              mp4_size: '28881',
              webp: 'https://media0.giphy.com/media/WXB88TeARFVvi/200.webp',
              webp_size: '143970',
            },
          },
        }}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
