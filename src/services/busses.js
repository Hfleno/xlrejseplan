const baseUrl = 'http://xmlopen.rejseplanen.dk/bin/rest.exe/'
import axios from 'axios'

export async function getDepartureBoard(id, date, time) {
  console.log('getting departures')
  let url =
    baseUrl +
    'departureBoard?id=' +
    id +
    '&date=' +
    date +
    '&time=' +
    (time + '&format=json')
  console.log(url)
  let res = await axios.get(url)
  return res
}
