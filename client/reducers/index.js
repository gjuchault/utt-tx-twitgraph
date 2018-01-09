import { combineReducers } from 'redux'

import tokens from './tokens'
import location from './location'
import map from './map'

export default combineReducers({ tokens, location, map })
