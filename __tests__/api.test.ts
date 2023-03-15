import {fakeUserResponse, headers} from '../utils/mockObjects';

import {enableFetchMocks} from 'jest-fetch-mock';
import {getUsersBySearchText} from '../services/api';

enableFetchMocks();

beforeEach(() => {
  fetchMock.mockClear();
});

it('test the function with a success return', async () => {
  fetchMock.mockResponseOnce(JSON.stringify(fakeUserResponse), {
    headers: headers,
    status: 200,
  });
  // The api call is being mock in this case
  const apiCall = await getUsersBySearchText('sebcarre');
  // We expect to have the reponse mock we created
  expect(apiCall).toStrictEqual(fakeUserResponse.items);
});

it('test the function with a error return', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({}), {
    headers: headers,
    status: 500,
  });
  const apiCall = await getUsersBySearchText('sebcarre');
  // In our function and if there is an error, we return a null from our api root call but nothing in this function
  expect(apiCall).toBeUndefined();
});
