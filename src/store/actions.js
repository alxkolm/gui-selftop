import {Api} from '../api/index'

export const loadData = ({commit}) => {
  Api.loadData().then((response) => {
    console.log(response)
    commit('updateData', response.data)
  })
}
