import {Alert} from 'react-native';

/** Default headers config */
const headersConfig: HeadersInit_ = {'Content-Type': 'application/json'};

/** The base URL of our API */
const baseURL = 'https://api.github.com';

/**
 * Function to call a API
 * @param {string} method
 * @param {string} url
 */
export default async function callAPI(method: string, url: string) {
  try {
    // Using JS Fetch function with our config
    const response = await fetch(baseURL + url, {
      method: method,
      headers: headersConfig,
    });

    // We have to get headers to see the rate limit of GitHub API
    const headersResponse = response.headers;
    if (response.ok) {
      if (headersResponse.has('x-ratelimit-remaining')) {
        const remainingRequests = Number(
          headersResponse.get('x-ratelimit-remaining'),
        );
        // We'll show a warning if the user is approaching the rate limit
        if (remainingRequests === 5) {
          Alert.alert(
            'Warning',
            'You can make 5 more searchs until you have to wait a time and be able to make new searchs',
          );
        }
      }
      const data = await response.json();
      // Return data response
      return data;
    } else {
      // if the user reach the limit, the status will be a 403
      // https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#rate-limiting
      if (
        response.status === 403 &&
        headersResponse.has('x-ratelimit-remaining') &&
        Number(headersResponse.get('x-ratelimit-remaining')) === 0
      ) {
        const time = headersResponse.get('x-ratelimit-reset');
        if (time) {
          // We need to convert this Unix Time to a date to show the user when we can search again
          const date = new Date(Number(time) * 1000);
          Alert.alert(
            'Error',
            `You have exceeed the limit of searchs, please wait until : ${date}`,
          );
        } else {
          Alert.alert(
            'Error',
            'You have exceeed the limit of searchs, take a break and try again',
          );
        }
      } else {
        // Others requests errors will be showed in this alert
        Alert.alert(
          'Error',
          `A error has occured, with a code error ${response.status} ${response.statusText}`,
        );
      }
      return null;
    }
  } catch (error) {
    Alert.alert('Error', `A error has occured during the request, ${error}`);
    return null;
  }
}