import {
  appSearchInput,
  checkbox,
  copyButton,
  deleteButton,
  flatList,
  textBeginSearch,
  textNoFoundSearch,
  userCard as userCardId,
} from '../tests/IdentifiersTest';
import {
  fakeUserResponse,
  fakeUserResponseWithMaxResults,
  fakeUserResponseWithNoData,
  headers,
  headersWithRateLimit,
  headersWithRateLimit5,
} from '../tests/mockObjects';
import {
  fireEvent,
  render,
  waitFor,
  within,
} from '@testing-library/react-native';

import {Alert} from 'react-native';
import App from '../App';
import React from 'react';
// To mock api calls, we are going to use this library testing
import {enableFetchMocks} from 'jest-fetch-mock';
import fetchMock from 'jest-fetch-mock';
import text from '../translate/translate';

// call it globally to ensure that jest-fetch-mock is being used !
enableFetchMocks();

beforeEach(() => {
  // We need to clear the mock before every test just to be sure that the result is not from a previous test
  fetchMock.mockClear();
});

describe('test the App.tsx Functional Component', () => {
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
    const input = getByTestId(appSearchInput);
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
    // this is the ID of our user we are going to see
    const textID = fakeUserResponse.items[0].id.toString();
    // this is the login of our user we are going to see
    const login = fakeUserResponse.items[0].login.toString();
    const {getByTestId, queryByText, queryByTestId} = render(<App />);
    const input = getByTestId(appSearchInput);
    fireEvent.changeText(input, searchUser);

    // We need to wait just because the request in being made after the delay function we made in App.tsx
    await waitFor(
      () => {
        // We expect that our id and login are showed
        expect(queryByText(textID)).not.toBeNull();
        expect(queryByText(login)).not.toBeNull();
        expect(queryByTestId(flatList)).not.toBeNull();
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
        expect(queryByTestId(flatList)).toBeNull();
        expect(queryByTestId(textBeginSearch)).not.toBeNull();
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
    const input = getByTestId(appSearchInput);
    fireEvent.changeText(input, searchUser);

    await waitFor(
      () => {
        // We expect that our flatlist is not showed but only our text component to say that there are no results
        expect(queryByTestId(flatList)).toBeNull();
        expect(queryByTestId(textNoFoundSearch)).not.toBeNull();
        expect(queryByTestId(textBeginSearch)).toBeNull();
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
    // We are going to spy if Alert RN is being called
    jest.spyOn(Alert, 'alert');
    const searchUser = 'sebcarre';
    const {getByTestId} = render(<App />);
    const input = getByTestId(appSearchInput);
    fireEvent.changeText(input, searchUser);

    await waitFor(
      () => {
        // We are checking if RN Alert has been called with the right text !
        expect(Alert.alert).toHaveBeenCalledWith(
          text('warning'),
          text('alertFiveRequestsRemaining'),
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
    // We are going to spy if Alert RN is being called
    jest.spyOn(Alert, 'alert');
    const searchUser = 'sebcarre';
    const {getByTestId} = render(<App />);
    const input = getByTestId(appSearchInput);
    fireEvent.changeText(input, searchUser);
    const time = headersWithRateLimit.get('x-ratelimit-reset');
    const date = new Date(Number(time) * 1000);
    await waitFor(
      () => {
        // We are checking if RN Alert has been called with the right text !
        expect(Alert.alert).toHaveBeenCalledWith(
          text('error'),
          `${text('alertNoMoreRequestsRemainingWithDate')} ${date}`,
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
    const resultUser = `${fakeUserResponse.items[0].login} ${text(
      'duplicatedUser',
    )}`;
    const textID = fakeUserResponse.items[0].id.toString();
    const {getByTestId, queryByText} = render(<App />);
    const input = getByTestId(appSearchInput);
    fireEvent.changeText(input, searchUser);

    await waitFor(
      () => {
        expect(queryByText(textID)).not.toBeNull();
        const userCard = getByTestId(userCardId + textID); // we select the right card item
        fireEvent.press(
          within(userCard).getByTestId('UserCard.CheckBox' + textID),
        );
        fireEvent.press(getByTestId(copyButton));
      },
      {timeout: 3000},
    );

    await waitFor(
      () => {
        // We expect the original card and duplicated one to be present
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
    const input = getByTestId(appSearchInput);
    fireEvent.changeText(input, searchUser);

    await waitFor(
      () => {
        expect(queryByText(textID)).not.toBeNull();
        expect(queryByText(resultUser)).not.toBeNull();
        const userCard = getByTestId(userCardId + textID); // we select the right card item
        fireEvent.press(
          within(userCard).getByTestId('UserCard.CheckBox' + textID),
        );
        fireEvent.press(getByTestId(deleteButton));
      },
      {timeout: 3000},
    );

    await waitFor(
      () => {
        // We expect to have no results with the delete we made !
        expect(queryByText(textID)).toBeNull();
        expect(queryByText(resultUser)).toBeNull();
      },
      {timeout: 1000},
    );
  });

  it('render the screen, make a search, select every users to be deleted', async () => {
    // In this response mock, we have 30 results, the maximum that GitHub's API is returning
    fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponseWithMaxResults), {
      headers: headers,
      status: 200,
    });
    const searchUser = 'sebastien';
    const {queryByTestId, getByTestId, queryByText} = render(<App />);
    const input = getByTestId(appSearchInput);
    fireEvent.changeText(input, searchUser);

    await waitFor(
      () => {
        // We press the checkbox inside App.tsx
        fireEvent.press(getByTestId(checkbox));
        expect(queryByText(`30 ${text('elementsSelected')}`)).not.toBeNull();
        // We clear the results with the delete button
        fireEvent.press(getByTestId(deleteButton));
        // And expect these results after deleting
        expect(queryByTestId(flatList)).toBeNull();
        expect(queryByText(`0 ${text('elementsSelected')}`)).not.toBeNull();
        expect(queryByTestId(textNoFoundSearch)).not.toBeNull();
      },
      {timeout: 3000},
    );
  });

  it('render the screen, make a search, select every users to be duplicated', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponseWithMaxResults), {
      headers: headers,
      status: 200,
    });
    const searchUser = 'sebastien';
    const {queryByTestId, getByTestId, queryByText} = render(<App />);
    const input = getByTestId(appSearchInput);
    fireEvent.changeText(input, searchUser);

    await waitFor(
      () => {
        fireEvent.press(getByTestId(checkbox));
        expect(queryByText(`30 ${text('elementsSelected')}`)).not.toBeNull();
        fireEvent.press(getByTestId(copyButton));
        // We expect these results copying
        expect(queryByTestId(flatList)).not.toBeNull();
        fireEvent.press(getByTestId(checkbox));
        expect(queryByText(`60 ${text('elementsSelected')}`)).not.toBeNull();
        expect(queryByTestId(textNoFoundSearch)).toBeNull();
      },
      {timeout: 3000},
    );
  });
});
