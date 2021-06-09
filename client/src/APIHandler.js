import config from './config';

export default class APIHandler {
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

    // Get Courses (no auth)
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

    // Get Course
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

    // Get User
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
    // Create User (auth / sign up)
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

    // Create course (auth required)
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

    // Update course (auth required)
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

    // Delete course (auth required)
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