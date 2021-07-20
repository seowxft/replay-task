import React from "react";
import { withRouter } from "react-router-dom";
import { DATABASE_URL } from "./config";

import state1 from "./states/baby.jpg";
import state2 from "./states/backpack.jpg";
import state3 from "./states/bicycle.jpg";
import state4 from "./states/bowtie.jpg";
import state5 from "./states/hourglass.jpg";
import state6 from "./states/house.jpg";
import state7 from "./states/lamp.jpg";
import state8 from "./states/toothbrush.jpg";
import state9 from "./states/zebra.jpg";
import state10 from "./states/car.jpg";
import state11 from "./states/cat.jpg";
import state12 from "./states/cupcake.jpg";

import astrodude from "./img/astro_1.png";
import counter from "./img/shuttle_red.png";
import coin from "./img/coin_small.png";

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

//element-wise multiplication for vector
function multVec(a, b) {
  return a.map((e, i) => e * b[i]);
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

// flip sign of elements in vector, and * the multiplier if the real ans is 0
function flipSign(vect, vect2) {
  var arr = [];
  for (var index = 0; index < vect.length; index += 1) {
    var posNum;

    if (vect[index] === 0) {
      posNum = 1 * vect2[index];
    } else {
      posNum = vect[index] * -1;
    }

    arr[index] = posNum;
  }
  return arr;
}

// if it is zero, and * the multiplier if the real ans is 0
function flipZero(vect, vect2) {
  var arr = [];
  for (var index = 0; index < vect.length; index += 1) {
    var posNum;

    if (vect[index] === 0) {
      posNum = -1 * vect2[index];
    } else {
      posNum = 0;
    }

    arr[index] = posNum;
  }
  return arr;
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

var trialTotal = 9;
// var outcomeWord = ["car", "cat", "cupcake"];
// var outcomePic = [outcome1, outcome2, outcome3];
var outcomeVal = [1, -1, 0];
var outcomeIndx = [0, 1, 2];

var stateWord = [
  "baby",
  "backpack",
  "bicycle",
  "bowtie",
  "hourglass",
  "house",
  "lamp",
  "toothbrush",
  "zebra",
  "car",
  "cat",
  "cupcake",
];

var statePic = [
  state1,
  state2,
  state3,
  state4,
  state5,
  state6,
  state7,
  state8,
  state9,
  state10,
  state11,
  state12,
];

shuffleSame(stateWord, statePic);

stateWord = stateWord.filter(function (val) {
  return val !== undefined;
});
statePic = statePic.filter(function (val) {
  return val !== undefined;
});

var outcomePic = [statePic[0], statePic[1], statePic[2]];
var outcomeWord = [stateWord[0], stateWord[1], stateWord[2]];

var roomPic = [
  statePic[3],
  statePic[4],
  statePic[5],
  statePic[6],
  statePic[7],
  statePic[8],
  statePic[9],
  statePic[10],
  statePic[11],
];
var roomWord = [
  stateWord[3],
  stateWord[4],
  stateWord[5],
  stateWord[6],
  stateWord[7],
  stateWord[8],
  stateWord[9],
  stateWord[10],
  stateWord[11],
];
/////////////////////////////////////////////////////////////////////////////////
// Plan the outcome memory test here

// There will be 9 trials, they have to pass 65%?
var outcomeMultLog = [1, 1, 2, 2, 3, 3, 4, 4, 5];
var outcomeIndxLog = outcomeIndx.concat(outcomeIndx.concat(outcomeIndx)); // [0,2,1,2,1,0...]
var outcomeValPreLog = outcomeVal.concat(outcomeVal.concat(outcomeVal)); // [0,-1,1,-1,1,0...]

shuffle(outcomeMultLog);
shuffleSame(outcomeIndxLog, outcomeValPreLog);

outcomeIndxLog = outcomeIndxLog.filter(function (val) {
  return val !== undefined;
});
outcomeValPreLog = outcomeValPreLog.filter(function (val) {
  return val !== undefined;
});

// the actual values for the answers
var outcomeValLog = multVec(outcomeValPreLog, outcomeMultLog); //[0,-1,1,-1,1,0...] * [1,2,3,1,4...] = [0,-2,3,-1,4...]
var outcomeNotValLog1 = flipSign(outcomeValLog, outcomeMultLog); //wrong answer 1
var outcomeNotValLog2 = flipZero(outcomeValLog, outcomeMultLog); //wrong answer 2

var outcomeAnsLog = randVec(trialTotal, 1, 3); // [1,3,2,1,2,3...] gives position of answer
var outcomeNotAnsLog = otherVec(outcomeAnsLog); // gives two arrays of wrong answer position for other two options
var outcomeNotAnsLog1 = outcomeNotAnsLog[0];
// var outcomeNotAnsLog2 = outcomeNotAnsLog[1];

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// REACT COMPONENT START
class OutcomeTask extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.location.state.userID;
    const date = this.props.location.state.date;
    const startTime = this.props.location.state.startTime;

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
      taskSession: "OutcomeTask",
      instructScreenText: 1,

      outcomePic: outcomePic,
      outcomeWord: outcomeWord,
      outcomeVal: outcomeVal, // [1, -1, 0];
      outcomeIndx: outcomeIndx,

      roomPic: roomPic,
      roomWord: roomWord,

      outcomeIndxLog: outcomeIndxLog,
      outcomeMultLog: outcomeMultLog,
      outcomeValPreLog: outcomeValPreLog,
      outcomeValLog: outcomeValLog,
      outcomeNotValLog1: outcomeNotValLog1,
      outcomeNotValLog2: outcomeNotValLog2,

      outcomeAnsLog: outcomeAnsLog,
      outcomeNotAnsLog1: outcomeNotAnsLog1,
      // outcomeNotAnsLog2: outcomeNotAnsLog2,

      trialNum: 1,
      trialTotal: trialTotal,
      trialRT: 0,
      trialTime: 0,
      trialKeypress: 0,
      trialCorLog: [],
      trialScore: 0,

      // trialPicIndx: null,
      // trialPicWord: null,
      // trialPicNum: null,
      // trialPicValue: null,
      // trialPicAns: null,
      trialCor: null,

      instructScreen: true,
      testScreen: false,

      debug: false, //if true, skip this section
    };

    this.handleInstructLocal = this.handleInstructLocal.bind(this);
    this.handleDebugKeyLocal = this.handleDebugKeyLocal.bind(this);
    this.testCheck = this.testCheck.bind(this);
    this.testStart = this.testStart.bind(this);

    /* prevents page from going down when space bar is hit .*/
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    });
  }
  /////////////////////////////////////////////////////////////////////////////////
  // END COMPONENT STATE

  // This handles instruction screen within the component USING KEYBOARD
  handleInstructLocal(key_pressed) {
    var curText = this.state.instructScreenText;
    var whichButton = key_pressed;

    if (whichButton === 4 && curText > 1) {
      this.setState({ instructScreenText: curText - 1 });
    } else if (whichButton === 5 && curText < 6) {
      this.setState({ instructScreenText: curText + 1 });
    } else if (curText === 6 && whichButton === 10) {
      //startmissionOne
      setTimeout(
        function () {
          this.missionOne();
        }.bind(this),
        0
      );
    } else if (curText === 7 && whichButton === 10) {
      //restart
      this.setState({
        instructScreenText: 1,
      });
    } else if (curText === 8 && whichButton === 10) {
      //go to pathtask
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

  _handleTestKey = (event) => {
    var pressed;
    var time_pressed;

    switch (event.keyCode) {
      case 49:
        pressed = 1;
        time_pressed = Math.round(performance.now());
        this.testCheck(pressed, time_pressed);
        break;
      case 50:
        pressed = 2;
        time_pressed = Math.round(performance.now());
        this.testCheck(pressed, time_pressed);
        break;
      case 51:
        pressed = 3;
        time_pressed = Math.round(performance.now());
        this.testCheck(pressed, time_pressed);
        break;
      //this is keycode for numpad
      case 97:
        pressed = 1;
        time_pressed = Math.round(performance.now());
        this.testCheck(pressed, time_pressed);
        break;
      case 98:
        pressed = 2;
        time_pressed = Math.round(performance.now());
        this.testCheck(pressed, time_pressed);
        break;
      case 99:
        pressed = 3;
        time_pressed = Math.round(performance.now());
        this.testCheck(pressed, time_pressed);
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
  // END COMPONENT PROPS

  missionOne() {
    var trialTime = Math.round(performance.now());
    this.setState({
      instructScreen: false,
      testScreen: true,
      trialNum: 1,
      trialTime: trialTime,
      trialRT: 0,
      trialKeypress: 0,
      trialCorLog: [],
      trialScore: 0,
    });
  }

  testStart(trialNum) {
    // which picture

    var whichOutcomePic = this.state.outcomeIndxLog[trialNum - 1];

    //how many pics
    var numOutcomePic = this.state.outcomeMultLog[trialNum - 1];

    //value of the answer
    var outcomeVal1 = this.state.outcomeValLog[trialNum - 1];
    var outcomeVal2 = this.state.outcomeNotValLog1[trialNum - 1];
    var outcomeVal3 = this.state.outcomeNotValLog2[trialNum - 1];

    // position of the answer
    var outcomePos1 = this.state.outcomeAnsLog[trialNum - 1];
    var outcomePos2 = this.state.outcomeNotAnsLog1[trialNum - 1];
    // var outcomePos3 = this.state.outcomeNotAnsLog2[trialNum - 1];

    var ansOne;
    var ansTwo;
    var ansThree;

    // console.log(this.state.outcomeValLog);
    // console.log(this.state.outcomeNotValLog1);
    // console.log(this.state.outcomeNotValLog1);
    // console.log(this.state.outcomeAnsLog);
    // console.log(this.state.outcomeNotAnsLog1);
    // console.log(this.state.outcomeNotAnsLog2);

    if (outcomePos1 === 1) {
      ansOne = outcomeVal1;
    } else {
      if (outcomePos2 === 1) {
        ansOne = outcomeVal2;
      } else {
        ansOne = outcomeVal3;
      }
    }

    if (outcomePos1 === 2) {
      ansTwo = outcomeVal1;
    } else {
      if (outcomePos2 === 2) {
        ansTwo = outcomeVal2;
      } else {
        ansTwo = outcomeVal3;
      }
    }

    if (outcomePos1 === 3) {
      ansThree = outcomeVal1;
    } else {
      if (outcomePos2 === 3) {
        ansThree = outcomeVal2;
      } else {
        ansThree = outcomeVal3;
      }
    }

    // console.log(ansOne);
    // console.log(ansTwo);
    // console.log(ansThree);

    let text = (
      <div className={styles.main}>
        <div className={styles.counter}>
          <img className={styles.counter} src={counter} alt="counter" />
          {this.state.trialNum}/{this.state.trialTotal}
        </div>
        <p>
          <span className={styles.centerTwo}>
            How many coins will I gain or lose?
          </span>
          <br />
          <span className={styles.centerTwo}>
            {numOutcomePic} X &nbsp;&nbsp;&nbsp;
            <img
              className={styles.state}
              src={this.state.outcomePic[whichOutcomePic]}
              alt="outcome"
            />
          </span>
          <span className={styles.centerTwo}>
            <br />[<strong>1</strong>]: {ansOne}{" "}
            <img className={styles.coin} src={coin} alt="coin" />
            <br />[<strong>2</strong>]: {ansTwo}{" "}
            <img className={styles.coin} src={coin} alt="coin" />
            <br />[<strong>3</strong>]: {ansThree}{" "}
            <img className={styles.coin} src={coin} alt="coin" />
          </span>
          <span className={styles.centerTwo}>
            [Press the correct number key]
          </span>
        </p>
      </div>
    );
    return <div>{text}</div>;
  }

  // function to go to next quiz question and check score
  testCheck(pressed, time_pressed) {
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
        this.trialSave();
      }.bind(this),
      5
    );
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
      structNum: null,

      outcomeWord: this.state.outcomeWord,
      outcomeVal: this.state.outcomeVal,
      outcomeIndx: this.state.outcomeIndx,
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
      tutForceChoice: null,
      tutPlanChoice: null,

      taskSafePathOutcome: null,
      taskRiskyPathOutcome1: null,
      taskRiskyPathOutcome2: null,
      taskSafePathProb: null,
      taskRiskyPathProb1: null,
      taskRiskyPathProb2: null,
      taskOptChoice: null,
      taskForceChoice: null,
      taskPlanChoice: null,
    };

    console.log(saveString);

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

  trialSave() {
    var userID = this.state.userID;
    var trialPicIndx = this.state.outcomeIndxLog[this.state.trialNum - 1];
    var trialPicWord = this.state.outcomeWord[trialPicIndx];

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime, // this is when they start the expt
      sectionTime: this.state.sectionTime, //this is if they somehow refresh the page...
      taskSession: this.state.taskSession,
      taskSessionTry: this.state.taskSessionTry,
      trialTime: this.state.trialTime,
      trialNum: this.state.trialNum,
      trialPicIndx: trialPicIndx,
      trialPicWord: trialPicWord,
      trialPicNum: this.state.outcomeMultLog[this.state.trialNum - 1],
      trialPicValue: this.state.outcomeValLog[this.state.trialNum - 1],
      trialPicAns: this.state.outcomeAnsLog[this.state.trialNum - 1],
      trialRT: this.state.trialRT,
      trialKeypress: this.state.trialKeypress,
      trialCor: this.state.trialCor,
      trialScore: this.state.trialScore,
    };

    try {
      fetch(`${DATABASE_URL}/outcome_test/` + userID, {
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

    this.setState({
      trialTime: trialTime,
      trialNum: trialNum,
      trialKeypress: 0,
      // trialPicIndx: null,
      // trialPicNum: null,
      // trialPicValue: null,
      // trialPicAns: null,
      trialCor: null,
    });
  }

  missionOneRestart() {
    //resetVariables
    var taskSessionTry = this.state.taskSessionTry + 1;

    var outcomeMultLog = this.state.outcomeMultLog;
    var outcomeIndxLog = this.state.outcomeIndxLog;
    var outcomeValPreLog = this.state.outcomeValPreLog;

    shuffle(outcomeMultLog);
    shuffleSame(outcomeIndxLog, outcomeValPreLog);

    outcomeIndxLog = outcomeIndxLog.filter(function (val) {
      return val !== undefined;
    });
    outcomeValPreLog = outcomeValPreLog.filter(function (val) {
      return val !== undefined;
    });

    // the actual values for the answers
    var outcomeValLog = multVec(outcomeValPreLog, outcomeMultLog); //[0,-1,1,-1,1,0...] * [1,2,3,1,4...] = [0,-2,3,-1,4...]
    var outcomeNotValLog1 = flipSign(outcomeValLog, outcomeMultLog); //wrong answer 1
    var outcomeNotValLog2 = flipZero(outcomeValLog, outcomeMultLog); //wrong answer 2

    var outcomeAnsLog = randVec(this.state.trialTotal, 1, 3); // [1,3,2,1,2,3...] gives position of answer
    var outcomeNotAnsLog = otherVec(outcomeAnsLog); // gives two arrays of wrong answer position for other two options
    var outcomeNotAnsLog1 = outcomeNotAnsLog[0];
    // var outcomeNotAnsLog2 = outcomeNotAnsLog[1];

    // console.log(outcomeAnsLog);
    // console.log(outcomeNotAnsLog);

    this.setState({
      taskSessionTry: taskSessionTry,
      instructScreen: true,
      testScreen: false,
      instructScreenText: 7,

      //this changes the test ans, but DOES NOT change the outcomeVal
      outcomeIndxLog: outcomeIndxLog,
      outcomeMultLog: outcomeMultLog,
      outcomeValPreLog: outcomeValPreLog,
      outcomeValLog: outcomeValLog,
      outcomeNotValLog1: outcomeNotValLog1,
      outcomeNotValLog2: outcomeNotValLog2,
      outcomeAnsLog: outcomeAnsLog,
      outcomeNotAnsLog1: outcomeNotAnsLog1,
      // outcomeNotAnsLog2: outcomeNotAnsLog2,
    });

    //send the outcomeTask conditions?
    setTimeout(
      function () {
        this.condSave();
      }.bind(this),
      0
    );
  }

  passMission() {
    this.setState({
      instructScreen: true,
      testScreen: false,
      instructScreenText: 8,
    });
  }

  nextMission() {
    document.removeEventListener("keyup", this._handleInstructKey);
    document.removeEventListener("keyup", this._handleDebugKey);
    this.props.history.push({
      pathname: `/PathTask`,
      state: {
        userID: this.state.userID,
        date: this.state.date,
        startTime: this.state.startTime,

        outcomePic: this.state.outcomePic,
        outcomeWord: this.state.outcomeWord,
        outcomeVal: this.state.outcomeVal,
        outcomeIndx: this.state.outcomeIndx,

        roomPic: this.state.roomPic,
        roomWord: this.state.roomWord,
      },
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    //send the outcomeTask conditions?
    let imagesPreload = [statePic, outcomePic];

    imagesPreload.forEach((image) => {
      const newImage = new Image();
      newImage.src = image;
      window[image] = newImage;
    });

    setTimeout(
      function () {
        this.condSave();
      }.bind(this),
      0
    );
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
              <p>
                <span className={styles.center}>
                  Hello and welcome to the space mission control centre!
                </span>
                <br />
                Welcome onboard!
                <br /> <br />
                For today&apos;s mission, we will be taking shuttles to our
                spaceships
                <br />
                to find pictures of certain objects.
                <br /> <br />
                One of these pictures are valuable, and you can{" "}
                <strong>earn coins</strong>.
                <br /> <br />
                One of these pictures are undesirable, and you can{" "}
                <strong>lose coins</strong>.
                <br /> <br />
                The more valuable pictures you find, the more coins you will
                earn,
                <br />
                and the higher your bonus will be, up to a maximum of{" "}
                <strong>£4</strong>!
                <br /> <br />
                Before we begin, you will need to learn several things.
                <br /> <br />
                <span className={styles.centerTwo}>
                  <i>(Use the ← → keys to navigate the pages.)</i>
                </span>
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
                <span className={styles.center}>TUTORIAL I</span>
                <br />
                The first is, when we board a spaceship, we will find one of
                these pictures:
                <br /> <br />
                <span className={styles.centerTwo}>
                  <img
                    className={styles.state}
                    src={this.state.outcomePic[0]}
                    alt="outcome1"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;or&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.state}
                    src={this.state.outcomePic[1]}
                    alt="outcome2"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;or&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    className={styles.state}
                    src={this.state.outcomePic[2]}
                    alt="outcome3"
                  />
                </span>
                <br />
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>] [<strong>NEXT →</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 3) {
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>TUTORIAL I</span>
                <br />
                If we find:
                <br />
                <span className={styles.centerTwo}>
                  <img
                    className={styles.state}
                    src={this.state.outcomePic[0]}
                    alt="outcome1"
                  />
                </span>
                <br />
                This picture is valuable and we can exchange it for coins.
                <br /> <br />
                In other words, if we find 3 {this.state.outcomeWord[0]}s, we
                earn 3 <img className={styles.coin} src={coin} alt="coin" />.
                <br /> <br />
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
                <span className={styles.center}>TUTORIAL I</span>
                <br />
                However, if we find:
                <br />
                <span className={styles.centerTwo}>
                  <img
                    className={styles.state}
                    src={this.state.outcomePic[1]}
                    alt="outcome2"
                  />
                </span>
                <br />
                This picture is undesirable, and we will be fined coins.
                <br /> <br />
                In other words, if we find 2 {this.state.outcomeWord[1]}s, we
                lose 2 <img className={styles.coin} src={coin} alt="coin" />.
                <br /> <br />
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
                <span className={styles.center}>TUTORIAL I</span>
                <br />
                Alternatively, if we find:
                <br />
                <span className={styles.centerTwo}>
                  <img
                    className={styles.state}
                    src={this.state.outcomePic[2]}
                    alt="outcome3"
                  />
                </span>
                <br />
                This picture is neutral, and we will not gain or lose coins for
                it.
                <br /> <br />
                In other words, even if we find 5 {this.state.outcomeWord[2]}s,
                we earn/lose 0{" "}
                <img className={styles.coin} src={coin} alt="coin" />.
                <br /> <br />
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
                <span className={styles.center}>TUTORIAL I</span>
                <br />
                For your first tutorial, let us check if you understood what is
                valuable for us to find.
                <br /> <br />
                When we find a picture, you simply have to tell us how many
                coins you gain or lose.
                <br /> <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to start the tutorial.
                </span>
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 7) {
          // IF YOU FAIL THE TEST, YOU RESTART
          document.addEventListener("keyup", this._handleInstructKey);
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>TUTORIAL I</span>
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
        } else if (this.state.instructScreenText === 8) {
          // IF YOU PASS THE TEST
          document.addEventListener("keyup", this._handleInstructKey);

          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>TUTORIAL I</span>
                <br />
                Great, you had {this.state.trialScore}/{this.state.trialTotal}
                &nbsp;correct!
                <br /> <br />
                In summary,
                <span className={styles.centerTwo}>
                  <img
                    className={styles.stateSmall}
                    src={this.state.outcomePic[0]}
                    alt="outcome1"
                  />
                  &nbsp;&nbsp; = &nbsp;+{" "}
                  <img className={styles.coin} src={coin} alt="coin" /> (gain)
                  <br />
                  <img
                    className={styles.stateSmall}
                    src={this.state.outcomePic[1]}
                    alt="outcome2"
                  />
                  &nbsp;&nbsp; = &nbsp;-{" "}
                  <img className={styles.coin} src={coin} alt="coin" /> (lose)
                  <br />
                  <img
                    className={styles.stateSmall}
                    src={this.state.outcomePic[2]}
                    alt="outcome3"
                  />
                  &nbsp;&nbsp; = &nbsp;none
                </span>
                <br />
                You are ready to move on to the next tutorial.
                <br /> <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to continue.
                </span>
              </p>
            </div>
          );
        }
      } else if (this.state.instructScreen === false) {
        // out of the instructions, this is the quiz
        if (this.state.testScreen === true) {
          document.removeEventListener("keyup", this._handleInstructKey);

          if (this.state.trialNum <= this.state.trialTotal) {
            document.addEventListener("keyup", this._handleTestKey);
            text = <div> {this.testStart(this.state.trialNum)}</div>;
          } else {
            // finish the quiz
            document.removeEventListener("keyup", this._handleTestKey);
            if (this.state.trialScore / this.state.trialTotal > 0.65) {
              //if score more than 65%, move on to the next section
              setTimeout(
                function () {
                  this.passMission();
                }.bind(this),
                0
              );
            } else {
              //if you fail, then you do the quiz again...
              setTimeout(
                function () {
                  this.missionOneRestart();
                }.bind(this),
                0
              );
            }
          }
        } else {
          //Error..........
          console.log("ERROR - LOOP BROKEN OR LEAKY");
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
        <span className={styles.astro1}>
          <img src={astrodude} alt="astrodude" />
        </span>
        <div className={styles.textblock}>{text}</div>
      </div>
    );
  }
}

export default withRouter(OutcomeTask);
