import {StyleSheet, Text, TextProps, TextStyle} from 'react-native';

import React from 'react';

interface CustomTextProps extends TextProps {
  children: any;
  style?: TextStyle | TextStyle[];
  textType?: 'title' | 'regular';
}

/**
 * Extension of Text RN with a configuration, you can use all the properties of Text RN if you need
 * @param {string} text
 */
export default function CustomText({
  style,
  children,
  textType,
  ...props
}: CustomTextProps) {
  let textStyle: object = {};
  // Check the textType is used
  switch (textType) {
    case 'title': {
      textStyle = styles.title;
      break;
    }
    default:
      textStyle = {};
      break;
  }
  // if object style is used to make more styling, we are going to put everything to style our component
  const passedStyles = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style;
  return (
    <Text style={[textStyle, passedStyles && {...passedStyles}]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});
