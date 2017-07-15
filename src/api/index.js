import axios from 'axios'

export class Api {
  static loadData () {
    return axios.get('http://localhost:9999/')
  }
}
