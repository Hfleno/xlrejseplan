<template>
  <v-main>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar color="cyan" dark>
            <v-icon>mdi-menu</v-icon>
            <v-toolbar-title>
              <v-select
                v-model="stop"
                :items="stopLocations"
                item-text="name"
                item-value="id"
                :label="selectLabel"
              ></v-select>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="update">
              <v-icon>mdi-cached</v-icon>
            </v-btn>
          </v-toolbar>

          <v-list v-if="!updating">
            <template v-for="(item, index) in items">
              <v-list-tile class="list-tile" :key="index">
                <v-list-tile-content>
                  <v-container fluid grid-list-xl>
                    <v-layout row>
                      <v-flex xs6>
                        <v-chip
                          class="bus-chip"
                          color="#ff0"
                          text-color="#00f"
                          @click="getBusDetails(item.JourneyDetailRef)"
                          >{{ item.name.substr(4, 4) }}
                          {{ item.direction.substr(0, 13) }}</v-chip
                        >
                      </v-flex>
                      <v-flex class="flex-time" xs2>{{ item.time }}</v-flex>
                      <v-flex class="flex-time" xs2>{{ item.rtTime }}</v-flex>
                      <v-flex
                        class="delayed flex-time"
                        xs2
                        v-if="item.rtTime"
                        >{{ item.delayed }}</v-flex
                      >
                    </v-layout>
                  </v-container>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < items.length"
                :key="`divider-${index}`"
              ></v-divider>
            </template>
          </v-list>
          <!-- <loader v-else></loader> -->
          <div v-else class="text-xs-center">
            <v-progress-circular
              indeterminate
              color="teal"
            ></v-progress-circular>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
//import { getLocation } from '../services/geolocation'
import axios from 'axios'
import Loader from '@/components/Loader'
export default {
  data() {
    return {
      items: [],
      coordY: '',
      coordX: '',
      stopLocations: [],
      stop: '',
      updating: false,
      error: {},
    }
  },
  components: {
    Loader,
  },
  watch: {
    stop: function(newValue, oldValue) {
      this.getDepartures(newValue)
    },
  },
  methods: {
    getDepartures(id) {
      if (!id) {
        return
      }
      console.log('testing')
      // const id = '8600617' //Roskilde
      // const ballerupId = '8600708'
      // const ballerupX = '12358343'
      // const ballerupY = '55729875'
      // Hove
      // const hoveId = '9764'
      // const hoveX = '12236926'
      // const hovey = '55726828'
      let date = this.getDate()
      //date = '17.01.19'
      var self = this
      axios
        .get('/api/departureBoard', {
          params: { id: id, date: date }, //, time: '00:00'
        }) ///8600617/15.01.19/17:00
        .then(function(data) {
          //console.log(data.data.DepartureBoard.Departure)
          let theItems = data.data.DepartureBoard.Departure
          if (theItems.length > 0) {
            theItems.forEach(element => {
              if (element.rtTime) {
                let rttime = element.rtTime.split(':')
                let time = element.time.split(':')
                let diff =
                  Number(rttime[0]) * 60 +
                  Number(rttime[1]) -
                  (Number(time[0]) * 60 + Number(time[1]))
                element.delayed = diff
              }
            })
            self.items = theItems
          }

          console.log(self.items)
        })
        .catch(function(error) {
          console.log('Fejl')
          console.log(error)
        })
    },
    update() {
      this.stopLocations = []
      this.updating = true
      this.getPosition()
    },
    getStopsNearby(x, y) {
      var self = this
      axios
        .get('/api/stopsNearby', {
          params: { coordX: x, coordY: y },
        })
        .then(function(data) {
          let theItems = data.data.LocationList.StopLocation
          console.log(typeof theItems)
          if (Array.isArray(theItems)) {
            self.stopLocations = theItems
          } else {
            self.stopLocations = []
            self.stopLocations.push(theItems)
          }
          let alreadySelected = self.stopLocations.some(function(stopLocation) {
            return stopLocation.id == self.stop
          })
          if (alreadySelected) {
            console.log('Updating current stop')
            self.getDepartures(self.stop)
          }
          self.updating = false
          console.log(typeof self.stopLocations)
          console.log(JSON.stringify(self.stopLocations))
          console.log(self.stop)
          console.log(theItems)
        })
        .catch(function(error) {
          console.log('Fejl')
          console.log(error)
        })
    },
    getDate() {
      let months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
      ]
      let d = new Date()
      let fromId = '8600617'
      let date = d.getDate()
      let month = months[d.getMonth()]
      let year = d
        .getFullYear()
        .toString()
        .substring(2)
      let today = date + '.' + month + '.' + year
      console.log(today)
      return today
    },
    getBusDetails(xref) {
      console.log(xref.ref)
      this.$router.push({ name: 'details', params: { xref: xref.ref } })
    },
    async getPosition() {
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(
          position => {
            console.log(position.coords)
            //console.log(JSON.stringify(position.coords.coordinates))
            this.coordY = position.coords.latitude
            this.coordX = position.coords.longitude
            console.log(this.coordX, this.coordY)
            this.getStopsNearby(this.coordX, this.coordY)
          },
          error => {
            alert('error:' + error.message)
            // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            this.error = error
          }
        )
      }
    },
  },
  computed: {
    selectLabel: function() {
      let label = ''
      this.stop == '' ? (label = 'Vælg') : (label = '')
      return label
    },
  },
  mounted() {
    this.getDepartures()
  },
}
</script>

<style>
.bus-chip {
  font-weight: bold;
}
.list-tile {
  background-color: lightgrey;
}
.delayed {
  color: red;
  font-weight: bold;
}
.flex-time {
  margin-top: 10px;
}
</style>
