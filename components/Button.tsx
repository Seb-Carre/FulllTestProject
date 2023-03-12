import {Pressable, PressableProps, StyleSheet} from 'react-native';

import CustomText from './CustomText';
import React from 'react';

interface ButtonProps extends PressableProps {
  children: any;
}

export default function Button({children, ...props}: ButtonProps) {
  return (
    <Pressable style={styles.container} {...props}>
      <CustomText style={styles.buttonText}>{children}</CustomText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00a2ff',
    paddingHorizontal: 50,
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
  },
});
