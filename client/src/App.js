import React from 'react';
import { 
  BrowserRouter,
  Route,
  Redirect,
  Switch,
  useHistory
} from 'react-router-dom';

import Header from './Components/Header';
import CourseList from './Components/CourseList';
import CourseDetail from './Components/CourseDetail';
import CreateCourse from './Components/CreateCourse';
import UpdateCourse from './Components/UpdateCourse';
import UserSignUp from './Components/UserSignUp';
import UserSignIn from './Components/UserSignIn';
import UserSignOut from './Components/UserSignOut';
import Error from './Components/Error';
import NotFound from './Components/NotFound';

import PrivateRoute from './PrivateRoute';


function App() {

  let history = useHistory();

  const handleCancel = (e) => {
    e.preventDefault();
    history.push('/courses');
  }

  return (
    <BrowserRouter> 
      <Header />
      <Switch>
        <Route exact path='/'><Redirect to='/courses'/></Route>
        <Route exact path='/courses' render={() => <CourseList/>}/>
        <Route path='/signup' component={UserSignUp} />
        <Route path='/signin' render={() => <UserSignIn handleCancel={handleCancel}/>} />
        <Route path='/signout' component={UserSignOut} />
        <PrivateRoute exact path='/courses/create' component={CreateCourse} />
        <Route exact path='/courses/:id' component={CourseDetail} />
        <PrivateRoute path='/courses/:id/update' component={UpdateCourse} />
        <Route path='/error' component={Error} />
        <Route path='/notfound' component={NotFound} />
        <Route path={'/'} component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
