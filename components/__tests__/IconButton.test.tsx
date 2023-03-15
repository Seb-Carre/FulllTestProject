import {fireEvent, render} from '@testing-library/react-native';

import IconButton from '../IconButton';
import React from 'react';

const checkMark = '../../assets/images/check-mark.png';
it('render the icon button as snapShot expected', () => {
  const {toJSON} = render(
    <IconButton iconName={require(checkMark)} onPress={() => {}} />,
  );
  expect(toJSON()).toMatchSnapshot();
});

it('renders the icon button and click', () => {
  // Using a mock function to check if our function is called
  const mockFunction = jest.fn();
  const {getByTestId} = render(
    <IconButton
      testID="iconButton"
      iconName={require(checkMark)}
      onPress={mockFunction}
    />,
  );
  const button = getByTestId('iconButton');

  // Making a press event on our IconButton
  fireEvent.press(button);
  expect(mockFunction).toBeCalled();
});
