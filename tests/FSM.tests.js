import FSM from '../src/FSM'
import { last } from 'ramda'
import State from '../src/State'
import test from 'tape'

test('Fsm', (child) => {

  const S0 = State({
    label: 'IDLE',
    origins: null,
    destinations: ['ACTIVE'],
    active: true,
  }).value

  const S1 = State({
    label: 'ACTIVE',
    origins: ['IDLE'],
    destinations: ['IDLE'],
    active: false,
  }).value

  const rightFsm = FSM('TEST', 'IDLE', [[S0, S1]])
  const testFsm = rightFsm.value

  child.test('constructor', (assert) => {

    assert.true(rightFsm.isRight, 'Successfuly creates an Fsm when provided adequate arguments')

    assert.end()

  })

  child.test('main', (assert) => {

    const actualMain = testFsm.main
    const expectedMain = S0

    assert.isEqual(actualMain, expectedMain, 'Returns the expected main State')

    assert.end()

  })

  child.test('current', (assert) => {

    const actualCurrent = testFsm.current
    const expectedCurrent = S0

    assert.isEqual(actualCurrent, expectedCurrent, 'Returns the expected current State')

    assert.end()

  })

  child.test('record', (assert) => {

    const actualRecordLength = testFsm.record.length
    const expectedRecordLength = 1

    const actualLastLength = last(testFsm.record).length
    const expectedLastLength = 2

    assert.isEqual(actualRecordLength, expectedRecordLength, 'Has expected length on main record')
    assert.isEqual(actualLastLength, expectedLastLength, 'Has expected length on record children')

    assert.end()

  })

  child.skip('states', (assert) => {

    const actualStates = testFsm.states
    const expectedStates = { ACTIVE: S1, IDLE: S0 }

    assert.isEqual(actualStates, expectedStates, 'Lists states correctly')

    assert.end()
  })

  child.end()

})
