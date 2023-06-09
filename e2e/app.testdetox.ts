import {
  appSearchInput,
  checkbox,
  copyButton,
  deleteButton,
  flatList,
  textBeginSearch,
  textNoFoundSearch,
  userCard,
} from '../tests/IdentifiersTest';
import {by, device, element, expect} from 'detox';

import text from '../translate/translate';

describe('Test the whole application', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  afterEach(async () => {
    // We need to wait every test to avoid the rate limit and making our tests falsy !
    await new Promise(r => setTimeout(r, 10000));
  });

  it('should have every component visible on start', async () => {
    await expect(element(by.text(text('titlePage')))).toBeVisible();
    await expect(element(by.id(appSearchInput))).toBeVisible();
    await expect(
      element(by.text(text('defaultTextPlaceholder'))),
    ).toBeVisible();
    await expect(element(by.id(checkbox))).toBeVisible();
    await expect(
      element(by.text(`0 ${text('elementsSelected')}`)),
    ).toBeVisible();
    await expect(element(by.id(copyButton))).toBeVisible();
    await expect(element(by.id(deleteButton))).toBeVisible();
    await expect(element(by.id(textBeginSearch))).toBeVisible();
    await expect(element(by.id(textNoFoundSearch))).not.toBeVisible();
    await expect(element(by.id(flatList))).not.toBeVisible();
    await expect(element(by.text(text('textBeginSearch')))).toBeVisible();
  });

  it('should make our first test with making a search and find some users', async () => {
    const userID = '14598';
    await element(by.id(appSearchInput)).typeText('sebastien');
    await expect(element(by.id(flatList))).toBeVisible();
    await expect(element(by.id(textBeginSearch))).not.toBeVisible();
    await expect(element(by.id(userCard + userID))).toBeVisible();
    await expect(element(by.text(userID))).toBeVisible();
  });

  it('should make a search, find some users and delete a user', async () => {
    const userID = '48792499';
    await element(by.id(appSearchInput)).typeText('sebcarre');
    await expect(element(by.id(userCard + userID))).toBeVisible();
    await expect(element(by.text('SebCarret'))).toBeVisible();
    await element(by.id('UserCard.CheckBox' + userID)).tap();
    await expect(
      element(by.text(`1 ${text('elementsSelected')}`)),
    ).toBeVisible();
    await element(by.id(deleteButton)).tap();
    await expect(element(by.id(userCard))).not.toBeVisible();
    await expect(element(by.id(textNoFoundSearch))).toBeVisible();
    await expect(
      element(by.text(`0 ${text('elementsSelected')}`)),
    ).toBeVisible();
  });

  it('should make a search, find some users and duplicate a user', async () => {
    const userID = '48792499';
    const userName = 'SebCarret';
    await element(by.id(appSearchInput)).typeText('sebcarre');
    await expect(element(by.id(userCard + userID))).toBeVisible();
    await expect(element(by.text(userName))).toBeVisible();
    await element(by.id('UserCard.CheckBox' + userID)).tap();
    await expect(
      element(by.text(`1 ${text('elementsSelected')}`)),
    ).toBeVisible();
    await element(by.id(copyButton)).tap();
    await expect(
      element(by.text(`0 ${text('elementsSelected')}`)),
    ).toBeVisible();
    await expect(
      element(by.text(`${userName} ${text('duplicatedUser')}`)),
    ).toBeVisible();
    await expect(element(by.text(userName))).toBeVisible();
  });

  it('should make a search, find some users and duplicate all', async () => {
    await element(by.id(appSearchInput)).typeText('sebastien');
    await element(by.id(checkbox)).tap();
    await expect(
      element(by.text(`30 ${text('elementsSelected')}`)),
    ).toBeVisible();
    await element(by.id(copyButton)).tap();
    // We are checking the number of items with the tap on checkbox
    await element(by.id(checkbox)).tap();
    // After copy, we expect to have the list multiplied by two
    await expect(
      element(by.text(`60 ${text('elementsSelected')}`)),
    ).toBeVisible();
    await expect(element(by.id(flatList))).toBeVisible();
  });

  it('should make a search, find some users and delete all', async () => {
    await element(by.id(appSearchInput)).typeText('sebastien');
    await element(by.id(checkbox)).tap();
    await expect(element(by.text('30 elements selected'))).toBeVisible();
    await element(by.id(deleteButton)).tap();
    // We are checking the number of items with the tap on checkbox
    await element(by.id(checkbox)).tap();
    // after delete, we expect to have no results, no list
    await expect(element(by.text('0 elements selected'))).toBeVisible();
    await expect(element(by.id(flatList))).not.toBeVisible();
    await expect(element(by.id(textNoFoundSearch))).toBeVisible();
  });

  it('should make a search, find some users and click to see the profile', async () => {
    const userID = '48792499';
    await element(by.id(appSearchInput)).typeText('sebcarre');
    await expect(element(by.id(userCard + userID))).toBeVisible();
    await expect(element(by.text('SebCarret'))).toBeVisible();
    // Click on the right user we want !
    await element(by.id('UserCard.ViewProfileButton' + userID)).tap();
    // If there is no error on tap, it means that it has opened the WebView, we are not going to check if the github page has been loaded, we stay to our app perimeter.
    // To get out of the webview, we need to get back to home interface and re-launch the app.
    await device.sendToHome();
    await device.launchApp();
  });

  it('should make 5 searchs until getting a alert to warn the user', async () => {
    var i;
    var j = 5;
    // Making a loop to type a letter until 5 letters to see the alert.
    for (i = 0; i < j; i++) {
      await element(by.id(appSearchInput)).typeText(i.toString());
    }
    await expect(element(by.text(text('warning')))).toBeVisible();
    await expect(
      element(by.text(text('alertFiveRequestsRemaining'))),
    ).toBeVisible();
  });

  it('should make multiple searchs until getting a alert to warn the user with rate limit at zero', async () => {
    var i;
    var j = 11;
    // Making a loop to type a letter until 11 letters to see the alert.
    for (i = 0; i < j; i++) {
      await element(by.id(appSearchInput)).typeText(i.toString());
    }
    await expect(element(by.text('Error'))).toBeVisible();
  });
});
