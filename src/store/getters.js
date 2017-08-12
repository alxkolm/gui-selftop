export const windowsMap = (state) => {
  let map = {}
  return state.windows.reduce((map, win) => {
    map[win.id] = win
    return map
  }, map)
}
