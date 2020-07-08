<template>
  <v-main>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar color="cyan" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title @click="getFromRoskilde">Hove</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn>
          </v-toolbar>

          <v-list>
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
                        >{{item.name.substr(4,4)}} {{item.direction}}</v-chip>
                      </v-flex>
                      <v-flex class="flex-time" xs2>{{item.time}}</v-flex>
                      <v-flex class="flex-time" xs2>{{item.rtTime}}</v-flex>
                      <v-flex class="delayed flex-time" xs2 v-if="item.rtTime">{{item.delayed}}</v-flex>
                    </v-layout>
                  </v-container>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider v-if="index + 1 < items.length" :key="`divider-${index}`"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>


<script>
import axios from 'axios'
export default {
  data() {
    return {
      items: [],
    }
  },
  methods: {
    getFromRoskilde() {
      console.log('testing')
      const id = '8600617' //Roskilde
      const ballerupId = '8600708'
      const ballerupX = '12358343'
      const ballerupY = '55729875'
      // Hove
      const hoveId = '9764'
      const hoveX = '12236926'
      const hovey = '55726828'
      let date = this.getDate()
      //date = '17.01.19'
      var self = this
      axios
        .get('/api/departureBoard', {
          params: { id: hoveId, date: date }, //, time: '00:00'
        }) ///8600617/15.01.19/17:00
        .then(function(data) {
          //console.log(data.data.DepartureBoard.Departure)
          let theItems = data.data.DepartureBoard.Departure
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
          console.log(self.items)
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
    getBusDetails(ref) {
      console.log(ref.ref)
      console.log('SKIIIIIFT')
      this.$router.push({ name: 'about' })
      //this.$router.push({ name: 'details', params: { ref: ref.ref } })
    },
  },
  mounted() {
    this.getFromRoskilde()
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
