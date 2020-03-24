<template>
  <v-app class="mainapp">
    <div v-if="getGameView.length !=0">
      <div>
        <div class="topnav">
          <div>{{getGameView.Game.gameplayers[0].player.username}}</div>
          <p class="vs">VS</p>
          <div
            v-if="getGameView.Game.gameplayers.length > 1"
          >{{getGameView.Game.gameplayers[1].player.username}}</div>
          <div v-else>Waiting for opponent...</div>
        </div>
      </div>
      <v-dialog v-model="dialogDrop" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text class="text-center px-1">Can't drop outside of the grid</v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogTurn" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text class="text-center px-1">Can't turn here</v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogTurnOnShip" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text class="text-center px-1">You cannot turn on top of the other ship</v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogSalvo" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text class="text-center px-1">You exhausted all of your shots, wait till next turn</v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogSalvoGrid" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text
            class="text-center px-1"
          >You cannot shoot off letters and numbers, game doesnt work like that.</v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDropOnShip" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text
            class="text-center px-1"
          >Any other great ideas you came up with and want to share?</v-card-text>
        </v-card>
      </v-dialog>
      <div class="all-grid">
        <div id="dragId" :draggable="draggable">
          <div :id="id">
            <div class="displayShep">
              <div
                :class="v['fish_raft'] ? 'fish_raft_vImg' : 'fish_raftImg' "
                id="fish_raft"
                :draggable="true"
                @dragstart="dragStart"
                @dragover.stop
                data-ship-length="2"
                @click="turnShip($event, 'fish_raft')"
                data-ship-type="fish_raft"
              >
                <p>Raft</p>
              </div>
              <div
                :class="v['Submarine'] ? 'Submarine_vImg' : 'SubmarineImg' "
                @click="turnShip($event, 'Submarine')"
                id="Submarine"
                @dragstart="dragStart"
                @dragover.stop
                draggable="true"
                data-ship-length="3"
                data-ship-type="Submarine"
              >
                <p>Submarine</p>
              </div>
              <div
                :class="v['Destroyer'] ? 'Destroyer_vImg' : 'DestroyerImg' "
                @click="turnShip($event, 'Destroyer')"
                id="Destroyer"
                @dragstart="dragStart"
                @dragover.stop
                draggable="true"
                data-ship-length="3"
                data-ship-type="Destroyer"
              >
                <p>Destroyer</p>
              </div>
              <div
                :class="v['patrol_boat']  ? 'patrol_boat_vImg' : 'patrol_boatImg' "
                @click="turnShip($event, 'patrol_boat')"
                id="patrol_boat"
                @dragstart="dragStart"
                @dragover.stop
                draggable="true"
                data-ship-length="4"
                data-ship-type="patrol_boat"
              >
                <p>Patrol Boat</p>
              </div>
              <div
                :class="v['Carrier']  ? 'Carrier_vImg' : 'CarrierImg' "
                @click="turnShip($event, 'Carrier')"
                id="Carrier"
                @dragstart="dragStart"
                @dragover.stop
                draggable="true"
                data-ship-length="5"
                data-ship-type="Carrier"
              >
                <p>Carrier</p>
              </div>
            </div>
          </div>
        </div>

        <div class="theg">
          <div class="firstGri">
            <h4>My Ships:</h4>
            <button @click="sendBoats">Send Ships</button>
            <div>
              <div class="flex-grid">
                <div v-for="num in rows" :key="num" class="grid-colum">{{num}}</div>
              </div>

              <div
                @dragover.prevent
                @drop.prevent="dropp"
                :id="id"
                v-for="char in cols"
                :key="char"
                class="flex-grid"
              >
                <div v-for="(num, index) in rows" :key="char+num" class="grid-row" :id="char+num">
                  <span v-if="index == 0">{{char}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="inbet">
            <div v-for="(type,i) in this.shipInf" :key="i" :id="type.type + 'FLOAT'">
              <p>{{type.type}}</p>
            </div>
          </div>

          <div class="secondGri">
            <h4>Shots:</h4>
            <button @click="sendSalvos">Shoot!</button>
            <div>
              <div class="flex-grid">
                <div v-for="num in rows" :key="num" class="grid-colum">{{num}}</div>
              </div>

              <div v-for="character in cols" :key="character" class="flex-grid">
                <div
                  v-for="number in rows"
                  :key="character+number"
                  class="grid-row"
                  :id="character + number +'s'"
                  @click="placeSalvos(character + number)"
                >
                  <span>{{character + number}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Tester",
  props: ["id", "draggable"],
  computed: {
    ...mapGetters(["shipLocations"])
  },
  data() {
    return {
      // true means it is horizontal
      dialogDropOnShip: false,
      dialogDrop: false,
      dialogTurn: false,
      dialogTurnOnShip: false,
      dialogSalvo: false,
      dialogSalvoGrid: false,
      dialogDrag: false,
      shipInf: [
        { type: "fish_raft", locations: [] },
        { type: "Submarine", locations: [] },
        { type: "patrol_boat", locations: [] },
        { type: "Destroyer", locations: [] },
        { type: "Carrier", locations: [] }
      ],
      counter: 0,
      myLocations: [],
      opponentLoc: [],
      salvoInf: [],
      rows: ["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      cols: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      v: {
        patrol_boat: true,
        fish_raft: true,
        Destroyer: true,
        Submarine: true,
        Carrier: true
      }
    };
  },
  watch: {
    dialogDrop(val) {
      if (!val) return;
      setTimeout(() => (this.dialogDrop = false), 3000);
    },
    dialogTurn(val) {
      if (!val) return;
      setTimeout(() => (this.dialogTurn = false), 3000);
    },
    dialogTurnOnShip(val) {
      if (!val) return;
      setTimeout(() => (this.dialogTurnOnShip = false), 3000);
    },
    dialogSalvo(val) {
      if (!val) return;
      setTimeout(() => (this.dialogSalvo = false), 3000);
    },
    dialogSalvoGrid(val) {
      if (!val) return;
      setTimeout(() => (this.dialogSalvoGrid = false), 3000);
    },
    dialogDropOnShip(val) {
      if (!val) return;
      setTimeout(() => (this.dialogDropOnShip = false), 3000);
    },
    getGameView() {
      setTimeout(() => {
        this.myLocations = [];
        for (let i = 0; i < this.getGameView.Ship.length; i++) {
          let shipLocation = this.getGameView.Ship[i].Locations;
          let shipType = this.getGameView.Ship[i].Type;
          for (let j = 0; j < shipLocation.length; j++) {
            document
              .getElementById(shipLocation[j])
              .classList.add(shipType.replace(/\s/g, ""));
            this.myLocations.push(shipLocation[j]);
          }
        }
        //users shots
        for (let i = 0; i < this.getGameView.mySalvo.length; i++) {
          let mySalvo = this.getGameView.mySalvo[i].Location;
          for (let j = 0; j < mySalvo.length; j++) {
            document.getElementById(mySalvo[j] + "s").classList.add("myShots");
          }
        }
        //opponent shots
        for (let i = 0; i < this.getGameView.oppSalvo.length; i++) {
          let oppSalvo = this.getGameView.oppSalvo[i].Location;
          for (let j = 0; j < oppSalvo.length; j++) {
            document.getElementById(oppSalvo[j]).style.background = "yellow";
            this.opponentLoc.push(oppSalvo[j]);
          }
        }
        //hits by opponent
        for (let i = 0; i < this.myLocations.length; i++) {
          for (let j = 0; j < this.opponentLoc.length; j++) {
            if (this.myLocations[i] == this.opponentLoc[j]) {
              document.getElementById(this.opponentLoc[j]).style.background =
                "orange";
            }
          }
        }

        for (let i = 0; i < this.getGameView.sunkShips.sunk.length; i++) {
          let sunk = this.getGameView.sunkShips.sunk[i].replace(/\s/g, "");
          let keys = Object.keys(this.v);
          for (let j = 0; j < keys.length; j++) {
            let ships = keys[j];
            if (sunk == ships) {
              document
                .getElementById(sunk + "FLOAT")
                .classList.add(sunk + "RIP");
            }
          }
        }
      });
    }
  },
  computed: {
    ...mapGetters(["getGameView", "getShips", "getGames"]),
    getPos() {
      return this.v;
    }
  },
  methods: {
    ...mapActions(["addShips", "addSalvos"]),

    sendBoats() {
      //console.log(this.shipInf);
      return this.$store.dispatch("addShips", {
        gpId: this.id,
        ships: this.shipInf
      });
      //console.log(this.shipInf);
    },
    sendSalvos() {
      this.$store.dispatch("addSalvos", {
        gpId: this.id,
        salvos: this.salvoInf
      });
      //console.log(this.salvoInf);

      this.salvoInf = [];
      // console.log(this.salvoInf);
    },
    dragStart(e) {
      console.log("started");
      let target = e.target;
      e.dataTransfer.setData("boat_id", target.id);
      this.counter = 0;
    },
    dropp(e) {
      console.log("dropped");
      let boat_id = e.dataTransfer.getData("boat_id");
      let boat = document.getElementById(boat_id);

      if (this.turnRules(boat_id, e.target)) {
        this.shipRules(boat_id, e.target);
      } else {
        this.dialogDropOnShip = true;
        // console.log("can't drop here");
      }
    },
    placeSalvos(cell) {
      if (document.getElementById(cell + "s").id.length > 2) {
        if (document.getElementById(cell + "s").classList.contains("myShots")) {
          console.log("You cannot shoot same cell twice");
        } else {
          if (this.salvoInf.includes(cell)) {
            document.getElementById(cell + "s").classList.remove("shotsDone");
            this.salvoInf.splice(this.salvoInf.indexOf(cell), 1);
          } else {
            if (this.salvoInf.length < 5) {
              document.getElementById(cell + "s").classList.add("shotsDone");
              this.salvoInf.push(cell);
            } else {
              this.dialogSalvo = true;
              console.log("You already put all 5 ships.");
            }
          }
        }
      } else {
        this.dialogSalvoGrid = true;
        console.log("You can only shoot on the table");
      }
      //console.log(this.salvoInf);
    },
    locationKnow(shipType, gridId) {
      let positionOnG = [];
      let ship = document.getElementById(shipType);
      let number = Number(gridId.id.substring(1));
      let char = gridId.id.substring(0, 1);

      if (this.v[shipType]) {
        for (let i = 0; i < ship.dataset.shipLength; i++) {
          positionOnG.push(char + (number + i));
          //console.log(positionOnG);
          //console.log(shipType);
          //console.log(ship.dataset.shipLength);
        }
      } else {
        for (let j = 0; j < ship.dataset.shipLength; j++) {
          positionOnG.push(
            String.fromCharCode(char.charCodeAt(0) + j) + number
          );
        }
      }
      //console.log(positionOnG);

      this.shipInf.forEach(boat => {
        if (boat.type == ship.dataset.shipType) {
          boat.locations = positionOnG;
        }
      });
      //console.log(this.shipInf);
    },
    turnShip(event, shipType) {
      this.counter = 1;
      let grid = event.toElement.offsetParent.offsetParent;
      let aShip = document.getElementById(shipType);
      let letter = grid.id.substring(0, 1);
      let numbe = Number(grid.id.substring(1));
      let shiplen = aShip.dataset.shipLength;

      if (
        (Number(shiplen) + numbe < 12 && !this.v[shipType]) ||
        (Number(shiplen) + letter.charCodeAt(0) < 76 && this.v[shipType])
      ) {
        this.v[shipType] = !this.v[shipType];
        if (this.turnRules(shipType, grid)) {
          this.shipRules(shipType, grid);
        } else {
          this.v[shipType] = !this.v[shipType];
          this.dialogTurnOnShip = true; // this one
          console.log("Not allowed to turn");
        }
      } else {
        this.dialogTurn = true;
        console.log("You cannot turn");
      }
    },
    turnRules(shipType, gridId) {
      let aShip = document.getElementById(shipType);
      let letter = gridId.id.substring(0, 1);
      let numbe = Number(gridId.id.substring(1));
      let shiplen = aShip.dataset.shipLength;
      let canTurn = true;

      for (let i = this.counter; i < shiplen; i++) {
        if (this.v[shipType]) {
          this.shipInf.forEach(shipInfo => {
            if (shipInfo.locations.includes(letter + (numbe + i))) {
              console.log("Not allowed Horizontal");
              canTurn = false;
            }
          });
        } else {
          this.shipInf.forEach(shipInfo => {
            if (
              shipInfo.locations.includes(
                String.fromCharCode(letter.charCodeAt(0) + i) + numbe
              )
            ) {
              console.log("Not allowed Vertical");
              canTurn = false;
            }
          });
        }
      }

      return canTurn;
    },
    shipRules(shipType, gridId) {
      // main rules of drag and drop
      let ship = document.getElementById(shipType);
      let letter = gridId.id.substring(0, 1);
      let numbe = Number(gridId.id.substring(1));
      let shiplen = ship.dataset.shipLength;
      let shipTap = ship.dataset.shipType;

      if (numbe + Number(shiplen) < 12 && numbe != 0 && this.v[shipType]) {
        ship.style.display = "block";
        ship.style.position = "absolute";
        gridId.appendChild(ship);
        this.locationKnow(shipType, gridId);
      } else if (
        Number(letter.charCodeAt(0)) + Number(shiplen) <= 75 &&
        numbe != 0 &&
        !this.v[shipType]
      ) {
        ship.style.display = "block";
        ship.style.position = "absolute";
        gridId.appendChild(ship);
        this.locationKnow(shipType, gridId);
      } else {
        this.dialogDrop = true;
        console.log("cannot place a ship there");
      }
    }
  }
};
</script>

<style>
.flex-grid,
.all-grid,
.theg {
  display: flex;
}
#dragId {
  padding-right: 40px;
  display: flex;
  min-width: 20%;
}
.grid-colum {
  display: inline-grid;
  border: 1px solid black;
  padding: 10px;
  font-size: 15px;
  text-align: center;
  width: 40px;
  height: 40px;
}

