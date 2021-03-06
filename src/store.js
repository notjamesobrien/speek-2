import { observable } from 'mobx'
import db from './db'
import moment from 'frozen-moment'

const WEATHER_API = 'f350cf6e59a712d6413981e3bfb42683'
const currentTime = moment().format('YYYY-MM-DD')

class Store {
  @observable username = window.localStorage.getItem('username')
  @observable messages = {}
  @observable announcements = {}
  @observable bitcoinChart
  @observable bitcoinData = 0
  @observable etherData = 0
  @observable ltcData = 0
  @observable time
  @observable weather
  @observable temp
  @observable conditions
  @observable weatherIcon
  @observable location
  @observable windDirection
  @observable windDirectionWord
  @observable windSpeed
  @observable update

  load () {
    db.ref('messages').on('value', (snapshot) => {
      const data = snapshot.val()
      this.messages = data
      console.log(this.messages)
    })
    const url = `http://api.coindesk.com/v1/bpi/currentprice.json`
    window.fetch(url)
    .then(r => r.json())
    .then(data => {
      const currency = Object.keys(data).map((key, i) => data[key])
      this.bitcoinData = currency[3].USD.rate_float.toFixed(2)
    })

// Weather
    const city = 'tampa'
    const weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${WEATHER_API}&units=imperial`
    window.fetch(weatherURL)
    .then(r => r.json())
    .then(data => {
      this.location = city
      this.temp = data.main.temp
      this.conditions = data.weather[0].description
      this.weatherIcon = data.weather[0].icon
      this.windDirection = data.wind.deg
      this.windSpeed = data.wind.speed
      this.toTextualDescription(this.windDirection)
    })
  }

  toTextualDescription = (direction) => {
    if (direction > 337.5) this.windDirectionWord = 'Northerly'
    if (direction > 292.5) this.windDirectionWord = 'North Westerly'
    if (direction > 247.5) this.windDirectionWord = 'Westerly'
    if (direction > 202.5) this.windDirectionWord = 'South Westerly'
    if (direction > 157.5) this.windDirectionWord = 'Southerly'
    if (direction > 122.5) this.windDirectionWord = 'South Easterly'
    if (direction > 67.5) this.windDirectionWord = 'Easterly'
    if (direction > 22.5) { this.windDirectionWord = 'North Easterly' }
  }

  addMessage (text) {
    console.log(db.ref('messages'))
    db.ref('messages').push().set({ username: this.username, text, time: this.time })
  }

  announceUser (text) {
    db.ref('messages').push().set({ username: 'SpeekBot', text })
    this.time = moment().format('LLLL')
  }
}

const store = new Store()

export default store
