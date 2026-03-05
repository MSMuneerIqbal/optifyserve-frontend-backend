import { combineReducers } from '@reduxjs/toolkit'
import themeReducer from '@/features/settings/theme/themeSlice'

const rootReducer = combineReducers({
  theme: themeReducer,
})

export default rootReducer
