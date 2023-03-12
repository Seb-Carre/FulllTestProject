import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import Button from './Button';
import Checkbox from './Checkbox';
import CustomText from './CustomText';
import React from 'react';
import {User} from '../types';

type UserCardProps = {
  user: User;
  setSelected: (user: User) => void;
  selected: boolean;
};

/**
 * Functional Component to show the user card
 * @param {User} user
 * @param {(user: User) void} setSelected
 * Put the user to the selected list from the parent component
 * @param {boolean} selected
 * Manage the status of the checkbox inside the card
 */
export default function UserCard({user, setSelected, selected}: UserCardProps) {
  const onPressViewProfile = () => {
    // if the user has a html url
    if (user?.html_url) {
      // we are going to open this url in a web browser
      Linking.openURL(user.html_url);
    }
  };
  const onPressSelectedUser = () => {
    // using the setSelected method from parent component to manage the state
    setSelected(user);
  };
  return (
    <View style={styles.container}>
      <View style={styles.infosUserContainer}>
        <Pressable
          onPress={onPressSelectedUser}
          style={styles.checkboxPosition}>
          <Checkbox mode={selected ? 'active' : 'none'} />
        </Pressable>
        <View style={styles.infoUser}>
          <Image style={styles.tinyLogo} source={{uri: user?.avatar_url}} />
          <CustomText textType="title">{user?.id}</CustomText>
          <CustomText textType="title">{user?.login}</CustomText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={onPressViewProfile}>View profile</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Dimensions.get('screen').width,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: 'lightgray',
  },
  infosUserContainer: {flex: 1, padding: 20, flexDirection: 'row'},
  buttonContainer: {margin: 15, alignItems: 'center'},
  checkboxPosition: {
    position: 'absolute',
    padding: 25,
    zIndex: 1,
  },
  infoUser: {flex: 1, alignItems: 'center'},
  tinyLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});
