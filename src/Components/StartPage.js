import React from "react";
import { withRouter } from "react-router-dom";
import * as Consent from "survey-react";
import "../../node_modules/survey-react/survey.css";
import queryString from "query-string"; // I need this for prolific

import "./style/startStyle.css";

// Edit: 22/07/2021: Add in pre-load and caching of images here

import img_shuttle1 from "./img/shuttle_green.png";
import img_shuttle2 from "./img/shuttle_blue.png";
import img_fix from "./img/fixation_white.png";
import img_astrodude1 from "./img/astro_1.png";
import img_astrodude2 from "./img/astro_2.png";
import img_astrodude3 from "./img/astro_3.png";
import img_counter from "./img/shuttle_red.png";
import img_coinSmall from "./img/coin_small.png";
import img_coin from "./img/coin.png";
import img_pathInstruct1 from "./img/PathInstruct1.png";
import img_stateHolder1 from "./img/quest_holder1.png";
import img_stateHolder2 from "./img/quest_holder2.png";
import img_state1 from "./states/baby.jpg";
import img_state2 from "./states/backpack.jpg";
import img_state3 from "./states/bicycle.jpg";
import img_state4 from "./states/bowtie.jpg";
import img_state5 from "./states/hourglass.jpg";
import img_state6 from "./states/house.jpg";
import img_state7 from "./states/lamp.jpg";
import img_state8 from "./states/toothbrush.jpg";
import img_state9 from "./states/zebra.jpg";
import img_state10 from "./states/car.jpg";
import img_state11 from "./states/cat.jpg";
import img_state12 from "./states/cupcake.jpg";

/////////
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

////////////////
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
  img_state1,
  img_state2,
  img_state3,
  img_state4,
  img_state5,
  img_state6,
  img_state7,
  img_state8,
  img_state9,
  img_state10,
  img_state11,
  img_state12,
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

var shuttle = [img_shuttle1, img_shuttle2];
var shuttleWord = ["green", "blue"];
shuffleSame(shuttle, shuttleWord);

shuttle = shuttle.filter(function (val) {
  return val !== undefined;
});

shuttleWord = shuttleWord.filter(function (val) {
  return val !== undefined;
});

