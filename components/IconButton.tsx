import {ImageSourcePropType, Pressable, StyleSheet} from 'react-native';

import {Icon} from './Icon';
import React from 'react';

type IconButtonParams = {
  iconName: ImageSourcePropType;
  onPress: () => void;
  testID?: string;
};

/**
 * Pressable button with a Icon inside !
 */
export default function IconButton({
  iconName,
  onPress,
  testID,
}: IconButtonParams) {
  return (
    <Pressable testID={testID} onPress={onPress}>
      <Icon name={iconName} style={{...styles.icon}} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 20,
    width: 20,
  },
});
