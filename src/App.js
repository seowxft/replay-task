import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import StartPage from "./Components/StartPage";
import OutcomeTask from "./Components/OutcomeTask";
import PathTask from "./Components/PathTask";
import TutorTask from "./Components/TutorTask";
import QuizTask from "./Components/QuizTask";
import ExptTask from "./Components/ExptTask";
import EndPage from "./Components/EndPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={StartPage} exact />
        <Route path="/OutcomeTask" component={OutcomeTask} exact />
        <Route path="/PathTask" component={PathTask} exact />
        <Route path="/TutorTask" component={TutorTask} exact />
        <Route path="/QuizTask" component={QuizTask} exact />
        <Route path="/ExptTask" component={ExptTask} exact />
        <Route path="/EndPage" component={EndPage} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