class StartPage extends React.Component {
  constructor(props) {
    super(props);

    // Get data and time
    var dateTime = new Date().toLocaleString();

    var currentDate = new Date(); // maybe change to local
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var dateString = date + "-" + (month + 1) + "-" + year;
    var timeString = currentDate.toTimeString();

    // Gen a random 6 digit number for now
    var prolific_id = Math.floor(100000 + Math.random() * 900000);
    // var prolific_id = 120000; //for testing

    // let url = this.props.location.search;
    // let params = queryString.parse(url);
    // // const prolific_id =
    // //   params["PROLIFIC_PID"] === undefined
    // //     ? "undefined"
    // //     : params["PROLIFIC_PID"];
    // // console.log(prolific_id);

    // Set state
    this.state = {
      //    userID: userID,
      userID: prolific_id,
      date: dateString,
      dateTime: dateTime,
      startTime: timeString,
      consentComplete: 0,

      img_shuttle1: img_shuttle1,
      img_shuttle2: img_shuttle2,
      img_fix: img_fix,
      img_astrodude1: img_astrodude1,
      img_astrodude2: img_astrodude2,
      img_astrodude3: img_astrodude3,
      img_counter: img_counter,
      img_coinSmall: img_coinSmall,
      img_coin: img_coin,
      img_pathInstruct1: img_pathInstruct1,
      stateHolder: [img_stateHolder1, img_stateHolder2],
      statePic: roomPic,
      stateWord: roomWord,
      outcomePic: outcomePic,
      outcomeWord: outcomeWord,
      shuttlePic: shuttle,
      shuttleWord: shuttleWord,
    };

    // update State when consent is complete
    this.redirectToTarget = this.redirectToTarget.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    var img_fix = this.state.img_fix;
    var img_astrodude1 = this.state.img_astrodude1;
    var img_astrodude2 = this.state.img_astrodude2;
    var img_astrodude3 = this.state.img_astrodude3;
    var img_counter = this.state.img_counter;
    var img_coinSmall = this.state.img_coinSmall;
    var img_coin = this.state.img_coin;
    var img_pathInstruct1 = this.state.img_pathInstruct1;
    var stateHolder = this.state.stateHolder;
    var statePic = this.state.statePic;
    var outcomePic = this.state.outcomePic;
    var shuttlePic = this.state.shuttlePic;

    [img_fix].forEach((image) => {
      new Image().src = image;
    });
    [img_astrodude1].forEach((image) => {
      new Image().src = image;
    });
    [img_astrodude2].forEach((image) => {
      new Image().src = image;
    });
    [img_astrodude3].forEach((image) => {
      new Image().src = image;
    });
    [img_counter].forEach((image) => {
      new Image().src = image;
    });
    [img_coinSmall].forEach((image) => {
      new Image().src = image;
    });
    [img_coin].forEach((image) => {
      new Image().src = image;
    });
    [img_pathInstruct1].forEach((image) => {
      new Image().src = image;
    });
    [stateHolder].forEach((image) => {
      new Image().src = image;
    });
    [statePic].forEach((image) => {
      new Image().src = image;
    });
    [outcomePic].forEach((image) => {
      new Image().src = image;
    });
    [shuttlePic].forEach((image) => {
      new Image().src = image;
    });

    // let imagesPreload = [
    //   img_fix,
    //   img_astrodude1,
    //   img_astrodude2,
    //   img_astrodude3,
    //   img_counter,
    //   img_coinSmall,
    //   img_coin,
    //   img_pathInstruct1,
    //   stateHolder,
    //   statePic,
    //   outcomePic,
    //   shuttlePic,
    // ];

    // imagesPreload.forEach((image) => {
    //   const newImage = new Image();
    //   newImage.src = image;
    //   window[image] = newImage;
    // });

    this.setState({
      img_fix: img_fix,
      img_astrodude1: img_astrodude1,
      img_astrodude2: img_astrodude2,
      img_astrodude3: img_astrodude3,
      img_counter: img_counter,
      img_coinSmall: img_coinSmall,
      img_coin: img_coin,
      img_pathInstruct1: img_pathInstruct1,
      stateHolder: stateHolder,
      statePic: statePic,
      outcomePic: outcomePic,
      shuttlePic: shuttlePic,
      mounted: 1,
    });
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  redirectToTarget() {
    this.setState({
      consentComplete: 1,
    });

    this.props.history.push({
      pathname: `/OutcomeTask`,
      state: {
        userID: this.state.userID,
        date: this.state.date,
        startTime: this.state.startTime,
        img_fix: this.state.img_fix,
        img_astrodude1: this.state.img_astrodude1,
        img_astrodude2: this.state.img_astrodude2,
        img_astrodude3: this.state.img_astrodude3,
        img_counter: this.state.img_counter,
        img_coinSmall: this.state.img_coinSmall,
        img_coin: this.state.img_coin,
        img_pathInstruct1: this.state.img_pathInstruct1,
        stateHolder: this.state.stateHolder,
        statePic: this.state.statePic,
        stateWord: this.state.stateWord,
        outcomePic: this.state.outcomePic,
        outcomeWord: this.state.outcomeWord,
        shuttlePic: this.state.shuttlePic,
        shuttleWord: this.state.shuttleWord,
      },
    });

    console.log("UserID is: " + this.state.userID);
  }

  render() {
    Consent.StylesManager.applyTheme("default");

    //short version
    var json0 = {
      title: null,
      pages: [
        {
          questions: [
            { type: "html", name: "info", html: "" },
            {
              type: "html",
              name: "info",
              html: "<b>Who is conducting this research study?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>This research is being conducted by the Wellcome Centre for Human Neuroimaging and the Max Planck UCL Centre for Computational Psychiatry and Ageing Research. The lead researchers for this project are Dr. Tricia Seow (Research Fellow, t.seow@ucl.ac.uk) and Dr. Tobias Hauser (Principal Investigator, t.hauser@ucl.ac.uk). This study has been approved by the UCL Research Ethics Committee (project ID number 15301&#92;001) and funded by the Wellcome Trust.</p>",
            },
          ],
        },
        {
          questions: [
            {
              type: "checkbox",
              name: "checkbox1",
              title:
                "I have read the information above, and understand what the study involves.",
              isRequired: true,
              choices: ["Yes"],
            },
          ],
        },
      ],
    };

    // Full consent, non-NHS version
    var json1 = {
      title: null,
      pages: [
        {
          questions: [
            {
              type: "html",
              name: "info",
              html: "<b>Who is conducting this research study?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>This research is being conducted by the Wellcome Centre for Human Neuroimaging and the Max Planck UCL Centre for Computational Psychiatry and Ageing Research. The lead researchers for this project are Dr. Tricia Seow (Research Fellow, t.seow@ucl.ac.uk) and Dr. Tobias Hauser (Principal Investigator, t.hauser@ucl.ac.uk). This study has been approved by the UCL Research Ethics Committee (project ID number 15301&#92;001) and funded by the Wellcome Trust.</p>",
            },

            {
              type: "html",
              name: "info",
              html: "<b>What is the purpose of this study?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p> We are interested in how the adult brain controls learning and decision-making. This research aims to provide insights into how the healthy brain works to help us understand the causes of a number of different medical conditions.</p>",
            },

            {
              type: "html",
              name: "info",
              html: "<b>Who can participate in the study?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p><ul><li>Adults aged between <strong>18 to 55 years old</strong></li><li>Fluent in English</li><li>Normal or corrected-to-normal vision</li></ul>If you take part in this study, you confirm that you meet the eligibity criteria.</p>",
            },

            {
              type: "html",
              name: "info",
              html: "<b>What will happen to me if I take part?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>You will play one or more online computer tasks, which will last around approximately <strong>1 hour</strong>. <br/><br/>You will also be asked some questions about yourself, your feelings, background, attitudes and behaviour in your everyday life. <br/><br/>You will receive <strong>6 GBP</strong> for helping us.<br/>Plus, depending on your performance you can earn an <strong>additional bonus</strong> of up to <strong>4 GBP</strong>. <br/><br/>Remember, you are free to withdraw at any time without giving a reason.</p>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<b>What are the possible disadvantages and risks of taking part?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p> The task you complete does not pose any known risks. You will be asked to answer some questions about mood and feelings, and we will provide information about ways to seek help should you feel affected by the issues raised by these questions.</p>",
            },

            {
              type: "html",
              name: "info",
              html: "<b>What are the possible benefits of taking part?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>While there are no immediate benefits to taking part, your participation in this research will help us understand how people make decisions and this could have benefits for our understanding of mental health problems. </p>",
            },

            { type: "html", name: "info", html: "<b>Complaints</b>" },

            {
              type: "html",
              name: "info",
              html:
                "<p>If you wish to complain or have any concerns about any aspect of the way you have been approached or treated by members of staff, then the research UCL complaints mechanisms are available to you. In the first instance, please talk to the researcher or the chief investigator (Dr Tobias Hauser, t.hauser@ucl.ac.uk) about your complaint. If you feel that the complaint has not been resolved satisfactorily, please contact the chair of the UCL Research Ethics Committee (ethics@ucl.ac.uk). <br/><br/>If you are concerned about how your personal data are being processed please contact the data controller who is UCL: data-protection@ucl.ac.uk. If you remain unsatisfied, you may wish to contact the Information Commissioner’s Office (ICO). Contact details, and details of data subject rights, are available on the ICO website <a href='https://ico.org.uk/for-organisations/data-protection-reform/overview-of-the-gdpr/individuals-rights' target='_blank'>here</a>. (opens in new tab) </p>",
            },

            {
              type: "html",
              name: "info",
              html: "<b>What about my data?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>This ‘local’ privacy notice sets out the information that applies to this particular study. Further information on how UCL uses participant information can be found in our ‘general’ privacy notice:<br/><br/>For participants in research studies, click <a href='https://www.ucl.ac.uk/legal-services/sites/legal-services/files/ucl_general_research_participant_privacy_notice_v1.pdf' target='_blank'>here</a>. (opens in new tab)<br/><br/>The information that is required to be provided to participants under data protection legislation (GDPR and DPA 2018) is provided across both the ‘local’ and ‘general’ privacy notices.<br/><br/>To help future research and make the best use of the research data you have given us (such as answers to questionnaires) we may keep your research data indefinitely and share these. The data we collect will be shared and held as follows:<ul><li> In publications, your data will be anonymised, so you cannot be identified. </li><li> In public databases, your data will be anonymised. </li><li>We do not collect any personal data that could be used to identify you. </li><li> Personal data is any information that could be used to identify you, such as your User ID. When we collect your data, your User ID will be replaced with a nonidentifiable random ID number. No personally identifying data will be stored.</li></ul>The legal basis used to process your personal data will be the provision of public task (this means that the research you are taking part in is deemed to be in the public interest). The legal basis used to process special category data (i.e. ethnicity) will be for scientific research purposes. We will follow the UCL and legal guidelines to safeguard your data. If you change your mind and withdraw your consent to participate in this study you can contact us via Prolific. However, we collect all data in an anonymised form, which is why this data cannot be destroyed, withdrawn or recalled. <br/><br/>If there are any queries or concerns please do not hesitate to contact Dr. Tricia Seow (t.seow@ucl.ac.uk).</p>",
            },
          ],
        },
        {
          questions: [
            {
              type: "checkbox",
              name: "checkbox1",
              title:
                "I have read the information above, and understand what the study involves.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox2",
              title:
                "I consent to the processing of my personal information (e.g. User ID) for the purposes of this research study. I understand that such information will remain confidential and will be handled in accordance with all applicable data protection legislation and ethical standards in research. These data will only be accessible to the study team and individuals from the University and Funder who are responsible for monitoring and audits.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox3",
              title:
                "I understand that my anonymised personal data can be shared with others for future research, shared in public databases and in scientific reports.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox4",
              title:
                "I understand that I am free to withdraw from this study at any time without giving a reason and this will not affect my future medical care or legal rights.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox5",
              title:
                "I understand the potential benefits and risks of participating, the support available to me should I become distressed during the research, and who to contact if I wish to lodge a complaint.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox6",
              title:
                "I understand the inclusion and exclusion criteria in the Information Sheet and as explained to me by the researcher. I confirm that I do not fall under the exclusion criteria.",
              isRequired: true,
              choices: ["Yes"],
            },

            {
              type: "checkbox",
              name: "checkbox7",
              title:
                "I agree that the research project named above has been explained to me to my satisfaction and I agree to take part in this study.",
              isRequired: true,
              choices: ["Yes"],
            },
          ],
        },
      ],
    };

    var json2 = {
      title: null,
      pages: [
        {
          questions: [
            {
              type: "html",
              name: "info",
              html:
                "<p>We are researchers from University College London. We need your help to understand how the brain works. <br/><br/>Before you decide if you would like to join in, it is really important to understand why the research is being done and what it will involve. Take time to decide whether or not you would like to take part. You can talk to your family, friends or doctor about this if you want to. If something is not clear or you have more questions please email [Dr. Tricia Seow (Research Fellow, t.seow@ucl.ac.uk) and Dr. Tobias Hauser (Principal Investigator, t.hauser@ucl.ac.uk)] us.</p>",
            },

            {
              type: "html",
              name: "info",
              html: "<b>Why is this study being done?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>Some people have problems with emotions, mood and behaviour that affect their life. This can be seen in conditions such as depression, conduct disorder and anxiety, to name a few. We want to find out why some people have these problems and others do not, so that we can help find better treatments.<br/><br/>In this study we are going to compare the brain activity of people who experience difficulties with those who do not.</p>",
            },

            {
              type: "html",
              name: "info",
              html: "<b>Why have I been asked to take part?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>We hope to have 500 people in this study. We want people in the study who do and do not experience difficulties such as problems with mood, emotion and behaviour. At the moment we are looking for people who are:<ul><li>Aged 18-55 years</li><li>Have normal or corrected-to-normal vision</li><li>No past or present psychiatric disorders if in healthy control cohort</li><li>No current or past history of serious neurological disorders or trauma including epilepsy</li><li>Not currently or recently (within 12 months) participating in a clinical trial of an investigational medical product (CTIMP)</li><li>No learning disability requiring specialist educational support and/or medical treatment</il><li>Able to understand written and spoken English</li><li>Not in prision or on probation</li><li>Is willing and able to give informed consent</li></p>",
            },

            {
              type: "html",
              name: "info",
              html: "<b>Do I have to take part?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>No you don’t. It is your choice, you can say ‘no’ and no one will be cross or upset. If you say ‘yes’ and change your mind later that is okay as well.</p>",
            },
            {
              type: "html",
              name: "info",
              html: "<b>Will joining help me?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>There will be no direct benefit to you, but you will have helped important research. By understanding how the brain works we hope to help patients in the future and you will have contributed towards this.</p>",
            },
            {
              type: "html",
              name: "info",
              html: "<b>What will happen if take part?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>You will be invited to complete part(s) of the assessment on the web-browser or through a mobile application. This part of the assessment will take around 1 hour, including time for breaks. You will be shown an information page explaining what the study involves and you are free to contact the researcher(s) should you have any questions. You will need to give explicit consent by clicking a button on the consent page affirming that you are happy to take part in the study. We will then start the assessment.<br/><br/>As for the other part of the assessment, you will be invited for an assessment day in London (Wellcome Centre for Human Neuroimaging in central London or at the Anna Freud Centre, Hampstead/ Kings Cross). This part of the assessment will take around 2 hours, including time for breaks. When you arrive, we will explain what the study involves and you can ask questions. You will need to sign a consent form saying that you are happy to take part in the study. We will then start the assessment. The order of the components of the entire assessment can vary, but it will include these parts:<br/><br/><b>1. Questions on how you feel and act.</b> You will be given questionnaires to fill out. You will also have an interview where we talk about your moods and feelings. We would like to record the interview. The recordings will be used for training, quality control, audit, and research purposes. The recordings will be stored anonymously, using password-protected software. You can ask for the recordings to be stopped or deleted at any time. We only record the interviews if you are happy for us to do so. You do not have to answer anything which makes you feel uncomfortable.<br/><br/><b>2. Computer games to play.</b> You will play up to six different games (we call these 'tasks'). Before you take part we will explain each task we would like you to play. In all tasks you make decisions and choices such as ‘Is there more gold or silver fishes in the lake?’, or ‘Should I hide or collect more points?’. There are other choices too depending on the task you play. In most of the tasks you try to win points, which are usually converted to money. You will be told beforehand if this is the case. There will be times when you need to avoid losing in the games. Losing will mean brief, mildly painful electrical stimulation (we have attached more information about the electrical stimulation). We will show you what will happen before you begin the task and check you are happy to continue.<br/><br/><b>3. Pictures of your brain.</b> We will look at activity from your brain using a Magnetic Resonance Imaging (MRI) or Magnetoencephalography (MEG) scanner. We may simultaneously collect data using Electroencephalography (EEG). Please look at the additional sheet, which tells you all about the scan you will be having. We will ask you to play some tasks on the computer and see how your brain activity changes.<br/><br/>During the tasks we may ask to record ‘physiological measures’. These show how your body reacts to playing the tasks and help us understand how you are feeling. Depending on the task we may record how fast your heart beats, how your eyes and muscles react or the moisture in your skin. We record pupil size with a camera and record the others by using sticky patches on the skin. These patches are harmless - they record activity underneath them. The patches are put on your arm and hands, or sometimes on your face, if we want to record eye movement. You will see the patches before they are put on and we will check to make sure you are comfortable.</p>",
            },
            {
              type: "html",
              name: "info",
              html: "<b>Payment</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>If you complete everything the study will take around 3 hours and you will receive at least £50 for the inconvenience of taking part. We will also reimburse travel costs - please do not forget to bring receipts.<br/><br/>We may contact you up to three years after this assessment to invite you to take part in future studies. Remember that you are free to withdraw from the study at any time.</p>",
            },
            {
              type: "html",
              name: "info",
              html: "<b>Are the measurements uncomfortable or dangerous?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>All the measures are safe. Some people find the scanning room uncomfortable as the room is not large. You will have a chance to look at the room and the scanner before we begin. If you have the MRI scan we will give you special plugs and padding to protect your ears because the scan makes noises. If you feel uncomfortable, you can always let us know and we will stop the scanning immediately and take you out. There is more information about the scan on the attached sheet.<br/><br/>If you have the physiological measures or EEG we will use gels and creams to clean the skin and stick on the patches/sensors. The gels and creams are hypoallergenic, but occasionally there is a slight reddening of the skin or slight irritation.</p>",
            },
            {
              type: "html",
              name: "info",
              html: "<b>Who should I ask if I have questions?</b>",
            },

            {
              type: "html",
              name: "info",
              html:
                "<p>If you have any questions after reading this information sheet please contact the researcher with whom you initially met [Dr. Tricia Seow (Research Fellow, t.seow@ucl.ac.uk) and Dr. Tobias Hauser (Principal Investigator, t.hauser@ucl.ac.uk)].</p>",
            },
          ],
        },
        {
          questions: [
            {
              type: "html",
              name: "info",
              html:
                "This is more detailed information that you need to know if you are taking part.",
            },
            {
              type: "html",
              name: "info",
              html: "<b>Who will look after my personal data?</b>",
            },
            {
              type: "html",
              name: "info",
              html:
                "<p>UCL is the sponsor for this study based in the United Kingdom. We will be using information from you and your medical records in order to undertake this study and will act as the data controller for this study. This means that we are responsible for looking after your information and using it properly. UCL will keep identifiable information about you until no longer needed.<br/><br/>Your rights to access, change or move your information are limited, as we need to manage your information in specific ways in order for the research to be reliable and accurate. If you withdraw from the study, we will keep the information about you that we have already obtained. However, once unidentifiable data and research results have been anonymised and shared or published it may not be possible for them to be destroyed, withdrawn or recalled. To safeguard your rights, we will use the minimum personally-identifiable information possible.<br/><br/>You can find out more about how we use your information by contacting the researcher you spoke to about this study.<br/><br/>As a university we use personally-identifiable information to conduct research to improve health, care and services. As a publicly-funded organisation, we have to ensure that it is in the public interest when we use personally-identifiable information from people who have agreed to take part in research. This means that when you agree to take part in a research study, we will use your data in the ways needed to conduct and analyse the research study. Your rights to access, change or move your information are limited, as we need to manage your information in specific ways in order for the research to be reliable and accurate. If you withdraw from the study, we will keep the information about you that we have already obtained. To safeguard your rights, we will use the minimum personally-identifiable information possible.<br/><br/>Health and care research should serve the public interest, which means that we have to demonstrate that our research serves the interests of society as a whole. We do this by following the UK Policy Framework for Health and Social Care Research.<br/><br/>If you wish to complain or have any concerns about any aspect of the way you have been approached or treated by members of staff, then please talk to the researcher or the chief investigator (Professor Ray Dolan, r.dolan@ucl.ac.uk) about your complaint. If you would like to discuss a complaint to someone outside the Study team please contact Cathy Price, Director, Wellcome Centre for Human Neuroimaging, UCL Institute of Neurology, 12 Queen Square, London WC1N 3BG; telephone number: 020 3448 4362.<br/><br/>If you wish to raise a complaint on how we have handled your personal data, you can contact our Data Protection Officer who will investigate the matter. If you are not satisfied with our response or believe we are processing your personal data in a way that is not lawful you can complain to the Information Commissioner’s Office (ICO).<br/><br/>Our Data Protection Officer can be contacted at data-protection@ucl.ac.uk.</p>",
            },
            {
              type: "html",
              name: "info",
              html: "<b>What personal data will be collected?</b>",
            },
            {
              type: "html",
              name: "info",
              html:
                "<p>The CNNP Team and NHS trusts involved in your care will collect information from you and your medical records for this research study in accordance with our instructions.<br/><br/>Individuals from UCL and regulatory organisations may look at your medical and research records to check the accuracy of the research study. NHS Trust involved in your care will pass these details to UCL along with the information collected from you and/or your medical records. The only people in UCL who will have access to information that identifies you will be people who need to contact you to give you further information about the study and check you can take part in the study or audit the data collection process. The people who analyse the information will not be able to identify you and will not be able to find out your name, NHS number or contact details.</br><br/><b>However, if you report anything that we feel is a serious risk to your or other people’s safety and well-being, we would then need to share that with the appropriate professionals.  In these cases we will always endeavour to contact you first.</b></p>",
            },
            {
              type: "html",
              name: "info",
              html:
                "<b>UCL will keep identifiable information about you from this study until no longer needed.</b>",
            },
            {
              type: "html",
              name: "info",
              html:
                "<p>UCL will collect information about you for this research study from your medical records. This information may include your name/NHS number/contact details and health information, which is regarded as a special category of information. We will use this information to ensure you can be included in the research and can undergo a research scan as part of the study.</p>",
            },
            {
              type: "html",
              name: "info",
              html: "<b>Sharing data</b>",
            },
            {
              type: "html",
              name: "info",
              html:
                "<p>When you agree to take part in a research study, the information about your health and care may be provided to researchers running other research studies in this organisation and in other organisations. These organisations may be universities, NHS organisations or companies involved in health and care research in this country or abroad. Your information will only be used by organisations and researchers to conduct research in accordance with the UK Policy Framework for Health and Social Care Research.<br/><br/>This information will not identify you and will not be combined with other information in a way that could identify you. The information will only be used for the purpose of health and care research, and cannot be used to contact you or to affect your care. It will not be used to make decisions about future services available to you, such as insurance.<br/><br/>We would like to make the best use of the research data you have given us.  Research data is information given by you, such as answers to questionnaires. We can do this by sharing research data between CNNP and other studies that you have taken part in.  If you are part of another research study, such as in the Neuroscience in Psychiatry Network (NSPN), we may ask you if we can share your research data between CNNP and the other research study.  It is up to you to decide if you would like to do this and you can say ‘yes’ or ‘no’ to research data sharing on the consent form. If you put ‘yes’ this only allows sharing of research data, not your medical records. You can still take part in CNNP if you say ‘no’ to sharing research data. If you withdraw from the CNNP study, you can still take part in the other studies.<br/><br/>We may share your research data in public research databases but your data will always be anonymised or pseudonymised. This means that a code will be used instead of your name (or other personal details), and other protections applied that reduce the risk of deliberate or accidental reidentification of you as an individual.</p>",
            },
            {
              type: "html",
              name: "info",
              html:
                "<b>What will happen to the results of the research study?</b>",
            },
            {
              type: "html",
              name: "info",
              html:
                "<p>If you like, we can send you a summary of the findings once the study is complete and published. Your data will be reported anonymously and you will not be identifiable in any publication.</p>",
            },
            {
              type: "html",
              name: "info",
              html: "<b>Who is organising and funding the research?</b>",
            },
            {
              type: "html",
              name: "info",
              html:
                "<p>This research has been funded by a Wellcome Trust Strategic Grant Award to the Neuroscience in Psychiatry Network (NSPN) and a Wellcome Trust Sir Henry Dale Fellowship. The former is a collaboration between researchers in University College London and the University of Cambridge.</p>",
            },
            {
              type: "html",
              name: "info",
              html: "<b>Who has reviewed the study?</b>",
            },
            {
              type: "html",
              name: "info",
              html:
                "<p>Before any research is allowed to go ahead it has to be checked by a group of people called the Research Ethics Committee. They protect the rights, safety and well-being of research participants. This study has been reviewed by the Westminster Research Ethics Committee (REC reference: 15/LO/1361).</p>",
            },
          ],
        },
        {
          questions: [
            {
              type: "html",
              name: "info",
              html:
                "<p>Thank you for your interest in taking part in this research.<br/><br/>Before you agree to take part, the person organising the research will explain the project to you. If you have any questions arising from the Information Sheet or explanation already given to you, please ask the researcher before you to decide whether to join in. <br/><br/>You will be given a copy of this Consent Form to keep and refer to at any time.</p>",
            },
            {
              type: "html",
              name: "info",
              html: "<b>Participant's statement:</b>",
            },
            {
              type: "checkbox",
              name: "checkbox1",
              title:
                "I have read and understood the information sheet version [number] dated [date] related to the CNNP Study. I have had sufficient time and opportunity to consider this information, ask questions and have had these answered satisfactorily by a member of the research team.",
              isRequired: true,
              choices: ["Yes"],
            },
            {
              type: "checkbox",
              name: "checkbox2",
              title:
                "I understand that my participation is voluntary and that I am/my child is free to withdraw at any time without giving a reason, without my medical care or legal rights being affected.",
              isRequired: true,
              choices: ["Yes"],
            },
            {
              type: "checkbox",
              name: "checkbox3",
              title:
                "I consent to the processing of my personal data for the purposes explained to me in the Information Sheet. I understand that my information will be handled in accordance with all applicable data protection legislation and ethical standards in research.",
              isRequired: true,
              choices: ["Yes"],
            },
            {
              type: "checkbox",
              name: "checkbox4",
              title:
                "I understand that my personal data (name, contact details etc.) will be held securely by UCL. Personal data will only be accessible to the study team and authorised individuals from UCL or the research funder working with them.",
              isRequired: true,
              choices: ["Yes"],
            },
            {
              type: "checkbox",
              name: "checkbox5",
              title:
                "I understand that my pseudonymised personal data can be shared with others for future research, shared in public databases and in scientific reports.",
              isRequired: true,
              choices: ["Yes"],
            },
            {
              type: "checkbox",
              name: "checkbox6",
              title:
                "I understand that the researchers in charge of this study may close the study, or stop my participation in it, at any time without my consent.",
              isRequired: true,
              choices: ["Yes"],
            },
            {
              type: "checkbox",
              name: "checkbox7",
              title:
                "I understand that information related to my/my child’s participation in this study may be accessed by responsible individuals from the sponsor for quality control purposes. I give permission for these individuals to have access to this data.",
              isRequired: true,
              choices: ["Yes"],
            },
            {
              type: "checkbox",
              name: "checkbox8",
              title:
                "I understand that relevant sections of my medical notes and data collected during the study may be looked at by individuals from University College London or from regulatory authorities, where it is relevant to my taking part in this research. I give permission for these individuals to have access to my records.",
              isRequired: true,
              choices: ["Yes"],
            },
          ],
        },
      ],
    };

    //if json1:
    // Please read this information page carefully. If you are happy to
    // proceed, please check the boxes on the second page of this form to
    // consent to this study proceeding. Please note that you cannot proceed
    // to the study unless you give your full consent.

    //if json2:
    // <b>Department</b>: Wellcome Centre for Human Neuroimaging, 12 Queen
    // Square, London WC1N 3BG
    // <br />
    // <b>Data Protection Officer</b>: data-protection@ucl.ac.uk

    if (this.state.consentComplete === 0) {
      return (
        <div className="placeMiddle">
          <div className="boldCenter">INFORMATION FOR THE PARTICIPANT</div>
          <br />
          Please read this information page carefully. If you are happy to
          proceed, please check the boxes on the second page of this form to
          consent to this study proceeding. Please note that you cannot proceed
          to the study unless you give your full consent.
          <br />
          <br />
          <Consent.Survey
            json={json1}
            showCompletedPage={false}
            onComplete={this.redirectToTarget}
          />
        </div>
      );
    } else {
      // this.redirectToTarget();
      console.log("ERROR This should have given consent.");
      return null;
    }
  }
}

export default withRouter(StartPage);
