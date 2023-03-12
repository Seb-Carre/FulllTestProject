import {StyleSheet, View} from 'react-native';

import {Icon} from './Icon';
import React from 'react';

type CheckboxParams = {
  mode: 'active' | 'multiple' | 'none';
};

/**
 * Functional Component to return a checkbox
 * The check mark is the only thing it isn't made with style
 */
export default function Checkbox({mode}: CheckboxParams) {
  // CheckMark icon to show when active mode is enabled
  const checkMark = '../assets/images/check-mark.png';
  return (
    <View style={styles.container}>
      {/* We are going to take the corresponding style we made in stylesheet styles, active mode is the only one mode which not made with styling */}
      {mode !== 'active' && <View style={styles[mode]} />}
      {/* if active, the need to use the icon asset image to show it, this is the only mode which is different */}
      {mode === 'active' && (
        <Icon name={require(checkMark)} style={styles.active} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: 20,
    borderWidth: 4,
    borderRadius: 4,
    backgroundColor: '#44a1f8',
    justifyContent: 'center',
  },
  multiple: {height: 3, backgroundColor: 'black'},
  active: {
    height: 13,
    width: 13,
  },
  none: {},
});
