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

export const getMeasurementsQry = gql`
query getMeasurements($input: MeasurementQuery) {
        getMeasurements(input: $input) {
            metric
            at
            value
            unit
        }
}`;
