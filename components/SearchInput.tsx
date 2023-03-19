import {Dimensions, StyleSheet, TextInput, TextInputProps} from 'react-native';

import React from 'react';
import text from '../translate/translate';

/**
 * Extension of textInput from RN but with a small configuration
 */
export default function SearchInput(props: TextInputProps) {
  return (
    <TextInput
      style={styles.textInput}
      placeholder={text('defaultTextPlaceholder')}
      placeholderTextColor="black"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginTop: 24,
    marginBottom: 24,
    marginLeft: 16,
    marginRight: 16,
    padding: 20,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    fontWeight: '600',
    fontSize: 17,
    paddingLeft: Dimensions.get('screen').width * 0.2, // to make sure that on a little and big device, it will be equivalent
  },
});
