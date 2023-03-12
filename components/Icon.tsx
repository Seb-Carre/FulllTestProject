import {
  Image,
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from 'react-native';

import React from 'react';

type IconParams = {
  name: ImageSourcePropType;
  style: StyleProp<ImageStyle>;
  props?: ImageProps;
};

/**
 * Functional Component to return a icon based on RN Image Component
 * You can't use dynamic variables to pass the icon file
 * See the doc about it https://reactnative.dev/docs/images#static-image-resources
 * Using a image from url is not a good pratice except if you have your own api ! better to have it in the project
 * @param {string} text
 */
export function Icon({name, style, props}: IconParams) {
  return <Image source={name} style={style} {...props} />;
}
