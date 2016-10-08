import {
  assertAtLeastOneArray,
  assertBoolean,
  assertString,
} from './utils/validation/assert'
import { compose, contains, flip, map, sequence } from 'ramda'
import { Left, Right } from 'data.either'
import { fork } from './utils/utils'
import { log } from './utils/console'
import Task from 'data.task'
import Validation from 'data.validation'

//+++ HELPERS +++//

const validateStateOptions = ({ label, origins, destinations, active }) =>
  new Task((fail, succeed) => {
    const validation = sequence(Validation.of, [
      assertString(label),
      assertAtLeastOneArray(origins, destinations),
      assertBoolean(active),
    ])

    return (validation.isFailure) ?
      fail(Left(validation.value))
      : succeed(Right({ label, origins, destinations, active }))
  })


//+++ PURE +++//

const State = ({ label, origins, destinations, active }) => {
  //+++ canTransition :: String -> Bool
  const canReach = compose(flip(contains)(destinations))

  return { active, canReach, destinations, label, origins }
}

export default compose(fork(map(log), map(State)), validateStateOptions)
