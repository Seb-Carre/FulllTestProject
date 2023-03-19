import {FlatList} from 'react-native';
import React from 'react';
import {User} from '../../types';
import UserCard from '../UserCard';
import {render} from '@testing-library/react-native';

const users: User[] = [
  {
    login: 'sebastien',
    id: 404,
    avatar_url: 'https://reactnative.dev/img/tiny_logo.png',
    html_url: 'https://github.com/Seb-Carre',
  },
  {
    login: 'eric',
    id: 500,
    avatar_url: 'https://reactnative.dev/img/tiny_logo.png',
    html_url: 'https://github.com/eric',
  },
];

it('render the Flatlist with our userCard as snapShot excepted', () => {
  const {toJSON} = render(
    <FlatList
      data={users} // insert the fake data we made
      keyExtractor={(user, index) => index.toString()}
      renderItem={({item}) => (
        <UserCard
          testID="userCard"
          user={item}
          setSelected={() => {}}
          selected={true}
        />
      )}
    />,
  );

  expect(toJSON()).toMatchSnapshot();
});

it('render the Flatlist with our userCard and check if our list is render correctly with users', () => {
  const {getByTestId, getByText} = render(
    <FlatList
      data={users}
      testID={'FlatList'}
      keyExtractor={(user, index) => index.toString()}
      renderItem={({item}) => (
        <UserCard user={item} setSelected={() => {}} selected={true} />
      )}
    />,
  );
  const list = getByTestId('FlatList');
  // Check to have our ListFlat, it need to be present of course
  expect(list).not.toBeNull();
  // We have two users, we are checking if the login and id is begin showed for both
  users.forEach(user => {
    expect(getByText(user.login)).not.toBeNull();
    expect(getByText(user.id.toString())).not.toBeNull();
  });
});
