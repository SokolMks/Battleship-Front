<template>
  <div>
    <div>
      <div v-if="getGames">
        <div class="topnav">
          <button
            v-if="getGames.player != null"
            class="gameCre"
            v-on:click="createGame"
          >Create a game</button>
          <button class="gameCre">
            <router-link :to="'/leaderboard'">Leaderboard</router-link>
          </button>
          <ul v-if="getGames.player != null">You have logged in as: {{getGames.player.username}}</ul>
          <button v-if="getGames.player != null" class="gameEnd" v-on:click="logOu">Log Out</button>
          <button v-else class="gameEnd">
            <router-link class :to="'/login'">Log In</router-link>
          </button>
        </div>

        <v-simple-table>
          <thead>
            <tr>
              <th>Game</th>
              <th>Date</th>
              <th colspan="2">Players</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(game, i) in getGames.games" :key="i">
              <td>{{game.id}}</td>
              <td>{{game.date}}</td>
              <td v-for="(gameplayer, i) in game.gameplayers" :key="i">
                <p>{{gameplayer.player.username}}</p>
              </td>
              <td v-if="game.gameplayers.length == 1">One free space</td>
              <td v-if="getGames.player != null">
                <h4 v-for="(gameplayer, i) in game.gameplayers" :key="i">
                  <router-link
                    v-if="gameplayer.player.id == getGames.player.id"
                    :to="`/game/${gameplayer.id}`"
                  >
                    <v-btn>Enter</v-btn>
                  </router-link>
                  <h4
                    class="text-center"
                    v-else-if="game.gameplayers.length == 1 && gameplayer.player.id !== getGames.player.id"
                  >
                    <v-btn v-on:click="gameJoin(game.id)">Join</v-btn>
                  </h4>
                </h4>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  methods: {
    ...mapActions([
      "actionGames",
      "createGame",
      "joinGame",
      "getLogin",
      "logOut"
    ]),
    logOu() {
      this.logOut();
      location.reload();
    },
    logEn() {
      this.getLogin();
    },
    gameCreation() {
      this.createGame();
      window.location.reload();
    },
    gameJoin(id) {
      this.joinGame(id);
    }
  },
  computed: {
    ...mapGetters(["getGames"])
  },
  created() {
    this.actionGames();
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 80px;
}
.gameCre {
  display: flex;
  justify-content: flex-end;
  margin-right: 30px;
}
.topnav {
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  justify-content: center;
  overflow: hidden;
  background-color: rgba(0, 0, 255, 0.493);
  color: white;
  line-height: 80px;
  height: 80px;
}
.gameEnd {
  margin-left: 40px;
}
</style>