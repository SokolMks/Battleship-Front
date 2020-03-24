import Vue from "vue";
import Vuex from "vuex";
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    player: null,
    ships: null,
    games: "",
    gameView: [],
    leaderBoard: [],
    gPlayer_id: "",
    shipLocations: [
      { type: "Destroyer", locations: [] },
      { type: "Submarine", locations: [] },
      { type: "Fish_raft", locations: [] },
      { type: "Patrol_boat", locations: [] },
      { type: "Carrier", locations: [] }
    ]
  },
  mutations: {
    getGame: (state, payload) => (state.games = payload),
    getGameView: (state, payload) => (state.gameView = payload),
    getLeaderBoard: (state, payload) => (state.leaderBoard = payload)
  },
  actions: {
    actionGames(context) {
      fetch("/api/games", {
        credentials: "include",
        method: "GET"
      })
        .then(resp => {
          // console.log(resp);
          if (resp.ok) {
            // console.log(resp);
            return resp.json();
          }
          throw new Error("Bad request try again");
        })
        .then(data => {
          context.commit("getGame", data);
          //console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    addGameView(context, id) {
      fetch("/api/game_view/" + id, {
        credentials: "include",
        method: "GET"
      })
        .then(resp => {
          //console.log(resp);
          if (resp.ok) {
            //console.log(resp);
            return resp.json();
          }
          throw new Error("Bad request try again");
        })
        .then(data => {
          context.commit("getGameView", data);
          //console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    // convertDate() {
    //   this.data.created = new Date(this.data.created).toLocaleString();
    // },
    addLeaderBoard(context) {
      fetch("/api/leaderBoard", {
        credentials: "include",
        method: "GET"
      })
        .then(resp => {
          //console.log(resp);
          if (resp.ok) {
            //console.log(resp);
            return resp.json();
          }
          throw new Error("Bad request try again");
        })
        .then(data => {
          context.commit("getLeaderBoard", data);
          //console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    createGame() {
      fetch("/api/games", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      })
        .then(newData => {
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            console.log("Creation could not be done", data);
          } else {
            console.log("Creation complete", data);
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
        });
    },
    joinGame({ commit }, id) {
      fetch("/api/game/" + id + "/players", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      })
        .then(newData => {
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            console.log("Could not join", data);
          } else {
            console.log("You joined the game", data);
            router.push(`/game/${data.gpid}`);
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
        });
    },
    getLogin({ commit }, payload) {
      fetch("/api/login", {
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: getBody({ email: payload.name, password: payload.password })
      })
        .then(function(data) {
          // console.log("Response: ", data);
          if (data.status == 200) {
            router.push("/");
            location.reload();
          }
        })
        .catch(function(error) {
          console.log("Request failure: ", error);
        });
      function getBody(json) {
        var body = [];
        for (var key in json) {
          var encKey = encodeURIComponent(key);
          var encVal = encodeURIComponent(json[key]);
          body.push(encKey + "=" + encVal);
        }
        return body.join("&");
      }
    },

    logOut() {
      fetch("/api/logout", {
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
        .then(function(data) {
          console.log("You have logged out.", data);
        })
        .catch(error => {
          console.log("There was an error", error);
        });
    },
    addShips({ commit, dispatch }, { gpId, ships }) {
      //console.log(gpId);
      //console.log(ships);
      fetch("/api/games/players/" + gpId + "/ships", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(ships)
      })
        .then(newData => {
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            console.log("Error ", data);
          } else {
            dispatch("addGameView", gpId);
          }
        })
        .catch(error => {
          console.log("Request error: ", error);
        });
    },
    addSalvos({ commit, dispatch }, { gpId, salvos }) {
      fetch("/api/games/players/" + gpId + "/salvos", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(salvos)
      })
        .then(newData => {
          //console.log("data send: ", JSON.stringify(newData));
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            console.log("error", data);
          } else {
            //console.log("created: ", data);
            dispatch("addGameView", gpId);
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
        });
    }
  },
  getters: {
    getGames: state => state.games,
    getGameView: state => state.gameView,
    getLeaderBoard: state => state.leaderBoard
  },
  modules: {}
});