.grid-row {
  display: inline-grid;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  padding: 10px;
  font-size: 15px;
  text-align: center;
  width: 40px;
  height: 40px;
  /*maybe remove relative */
  position: relative;
}
#first_ship,
#second_ship,
#third_ship,
#fourth_ship,
#fifth_ship {
  padding-bottom: 30px;
  padding-top: 30px;
}
.inbet {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-top: 50px;
  padding-left: 40px;
}
.secondGri,
.firstGri {
  padding-top: 60px;
  padding-left: 50px;
}
.displayShep {
  outline-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  padding-right: 60px;
  padding-top: 150px;
  flex-direction: column;
}
.shotsDone {
  background: purple;
}
#CarrierRIP,
#DestroyerRIP,
#SubmarineRIP,
#patrol_boatRIP,
#fish_raftRIP {
  text-decoration: line-through;
  color: red;
}

.Submarine {
  background: blue;
}
.SubmarineImg {
  display: block;
  background: blue;
  z-index: 1;
  height: 116px;
  width: 32px;
  top: 0;
}
.Submarine_vImg {
  display: block;
  background: blue;
  z-index: 1;
  height: 32px;
  width: 116px;
}
.Destroyer {
  background: pink;
}
.DestroyerImg {
  display: block;
  background: pink;
  z-index: 1;
  height: 116px;
  width: 32px;
  top: 0;
}
.Destroyer_vImg {
  display: block;
  background: pink;
  z-index: 1;
  height: 32px;
  width: 116px;
}
.Carrier {
  background: coral;
}
.CarrierImg {
  display: block;
  background: coral;
  z-index: 1;
  height: 192px;
  width: 32px;
  top: 0;
}
.Carrier_vImg {
  display: block;
  /*background-image: url("../assets/PatrolHull_horizont.png");*/
  background-color: coral;
  z-index: 1;
  height: 32px;
  width: 192px;
}
.patrol_boat {
  background: darkorchid;
}
.patrol_boatImg {
  display: block;
  background: darkorchid;
  z-index: 1;
  height: 155px;
  width: 32px;
  top: 0;
}
.patrol_boat_vImg {
  display: block;
  background: darkorchid;
  z-index: 1;
  height: 32px;
  width: 155px;
}
.fish_raft {
  background: darkred;
}
.fish_raftImg {
  display: block;
  background: darkred;
  z-index: 1;
  height: 76px;
  width: 32px;
  top: 0;
}
.fish_raft_vImg {
  display: block;
  background: darkred;
  z-index: 1;
  width: 76px;
  height: 32px;
}
.myShots {
  background: red;
}
.paint2 {
  background: red;
}
.vs {
  padding-right: 10px;
  padding-left: 10px;
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
.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  line-height: 150px;
  height: 150px;
}
.topnav a:hover {
  background-color: #ddd;
  color: black;
}
.topnav a.active {
  background-color: #4caf50;
  color: white;
}
</style>