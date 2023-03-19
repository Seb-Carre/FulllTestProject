import {Icon} from '../Icon';
import React from 'react';
import {render} from '@testing-library/react-native';

const checkMark = '../../assets/images/check-mark.png';
it('render the icon as snapShot expected', () => {
  const {toJSON} = render(<Icon name={require(checkMark)} style={{flex: 1}} />);

  expect(toJSON()).toMatchSnapshot();
});

it('check if the image source is correct', () => {
  const {queryByTestId} = render(
    <Icon testID="icon" name={require(checkMark)} style={{flex: 1}} />,
  );
  // We need to add an extra path because Icon module is not in the same place
  expect(queryByTestId('icon')?.props.source).toStrictEqual({
    testUri: '../' + checkMark,
  });
});
