export default {
  updateData (state, newData) {
    state.windows = newData.windows
    state.records = newData.records
    state.processes = newData.processes
    state.titleClusters = newData.titleClusters
    state.mclClusters = newData.mclClusters
    state.recordClusters = newData.recordClusters
  },

  setWindowsList (state, newData) {
    state.windowsList = newData
  },

  setRecordsList (state, newData) {
    state.recordsList = newData
  }
}
