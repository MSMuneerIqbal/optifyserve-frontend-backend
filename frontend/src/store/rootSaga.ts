import { all, fork } from 'redux-saga/effects'
import { themeSaga } from '@/features/settings/theme/themeSaga'

export default function* rootSaga() {
  yield all([
    fork(themeSaga),
  ])
}
