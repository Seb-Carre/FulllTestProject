import {fireEvent, render} from '@testing-library/react-native';

import Button from '../Button';
import React from 'react';

it('render the button as the snapShot we expected', () => {
  const {toJSON} = render(<Button>Hello World</Button>);

  expect(toJSON()).toMatchSnapshot();
});

it('renders the button with the text correctly and click', () => {
  const text = 'Click on me';
  // Using a mock function to check if our function is called
  const mockFunction = jest.fn();
  const {getByTestId, queryByText} = render(
    <Button testID="button" onPress={mockFunction}>
      {text}
    </Button>,
  );
  const button = getByTestId('button');
  // We check if the text button is here
  expect(queryByText(text)).not.toBeNull();

  // Making a press event on our button
  fireEvent.press(button);
  // With the press, we know that our function has been called !
  expect(mockFunction).toBeCalled();
});
