import React from 'react';
import { 
  BrowserRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Header from './Components/Header';
import Courses from './Components/Courses';
import CourseDetail from './Components/CourseDetail';
import CreateCourse from './Components/CreateCourse';
import UpdateCourse from './Components/UpdateCourse';
import UserSignUp from './Components/UserSignUp';
import UserSignIn from './Components/UserSignIn';
import UserSignOut from './Components/UserSignOut';
import Error from './Components/UnhandledError';
import NotFound from './Components/NotFound';
import Forbidden from './Components/Forbidden';

import PrivateRoute from './PrivateRoute';

function App() {

  // Build routes to direct user to appropriate component
  return (
    <BrowserRouter> 
      <Header />
      <Switch>
        <Route exact path='/'><Redirect to='/courses'/></Route>
        <Route exact path='/courses' component={Courses}/>
        <Route path='/signup' component={UserSignUp} />
        <Route path='/signin' component={UserSignIn} />
        <Route path='/signout' component={UserSignOut} />
        <PrivateRoute exact path='/courses/create' component={CreateCourse} />
        <Route exact path='/courses/:id' component={CourseDetail} />
        <PrivateRoute exact path='/courses/:id/update' component={UpdateCourse} />
        <Route path='/error' component={Error} />
        <Route path='/notfound' component={NotFound} />
        <Route path='/forbidden' component={Forbidden} />
        <Route path={'/'} component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
