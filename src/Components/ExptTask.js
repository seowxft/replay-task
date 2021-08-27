import React from "react";
import { withRouter } from "react-router-dom";
import { DATABASE_URL } from "./config";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import styles from "./style/taskStyle.module.css";

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// GLOBAL FUNCTIONS

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className={styles.timer}>Too late!</div>;
  }

  return (
    <div className={styles.timer}>
      <span className={styles.timerValue}>{20 - remainingTime}</span>
      <span className={styles.timerText}>sec</span>
    </div>
  );
};

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

function roundTo(n, digits) {
  if (digits === undefined) {
    digits = 0;
  }

  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  var test = Math.round(n) / multiplicator;
  return +test.toFixed(digits);
}
//////////////////////////////////////////////////////////////////////////////

var shuttleIndex = [0, 1]; //0 - safe, 1 - risky
var cueOutPosIndx = [0, 1, 2]; //0-- top, 1 - middle, 2 - bottom
var cueShutPosIndx = [0, 1]; //0 - left, 1 - right
var paths = [1, 2, 3];

var forcedPaths = [1, 2, 3];
shuffle(forcedPaths);

var trialBlockTotal = 6; //the full length is 6
var trialForced = 3;
var trialFree = 14;
var trialForcedTotal = trialForced * trialBlockTotal;
var trialFreeTotal = trialFree * trialBlockTotal;
var trialTotal = trialFreeTotal + trialForcedTotal;

var trialInBlock = trialTotal / trialBlockTotal;

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// REACT COMPONENT START
class ExptTask extends React.Component {
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
      taskSessionTry: 1,
      taskSession: "ExptTask",
      instructScreenText: 1,
      sectionTime: timeString,

      img_fix: img_fix,
      img_astrodude1: img_astrodude1,
      img_astrodude2: img_astrodude2,
      img_astrodude3: img_astrodude3,
      img_counter: img_counter,
      img_coinSmall: img_coinSmall,
      img_coin: img_coin,
      img_pathInstruct1: img_pathInstruct1,

      instructScreen: true,
      taskScreen: false,

      trialTotal: trialTotal,
      trialForced: trialForced, //3 of the trials are forced choice
      trialBlock: 1,
      trialBlockTotal: trialBlockTotal,
      trialNum: 0,
      trialNumInBlock: 0,
      trialInBlock: trialInBlock,
      trialTime: 0,
      trialRT: 0,
      trialKeypress: 0,
      trialScore: 0,

      shuttleChoice: 0, //1 or 2
      shuttleWord: shuttleWord,
      shuttlePic: shuttlePic,
      stateWord: stateWord,
      statePic: statePic,
      stateIndx: stateIndx,
      stateNum: "",
      stateShown: null,
      stateDur: 2000,
      outcomeDur: 2000,
      respWaitDur: 3000,
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

      taskOutcomeValue: null,
      taskForcedChoiceText1: [],
      taskForcedChoiceText2: [],

      timerCountDur: 20,
      timerKey: 0,

      StructToRender: "",

