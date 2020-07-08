<template>
  <div>{{xref}}</div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {}
  },
  props: {
    xref: {
      type: String,
      required: true,
    },
  },
  methods: {
    getDetails() {
      var self = this
      let refUrl = this.xref.split('?')[1]
      console.log('Details')
      console.log(refUrl)
      axios
        .get('/api/journeyDetail', {
          params: { refUrl },
        })
        .then(function(data) {
          console.log(data)
          let theItems = data.data.JourneyDetail.Stop.filter(function(stop) {
            return stop.rtArrTime
          })
          self.items = theItems
          console.log(self.items)
        })
        .catch(function(error) {
          console.log('Fejl')
          console.log(error)
        })
    },
  },
  mounted() {
    this.getDetails()
  },
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>