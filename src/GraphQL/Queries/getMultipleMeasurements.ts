import { gql } from '@apollo/client';

export interface IfGetMultipleMeasurements {
  getMultipleMeasurements: {
    metric: string;
    measurements: {
      metric: string;
      at: number;
      value: number;
      unit: string;
    }[]
  }[]
}

export default gql`
query getMultipleMeasurements($input: [MeasurementQuery]){
    getMultipleMeasurements(input: $input){
        metric
        measurements {
            metric
            at
            value
            unit
        }
    }
}`;
