import { gql } from '@apollo/client';

export interface IfNewMeasurement {
  newMeasurement:{
    metric: string,
    at: number,
    value: number,
    unit: string
  }
}

export default gql`
  subscription newMeasurement {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;
