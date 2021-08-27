import React from "react";
import { withRouter } from "react-router-dom";
import { DATABASE_URL } from "./config";

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

//shuffling 2 or more arrays in the same order
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

function getRandomInt(min, max) {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);

  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

// vector of random numbers within a range
function randVec(num, min, max) {
  var arr = [];

  while (arr.length < num) {
    var minT = Math.ceil(min);
    var maxT = Math.floor(max);
    var r = Math.floor(Math.random() * (maxT - minT + 1)) + minT;
    arr.push(r);
  }
  return arr;
}

// the index for NOT answers

function otherVec(vect) {
  var arr1 = [];
  var arr2 = [];

  for (var index = 0; index < vect.length; index += 1) {
    var chosenValue;
    var altValue;

    var num = vect[index];

    if (num === 1) {
      chosenValue = Math.random() <= 0.5 ? 2 : 3;
      if (chosenValue === 2) {
        altValue = 3;
      } else {
        altValue = 2;
      }
    } else if (num === 2) {
      chosenValue = Math.random() <= 0.5 ? 1 : 3;
      if (chosenValue === 1) {
        altValue = 3;
      } else {
        altValue = 1;
      }
    } else if (num === 3) {
      chosenValue = Math.random() <= 0.5 ? 2 : 1;
      if (chosenValue === 2) {
        altValue = 1;
      } else {
        altValue = 2;
      }
    }
    arr1[index] = chosenValue;
    arr2[index] = altValue;
  }

  return [arr1, arr2];
}

//////////////////////////////////////////////////////////////////////////////

var outcomeQuizIndex = [0, 1, 2];
var outcomeQuizAnswers = ["gain", "lose", "none"];
var pathQuizIndex = [1, 2, 3];

shuffleSame(outcomeQuizIndex, outcomeQuizAnswers);

outcomeQuizIndex = outcomeQuizIndex.filter(function (val) {
  return val !== undefined;
});
outcomeQuizAnswers = outcomeQuizAnswers.filter(function (val) {
  return val !== undefined;
});

shuffle(pathQuizIndex);

var paths = [1, 2, 3];
var trialOutcomeQnTotal = 3;
var trialPathQnTotal = 3;
var trialTotal = trialOutcomeQnTotal + trialPathQnTotal;

var outcomeAnsLog = randVec(trialTotal, 1, 3); // [1,3,2,1,2,3...] gives position of answer
var outcomeNotAnsLog = otherVec(outcomeAnsLog); // gives two arrays of wrong answer position for other two options
var outcomeNotAnsLog1 = outcomeNotAnsLog[0];

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// REACT COMPONENT START
class QuizTask extends React.Component {
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
    const img_planInstruct1 = this.props.location.state.img_planInstruct1;
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
      taskSession: "QuizTask",
      instructScreenText: 1,
      sectionTime: timeString,

      img_fix: img_fix,
      img_astrodude1: img_astrodude1,
      img_astrodude2: img_astrodude2,
      img_astrodude3: img_astrodude3,
      img_counter: img_counter,
      img_coinSmall: img_coinSmall,
      img_coin: img_coin,
      img_planInstruct1: img_planInstruct1,

      instructScreen: true,
      testScreen: false,

      trialOutcomeQnTotal: trialOutcomeQnTotal,
      trialPathQnTotal: trialPathQnTotal, //3 of the trials are forced choice
      trialTotal: trialTotal,
      outcomeQuizIndex: outcomeQuizIndex,
      outcomeQuizAnswers: outcomeQuizAnswers,
      pathQuizIndex: pathQuizIndex,
      trialNum: 0,
      trialTime: 0,
      trialRT: 0,
      trialKeypress: 0,
      trialScore: 0,
      trialCor: 0,
      trialCorLog: [],

      planChoices: [],
      planRT: [],
      planCor: null,
      planChoicesWords: [],

      shuttleWord: shuttleWord,
      shuttlePic: shuttlePic,
      stateWord: stateWord,
      statePic: statePic,
      stateIndx: stateIndx,
      stateShown: null,

      stateHolder: stateHolder,
      outcomePic: outcomePic,
      outcomeWord: outcomeWord,
      outcomeVal: outcomeVal,
      outcomeIndx: outcomeIndx,

      outcomeAnsLog: outcomeAnsLog,
      outcomeNotAnsLog1: outcomeNotAnsLog1,

