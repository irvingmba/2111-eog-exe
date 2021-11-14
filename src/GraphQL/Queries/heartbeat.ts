import { gql } from '@apollo/client';

export interface IfHeartbeat {
  heartBeat: number;
}

export const heartBeatQry = gql`
  query heartBeat {
    heartBeat
  }
`;
