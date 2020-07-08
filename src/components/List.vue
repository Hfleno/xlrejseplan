<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['id'],
  methods: {
    myFunc(args) {
      console.log(args)
    },
  },
  mounted() {
    console.log('mounted')
  },
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>