      coins: 0, //this is basically trialScore but long running tally..
      keyChoice: 0, //press left or right

      paths: paths,
      pathOne: pathOne,
      pathTwo: pathTwo,
      pathThree: pathThree,
      pathRoute: [],

      StructToRender: "",
      debug: false,
    };

    this.handleInstructLocal = this.handleInstructLocal.bind(this);
    this.handleDebugKeyLocal = this.handleDebugKeyLocal.bind(this);
    this.handleNextTrial = this.handleNextTrial.bind(this);
    this.outcomeTestCheck = this.outcomeTestCheck.bind(this);
    this.outcomeTestStart = this.outcomeTestStart.bind(this);
    this.planTestStart = this.planTestStart.bind(this);
    this.planCheck = this.planCheck.bind(this);

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
          this.quizStart();
        }.bind(this),
        0
      );
    } else if (curText === 5 && whichButton === 10) {
      // restart
      setTimeout(
        function () {
          this.quizRestart();
        }.bind(this),
        0
      );
    } else if (curText === 6 && whichButton === 10) {
      // to main mission
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

  _handleOutcomeTestKey = (event) => {
    var pressed;
    var time_pressed;

    switch (event.keyCode) {
      case 49:
        pressed = 1;
        time_pressed = Math.round(performance.now());
        this.outcomeTestCheck(pressed, time_pressed);
        break;
      case 50:
        pressed = 2;
        time_pressed = Math.round(performance.now());
        this.outcomeTestCheck(pressed, time_pressed);
        break;
      case 51:
        pressed = 3;
        time_pressed = Math.round(performance.now());
        this.outcomeTestCheck(pressed, time_pressed);
        break;
      //this is keycode for numpad
      case 97:
        pressed = 1;
        time_pressed = Math.round(performance.now());
        this.outcomeTestCheck(pressed, time_pressed);
        break;
      case 98:
        pressed = 2;
        time_pressed = Math.round(performance.now());
        this.outcomeTestCheck(pressed, time_pressed);
        break;
      case 99:
        pressed = 3;
        time_pressed = Math.round(performance.now());
        this.outcomeTestCheck(pressed, time_pressed);
        break;
      default:
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////

  quizRestart() {
    var outcomeQuizIndex = [0, 1, 2];
    var outcomeQuizAnswers = ["gain", "lose", "none"];
    var pathQuizIndex = [1, 2, 3];

    shuffleSame(outcomeQuizIndex, outcomeQuizAnswers);

    outcomeQuizIndex = outcomeQuizIndex.filter(function (val) {
      return val !== undefined;
    });
    outcomeQuizAnswers = outcomeQuizAnswers.filter(function (val) {
      return val !== undefined;
    });

    shuffle(pathQuizIndex);

    var outcomeAnsLog = randVec(trialTotal, 1, 3); // [1,3,2,1,2,3...] gives position of answer
    var outcomeNotAnsLog = otherVec(outcomeAnsLog); // gives two arrays of wrong answer position for other two options
    var outcomeNotAnsLog1 = outcomeNotAnsLog[0];
    var taskSessionTry = this.state.taskSessionTry + 1;
    this.setState({
      taskSessionTry: taskSessionTry,
      instructScreenText: 1,
      outcomeQuizIndex: outcomeQuizIndex,
      outcomeQuizAnswers: outcomeQuizAnswers,
      outcomeAnsLog: outcomeAnsLog,
      outcomeNotAnsLog1: outcomeNotAnsLog1,
      pathQuizIndex: pathQuizIndex,
    });
  }

  quizStart() {
    document.addEventListener("keyup", this._handleOutcomeTestKey);
    var trialTime = Math.round(performance.now());

    this.setState({
      testScreen: true,
      instructScreen: false,
      playOutcomeQuizScreen: true,
      playPlanQuizScreen: false,
      trialNum: 1,
      trialTime: trialTime,
      trialRT: 0,
      trialKeypress: 0,
      trialScore: 0,
      trialCorLog: [],
      outcomeInstruct1: "[Press the correct number key]",
      outcomeInstruct2: " ",
    });
  }

  outcomeTestStart(trialNum) {
    // which picture

    var whichOutcomePic = this.state.outcomeQuizIndex[trialNum - 1];
    var whichOutcomeAns = this.state.outcomeQuizAnswers[trialNum - 1];
    var outcomeVal2;
    var outcomeVal3;

    if (whichOutcomeAns === "gain") {
      outcomeVal2 = "lose";
      outcomeVal3 = "none";
    } else if (whichOutcomeAns === "lose") {
      outcomeVal2 = "gain";
      outcomeVal3 = "none";
    } else if (whichOutcomeAns === "none") {
      outcomeVal2 = "lose";
      outcomeVal3 = "gain";
    }

    // position of the answer
    var outcomePos1 = this.state.outcomeAnsLog[trialNum - 1];
    var outcomePos2 = this.state.outcomeNotAnsLog1[trialNum - 1];

    var ansOne;
    var ansTwo;
    var ansThree;

    if (outcomePos1 === 1) {
      ansOne = whichOutcomeAns;
    } else {
      if (outcomePos2 === 1) {
        ansOne = outcomeVal2;
      } else {
        ansOne = outcomeVal3;
      }
    }

    if (outcomePos1 === 2) {
      ansTwo = whichOutcomeAns;
    } else {
      if (outcomePos2 === 2) {
        ansTwo = outcomeVal2;
      } else {
        ansTwo = outcomeVal3;
      }
    }

    if (outcomePos1 === 3) {
      ansThree = whichOutcomeAns;
    } else {
      if (outcomePos2 === 3) {
        ansThree = outcomeVal2;
      } else {
        ansThree = outcomeVal3;
      }
    }

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
        <p>
          <span className={styles.centerTwo}>
            Q{this.state.trialNum}. What will happen if I enter this room?
          </span>
          <br />
          <span className={styles.centerTwo}>
            <img
              className={styles.state}
              src={this.state.outcomePic[whichOutcomePic]}
              alt="outcome"
            />
          </span>
          <span className={styles.centerTwo}>
            [<strong>1</strong>]: {ansOne}{" "}
            <img
              className={styles.coin}
              src={this.state.img_coinSmall}
              alt="coin"
            />
            <br />[<strong>2</strong>]: {ansTwo}{" "}
            <img
              className={styles.coin}
              src={this.state.img_coinSmall}
              alt="coin"
            />
            <br />[<strong>3</strong>]: {ansThree}{" "}
            <img
              className={styles.coin}
              src={this.state.img_coinSmall}
              alt="coin"
            />
          </span>
          <br />
          <span className={styles.centerTwo}>
            {this.state.outcomeInstruct1}
          </span>
          <br />
          <span className={styles.centerTwo}>
            {this.state.outcomeInstruct2}
          </span>
        </p>
      </div>
    );
    return <div>{text}</div>;
  }

  // function to go to next quiz question and check score
  outcomeTestCheck(pressed, time_pressed) {
    var trialNum = this.state.trialNum; //quiz question number (this needs to be rest to 1)
    var trialRT = time_pressed - this.state.trialTime;
    var corAns = this.state.outcomeAnsLog[trialNum - 1];
    var trialCorLog = this.state.trialCorLog; //[1,1,1,0...]
    var trialScore = this.state.trialScore; //sum of the correct answers
    var trialCor = this.state.trialCor;

    if (pressed === corAns) {
      trialCor = 1;
      trialCorLog[trialNum - 1] = 1;
      trialScore = trialScore + 1;
    } else {
      trialCor = 0;
      trialCorLog[trialNum - 1] = 0;
    }

    this.setState({
      trialKeypress: pressed,
      trialRT: trialRT,
      trialCor: trialCor,
      trialCorLog: trialCorLog,
      trialScore: trialScore,
    });

    setTimeout(
      function () {
        this.trialFb();
      }.bind(this),
      5
    );
  }

  trialFb() {
    document.addEventListener("keyup", this._handleNextTrialKey);
    document.removeEventListener("keyup", this._handleOutcomeTestKey);
    var outcomeInstruct1;
    if (this.state.trialCor === 1) {
      outcomeInstruct1 = "Correct!";
    } else {
      if (this.state.outcomeQuizAnswers[this.state.trialNum - 1] === "none") {
        outcomeInstruct1 = ["Incorrect. The answer is nothing!"];
      } else {
        outcomeInstruct1 = [
          "Incorrect. The answer is " +
            this.state.outcomeQuizAnswers[this.state.trialNum - 1] +
            " coins!",
        ];
      }
    }

    this.setState({
      outcomeInstruct1: outcomeInstruct1,
      outcomeInstruct2: "[Press the SPACEBAR to continue]",
    });
  }

  handleNextTrial(pressed, time_pressed) {
    var whichButton = pressed;
    if (whichButton === 10) {
      setTimeout(
        function () {
          this.trialSave();
        }.bind(this),
        0
      );
    }
  }

  trialSave() {
    document.removeEventListener("keyup", this._handleNextTrialKey);
    var userID = this.state.userID;

    var trialKeypress;
    var trialPicIndx;
    var trialPicWord;
    var trialPicAns;
    var trialPlanAns;
    var trialPlanRT;
    var trialPlanChoice;
    var trialPlanChoiceWords;
    var trialPlanPathChosen;
    var trialCor;
    var trialSection;
    var trialRT;

    // console.log(this.state.planPathChosen);

    if (this.state.trialNum <= this.state.trialOutcomeQnTotal) {
      trialSection = "Outcome";
      trialKeypress = this.state.trialKeypress;
      trialPicIndx = this.state.outcomeQuizIndex[this.state.trialNum - 1];
      trialPicWord = this.state.outcomeWord[trialPicIndx];
      trialPicAns = this.state.outcomeAnsLog[this.state.trialNum - 1];
      trialRT = this.state.trialRT;
      trialPlanAns = null;
      trialPlanRT = null;
      trialPlanChoice = null;
      trialPlanChoiceWords = null;
      trialPlanPathChosen = null;
      trialCor = this.state.trialCor;
    } else {
      trialSection = "Path";
      trialRT = null;
      trialPicIndx = null;
      trialPicWord = null;
      trialPicAns = null;
      trialKeypress = null;
      trialPlanAns = this.state.pathIndx;
      trialPlanRT = this.state.planRT;
      trialPlanChoice = this.state.planChoices;
      trialPlanChoiceWords = this.state.planChoicesWords;
      trialPlanPathChosen = this.state.planPathChosen;
      trialCor = this.state.planCor;
    }

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime, // this is when they start the expt
      sectionTime: this.state.sectionTime, //this is if they somehow refresh the page...
      taskSession: this.state.taskSession,
      taskSessionTry: this.state.taskSessionTry,
      trialSection: trialSection,
      trialTime: this.state.trialTime,
      trialNum: this.state.trialNum,
      trialRT: trialRT,

      trialKeypress: trialKeypress,
      trialPicIndx: trialPicIndx,
      trialPicWord: trialPicWord,
      trialPicAns: trialPicAns,

      trialPlanAns: trialPlanAns, //0 for not a plan trial, 1 for a plan trial
      trialPlanRT: trialPlanRT,
      trialPlanChoice: trialPlanChoice,
      trialPlanChoiceWords: trialPlanChoiceWords,
      trialPlanPathChosen: trialPlanPathChosen,
      trialCor: trialCor,
      trialScore: this.state.trialScore,
    };

    try {
      fetch(`${DATABASE_URL}/quiz_test/` + userID, {
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
    console.log(saveString);
    //lag a bit to make sure statestate is saved
    setTimeout(
      function () {
        this.trialNext();
      }.bind(this),
      10
    );
  }

  trialNext() {
    var trialNum = this.state.trialNum + 1;
    var trialTime = Math.round(performance.now());

    if (trialNum < 4) {
      document.addEventListener("keyup", this._handleOutcomeTestKey);

      this.setState({
        trialTime: trialTime,
        trialNum: trialNum,
        trialKeypress: 0,
        trialCor: null,
        outcomeInstruct1: "[Press the correct number key]",
        outcomeInstruct2: " ",
      });
    } else if (trialNum === 4) {
      document.addEventListener("keyup", this._handlePlanKey);

      this.setState({
        trialTime: trialTime,
        trialNum: trialNum,
        keyChoiceAll: [],
        trialKeypress: 0,
        planCor: null,
        planCurrentChoice: 1,
        planInstruct1: "[Press the correct number key]",
        planInstruct2: " ",
        planPathChosen: 0,
        statePlan1Style: styles.statePlan,
        statePlan2Style: styles.statePlan,
        statePlan3Style: styles.statePlan,
        statePlan4Style: styles.statePlan,
        statePlan5Style: styles.statePlan,
        statePlan6Style: styles.statePlan,
      });

      setTimeout(
        function () {
          this.selectPlanStates();
        }.bind(this),
        0
      );

      //go to select plan states
    } else if (trialNum > 4 && trialNum <= this.state.trialTotal) {
      document.addEventListener("keyup", this._handlePlanKey);

      this.setState({
        trialTime: trialTime,
        trialNum: trialNum,
        trialKeypress: 0,
        planPathChosen: 0,
        keyChoiceAll: [],
        planCor: null,
        planCurrentChoice: 1,
        planInstruct1: "[Press the correct number key]",
        planInstruct2: " ",
        statePlan1Style: styles.statePlan,
        statePlan2Style: styles.statePlan,
        statePlan3Style: styles.statePlan,
        statePlan4Style: styles.statePlan,
        statePlan5Style: styles.statePlan,
        statePlan6Style: styles.statePlan,
      });

      setTimeout(
        function () {
          this.selectPlanStates();
        }.bind(this),
        0
      );
    } else if (trialNum > this.state.trialTotal) {
      // end quiz
      setTimeout(
        function () {
          this.endQuiz();
        }.bind(this),
        0
      );
    }
  }

  selectPlanStates() {
    //if choose safe option, then state shown is 100% path and a random other path
    //if choose risky option, then state shown is between the risky paths
    var path1;
    var path2;

    var trialNumForPath = this.state.trialNum - this.state.trialOutcomeQnTotal;
    var pathIndx = this.state.pathQuizIndex[trialNumForPath - 1]; //which ship
    var whichShip;

    var rand = getRandomInt(1, 2);
    if (pathIndx === 1) {
      whichShip = "Spaceship A";
      if (rand === 1) {
        path1 = this.state.pathOne;
        path2 = this.state.pathTwo;
      } else {
        path1 = this.state.pathOne;
        path2 = this.state.pathThree;
      }
    } else if (pathIndx === 2) {
      whichShip = "Spaceship B";
      if (rand === 1) {
        path1 = this.state.pathTwo;
        path2 = this.state.pathThree;
      } else {
        path1 = this.state.pathTwo;
        path2 = this.state.pathOne;
      }
    } else if (pathIndx === 3) {
      whichShip = "Spaceship C";
      if (rand === 1) {
        path1 = this.state.pathThree;
        path2 = this.state.pathTwo;
      } else {
        path1 = this.state.pathThree;
        path2 = this.state.pathOne;
      }
    }

    var bothPath = shuffle(path1.concat(path2));

    this.setState({
      playOutcomeQuizScreen: false,
      playPlanQuizScreen: true,
      whichShip: whichShip,
      pathIndx: pathIndx,
      bothPath: bothPath, //[0,2,8,1,6,7]
      statePlan1: this.state.statePic[bothPath[0]],
      statePlan2: this.state.statePic[bothPath[1]],
      statePlan3: this.state.statePic[bothPath[2]],
      statePlan4: this.state.statePic[bothPath[3]],
      statePlan5: this.state.statePic[bothPath[4]],
      statePlan6: this.state.statePic[bothPath[5]],
    });
  }

  planTestStart() {
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
        <p>
          <span className={styles.centerTwo}>
            Q{this.state.trialNum}. Choose the room images of{" "}
            <strong>{this.state.whichShip}</strong> in order.
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
          <span className={styles.centerTwo}>{this.state.planInstruct1}</span>
          <br />
          <span className={styles.centerTwo}>{this.state.planInstruct2}</span>
        </p>
      </div>
    );

    return <div>{text}</div>;
  }

  planCheck(pressed, time_pressed) {
    var trialRT = time_pressed - this.state.planTime;
    var keyChoice = pressed;
    var keyChoiceAll = this.state.keyChoiceAll; //havent made this array yet

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
        document.removeEventListener("keyup", this._handlePlanKey);
        document.addEventListener("keyup", this._handleNextTrialKey);
        // check if correct?
        // the order has to be right!
        var samePathOne = arraysEqual(planChoices, this.state.pathOne);
        var samePathTwo = arraysEqual(planChoices, this.state.pathTwo);
        var samePathThree = arraysEqual(planChoices, this.state.pathThree);

        var planPathChosen = this.state.planPathChosen;

        if (
          samePathOne === true ||
          samePathTwo === true ||
          samePathThree === true
        ) {
          // if correct, which path did they think they were gonna go?

          if (samePathOne) {
            planPathChosen = 1;
          } else if (samePathTwo) {
            planPathChosen = 2;
          } else if (samePathThree) {
            planPathChosen = 3;
          }

          if (planPathChosen === this.state.pathIndx) {
            var trialScore = this.state.trialScore + 1;
            this.setState({
              planCor: 1,
              planInstruct1: "Correct!",
              planInstruct2: "[Press the SPACEBAR to continue]",
              planCurrentChoice: 3, //keep the number on screen
              trialScore: trialScore,
              planPathChosen: planPathChosen,
            });
          } else {
            this.setState({
              planCor: 0,
              planInstruct1: "Incorrect spaceship!",
              planInstruct2: "[Press the SPACEBAR to continue]",
              planCurrentChoice: 3, //keep the number on screen
              planPathChosen: planPathChosen,
            });
          }
        } else {
          this.setState({
            planCor: 0,
            planInstruct1: "Incorrect! No such order for any spaceship!",
            planInstruct2: "[Press the SPACEBAR to continue]",
            planCurrentChoice: 3,
            planPathChosen: planPathChosen,
          });
        }
      }
    }
  }

  endQuiz() {
    document.removeEventListener("keyup", this._handleNextTrialKey);
    document.addEventListener("keyup", this._handleInstructKey);
    if (this.state.trialScore === this.state.trialTotal) {
      this.setState({
        instructScreen: true,
        testScreen: false,
        playOutcomeQuizScreen: true,
        playPlanQuizScreen: false,
        instructScreenText: 6,
      });
    } else {
      this.setState({
        instructScreen: true,
        testScreen: false,
        playOutcomeQuizScreen: true,
        playPlanQuizScreen: false,
        instructScreenText: 5,
      });
    }
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

        shuttlePic: this.state.shuttlePic,
        shuttleWord: this.state.shuttleWord,

        img_fix: this.state.img_fix,
        img_astrodude1: this.state.img_astrodude1,
        img_astrodude2: this.state.img_astrodude2,
        img_astrodude3: this.state.img_astrodude3,
        img_counter: this.state.img_counter,
        img_coinSmall: this.state.img_coinSmall,
        img_coin: this.state.img_coin,
        img_planInstruct1: this.state.img_planInstruct1,
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

  //////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////
  // render time

  render() {
    let text;
    if (this.state.debug === false) {
      if (this.state.instructScreen === true) {
        if (this.state.instructScreenText === 1) {
          document.addEventListener("keyup", this._handleInstructKey);
          text = (
            <div className={styles.main}>
              <span className={styles.likeP}>
                <span className={styles.center}>QUIZ START</span>
                <br />
                Before we start the main mission, let us check with a quick quiz
                if you have
                <br />
                learnt the outcomes and room order of the spaceships well.
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
                <span className={styles.center}>QUIZ START</span>
                As a refresher, the outcome rooms you can find:
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
                <span className={styles.center}>QUIZ START</span>
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
              <p>
                <span className={styles.center}>QUIZ START</span>
                <br />
                We will ask you {this.state.trialOutcomeQnTotal} questions on
                the outcome rooms and {this.state.trialPathQnTotal} questions on
                the room order of the spaceships.
                <br /> <br />
                Note: You will have to answer <strong>all</strong> questions
                correctly to continue to the main task.
                <br /> <br />
                If you fail, you will be directed to the beginning of the
                instructions for this quiz to try again.
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to start the quiz.
                </span>
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 5) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>QUIZ</span>
                <br />
                Unforuntately, you only had {this.state.trialScore}/
                {this.state.trialTotal} correct!
                <br /> <br />
                Let us go through the instructions and try again.
                <br /> <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to try again.
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 6) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>QUIZ END</span>
                Great, you had {this.state.trialScore}/{this.state.trialTotal}
                &nbsp;correct!
                <br /> <br />
                Let us begin the main task.
                <br /> <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to continue.
                </span>
              </p>
            </div>
          );
        }
      } else if (this.state.instructScreen === false) {
        if (this.state.testScreen === true) {
          document.removeEventListener("keyup", this._handleInstructKey);

          if (
            this.state.playOutcomeQuizScreen === true &&
            this.state.playPlanQuizScreen === false
          ) {
            //outcome

            text = <div> {this.outcomeTestStart(this.state.trialNum)}</div>;
          } else if (
            this.state.playOutcomeQuizScreen === false &&
            this.state.playPlanQuizScreen === true
          ) {
            //test the order of the spaceships

            text = <div> {this.planTestStart(this.state.trialNum)}</div>;
          }
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

export default withRouter(QuizTask);
