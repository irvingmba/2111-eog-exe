import { ApolloClient, InMemoryCache } from '@apollo/client';
import { splitLink } from './Subscriptions';

export const client = new ApolloClient({
  uri: 'https://react.eogresources.com/graphql',
  cache: new InMemoryCache(),
  link: splitLink,
});
