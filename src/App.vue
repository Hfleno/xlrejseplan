<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Main from '@/components/Main'

export default {
  name: 'App',
  components: {
    Main,
  },
  data() {
    return {
      //
    }
  },
}
</script>
