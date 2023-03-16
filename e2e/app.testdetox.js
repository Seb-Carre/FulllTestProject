describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  const appSearchInput = 'App.SearchInput';
  const checkbox = 'App.CheckBox';
  const copyButton = 'App.CopyButton';
  const deleteButton = 'App.DeleteButton';
  const textBeginSearch = 'App.BeginSearch';
  const textNoFoundSearch = 'App.NoResultsFound';
  const flatList = 'App.FlatList';

  it('should have every component visible on start', async () => {
    await expect(element(by.text('Github Search'))).toBeVisible();
    await expect(element(by.id(appSearchInput))).toBeVisible();
    await expect(element(by.text('Search input'))).toBeVisible();
    await expect(element(by.id(checkbox))).toBeVisible();
    await expect(element(by.text('0 elements selected'))).toBeVisible();
    await expect(element(by.id(copyButton))).toBeVisible();
    await expect(element(by.id(deleteButton))).toBeVisible();
    await expect(element(by.id(textBeginSearch))).toBeVisible();
    await expect(element(by.id(textNoFoundSearch))).not.toBeVisible();
    await expect(element(by.id(flatList))).not.toBeVisible();
    await expect(
      element(
        by.text(
          `Please ! Begin the search by typing the user you're looking for.`,
        ),
      ),
    ).toBeVisible();
  });

  it('should make our first test with making a search and find some users', async () => {
    //await element(by.id('hello_button')).tap();
    await element(by.id(appSearchInput)).typeText('sebastien');
    await expect(element(by.id(flatList))).toBeVisible();
    await expect(element(by.id(textBeginSearch))).not.toBeVisible();
    //await expect(element(by.id('App.UserCard'))).toBeVisible();
    await expect(element(by.text('14598'))).toBeVisible();
  });

  it('should make a search, find some users and delete a user', async () => {
    await element(by.id(appSearchInput)).typeText('sebcarre');
    await expect(element(by.id('App.UserCard'))).toBeVisible();
    await expect(element(by.text('SebCarret'))).toBeVisible();
    await element(by.id('UserCard.CheckBox')).tap();
    await expect(element(by.text('1 elements selected'))).toBeVisible();
    await element(by.id(deleteButton)).tap();
    await expect(element(by.id('App.UserCard'))).not.toBeVisible();
    await expect(element(by.id(textNoFoundSearch))).toBeVisible();
    await expect(element(by.text('0 elements selected'))).toBeVisible();
  });

  it('should make a search, find some users and duplicate a user', async () => {
    await element(by.id(appSearchInput)).typeText('sebcarre');
    await expect(element(by.id('App.UserCard'))).toBeVisible();
    await expect(element(by.text('SebCarret'))).toBeVisible();
    await element(by.id('UserCard.CheckBox')).tap();
    await expect(element(by.text('1 elements selected'))).toBeVisible();
    await element(by.id(copyButton)).tap();
    await expect(element(by.text('0 elements selected'))).toBeVisible();
    await expect(element(by.text('SebCarret (duplicated)'))).toBeVisible();
    await expect(element(by.text('SebCarret'))).toBeVisible();
  });

  it('should make a search, find some users and click to see the profile', async () => {
    await element(by.id(appSearchInput)).typeText('sebcarre');
    await expect(element(by.id('App.UserCard'))).toBeVisible();
    await expect(element(by.text('SebCarret'))).toBeVisible();
    await element(by.id('UserCard.ViewProfileButton')).tap();
    await device.sendToHome();
    await device.launchApp();
  });

  it('should make 5 searchs until getting a alert to warn the user', async () => {
    var i;
    var j = 5;
    for (i = 0; i < j; i++) {
      await element(by.id(appSearchInput)).typeText(i.toString()); // wait for ?q
    }
    await expect(
      element(
        by.text(
          'Warning',
          'You can make 5 more searchs until you have to wait a time and be able to make new searchs',
        ),
      ),
    ).toBeVisible();
  });

  it('should make 10 searchs until getting a alert to warn the user with rate limit at zero', async () => {
    var i;
    var j = 10;
    for (i = 0; i < j; i++) {
      await element(by.id(appSearchInput)).typeText(i.toString());
    }

    await expect(element(by.text('Error'))).toBeVisible();
  });
});
