import { fork } from '../../src/utils/utils'
import sinon from 'sinon'
import Task from 'data.task'
import test from 'tape'

test('Utils', (parent) => {
  parent.test('fork', (child) => {
    let failStub
    let succeedStub

    const sandbox = sinon.sandbox.create()

    const forkSetup = () => {
      failStub = sandbox.stub()
      succeedStub = sandbox.stub()
    }

    const forkTeardown = () => sandbox.restore()

    const mockedTask = (arg) => new Task((fail, succeed) => (arg) ? succeed() : fail())

    child.test('When provided a match for Success', (assert) => {
      forkSetup()

      fork(failStub, succeedStub, mockedTask(true))

      assert.true(succeedStub.calledOnce, 'Invokes the provided success function')
      assert.false(failStub.called, 'Does not invoke the provided failure function')

      forkTeardown()

      assert.end()
    })

    child.test('When provided a match for Failure', (assert) => {
      forkSetup()

      fork(failStub, succeedStub, mockedTask(false))

      assert.true(failStub.calledOnce, 'Invokes the provided failure function')
      assert.false(succeedStub.called, 'Does not invoke the provided success function')

      forkTeardown()

      assert.end()
    })

    child.end()
  })
})
