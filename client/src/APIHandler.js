import config from './config';

export default class APIHandler {

    // Create an API handler function to streamline the process of making API calls below
    // Takes in a path and an optional "method", "id", "body", "requiresAuth", and "credentials" parameter depending on the API call
    api(path, method = 'GET', id = null, body = null, requiresAuth = false, credentials = null) {
        let url;
        if (id > 0) {
            url = `${config.apiBaseUrl}${path}/${id}`;
        } else {
            url = config.apiBaseUrl + path;
        }

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        };

        if (body !== null) {
            options.body = JSON.stringify(body);
        }

        if (requiresAuth) {
            const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;
        }

        return fetch(url, options);
    }

    // Function to make a "GET" request to pull all courses
    // Does not require an additional parameter
    async getCourses() {
        const response = await this.api('/courses');
        if (response.status === 200) {
            return response.json()
                    .then(data => data);
        } else if (response.status === 401) {
            return null;
        }
        else {
            throw new Error();
        }
    }

    // Function to make a "GET" request to pull a single course
    // Requires an "id" parameter
    async getCourse(id) {
        const response = await this.api('/courses', 'GET', id);
        if (response.status === 200) {
            return response.json()
                    .then(data => data);
        } else if (response.status === 401) {
            return null;
        }
        else {
            throw new Error();
        }
    }

    // Function to make a "GET" request to pull a single user
    // Requires a username and password to authenticate
    async getUser(username, password) {
        const response = await this.api('/users', 'GET', null, null, true, { username, password });
        if (response.status === 200 ) {
            return response.json().then(data => data);
        }
        else if (response.status === 401) {
            return response.json().then(data => {
                data.message = "Please provide a valid email address and password";
                return data.message;
            });
        }
        else {
            throw new Error();
        }
    }

    // Function to make a "POST" request to a create a user
    // Requires a user object parameter
    async createUser(user) {
        const response = await this.api('/users', 'POST', null, user);
        if (response.status === 201) {
            return [];
        } else if (response.status === 400) {
            return response.json().then(data => {
                return data.errors;
            })
        } else {
            throw new Error();
        }
    }

    // Function to make a "POST" request to create a single course
    // Requires a course object parameter and a username and password parameter to authenticate
    async createCourse(course, username, password) {
        const response = await this.api('/courses', 'POST', null, course, true, { username, password });
        if (response.status === 201) {
            return [];
        } else if (response.status === 400) {
            return response.json().then(data => {
                return data.errors;
            })
        } else {
            throw new Error();
        }
    }

    // Fnction to make a "PUT" request to update a single course
    // Requires an id parameter, a course object parameter, and a username and password to authenticate
    async updateCourse(id, course, username, password) {
        const response = await this.api('/courses', 'PUT', id, course, true, { username, password });
        if (response.status === 204) {
            return [];
        } else if (response.status === 400) {
            return response.json().then(data => {
                return data.errors;
            }) 
        } else {
            throw new Error();
        }
    }

    // Function to make a "DELETE" request to delete a single course
    // Requires an id parameter, and a username and password to authenticate
    async deleteCourse(id, username, password) {
        const response = await this.api('/courses', 'DELETE', id, null, true, { username, password });
        if (response.status === 204) {
            return [];
        } else if (response.status === 401) {
            return null;
        } else {
            throw new Error();
        }
    }

};