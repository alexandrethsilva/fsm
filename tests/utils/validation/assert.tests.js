import {
  assertAnyPass,
  assertArray,
  assertArrayOfString,
  assertArrayOrNull,
  assertAtLeastOneArray,
  assertBoolean,
  assertNull,
  assertState,
  assertString,
  assertStringOrNull,
} from '../../../src/utils/validation/assert'
import { Failure, Success } from 'data.validation'
import test from 'tape'

// TODO investigate use of jsverify

test('Assertion Utilility', (parent) => {
  parent.test('assertAnyPass()', (assert) => {
    const challengesWithSuccess = [Failure('_'), Success('_')]
    const challengesWithoutSuccess = [Failure('_'), Failure('_')]

    assert.true(assertAnyPass(challengesWithSuccess).isSuccess, 'Returns a `Success` when provided a [(Failure|Success)] containing at least one `Success`')
    assert.true(assertAnyPass(challengesWithoutSuccess).isFailure, 'Returns a `Failure` when provided a [Failure]')

    assert.end()
  })

  parent.test('assertArray()', (assert) => {
    assert.true(assertArray([0, 1, 2]).isSuccess, 'Returns a `Success` when provided an `Array`')
    assert.true(assertArray(0).isFailure, 'Returns a `Failure` when not provided an `Array`')

    assert.end()
  })

  parent.test('assertArrayOrNull()', (assert) => {
    assert.true(assertArrayOrNull([0, 1, 2]).isSuccess, 'Returns a `Success` when provided an `Array`')
    assert.true(assertArrayOrNull(null).isSuccess, 'Returns a `Success` when provided a `Null`')
    assert.true(assertArrayOrNull(0).isFailure, 'Returns a `Failure` when not provided an `Array`')

    assert.end()
  })

  parent.test('assertAtLeastOneArray()', (assert) => {
    const arr = [0, 1, 2]

    assert.true(assertAtLeastOneArray(null, arr).isSuccess, 'Returns a `Success` when provided a `Null` and an `Array`')
    assert.true(assertAtLeastOneArray(arr, null).isSuccess, 'Returns a `Success` when provided an `Array` and a `Null`')
    assert.true(assertAtLeastOneArray(arr, arr).isSuccess, 'Returns a `Success` when provided two `Array`')
    assert.true(assertAtLeastOneArray(null, null).isFailure, 'Returns a `Failure` when provided two `Null`')

    assert.end()
  })

  parent.test('assertBoolean()', (assert) => {
    assert.true(assertBoolean(true).isSuccess, 'Returns a `Success` when provided a `Bool`')
    assert.true(assertBoolean(0).isFailure, 'Returns a `Failure` when not provided a `Bool`')

    assert.end()
  })

  parent.test('assertNull()', (assert) => {
    assert.true(assertNull(null).isSuccess, 'Returns a `Success` when provided a `Null`')
    assert.true(assertNull(0).isFailure, 'Returns a `Failure` when not provided a `Null`')

    assert.end()
  })

  parent.test('assertString()', (assert) => {
    assert.true(assertString('_').isSuccess, 'Returns a `Success` when provided a `String`')
    assert.true(assertString(0).isFailure, 'Returns a `Failure` when not provided a `String`')

    assert.end()
  })

  parent.skip('assertArrayOfString()', (assert) => {
    // TODO This should be passing...
    assert.true(assertArrayOfString(['_', '_']).isSuccess, 'Returns a `Success` when provided an `ArayOf(String)`')
    assert.true(assertArrayOfString([]).isFailure, 'Returns a `Failure` when not provided an `ArrayOf(String)`')

    assert.end()
  })

  parent.test('assertStringOrNull()', (assert) => {
    assert.true(assertStringOrNull('_').isSuccess, 'Returns a `Success` when provided a `String`')
    assert.true(assertStringOrNull(null).isSuccess, 'Returns a `Success` when provided a `Null`')
    assert.true(assertStringOrNull(0).isFailure, 'Returns a `Failure` when not provided either a `String` or a `Null`')

    assert.end()
  })

  parent.skip('assertState()', (assert) => {
    const validStateWithNullOrigins = {
      active: false,
      destinations: ['_'],
      label: '_',
      origins: null,
    }

    assert.true(
      assertState(validStateWithNullOrigins).isSuccess,
      'Returns a `Success` when provided a valid `State` with `Null` origins and `ArrayOf(String)` destinations'
    )

    const validStateWithNullDestinations = {
      active: false,
      destinations: null,
      label: '_',
      origins: ['_'],
    }

    assert.true(
      assertState(validStateWithNullDestinations).isSuccess,
      'Returns a `Success` when provided a valid `State` with `Null` destinations and `ArrayOf(String)` origins'
    )

    const validState = {
      active: false,
      destinations: ['_'],
      label: '_',
      origins: ['_'],
    }

    assert.true(assertState(validState).isSuccess, 'Returns a `Success` when provided a valid `State` with both origins and destinations being `ArrayOf(String)`')

    const invalidStateWithNullLabel = {
      active: false,
      destinations: ['_'],
      label: null,
      origins: ['_'],
    }

    assert.true(assertState(invalidStateWithNullLabel).isFailure, 'Returns a `Failure` when provided an invalid `State` with `Null` label')

    const invalidStateOnActiveFlag = {
      active: 'false',
      destinations: ['_'],
      label: '_',
      origins: ['_'],
    }

    assert.true(assertState(invalidStateOnActiveFlag).isFailure, 'Returns a `Failure` when provided an invalid `State` with the active flag being other than `Bool`')

    assert.end()
  })
})
