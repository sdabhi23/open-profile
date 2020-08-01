import { ApolloClient, createHttpLink, gql, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const fetch = require("node-fetch");

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
  fetch: fetch
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const dataQuery = gql`query UserInfo($username: String!) {
  user(login: $username) {
    login
    avatarUrl
    bio
    createdAt
    organizations(first: 10) {
      totalCount
      nodes {
        avatarUrl
        name
        url
      }
    }
    isDeveloperProgramMember
    stats: contributionsCollection {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
    }
    gists {
      totalCount
    }
    followers {
      totalCount
    }
    following {
      totalCount
    }
    num_public: repositories(privacy: PUBLIC) {
      totalCount
    }
    num_private: repositories(privacy: PRIVATE) {
      totalCount
    }
    num_forks: repositories(isFork: true) {
      totalCount
    }
    num_owner: repositories(isFork: false) {
      totalCount
    }
    repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        forkCount
        isPrivate
        owner {
          login
        }
        primaryLanguage {
          color
          name
        }
        pullRequests {
          totalCount
        }
        issues {
          totalCount
        }
        forkCount
        stargazers {
          totalCount
        }
        watchers {
          totalCount
        }
        createdAt
        pushedAt
        updatedAt
        diskUsage
      }
      pageInfo {
        hasNextPage
      }
    }
    websiteUrl
    twitterUsername
    status {
      emojiHTML
      message
    }
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}`

const secret = process.env.DATA_TOKEN

const fetchGQL = username => {
  return client.query({
    query: dataQuery,
    variables: {
      username: username
    }
  })
    .then(gqlres => gqlres.data)
    .catch(gqlres => gqlres)
}

export default async (req, res) => {

  const { body: {
    username, access_token
  }, method } = req

  console.log(username, method)

  if (method === "POST") {
    if (access_token === secret) {
      const promised = await fetchGQL(username)
      res.json(promised)
    } else {
      res.statusCode = 401
      res.json({
        error: "missing token"
      })
    }
  }
}
