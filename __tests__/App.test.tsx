import {
  fakeUserResponse,
  fakeUserResponseWithNoData,
  headers,
  headersWithRateLimit,
  headersWithRateLimit5,
} from '../utils/mockObjects';
import {
  fireEvent,
  render,
  waitFor,
  within,
} from '@testing-library/react-native';

import {Alert} from 'react-native';
import App from '../App';
import React from 'react';
import {enableFetchMocks} from 'jest-fetch-mock';
import fetchMock from 'jest-fetch-mock';

enableFetchMocks();

beforeEach(() => {
  fetchMock.mockClear();
});

it('render the screen as snapShot expected', () => {
  const {toJSON} = render(<App />);

  expect(toJSON()).toMatchSnapshot();
});

it('render the screen, make a search and get the result', async () => {
  fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponse), {
    headers: headers,
    status: 200,
  });
  const searchUser = 'sebcarre'; // the search we put in our textInput, it could be anything
  const textID = fakeUserResponse.items[0].id.toString(); // this is the ID of our user we are going to see
  const login = fakeUserResponse.items[0].login.toString(); // this is the login of our user we are going to see
  const {getByTestId, queryByText} = render(<App />);
  const input = getByTestId('App.SearchInput');
  // Making the insert of the text in the inputText, this going to call our api which is mock with our fakeresponse we put
  fireEvent.changeText(input, searchUser);

  // We need to make a delay because the call api is not going to be make instantly
  await waitFor(
    () => {
      // We expect that our id and login is showed
      expect(queryByText(textID)).not.toBeNull();
      expect(queryByText(login)).not.toBeNull();
    },
    {timeout: 3000},
  );
});

it('render the screen, make a search and reset the text field', async () => {
  fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponse), {
    headers: headers,
    status: 200,
  });
  const searchUser = 'sebcarre';
  const textID = fakeUserResponse.items[0].id.toString(); // this is the ID of our user we are going to see
  const login = fakeUserResponse.items[0].login.toString(); // this is the login of our user we are going to see
  const {getByTestId, queryByText, queryByTestId} = render(<App />);
  const input = getByTestId('App.SearchInput');
  fireEvent.changeText(input, searchUser);

  await waitFor(
    () => {
      // We expect that our id and login are showed
      expect(queryByText(textID)).not.toBeNull();
      expect(queryByText(login)).not.toBeNull();
      expect(queryByTestId('App.FlatList')).not.toBeNull();
    },
    {timeout: 3000},
  );

  // Now we are going to reset the textInput to remove the previous search and we are going to see if our user has gone from showing on
  fireEvent.changeText(input, '');

  await waitFor(
    () => {
      // Of course, we expect that there are no userCard showed with user infos and having our text component
      expect(queryByText(textID)).toBeNull();
      expect(queryByText(login)).toBeNull();
      expect(queryByTestId('App.FlatList')).toBeNull();
      expect(queryByTestId('App.BeginSearch')).not.toBeNull();
    },
    {timeout: 1000},
  );
});

it('render the screen, make a search and have no results', async () => {
  // In this case, the result will have no results with our make response with a empty array in items returned
  fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponseWithNoData), {
    headers: headers,
    status: 200,
  });
  const searchUser = 'sebcarre';
  const {getByTestId, queryByTestId} = render(<App />);
  const input = getByTestId('App.SearchInput');
  fireEvent.changeText(input, searchUser);

  await waitFor(
    () => {
      // We expect that our flatlist is not showed but only our text component to say that there are no results
      expect(queryByTestId('App.Flatlist')).toBeNull();
      expect(queryByTestId('App.NoResultsFound')).not.toBeNull();
      expect(queryByTestId('App.BeginSearch')).toBeNull();
    },
    {timeout: 2000},
  );
});

it('render the screen, mock api call headers with 5 calls allowed to check the alert dialog with', async () => {
  // Same thing like we have in our api unit test but with the integration of our functionnal component
  fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponseWithNoData), {
    headers: headersWithRateLimit5,
    status: 200,
  });
  jest.spyOn(Alert, 'alert');
  const searchUser = 'sebcarre';
  const {getByTestId} = render(<App />);
  const input = getByTestId('App.SearchInput');
  fireEvent.changeText(input, searchUser);

  await waitFor(
    () => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Warning',
        'You can make 5 more searchs until you have to wait a time and be able to make new searchs',
      );
    },
    {timeout: 2000},
  );
});

it('render the screen, mock api call headers with no more calls allowed and status 403 to check the alert dialog with', async () => {
  // Same thing like we have in our api unit test but with the integration of our functionnal component
  fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponseWithNoData), {
    headers: headersWithRateLimit,
    status: 403,
  });
  jest.spyOn(Alert, 'alert');
  const searchUser = 'sebcarre';
  const {getByTestId} = render(<App />);
  const input = getByTestId('App.SearchInput');
  fireEvent.changeText(input, searchUser);
  const time = headersWithRateLimit.get('x-ratelimit-reset');
  const date = new Date(Number(time) * 1000);
  await waitFor(
    () => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        `You have exceeed the limit of searchs, please wait until : ${date}`,
      );
    },
    {timeout: 2000},
  );
});

it('render the screen, make a search, select a user and duplicate', async () => {
  fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponse), {
    headers: headers,
    status: 200,
  });
  const searchUser = 'sebcarre';
  // This is the user we going to have with the original
  const resultUser = fakeUserResponse.items[0].login + ' (duplicated)';
  const textID = fakeUserResponse.items[0].id.toString();
  const {getByTestId, queryByText} = render(<App />);
  const input = getByTestId('App.SearchInput');
  fireEvent.changeText(input, searchUser);

  await waitFor(
    () => {
      expect(queryByText(textID)).not.toBeNull();
      const userCard = getByTestId('App.UserCard');
      fireEvent.press(within(userCard).getByTestId('UserCard.CheckBox'));
      fireEvent.press(getByTestId('App.CopyButton'));
    },
    {timeout: 3000},
  );

  await waitFor(
    () => {
      // We expect original and duplicated to be present
      expect(queryByText(resultUser)).not.toBeNull();
      expect(queryByText(fakeUserResponse.items[0].login)).not.toBeNull();
    },
    {timeout: 1000},
  );
});

it('render the screen, make a search, select a user and remove', async () => {
  fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponse), {
    headers: headers,
    status: 200,
  });
  const searchUser = 'sebcarre';
  const resultUser = fakeUserResponse.items[0].login;
  const textID = fakeUserResponse.items[0].id.toString();
  const {getByTestId, queryByText} = render(<App />);
  const input = getByTestId('App.SearchInput');
  fireEvent.changeText(input, searchUser);

  await waitFor(
    () => {
      expect(queryByText(textID)).not.toBeNull();
      expect(queryByText(resultUser)).not.toBeNull();
      const userCard = getByTestId('App.UserCard');
      fireEvent.press(within(userCard).getByTestId('UserCard.CheckBox'));
      fireEvent.press(getByTestId('App.DeleteButton'));
    },
    {timeout: 3000},
  );

  await waitFor(
    () => {
      // We expect to have nothing here
      expect(queryByText(textID)).toBeNull();
      expect(queryByText(resultUser)).toBeNull();
    },
    {timeout: 1000},
  );
});
