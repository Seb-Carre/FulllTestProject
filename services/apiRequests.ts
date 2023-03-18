import callAPI from '../fetch/config';

/**
 * Function to get users by a search text
 * @param {string} text
 */
export async function getUsersBySearchText(text: string) {
  const data = await callAPI('GET', `/search/users?q=${text}`);
  // To prevent errors from API
  if (data && data.items) {
    // with that we get all users corresponding the text
    return data.items;
  }
}
