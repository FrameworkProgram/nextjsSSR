import { combineReducers } from 'redux'
import counter from "./counter"

export default combineReducers({
    counter
})

// export default function todoApp(state = {}, action) {
//     return {
//       counter: counter(state.counter, action)
//     }
// }