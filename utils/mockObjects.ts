export const fakeUserResponse = {
  incomplete_results: false,
  items: [
    {
      avatar_url: 'https://avatars.githubusercontent.com/u/48792499?v=4',
      events_url: 'https://api.github.com/users/SebCarret/events{/privacy}',
      followers_url: 'https://api.github.com/users/SebCarret/followers',
      following_url:
        'https://api.github.com/users/SebCarret/following{/other_user}',
      gists_url: 'https://api.github.com/users/SebCarret/gists{/gist_id}',
      gravatar_id: '',
      html_url: 'https://github.com/SebCarret',
      id: 48792499,
      login: 'SebCarret',
      node_id: 'MDQ6VXNlcjQ4NzkyNDk5',
      organizations_url: 'https://api.github.com/users/SebCarret/orgs',
      received_events_url:
        'https://api.github.com/users/SebCarret/received_events',
      repos_url: 'https://api.github.com/users/SebCarret/repos',
      score: 1,
      site_admin: false,
      starred_url:
        'https://api.github.com/users/SebCarret/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/SebCarret/subscriptions',
      type: 'User',
      url: 'https://api.github.com/users/SebCarret',
    },
  ],
  total_count: 1,
};

export const headers = new Headers({
  'x-ratelimit-limit': '10',
  'x-ratelimit-remaining': '10',
  'x-ratelimit-reset': '1678640067',
  'x-ratelimit-resource': 'search',
  'x-ratelimit-used': '10',
  'x-xss-protection': '1; mode=block',
});

export const fakeUserResponseWithNoData = {
  incomplete_results: false,
  items: [],
  total_count: 1,
};
export const headersWithRateLimit5 = new Headers({
  'x-ratelimit-limit': '10',
  'x-ratelimit-remaining': '5',
  'x-ratelimit-reset': '1678640067',
  'x-ratelimit-resource': 'search',
  'x-ratelimit-used': '10',
  'x-xss-protection': '1; mode=block',
});

export const headersWithRateLimit = new Headers({
  'x-ratelimit-limit': '10',
  'x-ratelimit-remaining': '0',
  'x-ratelimit-reset': '1678640067',
  'x-ratelimit-resource': 'search',
  'x-ratelimit-used': '10',
  'x-xss-protection': '1; mode=block',
});
