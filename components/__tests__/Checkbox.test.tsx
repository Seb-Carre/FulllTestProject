// We need this library to test every snapshots state depend on mode property, we can't do that with the original jest
import 'jest-specific-snapshot';

import {fireEvent, render} from '@testing-library/react-native';

import Checkbox from '../Checkbox';
import React from 'react';

it('render the checkbox with active mode with the snapshot ui we expected', () => {
  const {toJSON} = render(<Checkbox onPress={() => {}} mode="active" />);
  // toMatchSpecificSnapshot is provided by jest-specific-snapshot, this is the only components that can have a different snapshot with the mode property
  // We are taking the right snapshot specific if the mode property is active
  expect(toJSON()).toMatchSpecificSnapshot(
    './__snapshots__/CheckboxActive.test.tsx.shot',
  );
});

it('render the checkbox with multiple mode with the snapshot ui we expected', () => {
  const {toJSON} = render(<Checkbox onPress={() => {}} mode="multiple" />);
  // toMatchSpecificSnapshot is provided by jest-specific-snapshot, this is the only components that can have a different snapshot with the mode property
  // We are taking the right snapshot specific if the mode property is multiple
  expect(toJSON()).toMatchSpecificSnapshot(
    './__snapshots__/CheckboxMultiple.test.tsx.shot',
  );
});

it('render the checkbox with none mode with the snapshot ui we expected', () => {
  const {toJSON} = render(<Checkbox onPress={() => {}} mode="none" />);
  // toMatchSpecificSnapshot is provided by jest-specific-snapshot, this is the only components that can have a different snapshot with the mode property
  // We are taking the right snapshot specific if the mode property is none
  expect(toJSON()).toMatchSpecificSnapshot(
    './__snapshots__/CheckboxNone.test.tsx.shot',
  );
});

it('check if function is being called by pressing the checkbox', () => {
  // Using a mock function to check if our function is called
  const functionToCall = jest.fn();
  const {getByTestId} = render(
    <Checkbox onPress={functionToCall} testID="checkbox" mode="active" />,
  );
  // Making a press event on our checkbox
  fireEvent.press(getByTestId('checkbox'));
  // With the press, we know that our function has been called !
  expect(functionToCall).toBeCalled();
});

it('check if icon is here with active mode', () => {
  const {queryByTestId} = render(<Checkbox onPress={() => {}} mode="active" />);
  // if the mode is active, we have in this case an icon component !
  expect(queryByTestId('Checkbox.icon')).not.toBeNull();
});

it('check if view style is visible with multiple mode', () => {
  const {queryByTestId} = render(
    <Checkbox onPress={() => {}} mode="multiple" />,
  );
  // if the mode is multiple, we have in this case our viewStyle component !
  expect(queryByTestId('Checkbox.viewStyle')).not.toBeNull();
});

it('check if view style is visible with none mode', () => {
  const {queryByTestId} = render(<Checkbox onPress={() => {}} mode="none" />);
  // if the mode is none, we have in this case our viewStyle component !
  expect(queryByTestId('Checkbox.viewStyle')).not.toBeNull();
});
