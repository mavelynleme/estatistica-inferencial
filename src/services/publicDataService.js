import {
  brazilPublicPreparedExample,
  irisSetosaPublicExample,
  publicDataSources,
} from '../data/publicDatasets'

export function getIrisSetosaExample() {
  return irisSetosaPublicExample.example
}

export function getBrazilPublicDataExample() {
  return brazilPublicPreparedExample.example
}

export function getAvailablePublicDataSources() {
  return publicDataSources
}
