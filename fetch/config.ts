import {Alert} from 'react-native';
import text from '../translate/translate';

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
        Alert.alert(text('warning'), text('alertFiveRequestsRemaining'));
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
      const time = headersResponse!.get('x-ratelimit-reset');
      if (time) {
        // We need to convert this Unix Time to a date to show the user when we can search again
        const date = new Date(Number(time) * 1000);
        Alert.alert(
          text('error'),
          `${text('alertNoMoreRequestsRemainingWithDate')} ${date}`,
        );
      } else {
        Alert.alert(text('error'), text('alertNoMoreRequestsRemaining'));
      }
    } else {
      // Others requests errors will be showed in this alert
      Alert.alert(
        text('error'),
        `${text('alertErrorGenericMessage')} ${response.status} ${
          response.statusText
        }`,
      );
    }
    return null;
  }
}
