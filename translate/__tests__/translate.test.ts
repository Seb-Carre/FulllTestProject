import text from '../translate';

it('test the function to return a text that exist', async () => {
  const resultText = text('ok');
  expect(resultText).toBe('okay');
});

it('test the function to return a text that not exist', async () => {
  const resultText = text('zz');
  expect(resultText).toBe(
    'Error: key item not found, please check your wording !',
  );
});
