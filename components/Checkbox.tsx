import {Pressable, StyleSheet, View} from 'react-native';

import {Icon} from './Icon';
import React from 'react';

type CheckboxParams = {
  mode: 'active' | 'multiple' | 'none';
  onPress: () => void;
  testID?: string;
};

/**
 * Functional Component to return a checkbox
 * The check mark is the only thing it isn't made with style
 */
export default function Checkbox({mode, onPress, testID}: CheckboxParams) {
  // CheckMark icon to show when active mode is enabled
  const checkMark = '../assets/images/check-mark.png';
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={[
        styles.container,
        mode === 'active' || mode === 'multiple'
          ? styles.containerActive
          : null,
      ]}>
      {/* We are going to take the corresponding style we made in stylesheet styles, active mode is the only one mode which not made with styling */}
      {mode !== 'active' && (
        <View testID="Checkbox.viewStyle" style={styles[mode]} />
      )}
      {/* if active, the need to use the icon asset image to show it, this is the only mode which is different */}
      {mode === 'active' && (
        <Icon
          testID="Checkbox.icon"
          name={require(checkMark)}
          style={styles.active}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: 20,
    borderWidth: 4,
    borderRadius: 4,
    justifyContent: 'center',
  },
  containerActive: {backgroundColor: '#44a1f8'},
  multiple: {height: 3, backgroundColor: 'black'},
  active: {
    height: 13,
    width: 13,
  },
  none: {},
});
