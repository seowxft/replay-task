import React from "react";
import { withRouter } from "react-router-dom";
import { DATABASE_URL } from "./config";

// import state1 from "./states/baby.png";
// import state2 from "./states/backpack.png";
// import state3 from "./states/bicycle.png";
// import state4 from "./states/bowtie.png";
// import state5 from "./states/hourglass.png";
// import state6 from "./states/house.png";
// import state7 from "./states/lamp.png";
// import state8 from "./states/toothbrush.png";
// import state9 from "./states/zebra.png";

import astrodude from "./img/astro_2.png";
import counter from "./img/shuttle_red.png";

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
//
// //shuffling 2 or more arrays in the same order
// var isArray =
//   Array.isArray ||
//   function (value) {
//     return {}.toString.call(value) !== "[object Array]";
//   };
//
// function shuffleSame() {
//   var arrLength = 0;
//   var argsLength = arguments.length;
//   var rnd, tmp, argsIndex;
//
//   for (var index = 0; index < argsLength; index += 1) {
//     if (!isArray(arguments[index])) {
//       throw new TypeError("Argument is not an array.");
//     }
//
//     if (index === 0) {
//       arrLength = arguments[0].length;
//     }
//
//     if (arrLength !== arguments[index].length) {
//       throw new RangeError("Array lengths do not match.");
//     }
//   }
//
//   while (arrLength) {
//     rnd = Math.round(Math.random() * arrLength);
//     arrLength -= 1;
//     for (argsIndex = 0; argsIndex < argsLength; argsIndex += 1) {
//       tmp = arguments[argsIndex][arrLength];
//       arguments[argsIndex][arrLength] = arguments[argsIndex][rnd];
//       arguments[argsIndex][rnd] = tmp;
//     }
//   }
// }

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

// function randNumExcept(min, max, except) {
//   var num = Math.floor(Math.random() * (max - min + 1)) + min;
//   return num === except ? randNumExcept(min, max, except) : num;
// }

