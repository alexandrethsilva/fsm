import {
  assertRecord,
  assertString,
} from './utils/validation/assert'
import {
  compose, converge, curry, F, find, findIndex,
  identity, last, lensProp, map, mergeAll, objOf, over,
  prop, propEq, sequence, T, toUpper, update,
} from 'ramda'
import { Just, Nothing } from 'data.maybe'
import { Left, Right } from 'data.either'
import { fork } from './utils/utils'
import { log } from './utils/console'
import Task from 'data.task'
import Validation from 'data.validation'

//+++ HELPERS +++//

const validateFsmArgs = curry((fsmLabel, fsmDefaultState, fsmRecord) =>
  new Task((fail, succeed) => {
    const validation = sequence(Validation.of, [
      assertString(fsmLabel),
      assertString(fsmDefaultState),
      assertRecord(fsmRecord),
    ])

    return (validation.isFailure) ?
      fail(Left(validation.value))
      : succeed(Right([fsmLabel, fsmDefaultState, fsmRecord]))
  }))

const objWith = (key, content) => key(content)
const upperKey = curry((key, obj) => compose(objOf, toUpper, prop(key))(obj))
const toStatesList = converge(objWith, [upperKey('label'), identity])


//+++ LENSES +++//
const activeLens = lensProp('active')

const activate = over(activeLens, T)
const deactivate = over(activeLens, F)

const activateOnly = curry((state, list) => {
  //TODO This is ugly. Do it better.
  const index = findIndex(propEq('label', prop('label', state)))(list)
  const updateWith = (item) => update(index, item, list)

  return compose(updateWith, activate)(state)
})


//+++ PURE +++//

//+++ FSM :: String -> String -> [State] -> FSM
const FSM = curry((fsmLabel, fsmDefaultState, fsmRecord) => {
  //+++ label :: String
  const label = fsmLabel

  //+++ main :: String
  const main = compose(find(propEq('label', fsmDefaultState)), last)(fsmRecord)

  //+++ current :: State
  const current = compose(find(propEq('active', true)), last)(fsmRecord)

  //+++ states :: [State]
  const states = compose(mergeAll, map(toStatesList), last)(fsmRecord)

  //+++ record :: [[States]]
  const record = fsmRecord

  //+++ canTransition :: Origin -> Destination -> Maybe Destination
  const canTransition = curry((origin, destination) =>
    new Task((fail, succeed) =>
      (origin.canReach(destination)) ? succeed(Just(destination)) : fail(Nothing())))


  //+++ register :: Record -> Destination -> Record
  const register = curry((stateRecord, destination) =>
    [...stateRecord,
    compose(activateOnly(destination), map(deactivate), last)(stateRecord)])

  //+++ transition :: Destination -> Maybe(FSM)
  const transition = compose(
    map(FSM(label, main)), fork(log, map(register(record))), canTransition(current)
  )

  return { current, main, label, record, states, transition }
})

const spreadCall = curry((f, args) => f(...args))
// TODO ^ There must exist something with this signature already

export default compose(fork(map(log), map(spreadCall(FSM))), validateFsmArgs)
