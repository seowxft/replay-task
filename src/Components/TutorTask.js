import React from "react";
import { withRouter } from "react-router-dom";
import { DATABASE_URL } from "./config";

// import tutStruct from "./tutorialStruct/struct_1.json";
// import Struct from "./StructImport.js";
// import StructToRender from "./Main.js";

import shuttle1 from "./img/shuttle_green.png";
import shuttle2 from "./img/shuttle_blue.png";

import astrodude from "./img/astro_3.png";
import counter from "./img/shuttle_red.png";
import coin from "./img/coin.png";

import stateHolder1 from "./img/quest_holder1.png";
import stateHolder2 from "./img/quest_holder2.png";

import styles from "./style/taskStyle.module.css";

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// GLOBAL FUNCTIONS

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var isArray =
  Array.isArray ||
  function (value) {
    return {}.toString.call(value) !== "[object Array]";
  };

function shuffleSame() {
  var arrLength = 0;
  var argsLength = arguments.length;
  var rnd, tmp, argsIndex;

  for (var index = 0; index < argsLength; index += 1) {
    if (!isArray(arguments[index])) {
      throw new TypeError("Argument is not an array.");
    }

    if (index === 0) {
      arrLength = arguments[0].length;
    }

    if (arrLength !== arguments[index].length) {
      throw new RangeError("Array lengths do not match.");
    }
  }

  while (arrLength) {
    rnd = Math.round(Math.random() * arrLength);
    arrLength -= 1;
    for (argsIndex = 0; argsIndex < argsLength; argsIndex += 1) {
      tmp = arguments[argsIndex][arrLength];
      arguments[argsIndex][arrLength] = arguments[argsIndex][rnd];
      arguments[argsIndex][rnd] = tmp;
    }
  }
}

function getOutPos1() {
  var num = Math.random();
  if (num < 0.33) return 1;
  //probability 0.3
  else return 0; //probability 0.1
}

function getOutPos2() {
  var num = Math.random();
  if (num < 0.5) return 1;
  //probability 0.5
  else return 2; //probability 0.5
}

function getRandomInt(min, max) {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);

  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function pathToGo(probability) {
  var num = Math.random();
  if (num < probability) return 1;
  else return 0;
}

//////////////////////////////////////////////////////////////////////////////
//random the tutorial struct_1
// var randNum = "struct_" + getRandomInt(0, 2);
// var tutStruct = Struct[randNum];

var shuttle = [shuttle1, shuttle2];
var shuttleWord = ["green", "blue"];
shuffleSame(shuttle, shuttleWord);

shuttle = shuttle.filter(function (val) {
  return val !== undefined;
});

shuttleWord = shuttleWord.filter(function (val) {
  return val !== undefined;
});

var shuttleIndex = [0, 1]; //0 - safe, 1 - risky
var cueOutPosIndx = [0, 1, 2]; //0-- top, 1 - middle, 2 - bottom
var cueShutPosIndx = [0, 1]; //0 - left, 1 - right
var paths = [1, 2, 3];

var forcedPaths = [1, 2, 3];
shuffle(forcedPaths);

//////////////////////////////////
// Variables for tutorial
//tutStruct 0-2: values, 3-5: probability, 6-8: EVs, 9: risky EV, 10: safe - risky EV, 11: optimal answer (1:safe, 2: risky)
// const StructToRender = getMarkdown(1);
// var tutSafePathOutcome = StructToRender[0];
// var tutRiskyPathOutcome1 = StructToRender[1];
// var tutRiskyPathOutcome2 = StructToRender[2];
//
// var tutSafePathProb = StructToRender[3];
// var tutRiskyPathProb1 = StructToRender[4];
// var tutRiskyPathProb2 = StructToRender[5];
//
// var tutOptChoice = StructToRender[11];

