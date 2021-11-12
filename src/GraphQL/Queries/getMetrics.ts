import { gql } from '@apollo/client';

export interface IfMetrics {
  getMetrics: string[];
}

export default gql`query getMetrics{
    getMetrics
}`;
