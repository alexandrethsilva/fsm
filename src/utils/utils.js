/* eslint-disable import/prefer-default-export */
import { curry } from 'ramda'

//+++ PURE +++//

//++++++++++ fork :: A(_ -> _) -> B(_ -> _) -> Task -> Either(A(), B())
export const fork = curry((fail, succeed, task) => task.fork(fail, succeed))
