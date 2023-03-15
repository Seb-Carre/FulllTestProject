import {fireEvent, render} from '@testing-library/react-native';

import React from 'react';
import SearchInput from '../SearchInput';

it('render the searchInput as snapShot expected', () => {
  const {toJSON} = render(<SearchInput />);

  expect(toJSON()).toMatchSnapshot();
});

it('render the searchInput and check the placeholder', () => {
  const placeholder = 'Hello';
  const {getByTestId} = render(
    <SearchInput
      testID="searchInput"
      placeholder={placeholder}
      onChangeText={() => {}}
    />,
  );
  const input = getByTestId('searchInput');
  expect(input.props.placeholder).toBe(placeholder);
});

it('render the searchInput and change the text', () => {
  // In this case, we are going to check if our textInput has changed with const text and a mock function which is called if there is a text change as we want to reproduce as the search with GitHub
  const text = '123';
  const mockFunction = jest.fn();
  const {getByTestId} = render(
    <SearchInput testID="searchInput" onChangeText={mockFunction} />,
  );
  const input = getByTestId('searchInput');
  fireEvent.changeText(input, text);
  // By onChangeText, we know if the text has changed !
  expect(mockFunction).toBeCalled();
});
