import CustomText from '../CustomText';
import React from 'react';
import {render} from '@testing-library/react-native';

it('render the text as snapShot we expected', () => {
  const {toJSON} = render(<CustomText>Hello World</CustomText>);

  expect(toJSON()).toMatchSnapshot();
});

it('renders the customText with the text correctly', () => {
  const text = 'Hello world';
  // Insert text as children
  const {queryByText} = render(<CustomText testID="text">{text}</CustomText>);
  // We check if the text is present
  expect(queryByText(text)).not.toBeNull();
});
