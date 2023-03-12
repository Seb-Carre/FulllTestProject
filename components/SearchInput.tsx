import {StyleSheet, TextInput, TextInputProps} from 'react-native';

import React from 'react';

/**
 * Extension of textInput from RN but with a small configuration
 */
export default function SearchInput(props: TextInputProps) {
  return (
    <TextInput style={styles.textInput} placeholder="Search input" {...props} />
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
  },
});
