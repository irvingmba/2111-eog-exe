import { gql } from '@apollo/client';

export interface IfInput {
  input: {
    metricName: string,
    after: number,
    before: number
  }
}

export interface IfGetMeasurements {
  getMeasurements: {
    metric: string,
    at: number,
    value: number,
    unit: string
  }[]
}

// {
//     $metricName: String!,
//     $after: Timestamp,
//     $before: Timestamp}

export default gql`
query getMeasurements($input: MeasurementQuery) {
        getMeasurements(input: $input) {
            metric
            at
            value
            unit
        }
}`;
