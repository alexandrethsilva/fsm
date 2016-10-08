/* eslint-disable no-console */
import { tap } from 'ramda'

//+++ PURE +++//

//++++++++++ log :: String -> IO String, String
export const log = tap(console.log)

//++++++++++ table :: (Object | String) -> IO (Object | String), (Object | String)
export const table = tap(console.table)

//++++++++++ log :: String -> IO String, String
export const error = tap(console.error)
