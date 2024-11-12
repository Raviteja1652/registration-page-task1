import React from "react";
import Registration from "./Components/Registration/Registration";
import { Switch, Route, Redirect } from "react-router-dom";
import WelcomePage from "./Components/Pages/WelcomePage";

function App() {
  return (
    <div>
      <Switch>

        <Route path='/' exact>
          <Registration />
        </Route>

        <Route path='/welcome'>
          <WelcomePage />
        </Route>

        <Route path='/register/:id'>
          <Registration />
        </Route>
        
      </Switch>
    </div>
  )
}

export default App;