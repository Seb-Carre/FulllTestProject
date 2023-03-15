import {fireEvent, render} from '@testing-library/react-native';

import Checkbox from '../Checkbox';
import React from 'react';

it('render the checkbox with active mode as snapShot we expected', () => {
  const {toJSON} = render(<Checkbox onPress={() => {}} mode="active" />);

  expect(toJSON()).toMatchSnapshot();
});

it('check if function is being called by pressing the checkbox', () => {
  // Using a mock function to check if our function is called
  const functionToCall = jest.fn();
  const {getByTestId} = render(
    <Checkbox onPress={functionToCall} testID="checkbox" mode="active" />,
  );
  // Making a press event on our checkbox
  fireEvent.press(getByTestId('checkbox'));
  expect(functionToCall).toBeCalled();
});

it('check if icon is here with active mode', () => {
  const {queryByTestId} = render(<Checkbox onPress={() => {}} mode="active" />);
  // if the mode is active, we have in this case an icon component !
  expect(queryByTestId('Checkbox.icon')).not.toBeNull();
});

it('check if view style is visible with multiple mode', () => {
  const {queryByTestId} = render(<Checkbox onPress={() => {}} mode="multiple" />);
  // if the mode is multiple, we have in this case our viewStyle component !
  expect(queryByTestId('Checkbox.viewStyle')).not.toBeNull();
});

it('check if view style is visible with none mode', () => {
  const {queryByTestId} = render(<Checkbox onPress={() => {}} mode="none" />);
  expect(queryByTestId('Checkbox.viewStyle')).not.toBeNull();
});
