<template>
  <div>
    <Tester :id="id"></Tester>
  </div>
</template>

<script>
import Tester from "../components/Tester";

import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    Tester
  },
  props: ["id"],
  methods: {
    ...mapActions(["addGameView"])
  },
  watch: {
    getGameView() {
      let intervalSet = this.getGameView.State.Logic;
      console.log(intervalSet);

      if (
        intervalSet == "You won!" ||
        intervalSet == "You lost" ||
        intervalSet == "Draw"
      ) {
        clearInterval(this.fetching);
      }
    }
  },
  computed: {
    ...mapGetters(["getGameView"])
  },
  data() {
    return {
      fetching: null
    };
  },
  created() {
    this.addGameView(this.id);
    this.fetching = setInterval(() => {
      this.addGameView(this.id);
    }, 3000);
  }
};
</script>

<style>
</style>

