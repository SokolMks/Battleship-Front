<template>
  <div>
    <table id="customers">
      <thead class="thed">
        <tr>
          <th>Players:</th>
          <th>Wins:</th>
          <th>Loses:</th>
          <th>Ties:</th>
          <th>Total Score:</th>
        </tr>
      </thead>
      <tbody class="tbod">
        <tr v-for="(player, i) in makeLeaderBoard" :key="i">
          <td id="playerBoard">{{player.name}}</td>
          <td>{{player.win}}</td>
          <td>{{player.lose}}</td>
          <td>{{player.tie}}</td>
          <td>{{player.points}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  watch: {},
  methods: {
    ...mapActions(["addLeaderBoard"])
  },
  computed: {
    ...mapGetters(["getLeaderBoard"]),
    makeLeaderBoard() {
      let leaderboard = [];
      this.getLeaderBoard.forEach(player => {
        let playerScore = {
          name: player.Player.username,
          win: 0,
          lose: 0,
          tie: 0,
          points: 0
        };
        player.Score.forEach(score => {
          switch (score) {
            case 0.0:
              playerScore.lose += 1;
              break;
            case 0.5:
              playerScore.tie += 1;
              playerScore.points += score;
              break;
            case 1.0:
              playerScore.win += 1;
              playerScore.points += score;
              break;
            default:
              break;
          }
        });
        leaderboard.push(playerScore);
      });
      return leaderboard.sort((a, b) => {
        if (a.points < b.points) {
          return 1;
        } else if (a.points > b.points) {
          return -1;
        } else if (a.points == b.points) {
          return a.win + a.lose + a.tie < b.win + a.lose + b.tie;
        }
      });
    }
  },
  created() {
    this.addLeaderBoard();
    setInterval(() => {
      this.addLeaderBoard();
    }, 20000);
  }
};
</script>

<style>
#customers {
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#customers td,
#customers th {
  border: 1px solid #ddd;
  padding: 8px;
}

#customers tr:nth-child(even) {
  background-color: #f2f2f2;
}

#customers tr:hover {
  background-color: #ddd;
}

#customers th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: darkorchid;
  color: white;
}
</style>


