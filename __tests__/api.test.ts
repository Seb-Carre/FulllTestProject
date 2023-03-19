import {fakeUserResponse, headers} from '../tests/mockObjects';

// To mock api calls, we are going to use this library testing
import {enableFetchMocks} from 'jest-fetch-mock';
import {getUsersBySearchText} from '../services/apiRequests';

// call it globally to ensure that jest-fetch-mock is being used !
enableFetchMocks();

describe('test our getUsers function', () => {
  beforeEach(() => {
    // We need to clear the mock before every test just to be sure that the result is not from a previous test
    fetchMock.mockClear();
  });

  it('test the function with a success return', async () => {
    // We put our fake response with the our fake header
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
    // We put our fake response with the our fake header
    fetchMock.mockResponseOnce(JSON.stringify({}), {
      headers: headers,
      status: 500,
    });
    // you can put anything on the search because will return the same thing, our mock response
    const apiCall = await getUsersBySearchText('sebcarre');
    // In our function and if there is an error, we return a null from our api root call but nothing in this function
    expect(apiCall).toBeUndefined();
  });
});