function getRandomInt(min, max) {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);

  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function randNumExceptArray(min, max, excludeArrayNumbers) {
  let randomNumber;

  if (!Array.isArray(excludeArrayNumbers)) {
    randomNumber = getRandomInt(min, max);
    return randomNumber;
  }

  do {
    randomNumber = getRandomInt(min, max);
  } while ((excludeArrayNumbers || []).includes(randomNumber));

  return randomNumber;
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

var pathForceExplore = [1, 2, 3, 1, 2, 3];
var trialTotal = pathForceExplore.length;
var pathTotal = trialTotal / 3;
// var statePic = [
//   state1,
//   state2,
//   state3,
//   state4,
//   state5,
//   state6,
//   state7,
//   state8,
//   state9,
// ];
//
// var stateWord = [
//   "baby",
//   "backpack",
//   "bicycle",
//   "bowtie",
//   "hourglass",
//   "house",
//   "lamp",
//   "toothbrush",
//   "zebra",
// ];
//
var stateIndx = [0, 1, 2, 3, 4, 5, 6, 7, 8];
//
// shuffleSame(stateWord, statePic);
//
// stateWord = stateWord.filter(function (val) {
//   return val !== undefined;
// });
// statePic = statePic.filter(function (val) {
//   return val !== undefined;
// });

var pathOne = [0, 1, 2];
var pathTwo = [3, 4, 5];
var pathThree = [6, 7, 8];

/////////////////////////

var trialtestPath = [1, 1, 2, 2, 3, 3];
shuffle(trialtestPath);
var trialTestTotal = trialtestPath.length * 2;
//test combinations
var testOne = [
  [0, 1],
  [1, 0],
  [2, 1],
  [1, 2],
];
var testTwo = [
  [3, 4],
  [4, 3],
  [4, 5],
  [4, 5],
];
var testThree = [
  [6, 7],
  [7, 6],
  [8, 7],
  [7, 8],
];

var testShuff = randVec(trialTestTotal, 1, 4);

var testAns1 = randVec(trialTestTotal, 1, 2);
var testAns2 = randVec(trialTestTotal, 1, 3);

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// REACT COMPONENT START
class PathTask extends React.Component {
  constructor(props) {
    super(props);

    const userID = this.props.location.state.userID;
    const date = this.props.location.state.date;
    const startTime = this.props.location.state.startTime;

    const outcomePic = this.props.location.state.outcomePic;
    const outcomeWord = this.props.location.state.outcomeWord;
    const outcomeVal = this.props.location.state.outcomeVal;
    const outcomeIndx = this.props.location.state.outcomeIndx;

    const roomPic = this.props.location.state.roomPic;
    const roomWord = this.props.location.state.roomWord;

    var currentDate = new Date(); // maybe change to local
    var timeString = currentDate.toTimeString();
    /////////////////////////////////////////////////////////////////////////////////

    // SET COMPONENT STATES
    this.state = {
      userID: userID,
      date: date,
      startTime: startTime,
      sectionTime: timeString,
      taskSessionTry: 1, //if fail the quiz
      taskSession: "PathTask",
      instructScreenText: 1,
      taskSection: "explore", //vs test

      outcomePic: outcomePic,
      outcomeWord: outcomeWord,
      outcomeVal: outcomeVal,
      outcomeIndx: outcomeIndx,

      instructScreen: true,
      taskScreen: false,
      testScreen: false,

      stateWord: roomWord,
      statePic: roomPic,
      stateIndx: stateIndx,
      stateNum: 0,
      stateShown: null,
      stateDur: 2000,

      pathTotal: pathTotal,
      pathForceExplore: pathForceExplore,
      pathOne: pathOne,
      pathTwo: pathTwo,
      pathThree: pathThree,

      trialNum: 1,
      trialTotal: trialTotal,
      trialTime: 0,
      trialRT: 0,
      trialKeypress: 0,

      trialCor1Log: [],
      trialScore1: 0,
      trialCor2Log: [],
      trialScore2: 0,

      trialtestPath: trialtestPath,
      trialTestNum: 1,
      trialTestTotal: 6,

      testOne: testOne,
      testTwo: testTwo,
      testThree: testThree,
      testShuff: testShuff,

      testAns1: testAns1,
      testAns2: testAns2,
      trialPart: 1,

      whichQn: null,
      whichQnNot: null,
      whichQnNot2: null,
      whichQnNot3: null,

      pathPlay: false,

      debug: false, //if true, will skip the section
      percentPass: 0.75,
    };

    this.handleInstructLocal = this.handleInstructLocal.bind(this);
    this.handleDebugKeyLocal = this.handleDebugKeyLocal.bind(this);
    this.testStart = this.testStart.bind(this);
    this.taskStart = this.taskStart.bind(this);
    this.testCheck = this.testCheck.bind(this);
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

  // This handles instruction screen within the component USING KEYBOARD
  handleInstructLocal(key_pressed) {
    var curText = this.state.instructScreenText;
    var whichButton = key_pressed;

    if (whichButton === 4) {
      if (curText > 1 && curText <= 2) {
        this.setState({ instructScreenText: curText - 1 });
      } else if (curText === 3) {
        //restart path exploration
        setTimeout(
          function () {
            this.missionTwo();
          }.bind(this),
          0
        );
      }
    } else if (whichButton === 5 && curText < 2) {
      this.setState({ instructScreenText: curText + 1 });
    } else if (whichButton === 10) {
      if (curText === 2 || curText === 4) {
        //startmissiontwo or //restart path exploration if fail the quiz
        setTimeout(
          function () {
            this.missionTwo();
          }.bind(this),
          0
        );
      } else if (curText === 3) {
        //startmissionOne  after restart
        // this doesn't work?
        setTimeout(
          function () {
            this.setTrialVar();
          }.bind(this),
          0
        );
      } else if (curText === 5) {
        //go next mission
        setTimeout(
          function () {
            this.nextMission();
          }.bind(this),
          0
        );
      }
    }
  }

  // handle key key_pressed
  _handleInstructKey = (event) => {
    var key_pressed;

    console.log("InstructKey enabled.");

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
      case 49:
        pressed = 1;
        time_pressed = Math.round(performance.now());
        this.taskCheck(pressed, time_pressed);

        break;
      case 50:
        pressed = 2;
        time_pressed = Math.round(performance.now());
        this.taskCheck(pressed, time_pressed);

        break;
      case 51:
        pressed = 3;
        time_pressed = Math.round(performance.now());
        this.taskCheck(pressed, time_pressed);
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
      case 32: //this is SPACEBAR
        pressed = 10;
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

  taskCheck(pressed, time_pressed) {
    var pathChoice = pressed;
    var trialNum = this.state.trialNum;
    var trialRT = time_pressed - this.state.trialTime;

    //this part restricts them from pressing beyond what is shown to them
    //only if what they press is what is ditacted, then it will move to the next
    if (pathChoice === this.state.pathForceExplore[trialNum - 1]) {
      this.setState({
        trialRT: trialRT,
        pathChoice: pathChoice,
        pathPlay: true,
      });

      setTimeout(
        function () {
          this.playStateOne();
        }.bind(this),
        0
      );
    } else {
      console.log("Choose the correct path.");
    }
  }

  missionTwo() {
    var trialTime = Math.round(performance.now());
    this.setState({
      instructScreen: false,
      taskScreen: true,
      trialNum: 1,
      trialTime: trialTime,
      trialRT: 0,
      trialKeypress: 0,
    });
  }

  taskStart(trialNum) {
    var pathForceExplore = this.state.pathForceExplore[trialNum - 1];
    var spaceship1;
    var spaceship2;
    var spaceship3;
    if (pathForceExplore === 1) {
      spaceship1 = styles.spaceship;
      spaceship2 = styles.spaceshipDis;
      spaceship3 = styles.spaceshipDis;
    } else if (pathForceExplore === 2) {
      spaceship1 = styles.spaceshipDis;
      spaceship2 = styles.spaceship;
      spaceship3 = styles.spaceshipDis;
    } else if (pathForceExplore === 3) {
      spaceship1 = styles.spaceshipDis;
      spaceship2 = styles.spaceshipDis;
      spaceship3 = styles.spaceship;
    }

    let text = (
      <div className={styles.main}>
        <div className={styles.counter}>
          <img className={styles.counter} src={counter} alt="counter" />
          {this.state.trialNum}/{this.state.trialTotal}
        </div>
        <p>
          <span className={styles.centerTwo}>
            Let us explore Spaceship {pathForceExplore}.
          </span>
          <br /> <br />
          <span className={styles.centerTwo}>
            <span className={spaceship1}>Spaceship 1</span>
            &nbsp; &nbsp;
            <span className={spaceship2}>Spaceship 2</span>
            &nbsp; &nbsp;
            <span className={spaceship3}>Spaceship 3</span>
          </span>
          <br /> <br />
          <span className={styles.centerTwo}>
            [Press the {pathForceExplore} key.]
          </span>
        </p>
      </div>
    );

    return <div>{text}</div>;
  }

  playStateOne() {
    var statePic;

    if (this.state.pathChoice === 1) {
      //if choose path 1,
      statePic = this.state.pathOne[0];
    } else if (this.state.pathChoice === 2) {
      statePic = this.state.pathTwo[0];
    } else if (this.state.pathChoice === 3) {
      statePic = this.state.pathThree[0];
    }

    this.setState({
      stateNum: 1,
      stateShown: statePic,
    });

    setTimeout(
      function () {
        this.playStateTwo();
      }.bind(this),
      this.state.stateDur
    );
  }

  playStateTwo() {
    var statePic;

    if (this.state.pathChoice === 1) {
      //if choose path 1,
      statePic = this.state.pathOne[1];
    } else if (this.state.pathChoice === 2) {
      statePic = this.state.pathTwo[1];
    } else if (this.state.pathChoice === 3) {
      statePic = this.state.pathThree[1];
    }

    this.setState({
      stateNum: 2,
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
    var statePic;

    if (this.state.pathChoice === 1) {
      //if choose path 1,
      statePic = this.state.pathOne[2];
    } else if (this.state.pathChoice === 2) {
      statePic = this.state.pathTwo[2];
    } else if (this.state.pathChoice === 3) {
      statePic = this.state.pathThree[2];
    }

    this.setState({
      stateNum: 3,
      stateShown: statePic,
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
    var trialPicIndx;
    var trialPicWord;

    if (this.state.pathChoice === 1) {
      trialPicIndx = this.state.pathOne;
      trialPicWord = [
        this.state.stateWord[0],
        this.state.stateWord[1],
        this.state.stateWord[2],
      ];
    } else if (this.state.pathChoice === 2) {
      trialPicIndx = this.state.pathTwo;
      trialPicWord = [
        this.state.stateWord[3],
        this.state.stateWord[4],
        this.state.stateWord[5],
      ];
    } else if (this.state.pathChoice === 3) {
      trialPicIndx = this.state.pathThree;
      trialPicWord = [
        this.state.stateWord[6],
        this.state.stateWord[7],
        this.state.stateWord[8],
      ];
    }

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime,
      sectionTime: this.state.sectionTime,
      taskSession: this.state.taskSession,
      taskSessionTry: this.state.taskSessionTry,
      taskSection: this.state.taskSection, //the explore or the test?
      trialTime: this.state.trialTime,
      trialNum: this.state.trialNum,
      trialPart: null,
      trialPicIndx: trialPicIndx, //this should be which path
      trialPicWord: trialPicWord,
      trialQn: null,
      trialPicAns: null,
      trialRT: this.state.trialRT,
      trialKeypress: this.state.pathChoice, //which path they chose to go
      trialCor: null,
      trialScore: null,
    };

    try {
      fetch(`${DATABASE_URL}/path_test/` + userID, {
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

    setTimeout(
      function () {
        this.cueScreen();
      }.bind(this),
      this.state.stateDur
    );
  }

  cueScreen() {
    var trialTime = Math.round(performance.now());
    var trialNum = this.state.trialNum + 1;

    this.setState({
      pathPlay: false,
      trialNum: trialNum,
      trialTime: trialTime,
    });
  }

  finishForcedPathPlay() {
    this.setState({
      instructScreen: true,
      taskScreen: false,
      instructScreenText: 3,
    });
  }

  missionTwoTest() {
    this.setState({
      instructScreen: false,
      testScreen: true,
      taskSection: "test",
      instructScreenText: 3,
      trialTestNum: 1,
      trialPart: 1,
      trialRT: 0,
      trialKeypress: 0,
    });
  }

  setTrialVar() {
    var whichPath = this.state.trialtestPath[this.state.trialTestNum - 1];
    // I save these to state.props so that I dont re-run the functions in the later parts
    var whichQn = this.state.whichQn;

    var whichCombi = this.state.testShuff[whichPath - 1];
    var whichQnNot = null;

    if (whichPath === 1) {
      ///this.state.testOne - combinations e.g [1,0] [0,1] [1,2] [2,1]
      whichQn = this.state.testOne[whichCombi - 1];
      whichQnNot = randNumExceptArray(0, 8, this.state.pathOne); //none of the other states of the path should be the other option
    } else if (whichPath === 2) {
      //this.state.testTwo - combinations e.g [3,4] [4,3] [5,4] [4,5]
      whichQn = this.state.testTwo[whichCombi - 1];
      whichQnNot = randNumExceptArray(0, 8, this.state.pathTwo);
    } else if (whichPath === 3) {
      //this.state.testThree - combinations e.g [6,7] [7,6] [7,8] [8,7]
      whichQn = this.state.testThree[whichCombi - 1]; //e.g.[6,7]
      whichQnNot = randNumExceptArray(0, 8, this.state.pathThree);
    }

    // console.log("whichQn: " + whichQn);
    // console.log("whichQnNot: " + whichQnNot);

    /// FOR PART TWO
    var whichQnNotArray1 = [whichQnNot, whichQn[0], whichQn[1]];
    var whichQnNot2 = randNumExceptArray(0, 8, whichQnNotArray1); //any option but answer 2
    var whichQnNotArray2 = [whichQnNot, whichQn[0], whichQn[1], whichQnNot2];
    var whichQnNot3 = randNumExceptArray(0, 8, whichQnNotArray2); //any option but answer 2 and prev alt. answer

    this.setState({
      whichQn: whichQn,
      whichQnNot: whichQnNot,
      whichQnNot2: whichQnNot2,
      whichQnNot3: whichQnNot3,
    });

    if (this.state.trialTestNum === 1) {
      // start the test
      setTimeout(
        function () {
          this.missionTwoTest();
        }.bind(this),
        0
      );
    }
  }

  ///////////// test their memory
  testStart(trialTestNum, trialPart) {
    var whichPath = this.state.trialtestPath[trialTestNum - 1];

    var testAns1 = this.state.testAns1[trialTestNum - 1];
    var testAns2 = this.state.testAns2[trialTestNum - 1];

    // I save these to state.props so that I dont re-run the functions in the later parts
    var whichQn = this.state.whichQn;
    var whichQnNot = this.state.whichQnNot;
    var whichQnNot2 = this.state.whichQnNot2;
    var whichQnNot3 = this.state.whichQnNot3;

    var statePic1;
    var statePic2;

    var state2Pic1;
    var state2Pic2;
    var state2Pic3;

    var stateClass1;
    var stateClass2;
    var state2Class1;
    var state2Class2;
    var state2Class3;

    var partBeforeAfter;
    var trialFb1;
    var trialFb2;

    if (testAns1 === 1) {
      statePic1 = this.state.statePic[whichQn[0]]; //this will be 6
      statePic2 = this.state.statePic[whichQnNot];
      if (this.state.trialCor1 === 1) {
        stateClass1 = styles.stateBorder;
        stateClass2 = styles.stateFade;
      } else {
        stateClass1 = styles.stateBorder;
        stateClass2 = styles.stateFadeBorder;
      }
    } else if (testAns1 === 2) {
      statePic1 = this.state.statePic[whichQnNot];
      statePic2 = this.state.statePic[whichQn[0]];
      if (this.state.trialCor1 === 1) {
        stateClass1 = styles.stateFade;
        stateClass2 = styles.stateBorder;
      } else {
        stateClass1 = styles.stateFadeBorder;
        stateClass2 = styles.stateBorder;
      }
    }

    if (testAns2 === 1) {
      state2Pic1 = this.state.statePic[whichQn[1]];
      state2Pic2 = this.state.statePic[whichQnNot2];
      state2Pic3 = this.state.statePic[whichQnNot3];
      if (this.state.trialCor2 === 1) {
        state2Class1 = styles.stateBorder;
        state2Class2 = styles.stateFade;
        state2Class3 = styles.stateFade;
      } else if (this.state.trialCor2 === 0 && this.state.trialKeypress === 2) {
        state2Class1 = styles.stateBorder;
        state2Class2 = styles.stateFadeBorder;
        state2Class3 = styles.stateFade;
      } else if (this.state.trialCor2 === 0 && this.state.trialKeypress === 3) {
        state2Class1 = styles.stateBorder;
        state2Class2 = styles.stateFade;
        state2Class3 = styles.stateFadeBorder;
      }
    } else if (testAns2 === 2) {
      state2Pic1 = this.state.statePic[whichQnNot2];
      state2Pic2 = this.state.statePic[whichQn[1]];
      state2Pic3 = this.state.statePic[whichQnNot3];
      if (this.state.trialCor2 === 1) {
        state2Class1 = styles.stateFade;
        state2Class2 = styles.stateBorder;
        state2Class3 = styles.stateFade;
      } else if (this.state.trialCor2 === 0 && this.state.trialKeypress === 1) {
        state2Class1 = styles.stateFadeBorder;
        state2Class2 = styles.stateBorder;
        state2Class3 = styles.stateFade;
      } else if (this.state.trialCor2 === 0 && this.state.trialKeypress === 3) {
        state2Class1 = styles.stateFade;
        state2Class2 = styles.stateBorder;
        state2Class3 = styles.stateFadeBorder;
      }
    } else if (testAns2 === 3) {
      state2Pic1 = this.state.statePic[whichQnNot2];
      state2Pic2 = this.state.statePic[whichQnNot3];
      state2Pic3 = this.state.statePic[whichQn[1]];
      if (this.state.trialCor2 === 1) {
        state2Class1 = styles.stateFade;
        state2Class2 = styles.stateFade;
        state2Class3 = styles.stateBorder;
      } else if (this.state.trialCor2 === 0 && this.state.trialKeypress === 1) {
        state2Class1 = styles.stateFadeBorder;
        state2Class2 = styles.stateFade;
        state2Class3 = styles.stateBorder;
      } else if (this.state.trialCor2 === 0 && this.state.trialKeypress === 2) {
        state2Class1 = styles.stateFade;
        state2Class2 = styles.stateFadeBorder;
        state2Class3 = styles.stateBorder;
      }
    }

    if (whichQn[0] > whichQn[1]) {
      //if 1 > 0
      //What is before this state
      partBeforeAfter = "BEFORE";
    } else {
      //What is after this state
      partBeforeAfter = "AFTER";
    }

    if (this.state.trialCor1 === 1) {
      trialFb1 = "Correct!";
    } else {
      trialFb1 = "Incorrect. This is correct room.";
    }

    if (this.state.trialCor2 === 1) {
      trialFb2 = "Correct!";
    } else {
      trialFb2 = "Incorrect. This is correct room.";
    }

    let text1 = (
      <div className={styles.main}>
        <div className={styles.counter}>
          <img className={styles.counter} src={counter} alt="counter" />
          {this.state.trialTestNum}/{this.state.trialTestTotal}
        </div>
        <p>
          <span className={styles.center}>
            You are in Spaceship {whichPath}.
          </span>
          Which room will you encounter?
          <br />
          <span className={styles.centerTwo}>
            [<strong>1</strong>]:&nbsp;
            <img className={styles.state} src={statePic1} alt="state" />
            &nbsp;&nbsp;&nbsp;&nbsp; [<strong>2</strong>]:&nbsp;
            <img className={styles.state} src={statePic2} alt="state" />
          </span>
          <span className={styles.centerTwo}>
            [Press the correct number key.]
          </span>
        </p>
      </div>
    );

    let text2 = (
      <div className={styles.main}>
        <div className={styles.counter}>
          <img className={styles.counter} src={counter} alt="counter" />
          {this.state.trialTestNum}/{this.state.trialTestTotal}
        </div>
        <p>
          <span className={styles.center}>
            You are in Spaceship {whichPath}.
          </span>
          <span className={styles.centerThree}>{trialFb1}</span>
          <span className={styles.centerTwo}>
            <img className={stateClass1} src={statePic1} alt="state" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <img className={stateClass2} src={statePic2} alt="state" />
          </span>
          <span className={styles.centerTwo}>
            Which room {partBeforeAfter} comes this room?
          </span>
          <span className={styles.centerTwo}>
            [<strong>1</strong>]:&nbsp;
            <img className={styles.state} src={state2Pic1} alt="state" />
            &nbsp;&nbsp;&nbsp;&nbsp; [<strong>2</strong>]:&nbsp;
            <img className={styles.state} src={state2Pic2} alt="state" />
            &nbsp;&nbsp;&nbsp;&nbsp; [<strong>3</strong>]:&nbsp;
            <img className={styles.state} src={state2Pic3} alt="state" />
          </span>
          <span className={styles.centerTwo}>
            [Press the correct number key.]
          </span>
        </p>
      </div>
    );

    let text3 = (
      <div className={styles.main}>
        <div className={styles.counter}>
          <img className={styles.counter} src={counter} alt="counter" />
          {this.state.trialTestNum}/{this.state.trialTestTotal}
        </div>
        <p>
          <span className={styles.center}>
            You are in Spaceship {whichPath}.
          </span>
          <span className={styles.centerThree}></span>
          <span className={styles.centerTwo}>
            <img className={stateClass1} src={statePic1} alt="state" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <img className={stateClass2} src={statePic2} alt="state" />
          </span>
          <span className={styles.centerTwo}>
            Which room {partBeforeAfter} comes this room?
          </span>
          <span className={styles.centerTwo}>
            [<strong>1</strong>]:&nbsp;
            <img className={state2Class1} src={state2Pic1} alt="state" />
            &nbsp;&nbsp;&nbsp;&nbsp; [<strong>2</strong>]:&nbsp;
            <img className={state2Class2} src={state2Pic2} alt="state" />
            &nbsp;&nbsp;&nbsp;&nbsp; [<strong>3</strong>]:&nbsp;
            <img className={state2Class3} src={state2Pic3} alt="state" />
          </span>
          <span className={styles.centerTwo}>{trialFb2}</span>
          <br />
          <span className={styles.centerTwo}>
            Press the [<strong>SPACEBAR</strong>] to continue.
          </span>
        </p>
      </div>
    );

    switch (trialPart) {
      case 1:
        return <div>{text1}</div>;
      case 2:
        return <div>{text2}</div>;
      case 3:
        return <div>{text3}</div>;
      default:
    }
  }

  // function to go to next quiz question and check score
  testCheck(pressed, time_pressed) {
    var trialTime = time_pressed;
    var trialRT = time_pressed - this.state.trialTime;
    var testChoice = pressed;

    var trialCor1 = null;
    var trialCor2 = null;

    var trialTestNum = this.state.trialTestNum;
    var trialCor1Log = this.state.trialCor1Log; //[1,1,1,0...]
    var trialScore1 = this.state.trialScore1; //sum of the correct answers
    var trialCor2Log = this.state.trialCor2Log; //[1,1,1,0...]
    var trialScore2 = this.state.trialScore2; //sum of the correct answers

    if (this.state.trialPart === 1 && testChoice !== 3 && testChoice !== 10) {
      // only choice 1 or 2
      var testAns1 = this.state.testAns1[this.state.trialTestNum - 1];
      if (testChoice === testAns1) {
        trialCor1 = 1;
        trialCor1Log[trialTestNum - 1] = 1;
        trialScore1 = trialScore1 + 1;
      } else {
        trialCor1 = 0;
        trialCor1Log[trialTestNum - 1] = 0;
      }

      this.setState({
        trialTime: trialTime,
        trialKeypress: testChoice,
        trialCor1: trialCor1,
        trialRT: trialRT,
        trialCor1Log: trialCor1Log,
        trialScore1: trialScore1,
      });

      setTimeout(
        function () {
          this.testSave();
        }.bind(this),
        10
      );
    } else if (this.state.trialPart === 2 && testChoice !== 10) {
      var testAns2 = this.state.testAns2[this.state.trialTestNum - 1];
      if (testChoice === testAns2) {
        trialCor2 = 1;
        trialCor2Log[trialTestNum - 1] = 1;
        trialScore2 = trialScore2 + 1;
      } else {
        trialCor2 = 0;
        trialCor2Log[trialTestNum - 1] = 0;
      }

      this.setState({
        trialTime: trialTime,
        trialKeypress: testChoice,
        trialCor2: trialCor2,
        trialRT: trialRT,
        trialCor2Log: trialCor2Log,
        trialScore2: trialScore2,
      });

      setTimeout(
        function () {
          this.testSave();
        }.bind(this),
        10
      );
    } else if (this.state.trialPart === 3 && testChoice === 10) {
      trialTestNum = trialTestNum + 1;

      this.setState({
        trialTime: trialTime,
        trialPart: 1,
        trialTestNum: trialTestNum,
        trialCor1: trialCor1,
        trialCor2: trialCor2,
      });

      setTimeout(
        function () {
          this.setTrialVar();
        }.bind(this),
        0
      );
    } else {
      console.log("THERE SHOULD NOT BE ANY CHANGE HERE----");
    }
  }

  testSave() {
    var trialCor;
    var trialPicIndx;
    var trialPicWord;
    var testAns;
    var partBeforeAfter;
    var trialTestNum = this.state.trialTestNum;

    var testAns1 = this.state.testAns1[trialTestNum - 1];
    var testAns2 = this.state.testAns2[trialTestNum - 1];

    // I save these to state.props so that I dont re-run the functions in the later parts
    var whichQn = this.state.whichQn;
    var whichQnNot = this.state.whichQnNot;
    var whichQnNot2 = this.state.whichQnNot2;
    var whichQnNot3 = this.state.whichQnNot3;

    if (this.state.trialPart === 1) {
      trialCor = this.state.trialCor1;

      if (testAns1 === 1) {
        trialPicIndx = [whichQn[0], whichQnNot];
        trialPicWord = [
          this.state.stateWord[whichQn[0]],
          this.state.stateWord[whichQnNot],
        ];
      } else if (testAns1 === 2) {
        trialPicIndx = [whichQnNot, whichQn[0]];
        trialPicWord = [
          this.state.stateWord[whichQnNot],
          this.state.stateWord[whichQn[0]],
        ];
      }

      testAns = this.state.testAns1[this.state.trialTestNum - 1];
      partBeforeAfter = "ROOM";
    } else if (this.state.trialPart === 2) {
      trialCor = this.state.trialCor2;

      if (testAns2 === 1) {
        trialPicIndx = [whichQn[1], whichQnNot2, whichQnNot3];
        trialPicWord = [
          this.state.stateWord[whichQn[1]],
          this.state.stateWord[whichQnNot2],
          this.state.stateWord[whichQnNot3],
        ];
      } else if (testAns2 === 2) {
        trialPicIndx = [whichQnNot2, whichQn[1], whichQnNot3];
        trialPicWord = [
          this.state.stateWord[whichQnNot2],
          this.state.stateWord[whichQn[1]],
          this.state.stateWord[whichQnNot3],
        ];
      } else if (testAns2 === 3) {
        trialPicIndx = [whichQnNot2, whichQnNot3, whichQn[1]];
        trialPicWord = [
          this.state.stateWord[whichQnNot2],
          this.state.stateWord[whichQnNot3],
          this.state.stateWord[whichQn[1]],
        ];
      }

      testAns = this.state.testAns2[this.state.trialTestNum - 1];
      if (whichQn[0] > whichQn[1]) {
        partBeforeAfter = "BEFORE";
      } else {
        partBeforeAfter = "AFTER";
      }
    }

    var userID = this.state.userID;

    var trialScore = this.state.trialScore1 + this.state.trialScore2;

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime,
      sectionTime: this.state.sectionTime,
      taskSession: this.state.taskSession,
      taskSessionTry: this.state.taskSessionTry,
      taskSection: this.state.taskSection,
      trialTime: this.state.trialTime, //the explore or the test?
      trialNum: this.state.trialTestNum,
      trialPart: this.state.trialPart, //is it question a or b
      trialPicIndx: trialPicIndx,
      trialPicWord: trialPicWord,
      trialQn: partBeforeAfter,
      trialPicAns: testAns,
      trialRT: this.state.trialRT,
      trialKeypress: this.state.trialKeypress,
      trialCor: trialCor,
      trialScore: trialScore,
    };

    try {
      fetch(`${DATABASE_URL}/path_test/` + userID, {
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

    setTimeout(
      function () {
        this.testTrialSectNext();
      }.bind(this),
      0
    );
  }

  testTrialSectNext() {
    var trialPart = this.state.trialPart + 1;

    this.setState({
      trialPart: trialPart,
    });
  }

  missionTwoRestart() {
    //resetVariables
    var taskSessionTry = this.state.taskSessionTry + 1;

    this.setState({
      taskSessionTry: taskSessionTry,
      taskSection: "explore",
      instructScreen: true,
      testScreen: false,
      instructScreenText: 4,
    });
  }

  passTest() {
    this.setState({
      instructScreen: true,
      testScreen: false,
      instructScreenText: 5,
    });
  }

  nextMission() {
    document.removeEventListener("keyup", this._handleInstructKey);
    document.removeEventListener("keyup", this._handleDebugKey);
    this.props.history.push({
      pathname: `/TutorTask`,
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

  condSave() {
    var userID = this.state.userID;

    let saveString = {
      userID: this.state.userID,
      date: this.state.date,
      startTime: this.state.startTime, // this is when they start the expt
      sectionTime: this.state.sectionTime, //this is if they somehow refresh the page...
      taskSession: this.state.taskSession,
      taskSessionTry: this.state.taskSessionTry,
      structNum: null,

      outcomeWord: null,
      outcomeVal: null,
      outcomeIndx: null,

      stateWord: this.state.stateWord,
      stateIndx: this.state.stateIndx,

      pathOne: this.state.pathOne,
      pathTwo: this.state.pathTwo,
      pathThree: this.state.pathThree,

      tutForcedPaths: null,
      tutSafePathOutcome: null,
      tutRiskyPathOutcome1: null,
      tutRiskyPathOutcome2: null,
      tutSafePathProb: null,
      tutRiskyPathProb1: null,
      tutRiskyPathProb2: null,
      tutOptChoice: null,

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

  componentDidMount() {
    window.scrollTo(0, 0);
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
                <span className={styles.center}>TUTORIAL II</span>
                The second thing you need to learn is that there are connecting
                rooms in the spaceships.
                <br /> <br />
                Each spaceship has three connecting rooms which you will have to
                go through
                <br />
                in sequence to find your valuable item(s).
                <br /> <br />
                Every room is associated with an image, which you will have to
                learn.
                <br />
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
                <span className={styles.center}>TUTORIAL II</span>
                In this tutorial, we will show you the rooms of each
                spaceship&nbsp;
                {this.state.pathTotal} times.
                <br />
                <br />
                Your aim is to memorise the order of rooms in each type of
                spaceship.
                <br />
                <br />
                We will test your memory afterwards.
                <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to start the tutorial.
                </span>
                <span className={styles.centerTwo}>
                  [<strong>← BACK</strong>]
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 3) {
          document.addEventListener("keyup", this._handleInstructKey);
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>TUTORIAL II</span>
                Great. To ensure that you have learned the order of the rooms in
                the three types of spaceships,
                <br />
                we will quiz your memory.
                <br />
                <br />
                If you feel confident and want to start the quiz, press [
                <strong>SPACEBAR</strong>].
                <br /> <br />
                If you are still unsure of the room order, press the [
                <strong>←</strong>] key to view the room sequence again.
                <br /> <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to start the quiz.
                </span>
                <span className={styles.centerTwo}>
                  Press [<strong>←</strong>] key to view spaceships again.
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 4) {
          document.addEventListener("keyup", this._handleInstructKey);
          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>TUTORIAL II</span>
                Unfortunately you only got&nbsp;
                {this.state.trialScore1 + this.state.trialScore2} /
                {this.state.trialTestTotal * 2} correct.
                <br />
                Let us revisit the order of the rooms in each spaceship type
                using the items associated with each planet.
                <br /> <br />
                <span className={styles.centerTwo}>
                  Press [<strong>SPACEBAR</strong>] key to explore the
                  spaceships again.
                </span>
              </p>
            </div>
          );
        } else if (this.state.instructScreenText === 5) {
          // IF YOU PASS THE TEST
          document.addEventListener("keyup", this._handleInstructKey);

          text = (
            <div className={styles.main}>
              <p>
                <span className={styles.center}>TUTORIAL II</span>
                <br />
                Great, you had&nbsp;
                {this.state.trialScore1 + this.state.trialScore2}/
                {this.state.trialTestTotal * 2}
                &nbsp;correct!
                <br /> <br />
                You are ready to move on to the next tutorial.
                <br /> <br />
                <span className={styles.centerTwo}>
                  Press the [<strong>SPACEBAR</strong>] to contine.
                </span>
              </p>
            </div>
          );
        }
      }
      if (this.state.instructScreen === false) {
        ///task
        if (this.state.taskScreen === true) {
          document.removeEventListener("keyup", this._handleInstructKey);
          document.addEventListener("keyup", this._handleTaskKey);
          // exploring the state sequence
          if (this.state.trialNum <= this.state.trialTotal) {
            if (this.state.pathPlay === false) {
              text = <div>{this.taskStart(this.state.trialNum)}</div>;
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
                  <p>
                    <span className={styles.center}>
                      Spaceship {this.state.pathChoice}
                    </span>
                    <span className={styles.centerTwo}>
                      Room {this.state.stateNum}
                    </span>
                    <br />
                    <img
                      className={styles.stateLarge}
                      src={this.state.statePic[this.state.stateShown]}
                      alt="state"
                    />
                    <br /> <br />
                  </p>
                </div>
              );
            }
          } else {
            // finish the task
            document.removeEventListener("keyup", this._handleTaskKey);
            setTimeout(
              function () {
                this.finishForcedPathPlay();
              }.bind(this),
              0
            );
          }
        } else if (this.state.taskScreen === false) {
          //instruct screen is false, taskscreen is FALSE

          if (this.state.testScreen === true) {
            // document.removeEventListener("keyup", this._handleInstructKey);
            if (this.state.trialTestNum <= this.state.trialTestTotal) {
              document.addEventListener("keyup", this._handleTestKey);
              text = (
                <div>
                  {this.testStart(
                    this.state.trialTestNum,
                    this.state.trialPart
                  )}
                </div>
              );
            } else {
              //if end the test,
              document.removeEventListener("keyup", this._handleTestKey);
              if (
                (this.state.trialScore1 + this.state.trialScore2) /
                  2 /
                  this.state.trialTestTotal >
                this.state.percentPass
              ) {
                //if I pass, move on to the gambling task
                setTimeout(
                  function () {
                    this.passTest();
                  }.bind(this),
                  0
                );
              } else {
                //if I fail, go learn the paths again
                // send to new instruct screen
                setTimeout(
                  function () {
                    this.missionTwoRestart();
                  }.bind(this),
                  0
                );
              }
            }
          } else {
            console.log("ERROR - ALL SCREENS ARE FALSE");
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
        <span className={styles.astro2}>
          <img src={astrodude} alt="astrodude" />
        </span>
        <div className={styles.textblock}>{text}</div>
      </div>
    );
  }
}

export default withRouter(PathTask);
