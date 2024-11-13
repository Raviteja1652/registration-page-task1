import React, { useEffect, useState } from "react";
import Registration from "./Components/Registration/Registration";
import { Switch, Route, Redirect } from "react-router-dom";
import WelcomePage from "./Components/Pages/WelcomePage";

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [fullName, setFullName] = useState({firstName: '', lastName: ''})

  useEffect(() => {
    const firstName = localStorage.getItem('firstName')
    const lastName = localStorage.getItem('lastName')
    if (firstName && lastName) {
      setIsAuth(true)
      setFullName({firstName, lastName})
    }
    setIsLoading(false)
  }, [])

  if (isLoading) return null

  return (
    <div>
      <Switch>

        <Route path='/' exact>
          <Registration />
        </Route>

        <Route path='/welcome'>
          {isAuth ? <WelcomePage fullName={fullName} /> : <Redirect to='/' />}
        </Route>

        <Route path='/register/:id'>
          <Registration />
        </Route>

        <Route path='*'>
          <Redirect to='/' />
        </Route>
        
      </Switch>
    </div>
  )
}

export default App;