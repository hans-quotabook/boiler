import axios from 'axios'
import * as R from 'ramda'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'

const source = new RecordSource()
const store = new Store(source)

let environment: Environment | null = null

export function getEnvironment(_source?: any) {
  if (_source) {
    R.pipe(
      () => _source,
      Object.entries,
      R.map(([dataId, record]) => source.set(dataId, record))
    )()
  }

  if (environment) {
    return environment
  }

  const network = Network.create((operation, variables) => {
    return R.pipe(
      () =>
        axios.post('/graphql', {
          id: operation.id,
          query: operation.text,
          variables,
        }),
      R.andThen(({ data }) => data)
    )()
  })

  return (environment = new Environment({
    network,
    store,
  }))
}
