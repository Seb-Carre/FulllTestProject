import {fireEvent, render} from '@testing-library/react-native';

import {Linking} from 'react-native';
import React from 'react';
import {User} from '../../types';
import UserCard from '../UserCard';

const user: User = {
  login: 'sebastien',
  id: 404,
  avatar_url: 'https://reactnative.dev/img/tiny_logo.png',
  html_url: 'https://github.com/Seb-Carre',
};
const setSelectedMock = jest.fn();
const selected = true;
it('render the user card as snapShot expected', () => {
  const {toJSON} = render(
    <UserCard user={user} setSelected={setSelectedMock} selected={selected} />,
  );

  expect(toJSON()).toMatchSnapshot();
});

it('render the user card, check the user name and id', () => {
  const {queryByText} = render(
    <UserCard user={user} setSelected={setSelectedMock} selected={selected} />,
  );

  // We check if the login is showed
  expect(queryByText(user.login)).not.toBeNull();
  // We check if the ID is showed
  expect(queryByText(user.id.toString())).not.toBeNull();
});

it('render the user card and click on the checkBox', () => {
  const {getByTestId} = render(
    <UserCard user={user} setSelected={setSelectedMock} selected={selected} />,
  );

  // Making a press event and our mock function to be called
  fireEvent.press(getByTestId('UserCard.CheckBox' + user.id));
  expect(setSelectedMock).toBeCalled();
});

it('render the user card and click on view profile button', () => {
  // We are going to spy on the openURL Method from RN Linking
  const spy = jest.spyOn(Linking, 'openURL');
  const {getByTestId} = render(
    <UserCard user={user} setSelected={setSelectedMock} selected={selected} />,
  );

  fireEvent.press(getByTestId('UserCard.ViewProfileButton' + user.id));
  // We expect that the url is called is the url html.url to see his profile
  expect(spy).toHaveBeenCalledWith(user.html_url);
});
