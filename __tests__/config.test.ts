import {
  fakeUserResponse,
  fakeUserResponseWithNoData,
  headers,
  headersWithRateLimit,
  headersWithRateLimit5,
  headersWithRateLimitAndNoResetTime,
} from '../tests/mockObjects';

import {Alert} from 'react-native';
import callAPI from '../fetch/config';
// To mock api calls, we are going to use this library testing
import {enableFetchMocks} from 'jest-fetch-mock';
import text from '../translate/translate';
import {waitFor} from '@testing-library/react-native';

// call it globally to ensure that jest-fetch-mock is being used !
enableFetchMocks();

beforeEach(() => {
  // We need to clear the mock before every test just to be sure that the result is not from a previous test
  fetchMock.mockClear();
});

describe('test our Api Call function', () => {
  it('test the function with a success return', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponse), {
      headers: headers,
      status: 200,
    });
    // We expect to have the reponse mock we created
    const apiCall = await callAPI('GET', '');
    expect(apiCall).toStrictEqual(fakeUserResponse);
  });

  it('test the function with a success return and check that the limit rate remaning is 5', async () => {
    // For this case, we are going to pass a special header with the right info about the rate limit
    fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponseWithNoData), {
      headers: headersWithRateLimit5,
      status: 200,
    });
    // Alert RN is being called if the rate limit is 5
    jest.spyOn(Alert, 'alert');
    const apiCall = await callAPI('GET', '');
    expect(apiCall).toStrictEqual(fakeUserResponseWithNoData);

    await waitFor(
      () => {
        // The message here is exactly what we show to user if the rate limit is 5
        expect(Alert.alert).toHaveBeenCalledWith(
          text('warning'),
          text('alertFiveRequestsRemaining'),
        );
      },
      {timeout: 2000},
    );
  });

  it('test the function with a error return', async () => {
    // We are going to modify the fetch to be an error code 500
    fetchMock.mockResponseOnce(JSON.stringify({}), {
      headers: headers,
      status: 500,
    });
    // Alert RN is being called when there is an error from api
    jest.spyOn(Alert, 'alert');
    const apiCall = await callAPI('GET', '');
    // We return a null if there is a error
    expect(apiCall).toBeNull();
    // The message here is exactly what we show to user if there is an error other than 403
    await waitFor(
      () => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'A error has occured, with a code error 500 Internal Server Error',
        );
      },
      {timeout: 2000},
    );
  });

  it('test the function with a 403 error with the excedeed rate limit', async () => {
    // For this case, we are going to pass a special header with the right info about the rate limit and the code return 403
    fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponseWithNoData), {
      headers: headersWithRateLimit,
      status: 403,
    });
    // Alert RN is being called if the rate limit is zero and with a code error 403
    jest.spyOn(Alert, 'alert');
    const apiCall = await callAPI('GET', '');
    // As with error 500 with return a null
    expect(apiCall).toBeNull();

    // This message will take the date when the ratelimit (from headers) is going to be reset and be able to make new requests
    const time = headersWithRateLimit.get('x-ratelimit-reset');
    // Unix time, need to convert !
    const date = new Date(Number(time) * 1000);
    await waitFor(
      () => {
        // The message here is exactly what we show to user if the rate limit is 0 with an error 403
        expect(Alert.alert).toHaveBeenCalledWith(
          text('error'),
          `${text('alertNoMoreRequestsRemainingWithDate')} ${date}`,
        );
      },
      {timeout: 2000},
    );
  });

  it('test the function with a 403 error and if there is no rate limit reset time found', async () => {
    // For this case, we are going to pass a special header with the right info about the rate limit and the code return 403
    fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponseWithNoData), {
      headers: headersWithRateLimitAndNoResetTime,
      status: 403,
    });
    // Alert RN is being called if the rate limit is zero and with a code error 403
    jest.spyOn(Alert, 'alert');
    const apiCall = await callAPI('GET', '');
    // As with error 500 with return a null
    expect(apiCall).toBeNull();
    await waitFor(
      () => {
        // The message here is exactly what we show to user if the rate limit is 0 with an error 403
        expect(Alert.alert).toHaveBeenCalledWith(
          text('error'),
          text('alertNoMoreRequestsRemaining'),
        );
      },
      {timeout: 2000},
    );
  });
});
