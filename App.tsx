import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';

import Checkbox from './components/Checkbox';
import CustomText from './components/CustomText';
import IconButton from './components/IconButton';
import SearchInput from './components/SearchInput';
import {User} from './types';
import UserCard from './components/UserCard';
import {getUsersBySearchText} from './services/api';

function App(): JSX.Element {
  const [usersSelected, setUsersSelected] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>();
  const lastCall = useRef<Number>(0);

  const AddOrDeleteUserSelected = (user: User) => {
    // Check if user is already checked
    if (checkIfUserExistsInSelectedUsers(user)) {
      // we remove the user checked and in selection
      const newList = usersSelected.filter(item => item !== user);
      setUsersSelected(newList);
    } else {
      // We add this new user in the selections
      setUsersSelected(prev => {
        return [...prev, user];
      });
    }
  };

  const deleteUsers = () => {
    // Check if the users and usersSelected lists are not empty to delete the users selected
    if (users && users.length > 0 && usersSelected.length > 0) {
      // if the user is in the selection so we don't return it
      const newList = users?.filter(user => !usersSelected.includes(user));
      // set the new list without the users selected
      setUsers(newList);
      // Reset the selection
      setUsersSelected([]);
    }
  };

  const duplicateUsers = () => {
    if (users && users.length > 0 && usersSelected.length > 0) {
      // We need to loop for creating this new array, otherwise it will create a reference of userSelected and making changes to the originals users that we don't need to duplicate, we need to create a deep copy
      // More info here => https://stackoverflow.com/a/68080733 & https://stackoverflow.com/questions/38416020/deep-copy-in-es6-using-the-spread-syntax
      // For our case, using JSON.Parse is the faster method
      const addUsers: User[] = JSON.parse(JSON.stringify(usersSelected));
      // To distict the duplication of the users, adding duplicated word is helping !
      addUsers.forEach(user => {
        user.login = `${user.login} (duplicated)`;
      });
      // We finally setting the duplicates with the current list
      setUsers(prev => {
        if (prev) {
          return [...addUsers, ...prev];
        }
      });
      setUsersSelected([]);
    }
  };

  /**
   * Function to check if a user is already in the selected ones
   * @param {User} user
   */
  const checkIfUserExistsInSelectedUsers = (user: User) => {
    return usersSelected.includes(user);
  };

  /**
   * Function to select every user
   */
  const selectAllMethod = () => {
    // if we have already selected all users, we just going unselected all users
    if (users && usersSelected.length === users.length) {
      setUsersSelected([]);
    } else {
      // simply settings all users in the selection
      if (users) {
        setUsersSelected([...users]);
      }
    }
  };

  const onChangeText = (text: string) => {
    // Every time there is a text change, the selection is removed
    setUsersSelected([]);
    // To prevent multiple requests, we are going to save the last call with a random number and making a delay
    // The last call will be taken, the others will not pass the condition
    // With it, no request each time the user is changing the text to prevent the limit rate and no bad performance.
    const randomNumber = Math.random();
    // Using a useRef to not loose the state and no need to re-render for that
    lastCall.current = randomNumber;
    // if there is a text
    if (text && text.length !== 0) {
      const timeout = setTimeout(async () => {
        // if lastCall hasn't changed, the randomNumber is actually the only or last change in text
        if (lastCall.current === randomNumber) {
          // Call API
          const usersResult = await getUsersBySearchText(text);
          // If there is a result
          if (usersResult) {
            // We set the users corresponding to the search text
            setUsers(usersResult);
          }
        }
        // Every time, you have to clear the timeout to avoid memory leaks
        clearTimeout(timeout);
      }, 1000); // The delay of waiting, 1 second here, if the user hasn't made any changes during this 1 second, the app will call the api.
    } else {
      // if no text, we clear the users from the past search
      setUsers(undefined);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.containerFlex}>
          <View style={styles.titleContainer}>
            <CustomText>Github Search</CustomText>
          </View>
          <SearchInput testID="App.SearchInput" onChangeText={onChangeText} />
          <View style={styles.actionsContainer}>
            <Checkbox
              mode={
                users &&
                users.length > 0 &&
                usersSelected.length === users.length
                  ? 'multiple'
                  : 'none'
              }
              onPress={selectAllMethod}
            />
            <CustomText style={styles.numberSelectedUsers}>
              {usersSelected.length}{' '}
              <CustomText style={styles.phraseSelectedUsers}>
                elements selected
              </CustomText>
            </CustomText>
            <View style={styles.iconButtons}>
              {/* You can't use a dynamic icon */}
              <IconButton
                testID="App.CopyButton"
                iconName={require('./assets/images/copy.png')}
                onPress={duplicateUsers}
              />
              <IconButton
                testID="App.DeleteButton"
                iconName={require('./assets/images/trash.png')}
                onPress={deleteUsers}
              />
            </View>
          </View>
          <View style={styles.listWrapper}>
            {users && users.length >= 1 && (
              <FlatList
                testID='App.FlatList'
                style={styles.list}
                data={users}
                keyExtractor={(user, index) => index.toString()} // use the index for the keyExtractor, specially for the duplicated users
                renderItem={({item}) => (
                  <UserCard
                    testID="App.UserCard"
                    user={item}
                    setSelected={AddOrDeleteUserSelected}
                    selected={checkIfUserExistsInSelectedUsers(item)}
                  />
                )}></FlatList>
            )}
            {/* if the search don't give anything, this text will be visible */}
            {users !== undefined && users.length === 0 && (
              <CustomText testID="App.NoResultsFound" textType="title">
                No results found !
              </CustomText>
            )}
            {/* if the user has no text in TextInput, this text will be visible */}
            {users === undefined && (
              <View style={styles.containerFlex}>
                <CustomText testID="App.BeginSearch" textType="title">
                  Please ! Begin the search by typing the user you're looking
                  for.
                </CustomText>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  containerFlex: {
    flex: 1,
  },
  actionsContainer: {
    marginTop: 24,
    marginBottom: 24,
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'row',
  },
  numberSelectedUsers: {
    lineHeight: 20,
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 10,
    flex: 1,
  },
  phraseSelectedUsers: {fontWeight: 'normal'},
  iconButtons: {
    flexDirection: 'row',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    backgroundColor: 'gray',
    width: '100%',
  },
  listWrapper: {
    marginLeft: 16,
    marginRight: 16,
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  list: {width: '100%'},
});

export default App;
