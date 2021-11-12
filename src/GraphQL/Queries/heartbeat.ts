import { gql } from '@apollo/client';

export interface IfHeartbeat {
  heartBeat: number;
}

export default gql`
  query heartBeat {
    heartBeat
  }
`;