      debug: false,
      jitter: [1200, 1300, 1400, 1500, 1600, 1700],
    };

    this.handleInstructLocal = this.handleInstructLocal.bind(this);
    this.handleDebugKeyLocal = this.handleDebugKeyLocal.bind(this);
    this.handleNextTrial = this.handleNextTrial.bind(this);
    this.taskStart = this.taskStart.bind(this);
    this.planStart = this.planStart.bind(this);
    this.pathStart = this.pathStart.bind(this);
    this.pathShortStart = this.pathShortStart.bind(this);
    this.planCheck = this.planCheck.bind(this);
    this.taskCheck = this.taskCheck.bind(this);

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
    //taskStruct 0-2: values, 3-5: probability, 6-8: EVs, 9: risky EV, 10: safe - risky EV, 11: optimal answer (1:safe, 2: risky)
    // 12 -outcome structure, 13 - forced choice?, 14 - planning trial, 15 - play long path?

    var randNum = "struct_" + getRandomInt(1, 5);
    var StructToRender = require("./taskStruct/" + randNum + ".json");

    var taskSafePathOutcome = StructToRender[0];
    var taskRiskyPathOutcome1 = StructToRender[1];
    var taskRiskyPathOutcome2 = StructToRender[2];

    var taskSafePathProb = StructToRender[3];
    var taskRiskyPathProb1 = StructToRender[4];
    var taskRiskyPathProb2 = StructToRender[5];

    var taskSafePathEV = StructToRender[6];
    var taskRiskyPathEV1 = StructToRender[7];
    var taskRiskyPathEV2 = StructToRender[8];

    var taskGambleEV = StructToRender[9]; //Risky EV1+EV2
    var taskChoiceEV = StructToRender[10]; //SafeEV - (RiskyEV1+EV2)

    var taskOptChoice = StructToRender[11];
    var taskOutcomeStruct = StructToRender[12];
    var taskForceChoice = StructToRender[13];
    var taskPlanChoice = StructToRender[14];
    var taskShowPath = StructToRender[15];

    this.setState({
      structNum: randNum,
      StructToRender: StructToRender,
      taskSafePathOutcome: taskSafePathOutcome,
      taskRiskyPathOutcome1: taskRiskyPathOutcome1,
      taskRiskyPathOutcome2: taskRiskyPathOutcome2,

      taskSafePathProb: taskSafePathProb,
      taskRiskyPathProb1: taskRiskyPathProb1,
      taskRiskyPathProb2: taskRiskyPathProb2,

      taskSafePathEV: taskSafePathEV,
      taskRiskyPathEV1: taskRiskyPathEV1,
      taskRiskyPathEV2: taskRiskyPathEV2,

      taskGambleEV: taskGambleEV, //Risky EV1+EV2
      taskChoiceEV: taskChoiceEV, //SafeEV - (RiskyEV1+EV2)
      taskOutcomeStruct: taskOutcomeStruct,
      taskOptChoice: taskOptChoice,
      taskForceChoice: taskForceChoice,
      taskPlanChoice: taskPlanChoice,
      taskShowPath: taskShowPath,
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

  handleInstructLocal(key_pressed) {
    var curText = this.state.instructScreenText;
    var whichButton = key_pressed;

    if (whichButton === 4 && curText > 1 && curText <= 4) {
      this.setState({ instructScreenText: curText - 1 });
    } else if (whichButton === 5 && curText < 4) {
      this.setState({ instructScreenText: curText + 1 });
    } else if (curText === 4 && whichButton === 10) {
      //start task
      setTimeout(
        function () {
          this.missionThree();
        }.bind(this),
        0
      );
    } else if (curText === 5 && whichButton === 10) {
      //into rest block
      setTimeout(
        function () {
          this.nextBlock();
        }.bind(this),
        0
      );
    } else if (curText === 6 && whichButton === 10) {
      //into rest block
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
        outcome = this.state.taskSafePathOutcome[trialNum - 1];
        pathIndx = 1;
        pathProb = 1;
        pathProbEnd = 1;
        pathTrans = null;
      } else if (ShuttlePos[0] === 1) {
        //I choose the risky choice
        //Then Let's roll on the probability
        pathProb = this.state.taskRiskyPathProb2[trialNum - 1]; //this is the smaller prob
        pathTrans = pathToGo(pathProb); // 0 (Risk1) or 1 (Risk2)
        pathIndx = 2;

        if (pathTrans === 0) {
          pathRoute = this.state.RiskyPath1;
          outcome = this.state.taskRiskyPathOutcome1[trialNum - 1];
          pathProbEnd = this.state.taskRiskyPathProb1[trialNum - 1];
        } else if (pathTrans === 1) {
          pathRoute = this.state.RiskyPath2;
          outcome = this.state.taskRiskyPathOutcome2[trialNum - 1];
          pathProbEnd = this.state.taskRiskyPathProb2[trialNum - 1];
        } else {
          pathRoute = "error";
          outcome = "error";
          pathProbEnd = "error";
        }
      }

      //if choose right
    } else if (keyChoice === 2) {
      choice1Fade = styles.shuttleChoiceFade;
      choice2Fade = styles.shuttleChoice;
      if (ShuttlePos[1] === 0) {
        //I choose the safe choice
        pathRoute = this.state.SafePath;
        outcome = this.state.taskSafePathOutcome[trialNum - 1];
        pathIndx = 1;
        pathProb = 1;
        pathProbEnd = 1;
        pathTrans = null;
      } else if (ShuttlePos[1] === 1) {
        //I choose the risky choice
        //Then Let's roll on the probability
        pathProb = this.state.taskRiskyPathProb2[trialNum - 1]; //this is the smaller prob
        pathTrans = pathToGo(pathProb); // 0 (Risk1) or 1 (Risk2)
        pathIndx = 2;
        if (pathTrans === 0) {
          pathRoute = this.state.RiskyPath1;
          outcome = this.state.taskRiskyPathOutcome1[trialNum - 1];
          pathProbEnd = this.state.taskRiskyPathProb1[trialNum - 1];
        } else if (pathTrans === 1) {
          pathRoute = this.state.RiskyPath2;
          outcome = this.state.taskRiskyPathOutcome2[trialNum - 1];
          pathProbEnd = this.state.taskRiskyPathProb2[trialNum - 1];
        } else {
          pathRoute = "error";
          outcome = "error";
          pathProbEnd = "error";
        }
      }
    } else {
      //if neither left or right, then nothing happens
      console.log("Choice not made.");
    }

    if (
      (this.state.trialNumInBlock <= this.state.trialForced &&
        pathIndx !== this.state.taskForceChoice[trialNum - 1]) ||
      outcome === null
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
        pathRoute: pathRoute,
        outcome: outcome,
        pathIndx: pathIndx,
        pathProbEnd: pathProbEnd,
      });

      if (this.state.taskPlanChoice[trialNum - 1] === 1) {
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
        // setTimeout(
        //   function () {
        //     this.transShip();
        //   }.bind(this),
        //   500
        // );

        if (this.state.taskShowPath[this.state.trialNum - 1] === 1) {
          setTimeout(
            function () {
              this.playStateOne();
            }.bind(this),
            500
          );
        } else if (this.state.taskShowPath[this.state.trialNum - 1] === 0) {
          //if dont show the route, go to a jitter fixation
          setTimeout(
            function () {
              this.jitterFix();
            }.bind(this),
            500
          );
        }
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
      // playTransScreen: false,
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
        // playTransScreen: false,
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
            planPathChosen = this.state.taskSafePathProb[
              this.state.trialNum - 1
            ];
          } else if (arraysEqual(planChoices, this.state.RiskyPath1)) {
            planPathChosen = this.state.taskRiskyPathProb1[
              this.state.trialNum - 1
            ];
          } else if (arraysEqual(planChoices, this.state.RiskyPath2)) {
            planPathChosen = this.state.taskRiskyPathProb2[
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

        if (this.state.taskShowPath[this.state.trialNum - 1] === 1) {
          setTimeout(
            function () {
              this.playStateOne();
            }.bind(this),
            1000
          );
        } else if (this.state.taskShowPath[this.state.trialNum - 1] === 0) {
          //if dont show the route, go to a jitter fixation
          setTimeout(
            function () {
              this.jitterFix();
            }.bind(this),
            1000
          );
        }
      }
    }
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

  jitterFix() {
    if (this.state.pathRoute !== null) {
      document.removeEventListener("keyup", this._handleTaskKey);
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
        // playTransScreen: false,
        playCueScreen: false,
        playPlanScreen: false,
        playPathShort: true,
        playPathFull: false,

        playPathOutcomeShort: false,
        stateNum: " ",

        pathNum: pathNum,
        whichShip: whichShip,
        stateShown: this.state.img_fix,
        outcomeValue: null,
        taskOutcome1: [],
        taskOutcome2: [],
        taskOutcome3: [],
        taskOutcomeValue: null,
      });

      var jitterPos = this.state.jitter;
      var jitterTime = jitterPos[Math.floor(Math.random() * jitterPos.length)]; //random jitter time

      setTimeout(
        function () {
          this.playOutcomeShort();
        }.bind(this),
        jitterTime
      );
    } else {
      setTimeout(
        function () {
          this.lateResponse();
        }.bind(this),
        1
      );
    }
  }

  playOutcomeShort() {
    document.addEventListener("keyup", this._handleNextTrialKey);
    var outcome = this.state.outcome;
    var coins = this.state.coins + outcome;
    var taskOutcomeValue = this.state.taskOutcomeValue;
    var outcomeWord;
    var outcomeIndx;
    var outcomeValue;

    if (outcome > 0) {
      outcomeIndx = 0;
      outcomeWord = this.state.outcomeWord[0];
      outcomeValue = outcome / this.state.outcomeVal[0];
      taskOutcomeValue = outcomeValue;
    } else if (outcome < 0) {
      outcomeIndx = 1;
      outcomeWord = this.state.outcomeWord[1];
      outcomeValue = outcome / this.state.outcomeVal[1];
      taskOutcomeValue = outcomeValue;
    } else if (outcome === 0) {
      outcomeIndx = 2;
      outcomeWord = this.state.outcomeWord[2];
      outcomeValue = this.state.neuVal;
      taskOutcomeValue = outcome;
    }

    this.setState({
      playPathOutcomeShort: true,
      playPathShort: false,
      stateNum: "You receive:",
      outcomeValue: outcomeValue,
      taskOutcome1: [],
      taskOutcomeValue: taskOutcomeValue, // this is what is displayed...
      taskOutcome2: [],
      coins: coins,
      taskOutcomeWord: outcomeWord,
      taskOutcomeIndx: outcomeIndx,
      taskOutcome3: "[Press the SPACEBAR to continue to the next journey]",
    });

    setTimeout(
      function () {
        this.taskSave();
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
            {this.state.taskOutcome1}
            &nbsp;
            {this.state.taskOutcome2}
          </span>
          <br />
          <span className={styles.centerThree}>{this.state.taskOutcome3}</span>
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
            {this.state.taskOutcome1}
            &nbsp;
            {this.state.taskOutcome2}
          </span>
          <br />
          <span className={styles.centerThree}>{this.state.taskOutcome3}</span>
          <br />
        </p>
      </div>
    );

    return <div>{text}</div>;
  }

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
      trialNumInBlock: 0,
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

  setTrialVar() {
    // disable the task key
    document.removeEventListener("keyup", this._handleTaskKey);
    document.removeEventListener("keyup", this._handleNextTrialKey);
    // decide Left/Right position for shuttle option (I should save this later)
    var trialTime = Math.round(performance.now());
    var trialNum = this.state.trialNum + 1;
    var trialNumInBlock = this.state.trialNumInBlock + 1;
    var cueShutPosIndx = this.state.cueShutPosIndx; //0,1
    shuffle(cueShutPosIndx);

    // decide top/mid/bot position for outcome cues
    var cueOutPosIndx = this.state.cueOutPosIndx; //0,1,2
    shuffle(cueOutPosIndx);

    var taskSafePathOutcome = this.state.taskSafePathOutcome[trialNum - 1];
    var taskRiskyPathOutcome1 = this.state.taskRiskyPathOutcome1[trialNum - 1];
    var taskRiskyPathOutcome2 = this.state.taskRiskyPathOutcome2[trialNum - 1];

    var taskSafePathProb = this.state.taskSafePathProb[trialNum - 1];
    var taskRiskyPathProb1 = this.state.taskRiskyPathProb1[trialNum - 1];
    var taskRiskyPathProb2 = this.state.taskRiskyPathProb2[trialNum - 1];

    var taskForcedChoiceText1 = this.state.taskForcedChoiceText1;
    var taskForcedChoiceText2 = this.state.taskForcedChoiceText2;

    // var taskOptChoice = this.state.taskOptChoice[trialNum - 1];
    var taskForceChoice = this.state.taskForceChoice[trialNum - 1];

    var SafePath;
    var RiskyPath1;
    var RiskyPath2;

    var paths = this.state.paths; //1,2,3
    shuffle(paths);

    //  var bool = trialNumInBlock <= this.state.trialForced;
    // console.log("Still Forced Choice? " + bool);
    // console.log("trialNumInBlock " + trialNumInBlock);
    // console.log("trialForced " + this.state.trialForced);

    if (trialNumInBlock <= this.state.trialForced) {
      //if it is a forced choice then the safe path will play each of the paths twice
      // console.log("Forced Choice");
      var forcedPath = this.state.forcedPaths[trialNumInBlock - 1];

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
    } else if (trialNumInBlock > this.state.trialForced) {
      // shuffle the paths - this is random when not a forced choice
      // decide which paths are which options
      // console.log("Free Choice");
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

    console.log("Trial No: " + trialNum);
    // console.log("Path: " + paths);
    // console.log("SafePath: " + SafePath);
    // console.log("RiskyPath1: " + RiskyPath1);
    // console.log("RiskyPath2: " + RiskyPath2);
    // console.log("Path: " + paths);
    // console.log("SafeRand1: " + SafeRand1);
    // console.log("SafeRand2: " + SafeRand2);

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
    var pathProbBoth;

    var choice1Fade = styles.shuttlePreChoice;
    var choice2Fade = styles.shuttlePreChoice;

    if (cueShutPosIndx[0] === 0) {
      //safe one is left choice
      Prob1 = taskSafePathProb * 100 + "%";
      Prob2 = taskRiskyPathProb1 * 100 + "%/" + taskRiskyPathProb2 * 100 + "%";
      pathProbBoth = [Prob1, Prob2];
      Shuttle1 = this.state.shuttlePic[0];
      Shuttle2 = this.state.shuttlePic[1];
      Shuttle1Word = this.state.stateWord[SafePathShuttlePic];
      ShuttlePicWord = [this.state.shuttleWord[0], this.state.shuttleWord[1]];
      Shuttle2Word =
        this.state.stateWord[RiskyPath1ShuttlePic] +
        "/" +
        this.state.stateWord[RiskyPath2ShuttlePic];

      // console.log("taskForceChoice: " + taskForceChoice);

      if (trialNumInBlock <= this.state.trialForced && taskForceChoice === 1) {
        taskForcedChoiceText1 = "Let us take the reliable shuttle.";
        taskForcedChoiceText2 = "[Press the ← key]";
        // choice1Fade = styles.shuttleChoice;
        // choice2Fade = styles.shuttleChoiceFade;
      } else if (
        trialNumInBlock <= this.state.trialForced &&
        taskForceChoice === 2
      ) {
        taskForcedChoiceText1 = "Let us take the unreliable shuttle.";
        taskForcedChoiceText2 = "[Press the → key]";
        // choice1Fade = styles.shuttleChoiceFade;
        // choice2Fade = styles.shuttleChoice;
      } else {
        taskForcedChoiceText1 = [];
        taskForcedChoiceText2 = "[Press the ← or → key to choose]";
        // choice1Fade = styles.shuttleChoice;
        // choice2Fade = styles.shuttleChoice;
      }
    } else if (cueShutPosIndx[0] === 1) {
      Prob1 = taskRiskyPathProb1 * 100 + "%/" + taskRiskyPathProb2 * 100 + "%";
      Prob2 = taskSafePathProb * 100 + "%";
      pathProbBoth = [Prob1, Prob2];
      ShuttlePicWord = [this.state.shuttleWord[1], this.state.shuttleWord[0]];
      Shuttle1 = this.state.shuttlePic[1];
      Shuttle2 = this.state.shuttlePic[0];
      Shuttle1Word =
        this.state.stateWord[RiskyPath1ShuttlePic] +
        "/" +
        this.state.stateWord[RiskyPath2ShuttlePic];
      Shuttle2Word = this.state.stateWord[SafePathShuttlePic];
      //safe one is right choice
      if (trialNumInBlock <= this.state.trialForced && taskForceChoice === 1) {
        taskForcedChoiceText1 = "Let us take the reliable shuttle.";
        taskForcedChoiceText2 = "[Press the → key]";
        // choice1Fade = styles.shuttleChoiceFade;
        // choice2Fade = styles.shuttleChoice;
      } else if (
        trialNumInBlock <= this.state.trialForced &&
        taskForceChoice === 2
      ) {
        taskForcedChoiceText1 = "Let us take the unreliable shuttle.";
        taskForcedChoiceText2 = "[Press the ← key]";
        // choice1Fade = styles.shuttleChoice;
        // choice2Fade = styles.shuttleChoiceFade;
      } else {
        taskForcedChoiceText1 = [];
        taskForcedChoiceText2 = "[Press the ← or → key to choose]";
        // choice1Fade = styles.shuttleChoice;
        // choice2Fade = styles.shuttleChoice;
      }
    }

    var neuVal = getRandomInt(1, 5);
    var SafeOut;
    var SafeVal;

    if (taskSafePathOutcome > 0) {
      SafeOut = this.state.outcomeWord[0];
      SafeVal = taskSafePathOutcome / this.state.outcomeVal[0];
    } else if (taskSafePathOutcome < 0) {
      SafeOut = this.state.outcomeWord[1];
      SafeVal = taskSafePathOutcome / this.state.outcomeVal[1];
    } else if (taskSafePathOutcome === 0) {
      //if this is neutral, then random a number
      SafeOut = this.state.outcomeWord[2];
      SafeVal = neuVal;
    }

    var Risky1Out;
    var Risky1Val;
    if (taskRiskyPathOutcome1 > 0) {
      Risky1Out = this.state.outcomeWord[0];
      Risky1Val = taskRiskyPathOutcome1 / this.state.outcomeVal[0];
    } else if (taskRiskyPathOutcome1 < 0) {
      Risky1Out = this.state.outcomeWord[1];
      Risky1Val = taskRiskyPathOutcome1 / this.state.outcomeVal[1];
    } else if (taskRiskyPathOutcome1 === 0) {
      Risky1Out = this.state.outcomeWord[2];
      Risky1Val = neuVal;
    }

    var Risky2Out;
    var Risky2Val;
    if (taskRiskyPathOutcome2 > 0) {
      Risky2Out = this.state.outcomeWord[0];
      Risky2Val = taskRiskyPathOutcome2 / this.state.outcomeVal[0];
    } else if (taskRiskyPathOutcome2 < 0) {
      Risky2Out = this.state.outcomeWord[1];
      Risky2Val = taskRiskyPathOutcome2 / this.state.outcomeVal[1];
    } else if (taskRiskyPathOutcome2 === 0) {
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

    // console.log("text: " + taskForcedChoiceText1);
    // console.log("text: " + taskForcedChoiceText2);
    var timerKey = this.state.timerKey + 1;

    this.setState({
      Shuttle1Word: Shuttle1Word,
      Shuttle1: Shuttle1,
      Shuttle2Word: Shuttle2Word,
      Shuttle2: Shuttle2,
      ShuttlePos: cueShutPosIndx,
      ShuttlePicWord: ShuttlePicWord,
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

      taskForcedChoiceText1: taskForcedChoiceText1,
      taskForcedChoiceText2: taskForcedChoiceText2,

      choice1Fade: choice1Fade,
      choice2Fade: choice2Fade,

      playCueScreen: true,
      playPlanScreen: false,
      // playTransScreen: false,
      playPathFull: false,
      playPathShort: false,
      playPathOutcomeShort: false,

      trialNum: trialNum,
      trialNumInBlock: trialNumInBlock,
      trialTime: trialTime,
      timerKey: timerKey,
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

    if (trialNum === 1) {
      this.setState({
        instructScreen: false,
        taskScreen: true,
      });
    }

    setTimeout(
      function () {
        this.allowResp();
      }.bind(this),
      this.state.respWaitDur
    );
  }

  allowResp() {
    document.addEventListener("keyup", this._handleTaskKey);
    var taskForceChoice = this.state.taskForceChoice[this.state.trialNum - 1];
    var trialNumInBlock = this.state.trialNumInBlock;
    var choice1Fade = this.state.choice1Fade;
    var choice2Fade = this.state.choice2Fade;

    if (this.state.ShuttlePos[0] === 0) {
      //safe one is left choice
      if (trialNumInBlock <= this.state.trialForced && taskForceChoice === 1) {
        choice1Fade = styles.shuttleChoice;
        choice2Fade = styles.shuttleChoiceFade;
      } else if (
        trialNumInBlock <= this.state.trialForced &&
        taskForceChoice === 2
      ) {
        choice1Fade = styles.shuttleChoiceFade;
        choice2Fade = styles.shuttleChoice;
      } else {
        choice1Fade = styles.shuttleChoice;
        choice2Fade = styles.shuttleChoice;
      }
    } else if (this.state.ShuttlePos[0] === 1) {
      //safe one is right choice
      if (trialNumInBlock <= this.state.trialForced && taskForceChoice === 1) {
        choice1Fade = styles.shuttleChoiceFade;
        choice2Fade = styles.shuttleChoice;
      } else if (
        trialNumInBlock <= this.state.trialForced &&
        taskForceChoice === 2
      ) {
        choice1Fade = styles.shuttleChoice;
        choice2Fade = styles.shuttleChoiceFade;
      } else {
        choice1Fade = styles.shuttleChoice;
        choice2Fade = styles.shuttleChoice;
      }
    }

    this.setState({
      choice1Fade: choice1Fade,
      choice2Fade: choice2Fade,
    });
  }

  lateResponse() {
    document.addEventListener("keyup", this._handleNextTrialKey);
    document.removeEventListener("keyup", this._handleTaskKey);
    var coins = this.state.coins - 1;
    var trialRT = Math.round(performance.now()) - this.state.trialTime;

    this.setState({
      choice1Fade: styles.shuttleChoiceFade,
      choice2Fade: styles.shuttleChoiceFade,
      taskForcedChoiceText1: "You lose 1 coin! Please respond faster.",
      taskForcedChoiceText2:
        "[Press the SPACEBAR to continue to the next journey]",
      trialRT: trialRT,
      coins: coins,
      timerOn: false,
      keyChoice: 0, //meaning that they didn't press at all
      pathProb: null,
      pathRoute: null,
      outcome: null,
      pathIndx: null,
      pathProbEnd: null,
      pathNum: null,
      taskPathPicWord: null,
      taskOutcomeWord: null,
      taskOutcomeIndx: null,
      outcomeValue: null, //i can see what number 0 is
      taskOutcomeValue: -1, //actual value
    });

    setTimeout(
      function () {
        this.taskSave();
      }.bind(this),
      0
    );
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
        <span className={styles.likeP}>
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
          <span className={styles.centerThree}>
            <CountdownCircleTimer
              isPlaying
              key={this.state.timerKey}
              duration={this.state.timerCountDur}
              size={100}
              colors={[["#004777", 0.3], ["#F7B801", 0.6], ["#A30000"]]}
              onComplete={() => {
                this.lateResponse();
                return [false];
              }}
            >
              {renderTime}
            </CountdownCircleTimer>
          </span>
          <span className={styles.centerTwo}>
            {this.state.taskForcedChoiceText1}
          </span>
          <span className={styles.centerTwo}>
            {this.state.taskForcedChoiceText2}
          </span>
        </span>
      </div>
    );

    return <div>{text}</div>;
  }

  playStateOne() {
    // if it is null, it means you were too late!!! this helps catch the inconsistent time out
    if (this.state.pathRoute !== null) {
      document.removeEventListener("keyup", this._handleTaskKey);
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
        outcomeValue: null,
        taskPathPicWord: pathPicWord,
        taskOutcome1: [],
        taskOutcome2: [],
        taskOutcomeValue: null,
        taskOutcome3: [],
      });

      setTimeout(
        function () {
          this.playFix();
        }.bind(this),
        this.state.stateDur
      );
    } else {
      setTimeout(
        function () {
          this.lateResponse();
        }.bind(this),
        1
      );
    }
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
            {this.state.taskOutcome1} {this.state.taskOutcomeValue}
            &nbsp;
            {this.state.taskOutcome2}
          </span>
          <br />
          <span className={styles.centerThree}>{this.state.taskOutcome3}</span>
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
    var taskOutcome1 = this.state.taskOutcome1;
    var coins = this.state.coins + outcome;
    var taskOutcomeValue = this.state.taskOutcomeValue;
    var outcomeWord;
    var outcomeIndx;

    if (outcome > 0) {
      outcomeIndx = 0;
      outcomeWord = this.state.outcomeWord[0];

      if (this.state.trialNumInBlock <= this.state.trialForced) {
        outcomePic = this.state.outcomePic[0];
      } else {
        outcomePic = this.state.stateHolder[1];
      }

      outcomeValue = outcome / this.state.outcomeVal[0];
      taskOutcomeValue = outcomeValue;
      taskOutcome1 = "You gain";
    } else if (outcome < 0) {
      outcomeIndx = 1;
      outcomeWord = this.state.outcomeWord[1];

      if (this.state.trialNumInBlock <= this.state.trialForced) {
        outcomePic = this.state.outcomePic[1];
      } else {
        outcomePic = this.state.stateHolder[1];
      }

      outcomeValue = outcome / this.state.outcomeVal[1];
      taskOutcomeValue = outcomeValue;
      taskOutcome1 = "You lose";
    } else if (outcome === 0) {
      outcomeIndx = 2;
      outcomeWord = this.state.outcomeWord[2];

      if (this.state.trialNumInBlock <= this.state.trialForced) {
        outcomePic = this.state.outcomePic[2];
      } else {
        outcomePic = this.state.stateHolder[1];
      }

      outcomeValue = this.state.neuVal;
      taskOutcomeValue = outcome;
      taskOutcome1 = "You gain/lose";
    }

    this.setState({
      stateNum: "You find:",
      stateShown: outcomePic,
      outcomeValue: outcomeValue,
      taskOutcome1: taskOutcome1,
      taskOutcomeValue: taskOutcomeValue,
      taskOutcome2: "coin(s)!",
      coins: coins,
      taskOutcomeWord: outcomeWord,
      taskOutcomeIndx: outcomeIndx,
      taskOutcome3: "[Press the SPACEBAR to continue to the next journey]",
    });

    setTimeout(
      function () {
        this.taskSave();
      }.bind(this),
      0
    );
  }

  taskSave() {
    var userID = this.state.userID;
    var trialForced;

    var trialOutcomeValence;

    if (this.state.outcome === 0) {
      trialOutcomeValence = 0;
    } else if (this.state.outcome === null) {
      //this only comes from late response
      trialOutcomeValence = null;
    } else {
      trialOutcomeValence = this.state.outcome / this.state.taskOutcomeValue;
    }

    if (this.state.trialNumInBlock <= this.state.trialForced) {
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
      trialBlock: this.state.trialBlock,
      trialNumInBlock: this.state.trialNumInBlock,
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

      trialSafeProb: this.state.taskSafePathProb[this.state.trialNum - 1],
      trialRiskyProb1: this.state.taskRiskyPathProb1[this.state.trialNum - 1],
      trialRiskyProb2: this.state.taskRiskyPathProb2[this.state.trialNum - 1],

      trialSafeValue: this.state.taskSafePathOutcome[this.state.trialNum - 1],
      trialRiskyValue1: this.state.taskRiskyPathOutcome1[
        this.state.trialNum - 1
      ],
      trialRiskyValue2: this.state.taskRiskyPathOutcome2[
        this.state.trialNum - 1
      ],

      trialSafePathEV: this.state.taskSafePathEV[this.state.trialNum - 1],
      trialRiskyPathEV1: this.state.taskRiskyPathEV1[this.state.trialNum - 1],
      trialRiskyPathEV2: this.state.taskRiskyPathEV2[this.state.trialNum - 1],
      trialGambleEV: this.state.taskGambleEV[this.state.trialNum - 1], //Risky EV1+EV2
      trialChoiceEV: this.state.taskChoiceEV[this.state.trialNum - 1], //SafeEV - (RiskyEV1+EV2)

      trialPlan: this.state.taskPlanChoice[this.state.trialNum - 1], //0 for not a plan trial, 1 for a plan trial
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
      trialPath: this.state.pathNum, //this should be which path
      trialPathPicWord: this.state.taskPathPicWord,
      trialPathIndx: this.state.pathRoute,
      trialOutcomePicWord: this.state.taskOutcomeWord,
      trialOutcomeIndx: this.state.taskOutcomeIndx,
      trialOutcomeValence: trialOutcomeValence, //1, -1 or 0
      trialOutcomeMag: this.state.outcomeValue, //i can see what number 0 is
      trialOutcomeValue: this.state.outcome, //actual value
      trialOptimalChoice: this.state.taskOptChoice[this.state.trialNum - 1],
      trialCoins: this.state.coins,
    };

    try {
      fetch(`${DATABASE_URL}/task_data/` + userID, {
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

    // console.log("trialInBlock: " + this.state.trialInBlock);
  }

  handleNextTrial(pressed, time_pressed) {
    var whichButton = pressed;
    if (whichButton === 10) {
      if (
        this.state.trialNumInBlock >= this.state.trialInBlock &&
        this.state.trialNum !== this.state.trialTotal
      ) {
        //end of block, send to resting screen
        setTimeout(
          function () {
            this.endBlock();
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

  endBlock() {
    document.removeEventListener("keyup", this._handleNextTrialKey);
    this.setState({
      instructScreen: true,
      taskScreen: false,
      instructScreenText: 5,
    });
  }

  nextBlock() {
    var trialBlock = this.state.trialBlock + 1;
    var forcedPaths = this.state.forcedPaths;

    shuffle(forcedPaths);

    this.setState({
      instructScreen: false,
      taskScreen: true,
      trialNumInBlock: 0, //reset for next block
      trialBlock: trialBlock,
      forcedPaths: forcedPaths,
    });

    setTimeout(
      function () {
        this.setTrialVar();
      }.bind(this),
      5
    );
  }

  passMission() {
    this.setState({
      instructScreen: true,
      taskScreen: false,
      instructScreenText: 6,
    });

    setTimeout(
      function () {
        this.calBonus();
      }.bind(this),
      0
    );
  }

  // There is a default of 2 pounds bonus - for their time?
  calBonus() {
    var coins = this.state.coins;
    var bonus = (coins / (0.4 * this.state.trialTotal)) * 2;

    // if you earn negative then no bonus at all?
    if (bonus < 0) {
      bonus = 2;
    } else {
      bonus = roundTo(bonus, 2) + 2; //2 dec pl
    }

    this.setState({
      bonus: bonus,
    });

    setTimeout(
      function () {
        this.saveBonus();
      }.bind(this),
      0
    );
  }

  saveBonus() {
    var userID = this.state.userID;

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime,
      sectionTime: this.state.sectionTime,
      taskSession: this.state.taskSession,
      taskSessionTry: this.state.taskSessionTry,
      taskCoins: this.state.coins,
      taskBonus: this.state.bonus,
    };

    try {
      fetch(`${DATABASE_URL}/bonus_data/` + userID, {
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

  nextMission() {
    document.removeEventListener("keyup", this._handleInstructKey);
    document.removeEventListener("keyup", this._handleDebugKey);
    this.props.history.push({
      pathname: `/Questionnaires`,
      state: {
        userID: this.state.userID,
        date: this.state.date,
        startTime: this.state.startTime,
        bonus: this.state.bonus,

        img_astrodude1: this.state.img_astrodude1,
        shuttlePic: this.state.shuttlePic,
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

      tutForcedPaths: null,
      tutSafePathOutcome: null,
      tutRiskyPathOutcome1: null,
      tutRiskyPathOutcome2: null,
      tutSafePathProb: null,
      tutRiskyPathProb1: null,
      tutRiskyPathProb2: null,
      tutOptChoice: null,
      tutOutcomeStruct: null,
      tutForceChoice: null,
      tutPlanChoice: null,
      tutShowPath: null,

      taskSafePathOutcome: this.state.taskSafePathOutcome,
      taskRiskyPathOutcome1: this.state.taskRiskyPathOutcome1,
      taskRiskyPathOutcome2: this.state.taskRiskyPathOutcome2,
      taskSafePathProb: this.state.taskSafePathProb,
      taskRiskyPathProb1: this.state.taskRiskyPathProb1,
      taskRiskyPathProb2: this.state.taskRiskyPathProb2,
      taskOptChoice: this.state.taskOptChoice,
      taskOutcomeStruct: this.state.taskOutcomeStruct,
      taskForceChoice: this.state.taskForceChoice,
      taskPlanChoice: this.state.taskPlanChoice,
      taskShowPath: this.state.taskShowPath,
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
          document.addEventListener("keyup", this._handleInstructKey);
          document.removeEventListener("keyup", this._handleTaskKey);
          text = (
            <div className={styles.main}>
              <span className={styles.likeP}>
                <span className={styles.center}>MISSION START</span>
                <br />
                You are now ready to start the main mission.
                <br />
                <br />
                Remember: you can earn a bonus of up to £4 if you complete the
                mission!
                <br />
                <br />
                The more coins you earn, the higher your bonus will be.
                <br />
                <br />
                Please take note of some <strong>important changes</strong> for
                the main mission:
                <ul>
                  <li>
                    You can only choose the shuttle after&nbsp;
                    <strong>{this.state.respWaitDur / 1000} seconds</strong>.
                  </li>
                  <li>
                    You will only have&nbsp;
                    <strong>{this.state.timerCountDur} seconds</strong> to plan
                    which choice to make each time.
                  </li>
                  <li>
                    A timer will be shown. If the timer runs out, you will&nbsp;
                    <strong>lose 1 coin</strong>.
                  </li>
                  <li>
                    We will only ask you to select the connecting room images in
                    its correct order <br />
                    of the{" "}
                    <strong>
                      spaceship that you believe you will end up in
                    </strong>{" "}
                    SOME of the time.
                  </li>
                </ul>
                <span className={styles.centerTwo}>
                  [<strong>NEXT →</strong>]
                </span>
              </span>
            </div>
          );
        } else if (this.state.instructScreenText === 2) {
          text = (
            <div className={styles.main}>
              <span className={styles.likeP}>
                <span className={styles.center}>MISSION START</span>
                As a last refresher, the outcome rooms you can find:
                <span className={styles.centerTwo}>
                  <img
                    className={styles.stateSmall}
                    src={this.state.outcomePic[0]}
                    alt="outcome1"
                  />
                  &nbsp;&nbsp; = &nbsp;+{" "}
                  <img
                    className={styles.coin}
                    src={this.state.img_coin}
                    alt="coin"
                  />{" "}
                  (gain)
                  <br />
                  <img
                    className={styles.stateSmall}
                    src={this.state.outcomePic[1]}
                    alt="outcome2"
                  />
                  &nbsp;&nbsp; = &nbsp;-{" "}
                  <img
                    className={styles.coin}
                    src={this.state.img_coin}
                    alt="coin"
                  />{" "}
                  (lose)
                  <br />
                  <img
                    className={styles.stateSmall}
                    src={this.state.outcomePic[2]}
                    alt="outcome3"
                  />
                  &nbsp;&nbsp; = &nbsp;none
                </span>
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>] [<strong>NEXT →</strong>]
                </span>
              </span>
            </div>
          );
        } else if (this.state.instructScreenText === 3) {
          text = (
            <div className={styles.main}>
              <span className={styles.likeP}>
                <span className={styles.center}>MISSION START</span>
                And the connecting room order of the spaceships are:
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
                  <br /> <br />
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
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>] [<strong>NEXT →</strong>]
                </span>
              </span>
            </div>
          );
        } else if (this.state.instructScreenText === 4) {
          text = (
            <div className={styles.main}>
              <span className={styles.likeP}>
                <span className={styles.center}>MISSION START</span>
                You will make {this.state.trialTotal} shuttle journeys in total
                across {this.state.trialBlockTotal} blocks.
                <br />
                <br />
                This means you will make&nbsp;
                {this.state.trialTotal / this.state.trialBlockTotal} shuttle
                journeys in each block.
                <br />
                <br />
                In the&nbsp;
                <strong>
                  first {this.state.trialForced} shuttle journeys of every block
                </strong>
                , only the <strong>reliable shuttle</strong> option will be
                available and
                <br />
                you will be shown the connecting and outcome room images.
                <br />
                <br />
                Thereafter, both shuttles will be available and&nbsp;
                <strong>no images will be shown</strong>.
                <br />
                <br />
                You will have to use your <strong>memory</strong> to decipher
                the clues and make your choices.
                <br />
                <br />
                <strong>YOUR MISSION:</strong>
                <ul>
                  <li>
                    Recall the spaceship connecting rooms and figure out which
                    spaceship you should board to gain or avoid losing coins.
                  </li>
                  <li>
                    Then, decide if it is worth the risk take the reliable or
                    unreliable shuttle according to their probabilties.
                  </li>
                </ul>
                <span className={styles.centerTwo}>
                  If you are ready to begin, please press the [
                  <strong>SPACEBAR</strong>].
                </span>
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>]
                </span>
              </span>
            </div>
          );
        } else if (this.state.instructScreenText === 5) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MID-MISSION</span>
                You have completed {this.state.trialBlock} out of&nbsp;
                {this.state.trialBlockTotal} blocks!
                <br />
                <br />
                You may take a short break.
                <br />
                <br />
                Remember: the first {this.state.trialForced} shuttle journeys
                will only have the <strong>reliable shuttle</strong> option
                available.
                <br />
                <br />
                You should take the opportunity to refresh your memory of the
                room and outcome images.
                <br />
                <span className={styles.centerTwo}>
                  If you are ready to continue, please press the [
                  <strong>SPACEBAR</strong>].
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 6) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>MISSION END</span>
                Well done! You have completed all blocks!
                <br /> <br />
                You earned {this.state.coins} coins in your mission!
                <br /> <br />
                This will be converted into a bonus at the end of the task.
                <br /> <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to continue.
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
              // this.state.playTransScreen === false &&
              this.state.playPathFull === false &&
              this.state.playPathShort === false &&
              this.state.playPathOutcomeShort === false
            ) {
              //cueScreen
              //document.addEventListener("keyup", this._handleTaskKey);
              text = <div>{this.taskStart(this.state.trialNum)}</div>;
            } else if (
              this.state.playCueScreen === false &&
              this.state.playPlanScreen === true &&
              // this.state.playTransScreen === false &&
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
              // this.state.playTransScreen === false &&
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
              // this.state.playTransScreen === false &&
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
              // this.state.playTransScreen === false &&
              this.state.playPathFull === false &&
              this.state.playPathShort === false &&
              this.state.playPathOutcomeShort === true
            ) {
              // document.removeEventListener("keyup", this._handlePlanKey);
              // document.removeEventListener("keyup", this._handleTaskKey);
              text = <div>{this.pathShortOutcomeStart()}</div>;
            }
            //
          } else {
            // finish all trials - go to end screen
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

export default withRouter(ExptTask);
