import { any, compose, curry, find, prop, sequence } from 'ramda'
import {
  ArrayOf,
  Array as checkArray,
  Boolean as checkBoolean,
  Function as checkFunction,
  Null as checkNull,
  String as checkString,
  ObjectOf,
  Or,
} from 'core.check'
import Validation, { Failure, Success } from 'data.validation'

//+++ HELPERS +++//
const matchWith = {
  Failure: (value) => Failure([`Expected ${value}`]),
  Success: (value) => Success(value),
}

const cata = curry((_, f) => f.cata(_))
const isFailure = (_) => _.isFailure
const isSuccess = (_) => _.isSuccess

export const assertAnyPass = (challenges) =>
  any(isSuccess)(challenges) ? Success() : find(prop('isFailure'))(challenges)


//+++ PURE +++//
//++ GENERIC ++//
// TODO Consider experiment with pattern matching provided by Sparkler? Maybe...
// (https://github.com/natefaubion/sparkler)
export const assertArray = compose(cata(matchWith), checkArray)
export const assertArrayOrNull = compose(cata(matchWith), Or([checkArray, checkNull]))
export const assertBoolean = compose(cata(matchWith), checkBoolean)
export const assertFunction = compose(cata(matchWith), checkFunction)
export const assertNull = compose(cata(matchWith), checkNull)
export const assertString = compose(cata(matchWith), checkString)

export const assertStringOrNull = Or([assertString, assertNull])
export const assertArrayOfString = ArrayOf(assertString)
export const assertArrayOfStringOrNull = Or([assertArrayOfString, assertNull])

// TODO This should probably have a better abstraction
export const assertAtLeastOneArray = curry((subject1, subject2) =>
  assertAnyPass([
    sequence(Validation.of, [assertArray(subject1), assertArray(subject2)]),
    sequence(Validation.of, [assertNull(subject1), assertArray(subject2)]),
    sequence(Validation.of, [assertArray(subject1), assertNull(subject2)]),
  ]))


//++ SPECIFIC ++//
//+ STATE +//
export const assertState = compose(cata(matchWith), ObjectOf({
  active: checkBoolean,
  canReach: checkFunction,
  destinations: Or([checkArray, checkNull]),
  label: checkString,
  origins: Or([checkArray, checkNull]),
}))

//+ FSM +//
export const assertRecord = compose(cata(matchWith), ArrayOf(ArrayOf(assertState)))
