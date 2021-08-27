import React from "react";
import { withRouter } from "react-router-dom";
import { DATABASE_URL } from "./config";

import styles from "./style/taskStyle.module.css";

// 13/07/21: This version has a planning check for all free choice trials
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

function arraysEqual(a, b) {
  a = Array.isArray(a) ? a : [];
  b = Array.isArray(b) ? b : [];
  return a.length === b.length && a.every((el, ix) => el === b[ix]);
}

function inArray(needle, haystack) {
  var count = haystack.length;
  for (var i = 0; i < count; i++) {
    if (haystack[i] === needle) {
      return true;
    }
  }
  return false;
}

//////////////////////////////////////////////////////////////////////////////

var shuttleIndex = [0, 1]; //0 - safe, 1 - risky
var cueOutPosIndx = [0, 1, 2]; //0-- top, 1 - middle, 2 - bottom
var cueShutPosIndx = [0, 1]; //0 - left, 1 - right
var paths = [1, 2, 3];

var forcedPaths = [1, 2, 3];
shuffle(forcedPaths);

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// REACT COMPONENT START
class TutorTask extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.location.state.userID;
    const date = this.props.location.state.date;
    const startTime = this.props.location.state.startTime;

    const shuttlePic = this.props.location.state.shuttlePic;
    const shuttleWord = this.props.location.state.shuttleWord;
    const img_fix = this.props.location.state.img_fix;
    const img_astrodude1 = this.props.location.state.img_astrodude1;
    const img_astrodude2 = this.props.location.state.img_astrodude2;
    const img_astrodude3 = this.props.location.state.img_astrodude3;
    const img_counter = this.props.location.state.img_counter;
    const img_coinSmall = this.props.location.state.img_coinSmall;
    const img_coin = this.props.location.state.img_coin;
    const img_pathInstruct1 = this.props.location.state.img_pathInstruct1;
    const stateHolder = this.props.location.state.stateHolder;

    const statePic = this.props.location.state.statePic;
    const stateWord = this.props.location.state.stateWord;

    const outcomePic = this.props.location.state.outcomePic;
    const outcomeWord = this.props.location.state.outcomeWord;
    const outcomeVal = this.props.location.state.outcomeVal;
    const outcomeIndx = this.props.location.state.outcomeIndx;

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
      taskSession: "TutorTask",
      instructScreenText: 1,

      img_fix: img_fix,
      img_astrodude1: img_astrodude1,
      img_astrodude2: img_astrodude2,
      img_astrodude3: img_astrodude3,
      img_counter: img_counter,
      img_coinSmall: img_coinSmall,
      img_coin: img_coin,
      img_pathInstruct1: img_pathInstruct1,

      shuttlePic: shuttlePic,
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
      stateNum: "",
      stateShown: null,
      stateDur: 2000,
      // outcomeDur: 2500,
      fixDur: 250,

      stateHolder: stateHolder,
      outcomePic: outcomePic,
      outcomeWord: outcomeWord,
      outcomeVal: outcomeVal,
      outcomeIndx: outcomeIndx,

      coins: 0, //this is basically trialScore but long running tally..

      choice1Fade: styles.shuttleChoice,
      choice2Fade: styles.shuttleChoice,

      playCueScreen: false,
      playPlanScreen: false,
      // playTransScreen: false,
      playPathFull: false,
      playPathShort: false,
      playPathOutcomeShort: false,
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

      tutOutcomeValue: null,
      tutForcedChoiceText1: [],
      tutForcedChoiceText2: [],

      jitter: [1200, 1300, 1400, 1500, 1600, 1700],
      StructToRender: "",
      debug: false,
    };

    this.handleInstructLocal = this.handleInstructLocal.bind(this);
    this.handleDebugKeyLocal = this.handleDebugKeyLocal.bind(this);
    this.handleNextTrial = this.handleNextTrial.bind(this);
    this.taskStart = this.taskStart.bind(this);
    this.planStart = this.planStart.bind(this);
    this.pathStart = this.pathStart.bind(this);
    this.pathShortStart = this.pathShortStart.bind(this);
    this.planCheck = this.planCheck.bind(this);
    this.testCheck = this.testCheck.bind(this);

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

    // Variables for tutorial
    //tutStruct 0-2: values, 3-5: probability, 6-8: EVs, 9: risky EV, 10: safe - risky EV, 11: optimal answer (1:safe, 2: risky)
    // 12 -outcome structure, 13 - forced choice?, 14 - planning trial, 15 - play long path?
    var randNum = "struct_" + getRandomInt(1, 5);
    var StructToRender = require("./tutorialStruct/" + randNum + ".json");

    var tutSafePathOutcome = StructToRender[0];
    var tutRiskyPathOutcome1 = StructToRender[1];
    var tutRiskyPathOutcome2 = StructToRender[2];

    var tutSafePathProb = StructToRender[3];
    var tutRiskyPathProb1 = StructToRender[4];
    var tutRiskyPathProb2 = StructToRender[5];

    var tutSafePathEV = StructToRender[6];
    var tutRiskyPathEV1 = StructToRender[7];
    var tutRiskyPathEV2 = StructToRender[8];

    var tutGambleEV = StructToRender[9]; //Risky EV1+EV2
    var tutChoiceEV = StructToRender[10]; //SafeEV - (RiskyEV1+EV2)

    var tutOptChoice = StructToRender[11];
    var tutForceChoice = StructToRender[13];
    var tutOutcomeStruct = StructToRender[12];
    var tutPlanChoice = StructToRender[14];
    var tutShowPath = StructToRender[15];

    this.setState({
      structNum: randNum,
      StructToRender: StructToRender,
      tutSafePathOutcome: tutSafePathOutcome,
      tutRiskyPathOutcome1: tutRiskyPathOutcome1,
      tutRiskyPathOutcome2: tutRiskyPathOutcome2,

      tutSafePathEV: tutSafePathEV,
      tutRiskyPathEV1: tutRiskyPathEV1,
      tutRiskyPathEV2: tutRiskyPathEV2,

      tutGambleEV: tutGambleEV, //Risky EV1+EV2
      tutChoiceEV: tutChoiceEV, //SafeEV - (RiskyEV1+EV2)

      tutSafePathProb: tutSafePathProb,
      tutRiskyPathProb1: tutRiskyPathProb1,
      tutRiskyPathProb2: tutRiskyPathProb2,
      tutOptChoice: tutOptChoice,
      tutOutcomeStruct: tutOutcomeStruct,
      tutForceChoice: tutForceChoice,
      tutPlanChoice: tutPlanChoice,
      tutShowPath: tutShowPath,
      // I MIGHT NEED TO MOD THE COND SAVE
    });

    //send the outcomeTask conditions?
    setTimeout(
      function () {
        this.condSave();
      }.bind(this),
      0
    );

    setTimeout(
      function () {
        this.setState({
          mounted: 1,
        });
      }.bind(this),
      5000
    );
  };

  /////////////////////////////////////////////////////////////////////////////////
  // KEY STUFF
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
          this.missionCont();
        }.bind(this),
        0
      );
    } else if (curText === 11 && whichButton === 10) {
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

  _handlePlanKey = (event) => {
    var pressed;
    var time_pressed;

    switch (event.keyCode) {
      case 49:
        //    this is num 1
        pressed = 1;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;
      case 50:
        //     this is num 2
        pressed = 2;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;
      case 51:
        //    this is num 1
        pressed = 3;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;
      case 52:
        //     this is num 2
        pressed = 4;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;
      case 53:
        //    this is num 1
        pressed = 5;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;
      case 54:
        //     this is num 2
        pressed = 6;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;

      case 97:
        pressed = 1;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;
      case 98:
        pressed = 2;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;
      case 99:
        pressed = 3;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;
      case 100:
        pressed = 4;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;
      case 101:
        pressed = 5;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;
      case 102:
        pressed = 6;
        time_pressed = Math.round(performance.now());
        this.planCheck(pressed, time_pressed);
        break;
      default:
    }
  };

  _handleNextTrialKey = (event) => {
    var pressed;
    var time_pressed;

    switch (event.keyCode) {
      case 32:
        //    this is SPACEBAR
        pressed = 10;
        time_pressed = Math.round(performance.now());
        this.handleNextTrial(pressed, time_pressed);
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

  /////////////////////////////////////////////////////////////////////////////////

  missionThree() {
    var trialTime = Math.round(performance.now());

    this.setState({
      playCueScreen: false,
      playPlanScreen: false,
      // playTransScreen: false,
      playPathFull: false,
      playPathShort: false,
      playPathOutcomeShort: false,
      trialNum: 0,
      trialTime: trialTime,
      trialRT: 0,
      trialKeypress: 0,
      trialScore: 0,
    });
  }

  setTrialVar() {
    document.removeEventListener("keyup", this._handleNextTrialKey);
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

    var tutForceChoice = this.state.tutForceChoice[trialNum - 1]; //[1 -safe or 2 - risky]

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
      Shuttle1 = this.state.shuttlePic[0];
      Shuttle2 = this.state.shuttlePic[1];
      ShuttlePicWord = [this.state.shuttleWord[0], this.state.shuttleWord[1]];
      Shuttle1Word = this.state.stateWord[SafePathShuttlePic];
      Shuttle2Word =
        this.state.stateWord[RiskyPath1ShuttlePic] +
        "/" +
        this.state.stateWord[RiskyPath2ShuttlePic];

      if (trialNum <= this.state.trialForced && tutForceChoice === 1) {
        tutForcedChoiceText1 = "Let us take the reliable shuttle.";
        tutForcedChoiceText2 = "[Press the ← key]";
        choice1Fade = styles.shuttleChoice;
        choice2Fade = styles.shuttleChoiceFade;
      } else if (trialNum <= this.state.trialForced && tutForceChoice === 2) {
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

      Shuttle1 = this.state.shuttlePic[1];
      Shuttle2 = this.state.shuttlePic[0];

      ShuttlePicWord = [this.state.shuttleWord[1], this.state.shuttleWord[0]];
      Shuttle1Word =
        this.state.stateWord[RiskyPath1ShuttlePic] +
        "/" +
        this.state.stateWord[RiskyPath2ShuttlePic];
      Shuttle2Word = this.state.stateWord[SafePathShuttlePic];
      //safe one is right choice
      if (trialNum <= this.state.trialForced && tutForceChoice === 1) {
        tutForcedChoiceText1 = "Let us take the reliable shuttle.";
        tutForcedChoiceText2 = "[Press the → key]";
        choice1Fade = styles.shuttleChoiceFade;
        choice2Fade = styles.shuttleChoice;
      } else if (trialNum <= this.state.trialForced && tutForceChoice === 2) {
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

    if (trialNum === 1) {
      this.setState({
        instructScreen: false,
        taskScreen: true,
      });
    }

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
      playCueScreen: true,
      playPlanScreen: false,
      playPathFull: false,
      playPathShort: false,
      playPathOutcomeShort: false,
      trialNum: trialNum,
      trialTime: trialTime,
      pathProbBoth: pathProbBoth,
      planCurrentChoice: 1,
      statePlan1Style: styles.statePlan,
      statePlan2Style: styles.statePlan,
      statePlan3Style: styles.statePlan,
      statePlan4Style: styles.statePlan,
      statePlan5Style: styles.statePlan,
      statePlan6Style: styles.statePlan,
      planChoices: [],
      planRT: [],
      planCor: null,
      planChoicesWords: [],
      keyChoiceAll: [],
      planPathChosen: null,
      planFeedback: "Press the [number key] to select the room.",
    });
  }

  taskStart(trialNum) {
    var choice1Fade = this.state.choice1Fade;
    var choice2Fade = this.state.choice2Fade;

    let text = (
      <div className={styles.main}>
        <div className={styles.counter}>
          <img
            className={styles.counter}
            src={this.state.img_counter}
            alt="counter"
          />
          {this.state.trialNum}/{this.state.trialTotal}
        </div>
        <div className={styles.coins}>
          <img
            className={styles.counter}
            src={this.state.img_coin}
            alt="coin"
          />
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

    if (
      trialNum <= this.state.trialForced &&
      pathIndx !== this.state.tutForceChoice[trialNum - 1]
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

      if (this.state.tutPlanChoice[trialNum - 1] === 1) {
        //if it is a planning choice trial, then go to the planning screen
        var planTime = Math.round(performance.now()) + 500;

        this.setState({
          planTime: planTime,
        });

        setTimeout(
          function () {
            this.selectPlanStates();
          }.bind(this),
          500
        );
      } else {
        //if it is not a planning trial, go to outcomes
        // if tutShowPath, then play the full route
        // setTimeout(
        //   function () {
        //     this.transShip();
        //   }.bind(this),
        //   500
        // );

        if (this.state.tutShowPath[this.state.trialNum - 1] === 1) {
          setTimeout(
            function () {
              this.playStateOne();
            }.bind(this),
            500
          );
        } else if (this.state.tutShowPath[this.state.trialNum - 1] === 0) {
          //if dont show the route, go to a jitter fixation
          setTimeout(
            function () {
              this.jitterFix();
            }.bind(this),
            500
          );
        }

        //
      }
    }
  }

  selectPlanStates() {
    //if choose safe option, then state shown is 100% path and a random other path
    //if choose risky option, then state shown is between the risky paths
    var path1;
    var path2;

    if (this.state.pathIndx === 1) {
      var rand = getRandomInt(1, 2);
      //safe choice
      if (rand === 1) {
        path1 = this.state.SafePath;
        path2 = this.state.RiskyPath1;
      } else {
        path1 = this.state.SafePath;
        path2 = this.state.RiskyPath2;
      }
    } else if (this.state.pathIndx === 2) {
      path1 = this.state.RiskyPath1;
      path2 = this.state.RiskyPath2;
    }

    var bothPath = shuffle(path1.concat(path2));

    this.setState({
      playCueScreen: false,
      playPlanScreen: true,
      playTransScreen: false,
      playPathFull: false,
      playPathShort: false,
      playPathOutcomeShort: false,
      bothPath: bothPath, //[0,2,8,1,6,7]
      statePlan1: this.state.statePic[bothPath[0]],
      statePlan2: this.state.statePic[bothPath[1]],
      statePlan3: this.state.statePic[bothPath[2]],
      statePlan4: this.state.statePic[bothPath[3]],
      statePlan5: this.state.statePic[bothPath[4]],
      statePlan6: this.state.statePic[bothPath[5]],
    });
  }

  planStart() {
    let text = (
      <div className={styles.main}>
        <div className={styles.counter}>
          <img
            className={styles.counter}
            src={this.state.img_counter}
            alt="counter"
          />
          {this.state.trialNum}/{this.state.trialTotal}
        </div>
        <div className={styles.coins}>
          <img
            className={styles.counter}
            src={this.state.img_coin}
            alt="coin"
          />
          {this.state.coins}
        </div>
        <p>
          <span className={styles.centerTwo}>
            Choose the room images of the spaceship{" "}
            <strong>you believe you will end up in</strong> in order.
          </span>
          <br />
          <span className={styles.centerThree}>
            Which is <strong>Room {this.state.planCurrentChoice}</strong>?
          </span>
          <br />
          <span className={styles.centerTwo}>
            1 -{" "}
            <img
              className={this.state.statePlan1Style}
              src={this.state.statePlan1}
              alt="state1"
            />
            &nbsp; &nbsp; 2 -{" "}
            <img
              className={this.state.statePlan2Style}
              src={this.state.statePlan2}
              alt="state2"
            />
            &nbsp; &nbsp; 3 -{" "}
            <img
              className={this.state.statePlan3Style}
              src={this.state.statePlan3}
              alt="state3"
            />
            <br />
            <br />4 -{" "}
            <img
              className={this.state.statePlan4Style}
              src={this.state.statePlan4}
              alt="state4"
            />
            &nbsp; &nbsp; 5 -{" "}
            <img
              className={this.state.statePlan5Style}
              src={this.state.statePlan5}
              alt="state5"
            />
            &nbsp; &nbsp; 6 -{" "}
            <img
              className={this.state.statePlan6Style}
              src={this.state.statePlan6}
              alt="state6"
            />
          </span>
          <br />
          <span className={styles.centerTwo}>{this.state.planFeedback}</span>
        </p>
      </div>
    );

    return <div>{text}</div>;
  }

  planCheck(pressed, time_pressed) {
    var trialRT = time_pressed - this.state.planTime;
    var keyChoice = pressed;
    var keyChoiceAll = this.state.keyChoiceAll; //havent made this array yet

    // console.log("keyChoice: " + keyChoice);
    // console.log("keyChoiceAll: " + keyChoiceAll);

    if (inArray(keyChoice, keyChoiceAll)) {
      // if the key choice has already been chosen before, do nothing
    } else {
      var planCurrentChoice = this.state.planCurrentChoice + 1;
      var statePlan1Style = this.state.statePlan1Style;
      var statePlan2Style = this.state.statePlan2Style;
      var statePlan3Style = this.state.statePlan3Style;
      var statePlan4Style = this.state.statePlan4Style;
      var statePlan5Style = this.state.statePlan5Style;
      var statePlan6Style = this.state.statePlan6Style;
      var planChoices = this.state.planChoices;
      var planChoicesWords = this.state.planChoicesWords;
      var planRT = this.state.planRT;
      var coins = this.state.coins;

      keyChoiceAll[planCurrentChoice - 2] = keyChoice;

      if (keyChoice === 1) {
        statePlan1Style = styles.statePlanChosen;
      } else if (keyChoice === 2) {
        statePlan2Style = styles.statePlanChosen;
      } else if (keyChoice === 3) {
        statePlan3Style = styles.statePlanChosen;
      } else if (keyChoice === 4) {
        statePlan4Style = styles.statePlanChosen;
      } else if (keyChoice === 5) {
        statePlan5Style = styles.statePlanChosen;
      } else if (keyChoice === 6) {
        statePlan6Style = styles.statePlanChosen;
      }

      planChoices[planCurrentChoice - 2] = this.state.bothPath[keyChoice - 1];
      planChoicesWords[planCurrentChoice - 2] = this.state.stateWord[
        this.state.bothPath[keyChoice - 1]
      ];
      planRT[planCurrentChoice - 2] = trialRT;

      var planTime = Math.round(performance.now());

      this.setState({
        playCueScreen: false,
        playPlanScreen: true,
        playTransScreen: false,
        playPathFull: false,
        playPathShort: false,
        playPathOutcomeShort: false,
        statePlan1Style: statePlan1Style,
        statePlan2Style: statePlan2Style,
        statePlan3Style: statePlan3Style,
        statePlan4Style: statePlan4Style,
        statePlan5Style: statePlan5Style,
        statePlan6Style: statePlan6Style,
        planCurrentChoice: planCurrentChoice,
        planChoices: planChoices,
        planChoicesWords: planChoicesWords,
        planRT: planRT,
        planTime: planTime,
        keyChoiceAll: keyChoiceAll,
      });

      //finish choosing 3 choices
      if (planCurrentChoice === 4) {
        // check if correct?
        // the order has to be right!
        var samePathOne = arraysEqual(planChoices, this.state.pathOne);
        var samePathTwo = arraysEqual(planChoices, this.state.pathTwo);
        var samePathThree = arraysEqual(planChoices, this.state.pathThree);

        if (
          samePathOne === true ||
          samePathTwo === true ||
          samePathThree === true
        ) {
          // if correct, which path did they think they were gonna go?
          var planPathChosen;

          if (arraysEqual(planChoices, this.state.SafePath)) {
            planPathChosen = this.state.tutSafePathProb[
              this.state.trialNum - 1
            ];
          } else if (arraysEqual(planChoices, this.state.RiskyPath1)) {
            planPathChosen = this.state.tutRiskyPathProb1[
              this.state.trialNum - 1
            ];
          } else if (arraysEqual(planChoices, this.state.RiskyPath2)) {
            planPathChosen = this.state.tutRiskyPathProb2[
              this.state.trialNum - 1
            ];
          }

          this.setState({
            planCor: 1,
            planFeedback: "Correct order! No coins lost!",
            coins: coins,
            planPathChosen: planPathChosen,
            planCurrentChoice: 3, //keep the number on screen
          });
        } else {
          coins = coins - 1;
          this.setState({
            planCor: 0,
            planFeedback: "No such order! You lose 1 coin!",
            coins: coins,
            planPathChosen: null, //failed to choose correct path
            planCurrentChoice: 3,
          });
        }

        if (this.state.tutShowPath[this.state.trialNum - 1] === 1) {
          setTimeout(
            function () {
              this.playStateOne();
            }.bind(this),
            1000
          );
        } else if (this.state.tutShowPath[this.state.trialNum - 1] === 0) {
          //if dont show the route, go to a jitter fixation
          setTimeout(
            function () {
              this.jitterFix();
            }.bind(this),
            1000
          );
        }

        // setTimeout(
        //   function () {
        //     this.transShip();
        //   }.bind(this),
        //   2000
        // );

        //
      }
    }
  }
  //
  // transShip() {
  //   var pathRoutePic1 = this.state.pathRoute[0]; //[0,1,2] or [3,4,5] or [6,7,8]
  //   var pathNum;
  //   var whichShip;
  //
  //   if (pathRoutePic1 === 0) {
  //     pathNum = 1;
  //     whichShip = "A";
  //   } else if (pathRoutePic1 === 3) {
  //     pathNum = 2;
  //     whichShip = "B";
  //   } else if (pathRoutePic1 === 6) {
  //     pathNum = 3;
  //     whichShip = "C";
  //   }
  //
  //   this.setState({
  //     playCueScreen: false,
  //     playPlanScreen: false,
  //     playTransScreen: true,
  //     playPathFull: false,
  //     playPathShort: false,
  //     playPathOutcomeShort: false,
  //     stateNum: " ",
  //     stateShown: this.state.img_fix,
  //     pathNum: pathNum,
  //     whichShip: whichShip,
  //     outcomeValue: null,
  //     tutOutcome1: [],
  //     tutOutcome2: [],
  //     tutOutcome3: [],
  //     tutOutcomeValue: null,
  //   });
  //
  //   if (this.state.tutShowPath[this.state.trialNum - 1] === 1) {
  //     setTimeout(
  //       function () {
  //         this.playStateOne();
  //       }.bind(this),
  //       1000
  //     );
  //   } else if (this.state.tutShowPath[this.state.trialNum - 1] === 0) {
  //     //if dont show the route, go to a jitter fixation
  //     setTimeout(
  //       function () {
  //         this.jitterFix();
  //       }.bind(this),
  //       1000
  //     );
  //   }
  // }

  // transStart() {
  //   let text = (
  //     <div className={styles.main}>
  //       <div className={styles.counter}>
  //         <img
  //           className={styles.counter}
  //           src={this.state.img_counter}
  //           alt="counter"
  //         />
  //         {this.state.trialNum}/{this.state.trialTotal}
  //       </div>
  //       <div className={styles.coins}>
  //         <img
  //           className={styles.counter}
  //           src={this.state.img_coin}
  //           alt="coin"
  //         />
  //         {this.state.coins}
  //       </div>
  //       <p>
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <span className={styles.center}>
  //           You entered Spaceship {this.state.whichShip}!
  //         </span>
  //         <br />
  //         <span className={styles.centerThree}>
  //           {this.state.tutOutcome1} {this.state.tutOutcomeValue}
  //           &nbsp;
  //           {this.state.tutOutcome2}
  //         </span>
  //         <br />
  //         <span className={styles.centerThree}>{this.state.tutOutcome3}</span>
  //         <br />
  //       </p>
  //     </div>
  //   );
  //
  //   return <div>{text}</div>;
  // }

  jitterFix() {
    var pathRoutePic1 = this.state.pathRoute[0]; //[0,1,2] or [3,4,5] or [6,7,8]
    var pathNum;
    var whichShip;

    if (pathRoutePic1 === 0) {
      pathNum = 1;
      whichShip = "A";
    } else if (pathRoutePic1 === 3) {
      pathNum = 2;
      whichShip = "B";
    } else if (pathRoutePic1 === 6) {
      pathNum = 3;
      whichShip = "C";
    }

    this.setState({
      playCueScreen: false,
      playPlanScreen: false,
      playPathFull: false,
      playPathShort: true,
      playPathOutcomeShort: false,
      stateShown: this.state.img_fix,
      stateNum: " ",
      pathNum: pathNum,
      whichShip: whichShip,
      outcomeValue: null,
      tutOutcome1: [],
      tutOutcome2: [],
      tutOutcome3: [],
      tutOutcomeValue: null,
    });

    var jitterPos = this.state.jitter;
    var jitterTime = jitterPos[Math.floor(Math.random() * jitterPos.length)]; //random jitter time

    setTimeout(
      function () {
        this.playOutcomeShort();
      }.bind(this),
      jitterTime
    );
  }

  playOutcomeShort() {
    document.addEventListener("keyup", this._handleNextTrialKey);
    var outcome = this.state.outcome;
    var coins = this.state.coins + outcome;
    var tutOutcomeValue = this.state.tutOutcomeValue;
    var outcomeWord;
    var outcomeIndx;
    var outcomeValue;

    if (outcome > 0) {
      outcomeIndx = 0;
      outcomeWord = this.state.outcomeWord[0];
      outcomeValue = outcome / this.state.outcomeVal[0];
      tutOutcomeValue = outcomeValue;
    } else if (outcome < 0) {
      outcomeIndx = 1;
      outcomeWord = this.state.outcomeWord[1];
      outcomeValue = outcome / this.state.outcomeVal[1];
      tutOutcomeValue = outcomeValue;
    } else if (outcome === 0) {
      outcomeIndx = 2;
      outcomeWord = this.state.outcomeWord[2];
      outcomeValue = this.state.neuVal;
      tutOutcomeValue = outcome;
    }

    this.setState({
      playPathOutcomeShort: true,
      playPathShort: false,
      stateNum: "You receive:",
      outcomeValue: outcomeValue,
      tutOutcome1: [],
      tutOutcomeValue: tutOutcomeValue,
      tutOutcome2: [],
      coins: coins,
      tutOutcomeWord: outcomeWord,
      tutOutcomeIndx: outcomeIndx,
      tutOutcome3: "[Press the SPACEBAR to continue to the next journey]",
    });

    setTimeout(
      function () {
        this.tutSave();
      }.bind(this),
      0
    );
  }

  //just the jitter!
  pathShortStart() {
    let text = (
      <div className={styles.main}>
        <div className={styles.counter}>
          <img
            className={styles.counter}
            src={this.state.img_counter}
            alt="counter"
          />
          {this.state.trialNum}/{this.state.trialTotal}
        </div>
        <div className={styles.coins}>
          <img
            className={styles.counter}
            src={this.state.img_coin}
            alt="coin"
          />
          {this.state.coins}
        </div>
        <p>
          <span className={styles.center}>&nbsp;</span>
          <span className={styles.centerTwo}>&nbsp;</span>
          <br />
          <span className={styles.centerThree}>
            <img
              className={styles.stateLarge}
              src={this.state.stateShown}
              alt="state"
            />
          </span>
          <span className={styles.centerThree}>
            {this.state.tutOutcome1} {this.state.tutOutcomeValue}
            &nbsp;
            {this.state.tutOutcome2}
          </span>
          <br />
          <span className={styles.centerThree}>{this.state.tutOutcome3}</span>
          <br />
        </p>
      </div>
    );

    return <div>{text}</div>;
  }

  pathShortOutcomeStart() {
    let text = (
      <div className={styles.main}>
        <div className={styles.counter}>
          <img
            className={styles.counter}
            src={this.state.img_counter}
            alt="counter"
          />
          {this.state.trialNum}/{this.state.trialTotal}
        </div>
        <div className={styles.coins}>
          <img
            className={styles.counter}
            src={this.state.img_coin}
            alt="coin"
          />
          {this.state.coins}
        </div>
        <p>
          <span className={styles.center}>
            Spaceship {this.state.whichShip}
          </span>
          <span className={styles.centerTwo}>{this.state.stateNum}</span>
          <br />
          <br />
          <br />
          <br />
          <br /> <br />
          <br /> <br />
          <span className={styles.centerThree}>
            <span className={styles.outcomeValue}>
              {this.state.outcome}
              &nbsp;
              <img
                className={styles.stateSmall}
                src={this.state.img_coin}
                alt="state"
              />
            </span>
          </span>
          <span className={styles.centerThree}>
            {this.state.tutOutcome1}
            &nbsp;
            {this.state.tutOutcome2}
          </span>
          <br />
          <span className={styles.centerThree}>{this.state.tutOutcome3}</span>
          <br />
        </p>
      </div>
    );

    return <div>{text}</div>;
  }

  playStateOne() {
    var pathRoutePic1 = this.state.pathRoute[0]; //[0,1,2] or [3,4,5] or [6,7,8]
    var pathNum;
    var whichShip;
    var pathPicWord;
    if (pathRoutePic1 === 0) {
      pathNum = 1;
      whichShip = "A";
      pathPicWord = [
        this.state.stateWord[0],
        this.state.stateWord[1],
        this.state.stateWord[2],
      ];
    } else if (pathRoutePic1 === 3) {
      pathNum = 2;
      whichShip = "B";
      pathPicWord = [
        this.state.stateWord[3],
        this.state.stateWord[4],
        this.state.stateWord[5],
      ];
    } else if (pathRoutePic1 === 6) {
      pathNum = 3;
      whichShip = "C";
      pathPicWord = [
        this.state.stateWord[6],
        this.state.stateWord[7],
        this.state.stateWord[8],
      ];
    }

    var statePic = this.state.statePic[pathRoutePic1];

    console.log(pathRoutePic1);
    console.log(statePic);

    this.setState({
      playCueScreen: false,
      playPlanScreen: false,
      // playTransScreen: false,
      playPathFull: true,
      playPathShort: false,
      playPathOutcomeShort: false,
      stateNum: "Room 1",
      stateShown: statePic,
      pathNum: pathNum,
      whichShip: whichShip,
      tutPathPicWord: pathPicWord,
      outcomeValue: null,
      tutOutcome1: [],
      tutOutcome2: [],
      tutOutcome3: [],
      tutOutcomeValue: null,
    });

    setTimeout(
      function () {
        this.playFix();
      }.bind(this),
      this.state.stateDur
    );
  }

  playFix() {
    this.setState({
      stateShown: this.state.img_fix,
    });

    if (this.state.stateNum === "Room 1") {
      setTimeout(
        function () {
          this.playStateTwo();
        }.bind(this),
        this.state.fixDur
      );
    } else if (this.state.stateNum === "Room 2") {
      setTimeout(
        function () {
          this.playStateThree();
        }.bind(this),
        this.state.fixDur
      );
    } else if (this.state.stateNum === "Room 3") {
      setTimeout(
        function () {
          this.playOutcome();
        }.bind(this),
        this.state.fixDur
      );
    }
  }

  playStateTwo() {
    var pathRoutePic2 = this.state.pathRoute[1]; //[0,1,2] or [3,4,5] or [6,7,8]
    var statePic = this.state.statePic[pathRoutePic2];

    this.setState({
      stateNum: "Room 2",
      stateShown: statePic,
    });

    setTimeout(
      function () {
        this.playFix();
      }.bind(this),
      this.state.stateDur
    );
  }

  playStateThree() {
    var pathRoutePic3 = this.state.pathRoute[2]; //[0,1,2] or [3,4,5] or [6,7,8]
    var statePic = this.state.statePic[pathRoutePic3];

    this.setState({
      stateNum: "Room 3",
      stateShown: statePic,
    });

    setTimeout(
      function () {
        this.playFix();
      }.bind(this),
      this.state.stateDur
    );
  }

  //normal path play
  pathStart() {
    let text = (
      <div className={styles.main}>
        <div className={styles.counter}>
          <img
            className={styles.counter}
            src={this.state.img_counter}
            alt="counter"
          />
          {this.state.trialNum}/{this.state.trialTotal}
        </div>
        <div className={styles.coins}>
          <img
            className={styles.counter}
            src={this.state.img_coin}
            alt="coin"
          />
          {this.state.coins}
        </div>
        <p>
          <span className={styles.center}>
            Spaceship {this.state.whichShip}
          </span>
          <span className={styles.centerTwo}>{this.state.stateNum}</span>
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
          <span className={styles.centerThree}>{this.state.tutOutcome3}</span>
          <br />
        </p>
      </div>
    );

    return <div>{text}</div>;
  }

  playOutcome() {
    document.addEventListener("keyup", this._handleNextTrialKey);
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

      outcomePic = this.state.outcomePic[0];

      outcomeValue = outcome / this.state.outcomeVal[0];
      tutOutcomeValue = outcomeValue;
      tutOutcome1 = "You gain";
    } else if (outcome < 0) {
      outcomeIndx = 1;
      outcomeWord = this.state.outcomeWord[1];
      outcomePic = this.state.outcomePic[1];
      outcomeValue = outcome / this.state.outcomeVal[1];
      tutOutcomeValue = outcomeValue;
      tutOutcome1 = "You lose";
    } else if (outcome === 0) {
      outcomeIndx = 2;
      outcomeWord = this.state.outcomeWord[2];
      outcomePic = this.state.outcomePic[2];
      outcomeValue = this.state.neuVal;
      tutOutcomeValue = outcome;
      tutOutcome1 = "You gain/lose";
    }

    this.setState({
      stateNum: "You receive:",
      stateShown: outcomePic,
      outcomeValue: outcomeValue,
      tutOutcome1: tutOutcome1,
      tutOutcomeValue: tutOutcomeValue,
      tutOutcome2: "coin(s)!",
      coins: coins,
      tutOutcomeWord: outcomeWord,
      tutOutcomeIndx: outcomeIndx,
      tutOutcome3: "[Press the SPACEBAR to continue to the next journey]",
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

      trialSafeProb: this.state.tutSafePathProb[this.state.trialNum - 1],
      trialRiskyProb1: this.state.tutRiskyPathProb1[this.state.trialNum - 1],
      trialRiskyProb2: this.state.tutRiskyPathProb2[this.state.trialNum - 1],

      trialSafeValue: this.state.tutSafePathOutcome[this.state.trialNum - 1],
      trialRiskyValue1: this.state.tutRiskyPathOutcome1[
        this.state.trialNum - 1
      ],
      trialRiskyValue2: this.state.tutRiskyPathOutcome2[
        this.state.trialNum - 1
      ],

      trialSafePathEV: this.state.tutSafePathEV[this.state.trialNum - 1],
      trialRiskyPathEV1: this.state.tutRiskyPathEV1[this.state.trialNum - 1],
      trialRiskyPathEV2: this.state.tutRiskyPathEV2[this.state.trialNum - 1],
      trialGambleEV: this.state.tutGambleEV[this.state.trialNum - 1], //Risky EV1+EV2
      trialChoiceEV: this.state.tutChoiceEV[this.state.trialNum - 1], //SafeEV - (RiskyEV1+EV2)

      trialPlan: this.state.tutPlanChoice[this.state.trialNum - 1], //0 for not a plan trial, 1 for a plan trial
      trialPlanRT: this.state.planRT,
      trialPlanChoice: this.state.planChoices,
      trialPlanChoiceWords: this.state.planChoicesWords,
      trialPlanPathChosen: this.state.planPathChosen,
      trialPlanCor: this.state.planCor,

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
      trialOptimalChoice: this.state.tutOptChoice[this.state.trialNum - 1],
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
  }

  handleNextTrial(pressed, time_pressed) {
    var whichButton = pressed;
    if (whichButton === 10) {
      if (this.state.trialNum === 3 || this.state.trialNum === 6) {
        //send back to instructions, this is the end of the forced choice
        setTimeout(
          function () {
            this.interMiss();
          }.bind(this),
          0
        );
      } else {
        setTimeout(
          function () {
            this.setTrialVar();
          }.bind(this),
          0
        );
      }
    }
  }

  interMiss() {
    document.removeEventListener("keyup", this._handleNextTrialKey);
    if (this.state.trialNum === 3) {
      this.setState({
        instructScreen: true,
        taskScreen: false,
        instructScreenText: 9,
      });
    } else if (this.state.trialNum === 6) {
      this.setState({
        instructScreen: true,
        taskScreen: false,
        instructScreenText: 10,
      });
    }
  }

  missionCont() {
    var trialTime = Math.round(performance.now());

    this.setState({
      instructScreen: false,
      taskScreen: true,
      playCueScreen: false,
      playPlanScreen: false,
      // playTransScreen: false,
      playPathFull: false,
      playPathShort: false,
      playPathOutcomeShort: false,
      trialTime: trialTime,
    });

    setTimeout(
      function () {
        this.setTrialVar();
      }.bind(this),
      0
    );
  }

  passMission() {
    this.setState({
      instructScreen: true,
      taskScreen: false,
      instructScreenText: 11,
    });
  }

  nextMission() {
    document.removeEventListener("keyup", this._handleInstructKey);
    document.removeEventListener("keyup", this._handleDebugKey);
    this.props.history.push({
      pathname: `/QuizTask`,
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

        shuttlePic: this.state.shuttlePic,
        shuttleWord: this.state.shuttleWord,

        img_fix: this.state.img_fix,
        img_astrodude1: this.state.img_astrodude1,
        img_astrodude2: this.state.img_astrodude2,
        img_astrodude3: this.state.img_astrodude3,
        img_counter: this.state.img_counter,
        img_coinSmall: this.state.img_coinSmall,
        img_coin: this.state.img_coin,
        img_pathInstruct1: this.state.img_pathInstruct1,
        stateHolder: this.state.stateHolder,
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
    var currentDate = new Date(); // maybe change to local
    var sectionTime = currentDate.toTimeString();
    var trialTime = Math.round(performance.now());

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime, // this is when they start the expt
      sectionTime: sectionTime, //this is if they somehow refresh the page...
      trialTime: trialTime,
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
      tutOutcomeStruct: this.state.tutOutcomeStruct,
      tutForceChoice: this.state.tutForceChoice,
      tutPlanChoice: this.state.tutPlanChoice,
      tutShowPath: this.state.tutShowPath,

      taskSafePathOutcome: null,
      taskRiskyPathOutcome1: null,
      taskRiskyPathOutcome2: null,
      taskSafePathProb: null,
      taskRiskyPathProb1: null,
      taskRiskyPathProb2: null,
      taskOptChoice: null,
      taskOutcomeStruct: null,
      taskForceChoice: null,
      taskPlanChoice: null,
      taskShowPath: null,
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
                You have now learnt the order of the connecting rooms inside
                each spaceship type,
                <br />
                and that you can gain or lose coins depending on which outcome
                room you end up in.
                <br />
                <br />
                For your mission, you will use the information you have
                memorised to{" "}
                <strong>
                  choose <br />
                  shuttles
                </strong>
                &nbsp;that will get you to the spaceship with the outcome room
                where you can earn coins.
                <br />
                <br />
                The more coins you earn at the end of the mission, the higher
                your bonus will be.
                <span className={styles.centerTwo}>
                  [<strong>NEXT →</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 2) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION PRACTICE</span>
                To get to the spaceships, you have a choice between 2 space
                shuttles:
                <br /> <br />
                <span className={styles.centerThree}>
                  <span className={styles.shuttleChoice}>
                    100%
                    <br />
                    <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttlePic[0]}
                      alt="shuttle1"
                    />
                  </span>
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <span className={styles.shuttleChoice}>
                    70%/30%
                    <br /> <br />
                    <img
                      className={styles.shuttle}
                      src={this.state.shuttlePic[1]}
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
                the outcome room
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
                      src={this.state.shuttlePic[0]}
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
                      src={this.state.shuttlePic[1]}
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
                You will also be told about the outcome room present in each
                spaceship.
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
                find us a 3 in the <strong>{this.state.outcomeWord[0]}</strong>{" "}
                room,
                <br />
                the <strong>{this.state.stateWord[2]}</strong> room will find us
                a 1 in the <strong>{this.state.outcomeWord[1]}</strong> room,
                <br />
                and the <strong>{this.state.stateWord[5]}</strong> room will
                find us a 4 in the <strong>{this.state.outcomeWord[2]}</strong>{" "}
                room.
                <br />
                <br />
                This means the {this.state.outcomeWord[0]} room gains us 3
                coins, {this.state.outcomeWord[1]} room will lose us 4 coins,
                <br />
                while we gain/lose nothing for the {
                  this.state.outcomeWord[2]
                }{" "}
                room.
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
                choose
                <br />
                which shuttle to take to find the outcome room you want.
                <br />
                <br />
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
                      src={this.state.shuttlePic[0]}
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
                      src={this.state.shuttlePic[1]}
                      alt="shuttle2"
                    />
                  </span>
                </span>
                <br />
                You should recall the room order of each spaceship to help
                decide which shuttle
                <br />
                you should take to bring you to the spaceship with the outcome
                room that you want.
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
                      src={this.state.shuttlePic[0]}
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
                      src={this.state.shuttlePic[1]}
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
                Previously, you learned:
                <span className={styles.centerTwo}>
                  <span className={styles.spaceshipSmall}>Spaceship A</span>
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[0]}
                    alt="statePic1"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[1]}
                    alt="statePic2"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[2]}
                    alt="statePic3"
                  />
                </span>
                <br />
                You are told here that the{" "}
                <strong>{this.state.stateWord[2]}</strong> room will lead you to
                the <strong>{this.state.outcomeWord[1]}</strong> room.
                <br />
                <br />
                This means that if you choose the <strong>reliable 100%</strong>
                &nbsp;shuttle, you will board <strong>Spaceship A</strong> and
                reach the <strong>{this.state.outcomeWord[1]}</strong> room, and
                thus&nbsp;
                <strong>lose 1</strong> coin.
                <br />
                <br />
                <span className={styles.centerTwo}>
                  <span className={styles.spaceshipSmall}>Spaceship A</span>
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[0]}
                    alt="statePic1"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[1]}
                    alt="statePic2"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[2]}
                    alt="statePic3"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.outcomePic[1]}
                    alt="outcome"
                  />
                  &nbsp;&nbsp; = &nbsp;-{" "}
                  <img
                    className={styles.coin}
                    src={this.state.img_coinSmall}
                    alt="coin"
                  />
                  &nbsp;&nbsp;(lose)
                </span>
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
                      src={this.state.shuttlePic[0]}
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
                      src={this.state.shuttlePic[1]}
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
                Previously, you learnt:
                <br /> <br />
                <span className={styles.centerTwo}>
                  <span className={styles.spaceshipSmall}>Spaceship B</span>
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[3]}
                    alt="statePic4"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[4]}
                    alt="statePic5"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[5]}
                    alt="statePic6"
                  />
                  <br /> <br />
                  <span className={styles.spaceshipSmall}>Spaceship C</span>
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[6]}
                    alt="statePic7"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[7]}
                    alt="statePic8"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[8]}
                    alt="statePic9"
                  />
                </span>
                <br />
                This means that if you choose the&nbsp;
                <strong>unreliable 70%/30%</strong>
                &nbsp;shuttle, you have:
                <ul>
                  <li>
                    a 70% chance of boarding <strong>Spaceship B</strong> to
                    reach the <strong>{this.state.outcomeWord[2]}</strong> room,
                    and thus gaining/losing <strong>0 coins</strong>.
                  </li>
                  <li>
                    a 30% chance of boarding <strong>Spaceship C</strong> to
                    reach the <strong>{this.state.outcomeWord[0]}</strong> room,
                    and thus&nbsp;<strong>gaining 3 coins</strong>.
                  </li>
                </ul>
                <span className={styles.centerTwo}>
                  <span className={styles.spaceshipSmall}>Spaceship B</span>
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[3]}
                    alt="statePic4"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[4]}
                    alt="statePic5"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[5]}
                    alt="statePic6"
                  />{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.outcomePic[2]}
                    alt="outcome"
                  />
                  &nbsp;&nbsp; = &nbsp;nothing
                  <br /> <br />
                  <span className={styles.spaceshipSmall}>Spaceship C</span>
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[6]}
                    alt="statePic7"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[7]}
                    alt="statePic8"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.statePic[8]}
                    alt="statePic9"
                  />{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.stateSmall}
                    src={this.state.outcomePic[0]}
                    alt="outcome"
                  />
                  &nbsp;&nbsp; = &nbsp;+{" "}
                  <img
                    className={styles.coin}
                    src={this.state.img_coinSmall}
                    alt="coin"
                  />
                  &nbsp;&nbsp;(gain)
                </span>
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
                shuttle journey
                <br />
                to figure out which spaceship will be the best to board.
                <br />
                <br />
                You must do this <strong>in your head</strong> by remembering
                the order of the
                <br />
                connecting rooms of the spaceships and the possible outcome
                rooms.
                <br />
                <br />
                You will need to decide whether it is worth risking the
                unreliable shuttle,
                <br />
                or if you would be better off going with the reliable shuttle,
                <br />
                to get to the spaceship and find the outcome room that you want.
                <br />
                <br />
                Let us start with a practice.
                <br />
                <br />
                For the first 3 shuttle journeys, only the reliable shuttle is
                available.
                <br />
                <br />
                This so you get a chance to see what happens when you choose a
                shuttle.
                <br />
                <br />
                After that, both shuttles will be available.
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
                Great! For the next shuttle journeys, you are free to choose the
                shuttle to gain as many coins as possible.
                <br />
                <br />
                Once you have chosen your shuttle, we will also ask you to
                select the connecting room images in its correct order
                <br />
                (Room 1 to 2 to 3) of the{" "}
                <strong>spaceship that you believe you will end up in</strong>.
                <br />
                <br />
                Your selection <strong>will not influence</strong> the chance of
                getting to the spaceships.
                <br />
                <br />
                If you select the connecting room images in the wrong sequence,
                you will have a penalty of <strong>losing 1 coin</strong>.
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
                For the last 3 shuttle journeys, no{" "}
                <strong>images will be shown</strong> after selecting the room
                order.
                <br />
                <br />
                We will only tell you the outcome of your journey.
                <br />
                <br />
                As such, you will have to use your <strong>memory</strong> in
                recalling the room order of the spaceships.
                <br />
                <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to begin.
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 11) {
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

          if (this.state.trialNum <= this.state.trialTotal) {
            if (
              this.state.playCueScreen === true &&
              this.state.playPlanScreen === false &&
              this.state.playPathFull === false &&
              this.state.playPathShort === false &&
              this.state.playPathOutcomeShort === false
            ) {
              //cueScreen
              document.addEventListener("keyup", this._handleTaskKey);
              text = <div>{this.taskStart(this.state.trialNum)}</div>;
            } else if (
              this.state.playCueScreen === false &&
              this.state.playPlanScreen === true &&
              this.state.playPathFull === false &&
              this.state.playPathShort === false &&
              this.state.playPathOutcomeShort === false
            ) {
              // the planning screen
              document.addEventListener("keyup", this._handlePlanKey);
              document.removeEventListener("keyup", this._handleTaskKey);
              text = <div>{this.planStart()}</div>;
            } else if (
              this.state.playCueScreen === false &&
              this.state.playPlanScreen === false &&
              this.state.playPathFull === true &&
              this.state.playPathShort === false &&
              this.state.playPathOutcomeShort === false
            ) {
              // the path route with pics
              document.removeEventListener("keyup", this._handlePlanKey);
              document.removeEventListener("keyup", this._handleTaskKey);
              text = <div>{this.pathStart()}</div>;
            } else if (
              this.state.playCueScreen === false &&
              this.state.playPlanScreen === false &&
              this.state.playPathFull === false &&
              this.state.playPathShort === true &&
              this.state.playPathOutcomeShort === false
            ) {
              document.removeEventListener("keyup", this._handlePlanKey);
              document.removeEventListener("keyup", this._handleTaskKey);
              text = <div>{this.pathShortStart()}</div>;
            } else if (
              this.state.playCueScreen === false &&
              this.state.playPlanScreen === false &&
              this.state.playPathFull === false &&
              this.state.playPathShort === false &&
              this.state.playPathOutcomeShort === true
            ) {
              text = <div>{this.pathShortOutcomeStart()}</div>;
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
          <img src={this.state.img_astrodude3} alt="astrodude" />
        </span>
        <div className={styles.textblock}>{text}</div>
      </div>
    );
  }
}

export default withRouter(TutorTask);
