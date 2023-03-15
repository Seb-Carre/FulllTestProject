type User = {
  name: string;
  age: number;
};

export default async function registerUser(user: User) {
  // Using JS Fetch function
  const response = await fetch('URL_API_TO_CALL', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user),
  });

  if (response.ok) {
    // Return the success message
    return 'Congratulations, the user has been registered !';
  } else {
    // Return the status code when request has failed
    return response.status;
  }
}
