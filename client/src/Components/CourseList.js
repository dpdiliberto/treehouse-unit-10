import React, { useState, useEffect, useContext } from 'react';
import APIHandler from '../APIHandler';
import { Link } from 'react-router-dom';

import Course from './Course';
import Context from '../Context';

export default function CourseList () {
    const context = useContext(Context.Context);

    const [coursesData, setCoursesData] = useState([]);

    const apiHandler = new APIHandler();

    useEffect(() => {
        let mounted = true;
        apiHandler.getCourses()
            .then(courses => {
                if (mounted) {
                    setCoursesData(courses)
                }
            })
            .catch(err => console.log('Error fetching and parsing data', err));
        
        return () => mounted = false;
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

    let courses = coursesData.map(course => 
        <Course 
            title={course.title} 
            description={course.description}
            id={course.id}
            key={course.id}
    />);

    const addNewCourse = (user) => {
        if (user) {
            return (
                <Link to={'/courses/create'}> 
                    <div className="course--module course--add--module" style={ {height: '90%'}}>
                        <span className="course--add--title">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
                            New Course
                        </span>
                    </div>
                </Link>
            )
        }
    }

    return (
        <main>
            <div className="wrap main--grid">
                {courses}
                {addNewCourse(context.authenticatedUser)}
            </div>
        </main>
    )
}