// var StructToRender = "";
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// REACT COMPONENT START
class TutorTask extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.location.state.userID;
    const date = this.props.location.state.date;
    const startTime = this.props.location.state.startTime;

    const outcomePic = this.props.location.state.outcomePic;
    const outcomeWord = this.props.location.state.outcomeWord;
    const outcomeVal = this.props.location.state.outcomeVal; //[1, -1, 0];
    const outcomeIndx = this.props.location.state.outcomeIndx; // [0, 1, 2];

    const stateWord = this.props.location.state.stateWord;
    const statePic = this.props.location.state.statePic;
    const stateIndx = this.props.location.state.stateIndx; //[0, 1, 2, 3, 4, 5, 6, 7, 8];

    const pathOne = this.props.location.state.pathOne; //[0, 1, 2];
    const pathTwo = this.props.location.state.pathTwo; //[3, 4, 5];
    const pathThree = this.props.location.state.pathThree; //[6, 7, 8];

    var currentDate = new Date(); // maybe change to local
    var timeString = currentDate.toTimeString();

    /////////////////////////////////////////////////////////////////////////////////
    // SET COMPONENT STATES
    this.state = {
      userID: userID,
      date: date,
      startTime: startTime,
      sectionTime: timeString,

      taskSessionTry: 1,
      taskSession: "tutorial",
      instructScreenText: 1,

      shuttle: shuttle,
      shuttleWord: shuttleWord,
      instructScreen: true,
      taskScreen: false,

      trialTotal: 9, //6 are free choice
      trialForced: 3, //3 of the trials are forced choice
      trialNum: 0,
      trialTime: 0,
      trialRT: 0,
      trialKeypress: 0,
      trialScore: 0,

      shuttleChoice: 0, //1 or 2
      stateWord: stateWord,
      statePic: statePic,
      stateIndx: stateIndx,
      stateNum: 0,
      stateShown: null,
      stateDur: 2000,
      outcomeDur: 2500,
      stateHolder: [stateHolder1, stateHolder2],

      outcomePic: outcomePic,
      outcomeWord: outcomeWord,
      outcomeVal: outcomeVal,
      outcomeIndx: outcomeIndx,

      coins: 0, //this is basically trialScore but long running tally..

      choice1Fade: styles.shuttleChoice,
      choice2Fade: styles.shuttleChoice,

      pathPlay: false,
      pathProb: 0,
      keyChoice: 0, //press left or right

      shuttleIndex: shuttleIndex,
      cueOutPosIndx: cueOutPosIndx,
      cueShutPosIndx: cueShutPosIndx,
      paths: paths,
      pathOne: pathOne,
      pathTwo: pathTwo,
      pathThree: pathThree,
      pathRoute: [],
      forcedPaths: forcedPaths,

      // tutSafePathOutcome: tutSafePathOutcome,
      // tutRiskyPathOutcome1: tutRiskyPathOutcome1,
      // tutRiskyPathOutcome2: tutRiskyPathOutcome2,
      //
      // tutSafePathProb: tutSafePathProb,
      // tutRiskyPathProb1: tutRiskyPathProb1,
      // tutRiskyPathProb2: tutRiskyPathProb2,
      // tutOptChoice: tutOptChoice,

      tutOutcomeValue: null,
      tutForcedChoiceText1: [],
      tutForcedChoiceText2: [],

      StructToRender: "",
      debug: false,
    };

    this.handleInstructLocal = this.handleInstructLocal.bind(this);
    this.handleDebugKeyLocal = this.handleDebugKeyLocal.bind(this);
    this.taskStart = this.taskStart.bind(this);

    /* prevents page from going down when space bar is hit .*/
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    });
  }
  /////////////////////////////////////////////////////////////////////////////////
  // END COMPONENT STATE

  componentDidMount = () => {
    window.scrollTo(0, 0);

    var randNum = "struct_" + getRandomInt(1, 5);
    var StructToRender = require("./tutorialStruct/" + randNum + ".json");

    var tutSafePathOutcome = StructToRender[0];
    var tutRiskyPathOutcome1 = StructToRender[1];
    var tutRiskyPathOutcome2 = StructToRender[2];

    var tutSafePathProb = StructToRender[3];
    var tutRiskyPathProb1 = StructToRender[4];
    var tutRiskyPathProb2 = StructToRender[5];

    var tutOptChoice = StructToRender[11];

    this.setState({
      structNum: randNum,
      StructToRender: StructToRender,
      tutSafePathOutcome: tutSafePathOutcome,
      tutRiskyPathOutcome1: tutRiskyPathOutcome1,
      tutRiskyPathOutcome2: tutRiskyPathOutcome2,

      tutSafePathProb: tutSafePathProb,
      tutRiskyPathProb1: tutRiskyPathProb1,
      tutRiskyPathProb2: tutRiskyPathProb2,
      tutOptChoice: tutOptChoice,
    });
  };

  handleInstructLocal(key_pressed) {
    var curText = this.state.instructScreenText;
    var whichButton = key_pressed;

    if (whichButton === 4 && curText > 1 && curText <= 8) {
      this.setState({ instructScreenText: curText - 1 });
    } else if (whichButton === 5 && curText < 8) {
      this.setState({ instructScreenText: curText + 1 });
    } else if (curText === 8 && whichButton === 10) {
      //startmissionThree
      setTimeout(
        function () {
          this.missionThree();
        }.bind(this),
        0
      );
    } else if (curText === 9 && whichButton === 10) {
      //startmissionThree
      setTimeout(
        function () {
          this.missionCont();
        }.bind(this),
        0
      );
    } else if (curText === 10 && whichButton === 10) {
      //startmissionThree
      setTimeout(
        function () {
          this.nextMission();
        }.bind(this),
        0
      );
    }
  }

  // handle key key_pressed
  _handleInstructKey = (event) => {
    var key_pressed;

    switch (event.keyCode) {
      case 37:
        //    this is left arrow
        key_pressed = 4;
        this.handleInstructLocal(key_pressed);
        break;
      case 39:
        //    this is right arrow
        key_pressed = 5;
        this.handleInstructLocal(key_pressed);
        break;
      case 32:
        //    this is SPACEBAR
        key_pressed = 10;
        this.handleInstructLocal(key_pressed);
        break;
      default:
    }
  };

  _handleTaskKey = (event) => {
    var pressed;
    var time_pressed;

    switch (event.keyCode) {
      case 37:
        //    this is left arrow
        pressed = 1;
        time_pressed = Math.round(performance.now());
        this.taskCheck(pressed, time_pressed);
        break;
      case 39:
        //    this is right arrow
        pressed = 2;
        time_pressed = Math.round(performance.now());
        this.taskCheck(pressed, time_pressed);
        break;
      default:
    }
  };

  handleDebugKeyLocal(pressed) {
    var whichButton = pressed;

    if (whichButton === 10) {
      setTimeout(
        function () {
          this.nextMission();
        }.bind(this),
        0
      );
    }
  }

  _handleDebugKey = (event) => {
    var pressed;

    switch (event.keyCode) {
      case 32:
        //    this is SPACEBAR
        pressed = 10;
        this.handleDebugKeyLocal(pressed);
        break;
      default:
    }
  };

  // function to play choice feedback, and then go play path
  taskCheck(pressed, time_pressed) {
    var trialRT = time_pressed - this.state.trialTime;
    var keyChoice = pressed;
    var choice1Fade = this.state.choice1Fade;
    var choice2Fade = this.state.choice2Fade;
    var trialNum = this.state.trialNum;
    var pathRoute = this.state.pathRoute;
    var pathProb;

    var pathTrans;
    var outcome;
    var pathIndx;
    var ShuttlePos = this.state.ShuttlePos; //[0,1] means safe/risky vs [0,1] means risky, safe
    var pathProbEnd;
    // if choose left
    if (keyChoice === 1) {
      choice1Fade = styles.shuttleChoice;
      choice2Fade = styles.shuttleChoiceFade;

      if (ShuttlePos[0] === 0) {
        //I choose the safe choice
        pathRoute = this.state.SafePath;
        outcome = this.state.tutSafePathOutcome[trialNum - 1];
        pathIndx = 1;
        pathProb = 1;
        pathProbEnd = 1;
      } else if (ShuttlePos[0] === 1) {
        //I choose the risky choice
        //Then Let's roll on the probability
        pathProb = this.state.tutRiskyPathProb2[trialNum - 1]; //this is the smaller prob

        pathTrans = pathToGo(pathProb); // 0 (Risk1) or 1 (Risk2)

        pathIndx = 2;

        if (pathTrans === 0) {
          pathRoute = this.state.RiskyPath1;
          outcome = this.state.tutRiskyPathOutcome1[trialNum - 1];
          pathProbEnd = this.state.tutRiskyPathProb1[trialNum - 1];
        } else if (pathTrans === 1) {
          pathRoute = this.state.RiskyPath2;
          outcome = this.state.tutRiskyPathOutcome2[trialNum - 1];
          pathProbEnd = this.state.tutRiskyPathProb2[trialNum - 1];
        }
      }
      //if choose right
    } else if (keyChoice === 2) {
      choice1Fade = styles.shuttleChoiceFade;
      choice2Fade = styles.shuttleChoice;

      if (ShuttlePos[1] === 0) {
        //I choose the safe choice
        pathRoute = this.state.SafePath;
        outcome = this.state.tutSafePathOutcome[trialNum - 1];
        pathIndx = 1;
        pathProb = 1;
        pathProbEnd = 1;
      } else if (ShuttlePos[1] === 1) {
        //I choose the risky choice
        //Then Let's roll on the probability
        pathProb = this.state.tutRiskyPathProb2[trialNum - 1]; //this is the smaller prob
        pathTrans = pathToGo(pathProb); // 0 (Risk1) or 1 (Risk2)
        pathIndx = 2;

        if (pathTrans === 0) {
          pathRoute = this.state.RiskyPath1;
          outcome = this.state.tutRiskyPathOutcome1[trialNum - 1];
          pathProbEnd = this.state.tutRiskyPathProb1[trialNum - 1];
        } else if (pathTrans === 1) {
          pathRoute = this.state.RiskyPath2;
          outcome = this.state.tutRiskyPathOutcome2[trialNum - 1];
          pathProbEnd = this.state.tutRiskyPathProb2[trialNum - 1];
        }
      }
    } else {
      //if neither left or right, then nothing happens
      console.log("Choice not made.");
    }

    // console.log("tutOptChoice " + this.state.tutOptChoice[trialNum - 1]);
    if (
      trialNum <= this.state.trialForced &&
      pathIndx !== this.state.tutOptChoice[trialNum - 1]
    ) {
      //if the trial the forced, keyChoice has to be the same as the dictated asnwer, else it wil not move on
    } else {
      // free choice trials

      this.setState({
        trialRT: trialRT,
        keyChoice: keyChoice,
        choice1Fade: choice1Fade,
        choice2Fade: choice2Fade,
        pathProb: pathProb,
        pathProbEnd: pathProbEnd,

        pathRoute: pathRoute,
        outcome: outcome,
        pathIndx: pathIndx,
      });

      setTimeout(
        function () {
          this.playStateOne();
        }.bind(this),
        500
      );
    }
  }

  missionThree() {
    var trialTime = Math.round(performance.now());

    this.setState({
      pathPlay: false,
      trialNum: 0,
      trialTime: trialTime,
      trialRT: 0,
      trialKeypress: 0,
      trialScore: 0,
    });

    setTimeout(
      function () {
        this.setTrialVar();
      }.bind(this),
      0
    );
  }

  missionCont() {
    var trialTime = Math.round(performance.now());

    this.setState({
      instructScreen: false,
      taskScreen: true,
      pathPlay: false,
      trialTime: trialTime,
    });

    setTimeout(
      function () {
        this.setTrialVar();
      }.bind(this),
      0
    );
  }

  setTrialVar() {
    // decide Left/Right position for shuttle option (I should save this later)
    var trialTime = Math.round(performance.now());
    var trialNum = this.state.trialNum + 1;
    var cueShutPosIndx = this.state.cueShutPosIndx; //0,1
    shuffle(cueShutPosIndx);

    // decide top/mid/bot position for outcome cues
    var cueOutPosIndx = this.state.cueOutPosIndx; //0,1,2
    shuffle(cueOutPosIndx);

    // decide which paths are which options
    var paths = this.state.paths; //1,2,3
    shuffle(paths);

    var tutSafePathOutcome = this.state.tutSafePathOutcome[trialNum - 1];
    var tutRiskyPathOutcome1 = this.state.tutRiskyPathOutcome1[trialNum - 1];
    var tutRiskyPathOutcome2 = this.state.tutRiskyPathOutcome2[trialNum - 1];

    var tutSafePathProb = this.state.tutSafePathProb[trialNum - 1];
    var tutRiskyPathProb1 = this.state.tutRiskyPathProb1[trialNum - 1];
    var tutRiskyPathProb2 = this.state.tutRiskyPathProb2[trialNum - 1];

    var tutForcedChoiceText1 = this.state.tutForcedChoiceText1;
    var tutForcedChoiceText2 = this.state.tutForcedChoiceText2;

    var tutOptChoice = this.state.tutOptChoice[trialNum - 1]; //[1 -safe or 2 - risky]

    var SafePath;
    var RiskyPath1;
    var RiskyPath2;

    var choice1Fade = this.state.choice1Fade;
    var choice2Fade = this.state.choice2Fade;

    var pathProbBoth;

    if (trialNum <= this.state.trialForced) {
      //if it is a forced choice then the safe path will play each of the paths twice
      var forcedPath = this.state.forcedPaths[trialNum - 1];

      if (forcedPath === 1) {
        SafePath = this.state.pathOne;
        RiskyPath1 = this.state.pathTwo;
        RiskyPath2 = this.state.pathThree;
      } else if (forcedPath === 2) {
        SafePath = this.state.pathTwo;
        RiskyPath1 = this.state.pathOne;
        RiskyPath2 = this.state.pathThree;
      } else if (forcedPath === 3) {
        SafePath = this.state.pathThree;
        RiskyPath1 = this.state.pathTwo;
        RiskyPath2 = this.state.pathOne;
      }
    } else {
      // shuffle the paths - this is random when not a forced choice
      if ((paths[0] === 1) & (paths[1] === 2) & (paths[2] === 3)) {
        //this means safe is spaceship 1, risky 1 is spaceship 2 and risky 2 is spaceship 3
        SafePath = this.state.pathOne;
        RiskyPath1 = this.state.pathTwo;
        RiskyPath2 = this.state.pathThree;
      } else if ((paths[0] === 1) & (paths[1] === 3) & (paths[2] === 2)) {
        SafePath = this.state.pathOne;
        RiskyPath1 = this.state.pathThree;
        RiskyPath2 = this.state.pathTwo;
      } else if ((paths[0] === 2) & (paths[1] === 1) & (paths[2] === 3)) {
        SafePath = this.state.pathTwo;
        RiskyPath1 = this.state.pathOne;
        RiskyPath2 = this.state.pathThree;
      } else if ((paths[0] === 2) & (paths[1] === 3) & (paths[2] === 1)) {
        SafePath = this.state.pathTwo;
        RiskyPath1 = this.state.pathThree;
        RiskyPath2 = this.state.pathOne;
      } else if ((paths[0] === 3) & (paths[1] === 1) & (paths[2] === 2)) {
        SafePath = this.state.pathThree;
        RiskyPath1 = this.state.pathOne;
        RiskyPath2 = this.state.pathTwo;
      } else if ((paths[0] === 3) & (paths[1] === 2) & (paths[2] === 1)) {
        SafePath = this.state.pathThree; //[6,7,8]
        RiskyPath1 = this.state.pathTwo; //[3,4,5]
        RiskyPath2 = this.state.pathOne; //[0,1,2]
      }
    }
    //shuttle Pic is either first (0) or second (1) state, with 33% probability for the latter
    var SafeRand1 = getOutPos1();
    var SafeRand2;
    if (SafeRand1 === 1) {
      SafeRand2 = 2; //if it is the second state, then only the third state can be the outcome Pic
    } else {
      SafeRand2 = getOutPos2(); //if it is the first state, then second OR third state can be the outcome Pic
    }

    // the shuttlePic can be the first or second state, while the path outcome can be the second or third state
    var SafePathShuttlePic = SafePath[SafeRand1];
    var SafePathOutPic = SafePath[SafeRand2];

    var Risky1Rand1 = getOutPos1();
    var Risky1Rand2;
    if (Risky1Rand1 === 1) {
      Risky1Rand2 = 2; //if it is the second state, then only the third state can be the outcome Pic
    } else {
      Risky1Rand2 = getOutPos2(); //if it is the first state, then second OR third state can be the outcome Pic
    }

    var RiskyPath1ShuttlePic = RiskyPath1[Risky1Rand1];
    var RiskyPath1OutPic = RiskyPath1[Risky1Rand2];

    var Risky2Rand1 = getOutPos1();
    var Risky2Rand2;
    if (Risky2Rand1 === 1) {
      Risky2Rand2 = 2; //if it is the second state, then only the third state can be the outcome Pic
    } else {
      Risky2Rand2 = getOutPos2(); //if it is the first state, then second OR third state can be the outcome Pic
    }

    var RiskyPath2ShuttlePic = RiskyPath2[Risky2Rand1];
    var RiskyPath2OutPic = RiskyPath2[Risky2Rand2];

    // shuffle the shuttle option
    var Prob1;
    var Prob2;
    var Shuttle1;
    var Shuttle2;
    var Shuttle1Word;
    var Shuttle2Word;
    var ShuttlePicWord;

    if (cueShutPosIndx[0] === 0) {
      //safe one is left choice
      Prob1 = tutSafePathProb * 100 + "%";
      Prob2 = tutRiskyPathProb1 * 100 + "%/" + tutRiskyPathProb2 * 100 + "%";

      pathProbBoth = [Prob1, Prob2];
      Shuttle1 = this.state.shuttle[0];
      Shuttle2 = this.state.shuttle[1];
      ShuttlePicWord = [this.state.shuttleWord[0], this.state.shuttleWord[1]];
      Shuttle1Word = this.state.stateWord[SafePathShuttlePic];
      Shuttle2Word =
        this.state.stateWord[RiskyPath1ShuttlePic] +
        "/" +
        this.state.stateWord[RiskyPath2ShuttlePic];

      if (trialNum <= this.state.trialForced && tutOptChoice === 1) {
        tutForcedChoiceText1 = "Let us take the reliable shuttle.";
        tutForcedChoiceText2 = "[Press the ← key]";
        choice1Fade = styles.shuttleChoice;
        choice2Fade = styles.shuttleChoiceFade;
      } else if (trialNum <= this.state.trialForced && tutOptChoice === 2) {
        tutForcedChoiceText1 = "Let us take the unreliable shuttle.";
        tutForcedChoiceText2 = "[Press the → key]";
        choice1Fade = styles.shuttleChoiceFade;
        choice2Fade = styles.shuttleChoice;
      } else {
        tutForcedChoiceText1 = [];
        tutForcedChoiceText2 = "[Press the ← or → key to choose]";
        choice1Fade = styles.shuttleChoice;
        choice2Fade = styles.shuttleChoice;
      }
    } else if (cueShutPosIndx[0] === 1) {
      Prob1 = tutRiskyPathProb1 * 100 + "%/" + tutRiskyPathProb2 * 100 + "%";
      Prob2 = tutSafePathProb * 100 + "%";
      pathProbBoth = [Prob1, Prob2];

      Shuttle1 = this.state.shuttle[1];
      Shuttle2 = this.state.shuttle[0];

      ShuttlePicWord = [this.state.shuttleWord[1], this.state.shuttleWord[0]];
      Shuttle1Word =
        this.state.stateWord[RiskyPath1ShuttlePic] +
        "/" +
        this.state.stateWord[RiskyPath2ShuttlePic];
      Shuttle2Word = this.state.stateWord[SafePathShuttlePic];
      //safe one is right choice
      if (trialNum <= this.state.trialForced && tutOptChoice === 1) {
        tutForcedChoiceText1 = "Let us take the reliable shuttle.";
        tutForcedChoiceText2 = "[Press the → key]";
        choice1Fade = styles.shuttleChoiceFade;
        choice2Fade = styles.shuttleChoice;
      } else if (trialNum <= this.state.trialForced && tutOptChoice === 2) {
        tutForcedChoiceText1 = "Let us take the unreliable shuttle.";
        tutForcedChoiceText2 = "[Press the ← key]";
        choice1Fade = styles.shuttleChoice;
        choice2Fade = styles.shuttleChoiceFade;
      } else {
        tutForcedChoiceText1 = [];
        tutForcedChoiceText2 = "[Press the ← or → key to choose]";
        choice1Fade = styles.shuttleChoice;
        choice2Fade = styles.shuttleChoice;
      }
    }

    var neuVal = getRandomInt(1, 5);
    var SafeOut;
    var SafeVal;

    if (tutSafePathOutcome > 0) {
      SafeOut = this.state.outcomeWord[0];
      SafeVal = tutSafePathOutcome / this.state.outcomeVal[0];
    } else if (tutSafePathOutcome < 0) {
      SafeOut = this.state.outcomeWord[1];
      SafeVal = tutSafePathOutcome / this.state.outcomeVal[1];
    } else if (tutSafePathOutcome === 0) {
      //if this is neutral, then random a number
      SafeOut = this.state.outcomeWord[2];
      SafeVal = neuVal;
    }

    var Risky1Out;
    var Risky1Val;
    if (tutRiskyPathOutcome1 > 0) {
      Risky1Out = this.state.outcomeWord[0];
      Risky1Val = tutRiskyPathOutcome1 / this.state.outcomeVal[0];
    } else if (tutRiskyPathOutcome1 < 0) {
      Risky1Out = this.state.outcomeWord[1];
      Risky1Val = tutRiskyPathOutcome1 / this.state.outcomeVal[1];
    } else if (tutRiskyPathOutcome1 === 0) {
      Risky1Out = this.state.outcomeWord[2];
      Risky1Val = neuVal;
    }

    var Risky2Out;
    var Risky2Val;
    if (tutRiskyPathOutcome2 > 0) {
      Risky2Out = this.state.outcomeWord[0];
      Risky2Val = tutRiskyPathOutcome2 / this.state.outcomeVal[0];
    } else if (tutRiskyPathOutcome2 < 0) {
      Risky2Out = this.state.outcomeWord[1];
      Risky2Val = tutRiskyPathOutcome2 / this.state.outcomeVal[1];
    } else if (tutRiskyPathOutcome2 === 0) {
      Risky2Out = this.state.outcomeWord[2];
      Risky2Val = neuVal;
    }

    var OutcomeVal1;
    var OutcomeVal2;
    var OutcomeVal3;
    var OutcomePic1;
    var OutcomePic2;
    var OutcomePic3;
    var LastStatePic1;
    var LastStatePic2;
    var LastStatePic3;
    // outcome cues
    if (
      (cueOutPosIndx[0] === 0) &
      (cueOutPosIndx[1] === 1) &
      (cueOutPosIndx[2] === 2)
    ) {
      //this means safe is spaceship 1, risky 1 is spaceship 2 and risky 2 is spaceship 3
      LastStatePic1 = this.state.stateWord[SafePathOutPic];
      LastStatePic2 = this.state.stateWord[RiskyPath1OutPic];
      LastStatePic3 = this.state.stateWord[RiskyPath2OutPic];
      OutcomePic1 = SafeOut;
      OutcomePic2 = Risky1Out;
      OutcomePic3 = Risky2Out;
      OutcomeVal1 = SafeVal;
      OutcomeVal2 = Risky1Val;
      OutcomeVal3 = Risky2Val;
    } else if (
      (cueOutPosIndx[0] === 0) &
      (cueOutPosIndx[1] === 2) &
      (cueOutPosIndx[2] === 1)
    ) {
      LastStatePic1 = this.state.stateWord[SafePathOutPic];
      LastStatePic2 = this.state.stateWord[RiskyPath2OutPic];
      LastStatePic3 = this.state.stateWord[RiskyPath1OutPic];
      OutcomePic1 = SafeOut;
      OutcomePic2 = Risky2Out;
      OutcomePic3 = Risky1Out;
      OutcomeVal1 = SafeVal;
      OutcomeVal2 = Risky2Val;
      OutcomeVal3 = Risky1Val;
    } else if (
      (cueOutPosIndx[0] === 1) &
      (cueOutPosIndx[1] === 0) &
      (cueOutPosIndx[2] === 2)
    ) {
      LastStatePic1 = this.state.stateWord[RiskyPath1OutPic];
      LastStatePic2 = this.state.stateWord[SafePathOutPic];
      LastStatePic3 = this.state.stateWord[RiskyPath2OutPic];
      OutcomePic1 = Risky1Out;
      OutcomePic2 = SafeOut;
      OutcomePic3 = Risky2Out;
      OutcomeVal1 = Risky1Val;
      OutcomeVal2 = SafeVal;
      OutcomeVal3 = Risky2Val;
    } else if (
      (cueOutPosIndx[0] === 1) &
      (cueOutPosIndx[1] === 2) &
      (cueOutPosIndx[2] === 0)
    ) {
      LastStatePic1 = this.state.stateWord[RiskyPath1OutPic];
      LastStatePic2 = this.state.stateWord[RiskyPath2OutPic];
      LastStatePic3 = this.state.stateWord[SafePathOutPic];
      OutcomePic1 = Risky1Out;
      OutcomePic2 = Risky2Out;
      OutcomePic3 = SafeOut;
      OutcomeVal1 = Risky1Val;
      OutcomeVal2 = Risky2Val;
      OutcomeVal3 = SafeVal;
    } else if (
      (cueOutPosIndx[0] === 2) &
      (cueOutPosIndx[1] === 0) &
      (cueOutPosIndx[2] === 1)
    ) {
      LastStatePic1 = this.state.stateWord[RiskyPath2OutPic];
      LastStatePic2 = this.state.stateWord[SafePathOutPic];
      LastStatePic3 = this.state.stateWord[RiskyPath1OutPic];
      OutcomePic1 = Risky2Out;
      OutcomePic2 = SafeOut;
      OutcomePic3 = Risky1Out;
      OutcomeVal1 = Risky2Val;
      OutcomeVal2 = SafeVal;
      OutcomeVal3 = Risky1Val;
    } else if (
      (cueOutPosIndx[0] === 2) &
      (cueOutPosIndx[1] === 1) &
      (cueOutPosIndx[2] === 0)
    ) {
      LastStatePic1 = this.state.stateWord[RiskyPath2OutPic];
      LastStatePic2 = this.state.stateWord[RiskyPath1OutPic];
      LastStatePic3 = this.state.stateWord[SafePathOutPic];
      OutcomePic1 = Risky2Out;
      OutcomePic2 = Risky1Out;
      OutcomePic3 = SafeOut;
      OutcomeVal1 = Risky2Val;
      OutcomeVal2 = Risky1Val;
      OutcomeVal3 = SafeVal;
    }

    // console.log("text: " + tutForcedChoiceText1);
    // console.log("text: " + tutForcedChoiceText2);
    this.setState({
      Shuttle1Word: Shuttle1Word,
      Shuttle1: Shuttle1,
      Shuttle2Word: Shuttle2Word,
      Shuttle2: Shuttle2,
      ShuttlePicWord: ShuttlePicWord,
      ShuttlePos: cueShutPosIndx,
      Prob1: Prob1,
      Prob2: Prob2,
      LastStatePic1: LastStatePic1,
      LastStatePic2: LastStatePic2,
      LastStatePic3: LastStatePic3,
      OutcomePic1: OutcomePic1,
      OutcomePic2: OutcomePic2,
      OutcomePic3: OutcomePic3,
      OutcomeVal1: OutcomeVal1,
      OutcomeVal2: OutcomeVal2,
      OutcomeVal3: OutcomeVal3,
      SafePath: SafePath,
      RiskyPath1: RiskyPath1,
      RiskyPath2: RiskyPath2,
      neuVal: neuVal, //just for the trual value
      tutForcedChoiceText1: tutForcedChoiceText1,
      tutForcedChoiceText2: tutForcedChoiceText2,
      choice1Fade: choice1Fade,
      choice2Fade: choice2Fade,
      pathPlay: false,
      trialNum: trialNum,
      trialTime: trialTime,
      pathProbBoth: pathProbBoth,
    });

    if (trialNum === 1) {
      this.setState({
        instructScreen: false,
        taskScreen: true,
      });
    }
  }

  taskStart(trialNum) {
    var choice1Fade = this.state.choice1Fade;
    var choice2Fade = this.state.choice2Fade;

    let text = (
      <div className={styles.main}>
        <div className={styles.counter}>
          <img className={styles.counter} src={counter} alt="counter" />
          {this.state.trialNum}/{this.state.trialTotal}
        </div>
        <div className={styles.coins}>
          <img className={styles.counter} src={coin} alt="coin" />
          {this.state.coins}
        </div>
        <p>
          <span className={styles.centerThree}>
            <span className={styles.cueScreen}>
              {this.state.LastStatePic1} - {this.state.OutcomeVal1}&nbsp;
              {this.state.OutcomePic1}
              <br />
              {this.state.LastStatePic2} - {this.state.OutcomeVal2}&nbsp;
              {this.state.OutcomePic2}
              <br />
              {this.state.LastStatePic3} - {this.state.OutcomeVal3}&nbsp;
              {this.state.OutcomePic3}
            </span>
          </span>
          <br />
          <span className={styles.centerThree}>
            <span className={choice1Fade}>
              {this.state.Prob1}
              <br /> {this.state.Shuttle1Word} <br />
              <img
                className={styles.shuttle}
                src={this.state.Shuttle1}
                alt="shuttle1"
              />
            </span>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <span className={choice2Fade}>
              {this.state.Prob2}
              <br /> {this.state.Shuttle2Word} <br />
              <img
                className={styles.shuttle}
                src={this.state.Shuttle2}
                alt="shuttle2"
              />
            </span>
            <br /> <br />
          </span>
          <span className={styles.centerTwo}>
            {this.state.tutForcedChoiceText1}
          </span>
          <span className={styles.centerTwo}>
            {this.state.tutForcedChoiceText2}
          </span>
        </p>
      </div>
    );

    return <div>{text}</div>;
  }

  playStateOne() {
    var pathRoutePic1 = this.state.pathRoute[0]; //[0,1,2] or [3,4,5] or [6,7,8]
    var pathNum;
    var pathPicWord;
    if (pathRoutePic1 === 0) {
      pathNum = 1;
      pathPicWord = [
        this.state.stateWord[0],
        this.state.stateWord[1],
        this.state.stateWord[2],
      ];
    } else if (pathRoutePic1 === 3) {
      pathNum = 2;
      pathPicWord = [
        this.state.stateWord[3],
        this.state.stateWord[4],
        this.state.stateWord[5],
      ];
    } else if (pathRoutePic1 === 6) {
      pathNum = 3;
      pathPicWord = [
        this.state.stateWord[6],
        this.state.stateWord[7],
        this.state.stateWord[8],
      ];
    }

    var statePic;

    if (this.state.trialNum <= this.state.trialForced) {
      statePic = this.state.statePic[pathRoutePic1];
    } else {
      statePic = this.state.stateHolder[0];
    }

    this.setState({
      pathPlay: true,
      stateNum: "Room 1",
      stateShown: statePic,
      pathNum: pathNum,
      tutPathPicWord: pathPicWord,
      outcomeValue: null,
      tutOutcome1: [],
      tutOutcome2: [],
      tutOutcomeValue: null,
    });

    setTimeout(
      function () {
        this.playStateTwo();
      }.bind(this),
      this.state.stateDur
    );
  }

  playStateTwo() {
    var pathRoutePic2 = this.state.pathRoute[1]; //[0,1,2] or [3,4,5] or [6,7,8]
    var statePic;
    if (this.state.trialNum <= this.state.trialForced) {
      statePic = this.state.statePic[pathRoutePic2];
    } else {
      statePic = this.state.stateHolder[1];
    }

    this.setState({
      stateNum: "Room 2",
      stateShown: statePic,
    });

    setTimeout(
      function () {
        this.playStateThree();
      }.bind(this),
      this.state.stateDur
    );
  }

  playStateThree() {
    var pathRoutePic3 = this.state.pathRoute[2]; //[0,1,2] or [3,4,5] or [6,7,8]
    var statePic;
    if (this.state.trialNum <= this.state.trialForced) {
      statePic = this.state.statePic[pathRoutePic3];
    } else {
      statePic = this.state.stateHolder[0];
    }

    this.setState({
      stateNum: "Room 3",
      stateShown: statePic,
    });

    setTimeout(
      function () {
        this.playOutcome();
      }.bind(this),
      this.state.stateDur
    );
  }

  playOutcome() {
    var outcome = this.state.outcome;
    var outcomePic;
    var outcomeValue = this.state.outcomeValue;
    //that is, if it is tutorial, i explictly say the outcome
    var tutOutcome1 = this.state.tutOutcome1;
    var coins = this.state.coins + outcome;
    var tutOutcomeValue = this.state.tutOutcomeValue;
    var outcomeWord;
    var outcomeIndx;

    if (outcome > 0) {
      outcomeIndx = 0;
      outcomeWord = this.state.outcomeWord[0];
      if (this.state.trialNum <= this.state.trialForced) {
        outcomePic = this.state.outcomePic[0];
      } else {
        outcomePic = this.state.stateHolder[1];
      }

      outcomeValue = outcome / this.state.outcomeVal[0];
      tutOutcomeValue = outcomeValue;
      tutOutcome1 = "You gain";
    } else if (outcome < 0) {
      outcomeIndx = 1;
      outcomeWord = this.state.outcomeWord[1];
      if (this.state.trialNum <= this.state.trialForced) {
        outcomePic = this.state.outcomePic[1];
      } else {
        outcomePic = this.state.stateHolder[1];
      }

      outcomeValue = outcome / this.state.outcomeVal[1];
      tutOutcomeValue = outcomeValue;
      tutOutcome1 = "You lose";
    } else if (outcome === 0) {
      outcomeIndx = 2;
      outcomeWord = this.state.outcomeWord[2];
      if (this.state.trialNum <= this.state.trialForced) {
        outcomePic = this.state.outcomePic[2];
      } else {
        outcomePic = this.state.stateHolder[1];
      }
      outcomeValue = this.state.neuVal;
      tutOutcomeValue = outcome;
      tutOutcome1 = "You gain/lose";
    }

    this.setState({
      stateNum: "You find:",
      stateShown: outcomePic,
      outcomeValue: outcomeValue,
      tutOutcome1: tutOutcome1,
      tutOutcomeValue: tutOutcomeValue,
      tutOutcome2: "coin(s)!",
      coins: coins,
      tutOutcomeWord: outcomeWord,
      tutOutcomeIndx: outcomeIndx,
    });

    setTimeout(
      function () {
        this.tutSave();
      }.bind(this),
      0
    );
  }

  tutSave() {
    var userID = this.state.userID;
    var trialForced;
    var trialOutcomeValence;

    if (this.state.outcome === 0) {
      trialOutcomeValence = 0;
    } else {
      trialOutcomeValence = this.state.outcome / this.state.tutOutcomeValue;
    }

    if (this.state.trialNum <= this.state.trialForced) {
      trialForced = true;
    } else {
      trialForced = false;
    }

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime,
      sectionTime: this.state.sectionTime,
      taskSession: this.state.taskSession,
      taskSessionTry: this.state.taskSessionTry,
      trialTime: this.state.trialTime,
      trialNum: this.state.trialNum,
      trialForced: trialForced, // true if it is a forced trial
      trialShuttleWord: [this.state.Shuttle1Word, this.state.Shuttle2Word],
      trialShuttle: this.state.ShuttlePicWord,
      trialShuttlePos: this.state.ShuttlePos,
      trialShuttleProb: [this.state.Prob1, this.state.Prob2],
      trialLastStatePic: [
        this.state.LastStatePic1,
        this.state.LastStatePic2,
        this.state.LastStatePic3,
      ],
      trialOutcomePic: [
        this.state.OutcomePic1,
        this.state.OutcomePic2,
        this.state.OutcomePic3,
      ],
      trialOutcomeVal: [
        this.state.OutcomeVal1,
        this.state.OutcomeVal2,
        this.state.OutcomeVal2,
      ],
      trialSafePath: this.state.SafePath,
      trialRiskyPath1: this.state.RiskyPath1,
      trialRiskyPath2: this.state.RiskyPath2,
      trialPathProb: this.state.pathProbBoth, //this is whether they chose 100 or 50/50, etc
      trialRT: this.state.trialRT,
      trialKeypress: this.state.keyChoice, //press left or right
      trialGambleChoice: this.state.pathIndx, //press 1- safe or 2 -risky
      trialPathProbChosen: this.state.pathProbEnd, //this is whether they chose 100 or 50/50, etc
      trialPath: this.state.pathNum, //this should be which path it went
      trialPathPicWord: this.state.tutPathPicWord,
      trialPathIndx: this.state.pathRoute,
      trialOutcomePicWord: this.state.tutOutcomeWord,
      trialOutcomeIndx: this.state.tutOutcomeIndx,
      trialOutcomeValence: trialOutcomeValence, //1, -1 or 0
      trialOutcomeMag: this.state.outcomeValue, //i can see what number 0 is
      trialOutcomeValue: this.state.outcome, //actual value
      trialCoins: this.state.coins,
    };

    try {
      fetch(`${DATABASE_URL}/tutorial_data/` + userID, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveString),
      });
    } catch (e) {
      console.log("Cant post?");
    }

    if (this.state.trialNum === this.state.trialForced) {
      //send back to instructions, this is the end of the forced choice
      setTimeout(
        function () {
          this.interMiss();
        }.bind(this),
        this.state.outcomeDur
      );
    } else {
      setTimeout(
        function () {
          this.setTrialVar();
        }.bind(this),
        this.state.outcomeDur
      );
    }
  }

  interMiss() {
    this.setState({
      instructScreen: true,
      taskScreen: false,
      instructScreenText: 9,
    });
  }

  passMission() {
    this.setState({
      instructScreen: true,
      taskScreen: false,
      instructScreenText: 10,
    });
  }

  nextMission() {
    document.removeEventListener("keyup", this._handleInstructKey);
    document.removeEventListener("keyup", this._handleDebugKey);
    this.props.history.push({
      pathname: `/ExptTask`,
      state: {
        userID: this.state.userID,
        date: this.state.date,
        startTime: this.state.startTime,

        outcomePic: this.state.outcomePic,
        outcomeWord: this.state.outcomeWord,
        outcomeVal: this.state.outcomeVal,
        outcomeIndx: this.state.outcomeIndx,

        stateWord: this.state.stateWord,
        statePic: this.state.statePic,
        stateIndx: this.state.stateIndx,

        pathOne: this.state.pathOne,
        pathTwo: this.state.pathTwo,
        pathThree: this.state.pathThree,
      },
    });
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  condSave() {
    var userID = this.state.userID;

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime, // this is when they start the expt
      sectionTime: this.state.sectionTime, //this is if they somehow refresh the page...
      taskSession: this.state.taskSession,
      taskSessionTry: this.state.taskSessionTry,
      structNum: this.state.structNum,

      outcomeWord: null,
      outcomeVal: null,
      outcomeIndx: null,

      stateWord: null,
      stateIndx: null,
      pathOne: null,
      pathTwo: null,
      pathThree: null,

      tutForcedPaths: this.state.forcedPaths,
      tutSafePathOutcome: this.state.tutSafePathOutcome,
      tutRiskyPathOutcome1: this.state.tutRiskyPathOutcome1,
      tutRiskyPathOutcome2: this.state.tutRiskyPathOutcome2,
      tutSafePathProb: this.state.tutSafePathProb,
      tutRiskyPathProb1: this.state.tutRiskyPathProb1,
      tutRiskyPathProb2: this.state.tutRiskyPathProb2,
      tutOptChoice: this.state.tutOptChoice,

      taskSafePathOutcome: null,
      taskRiskyPathOutcome1: null,
      taskRiskyPathOutcome2: null,
      taskSafePathProb: null,
      taskRiskyPathProb1: null,
      taskRiskyPathProb2: null,
      taskOptChoice: null,
    };

    try {
      fetch(`${DATABASE_URL}/cond_data/` + userID, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveString),
      });
    } catch (e) {
      console.log("Cant post?");
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////
  // render time

  render() {
    let text;
    if (this.state.debug === false) {
      if (this.state.instructScreen === true) {
        document.addEventListener("keyup", this._handleInstructKey);
        if (this.state.instructScreenText === 1) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION PRACTICE</span>
                You have now learnt the order of rooms (i.e., images) inside
                each spaceship type,
                <br />
                as well as the coins you can gain or lose depending on which
                items you find.
                <br />
                <br />
                For your mission, you will use the information you have
                memorised to get to
                <br />
                spaceships with the valuable item to exchange for coins, which
                will become
                <br />
                your bonus.
                <span className={styles.centerTwo}>
                  [<strong>NEXT →</strong>]
                </span>
              </p>
            </div>
          );

          //send the outcomeTask conditions?
          setTimeout(
            function () {
              this.condSave();
            }.bind(this),
            0
          );
        } else if (this.state.instructScreenText === 2) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION PRACTICE</span>
                To get to the spaceships, you will have to take a space shuttle.
                <br />
                <br />
                There are two space shuttles:
                <br /> <br />
                <span className={styles.centerThree}>
                  <span className={styles.shuttleChoice}>
                    100%
                    <br />
                    <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttle[0]}
                      alt="shuttle1"
                    />
                  </span>
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <span className={styles.shuttleChoice}>
                    70%/30%
                    <br /> <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttle[1]}
                      alt="shuttle2"
                    />
                  </span>
                </span>
                <br />
                One of them is reliable, and will get you to the spaceship 100%
                of the time.
                <br />
                <br />
                The other is not so reliable, and will get you to one of two
                spaceships
                <br />
                with the probability stated i.e., 70% to one spaceship, and 30%
                to another.
                <br />
                <br />
                <span className={styles.centerTwo}>
                  [<strong>NEXT →</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 3) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION PRACTICE</span>
                During the mission, you will be given clues that give you
                information about which
                <br />
                shuttle will go to which spaceship, and which spaceship contains
                the valuable item
                <br />
                that you are searching for.
                <br /> <br />
                Each shuttle will tell you that it will lead to the spaceship
                with the following room(s):
                <br />
                <br />
                <span className={styles.centerThree}>
                  <span className={styles.shuttleChoice}>
                    100%
                    <br /> {this.state.stateWord[0]} <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttle[0]}
                      alt="shuttle1"
                    />
                  </span>
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <span className={styles.shuttleChoice}>
                    70%/30%
                    <br /> {this.state.stateWord[3]}/{this.state.stateWord[6]}
                    <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttle[1]}
                      alt="shuttle2"
                    />
                  </span>
                </span>
                <br />
                This means that the reliable shuttle will lead you to the
                spaceship with the <strong>{this.state.stateWord[0]}</strong>
                <br />
                room <strong>100%</strong> of the time.
                <br /> <br />
                However, if you take the unreliable shuttle, it will lead you to
                the spaceship with the <br />
                <strong>{this.state.stateWord[3]}</strong> room&nbsp;
                <strong>70%</strong> of the time, and to the spaceship with
                the&nbsp;<strong>{this.state.stateWord[6]}</strong> room&nbsp;
                <strong>30%</strong> of <br />
                the time.
                <br />
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>] [<strong>NEXT →</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 4) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION PRACTICE</span>
                You will also be told about the rooms in one of each spaceship
                where you can
                <br />
                find the possible items.
                <br /> <br />
                <span className={styles.centerThree}>
                  <span className={styles.cueScreen}>
                    {this.state.stateWord[8]} - 3 {this.state.outcomeWord[0]}
                    <br />
                    {this.state.stateWord[2]} - 1 {this.state.outcomeWord[1]}
                    <br />
                    {this.state.stateWord[5]} - 4 {this.state.outcomeWord[2]}
                  </span>
                </span>
                <br />
                Here, the <strong>{this.state.stateWord[8]}</strong> room will
                find us&nbsp;
                <strong>3 {this.state.outcomeWord[0]}s</strong>, the&nbsp;
                <strong>{this.state.stateWord[2]}</strong> room will find
                us&nbsp;
                <strong>1 {this.state.outcomeWord[1]}</strong>,
                <br />
                and the <strong>{this.state.stateWord[5]}</strong> room will
                find us&nbsp;
                <strong>4 {this.state.outcomeWord[2]}s</strong>.
                <br />
                <br />
                If you remember, you can exchange {this.state.outcomeWord[0]}s
                for coins, {this.state.outcomeWord[1]}s will lose you coins,
                <br />
                while you gain/lose nothing for {this.state.outcomeWord[2]}s.
                <br />
                <br />
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>] [<strong>NEXT →</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 5) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION PRACTICE</span>
                Together, these two sets of clues give us enough information to
                choose which shuttle to take to find the valuable item. <br />
                For instance:
                <br /> <br />
                <span className={styles.centerThree}>
                  <span className={styles.cueScreen}>
                    {this.state.stateWord[8]} - 3 {this.state.outcomeWord[0]}
                    <br />
                    {this.state.stateWord[2]} - 1 {this.state.outcomeWord[1]}
                    <br />
                    {this.state.stateWord[5]} - 4 {this.state.outcomeWord[2]}
                  </span>
                </span>
                <br />
                <span className={styles.centerThree}>
                  <span className={styles.shuttleChoice}>
                    100%
                    <br /> {this.state.stateWord[0]} <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttle[0]}
                      alt="shuttle1"
                    />
                  </span>
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <span className={styles.shuttleChoice}>
                    70%/30%
                    <br /> {this.state.stateWord[3]}/{this.state.stateWord[6]}
                    <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttle[1]}
                      alt="shuttle2"
                    />
                  </span>
                </span>
                <br />
                You should recall the room order of each spaceship to help
                decide which shuttle you should take to bring you to the
                <br />
                spaceship with the valuable item.
                <br />
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>] [<strong>NEXT →</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 6) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION PRACTICE</span>
                <span className={styles.centerThree}>
                  <span className={styles.cueScreen}>
                    {this.state.stateWord[8]} - 3 {this.state.outcomeWord[0]}
                    <br />
                    {this.state.stateWord[2]} - 1 {this.state.outcomeWord[1]}
                    <br />
                    {this.state.stateWord[5]} - 4 {this.state.outcomeWord[2]}
                  </span>
                </span>
                <br />
                <span className={styles.centerThree}>
                  <span className={styles.shuttleChoice}>
                    100%
                    <br /> {this.state.stateWord[0]} <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttle[0]}
                      alt="shuttle1"
                    />
                  </span>
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <span className={styles.shuttleChoiceFade}>
                    70%/30%
                    <br /> {this.state.stateWord[3]}/{this.state.stateWord[6]}
                    <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttle[1]}
                      alt="shuttle2"
                    />
                  </span>
                </span>
                <br />
                For example, if you choose the <strong>reliable 100%</strong>
                &nbsp;shuttle, this shuttle will lead you to the spaceship with
                the <strong>{this.state.stateWord[0]}</strong> room.
                <br />
                <br />
                Previously, you learned that <strong>Spaceship 1</strong>{" "}
                contains the <strong>{this.state.stateWord[0]}</strong> room,
                which leads to the&nbsp;
                <strong>{this.state.stateWord[1]}</strong> room and&nbsp;
                <strong>{this.state.stateWord[2]}</strong> room.
                <br /> <br />
                You are told here that the {this.state.stateWord[2]} room is
                where you can find 1 {this.state.outcomeWord[1]}.
                <br />
                <br />
                This means that if you choose the <strong>reliable 100%</strong>
                &nbsp;shuttle, you will find 1 {this.state.outcomeWord[1]}, and
                thus&nbsp;
                <strong>lose 1</strong> coin.
                <br />
                <br />
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>] [<strong>NEXT →</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 7) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION PRACTICE</span>
                <span className={styles.centerThree}>
                  <span className={styles.cueScreen}>
                    {this.state.stateWord[8]} - 3 {this.state.outcomeWord[0]}
                    <br />
                    {this.state.stateWord[2]} - 1 {this.state.outcomeWord[1]}
                    <br />
                    {this.state.stateWord[5]} - 4 {this.state.outcomeWord[2]}
                  </span>
                </span>
                <br />
                <span className={styles.centerThree}>
                  <span className={styles.shuttleChoiceFade}>
                    100%
                    <br /> {this.state.stateWord[0]} <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttle[0]}
                      alt="shuttle1"
                    />
                  </span>
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <span className={styles.shuttleChoice}>
                    70%/30%
                    <br /> {this.state.stateWord[3]}/{this.state.stateWord[6]}
                    <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttle[1]}
                      alt="shuttle2"
                    />
                  </span>
                </span>
                <br />
                Whereas if you choose the <strong>unreliable 70%/30%</strong>
                &nbsp;shuttle, this shuttle will lead you to the spaceship with
                the <strong>{this.state.stateWord[3]}</strong> room&nbsp;
                <strong>70%</strong> of the time,
                <br />
                and to the spaceship with the&nbsp;
                <strong>{this.state.stateWord[6]}</strong> room&nbsp;
                <strong>30%</strong> of the time.
                <br />
                <br />
                Previously, you learned that <strong>Spaceship 2</strong>{" "}
                contains the <strong>{this.state.stateWord[3]}</strong> room,
                which leads to the&nbsp;
                <strong>{this.state.stateWord[4]}</strong> room and&nbsp;
                <strong>{this.state.stateWord[5]}</strong> room.
                <br /> <br />
                Meanwhile <strong>Spaceship 3</strong> contains the&nbsp;
                <strong>{this.state.stateWord[6]}</strong> room, which leads to
                the&nbsp;
                <strong>{this.state.stateWord[7]}</strong> room and&nbsp;
                <strong>{this.state.stateWord[8]}</strong> room.
                <br /> <br />
                This means that if you choose the&nbsp;
                <strong>unreliable 70%/30%</strong>
                &nbsp;shuttle, you have a 70% chance of finding&nbsp;
                <strong>4 {this.state.outcomeWord[2]}s</strong>, and thus
                gaining/losing 0 coins.
                <br />
                and a 30% chance of finding&nbsp;
                <strong>3 {this.state.outcomeWord[0]}s</strong>, and thus
                gaining 3 coins.
                <br />
                <br />
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>] [<strong>NEXT →</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 8) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION PRACTICE</span>
                <br />
                Your mission is to use the clues shown at the start of each
                shuttle journey to figure out which spaceship will be the best
                to board.
                <br />
                <br />
                You must do this <strong>in your head</strong> by remembering
                the room order of the spaceships and the outcome item images.
                <br />
                <br />
                You will need to decide whether it is worth risking the
                unreliable shuttle, or if you would be better off going with the
                reliable shuttle,
                <br />
                to get to the spaceship and find the item that you want.
                <br />
                <br />
                Let us start with a practice.
                <br />
                <br />
                For the first 3 shuttle journeys, only the reliable shuttle is
                available.
                <br />
                <br />
                This so you get a chance to see how the journey plays out when
                you choose a shuttle.
                <br />
                <br />
                After that, both shuttles will be available, and the&nbsp;
                <strong>images will be hidden</strong> so you will have to use
                your <strong>memory</strong>.
                <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to begin.
                </span>
                <br />
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 9) {
          document.addEventListener("keyup", this._handleInstructKey);
          document.removeEventListener("keyup", this._handleTaskKey);
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION PRACTICE</span>
                <br />
                Great! For the remaining 6 shuttle journeys, you are free to
                choose the shuttle to gain as many coins as possible.
                <br />
                <br />
                Remember: all images will be hidden - you will have to use your
                memory.
                <br />
                <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to begin.
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 10) {
          document.addEventListener("keyup", this._handleInstructKey);
          document.removeEventListener("keyup", this._handleTaskKey);
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION PRACTICE</span>
                <br />
                Well done!
                <br />
                <br />
                If you have understood how the main mission will work, press [
                <strong>SPACEBAR</strong>] to continue onwards.
                <br />
                <br />
                If you would like another run through, press [
                <strong>← BACK</strong>] do the tutorial again.
                <br />
                <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to continue.
                </span>
                <span className={styles.centerTwo}>
                  Press [<strong>← BACK</strong>] to do the tutorial again.
                </span>
              </p>
            </div>
          );
        }
      } else if (this.state.instructScreen === false) {
        if (this.state.taskScreen === true) {
          document.removeEventListener("keyup", this._handleInstructKey);
          document.addEventListener("keyup", this._handleTaskKey);
          if (this.state.trialNum <= this.state.trialTotal) {
            if (this.state.pathPlay === false) {
              text = <div>{this.taskStart(this.state.trialNum)}</div>;
              //
            } else if (this.state.pathPlay === true) {
              text = (
                <div className={styles.main}>
                  <div className={styles.counter}>
                    <img
                      className={styles.counter}
                      src={counter}
                      alt="counter"
                    />
                    {this.state.trialNum}/{this.state.trialTotal}
                  </div>
                  <div className={styles.coins}>
                    <img className={styles.counter} src={coin} alt="coin" />
                    {this.state.coins}
                  </div>
                  <p>
                    <span className={styles.center}>
                      Spaceship {this.state.pathNum}
                    </span>
                    <span className={styles.centerTwo}>
                      {this.state.stateNum}
                    </span>
                    <br />
                    <span className={styles.centerThree}>
                      <span className={styles.outcomeValue}>
                        {this.state.outcomeValue}
                      </span>
                      <img
                        className={styles.stateLarge}
                        src={this.state.stateShown}
                        alt="state"
                      />
                    </span>
                    <br />
                    <span className={styles.centerThree}>
                      {this.state.tutOutcome1} {this.state.tutOutcomeValue}
                      &nbsp;
                      {this.state.tutOutcome2}
                    </span>
                    <br />
                  </p>
                </div>
              );
            }
            //
          } else {
            // finish all trials - go to the main trials
            setTimeout(
              function () {
                this.passMission();
              }.bind(this),
              0
            );
          }
          //
        }
      }
    } else if (this.state.debug === true) {
      document.addEventListener("keyup", this._handleDebugKey);
      text = (
        <div className={styles.main}>
          <p>
            <span className={styles.center}>DEBUG MODE</span>
            <br />

            <span className={styles.centerTwo}>
              Press the [<strong>SPACEBAR</strong>] to skip to next section.
            </span>
          </p>
        </div>
      );
    }

    return (
      <div className={styles.spacebg}>
        <span className={styles.astro3}>
          <img src={astrodude} alt="astrodude" />
        </span>
        <div className={styles.textblock}>{text}</div>
      </div>
    );
  }
}

export default withRouter(TutorTask);
