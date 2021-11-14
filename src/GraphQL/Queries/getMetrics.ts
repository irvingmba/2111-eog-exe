import { gql } from '@apollo/client';

export interface IfMetrics {
  getMetrics: string[];
}

export const metricsQuery = gql`query getMetrics{
    getMetrics
}`;
