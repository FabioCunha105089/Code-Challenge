# API Endpoints

### GET /

- **Description:** Redirects to **/users**.

---
### GET /users

- **Description:** Home page. Retrieves a list of users.
- **Response Status Code:**
    - (200) Successfully retrieved the list of users.
    - (500) Server error. Probably reading the dataset file.
- **Response Body:** An array of user objects.
- **Instructions:** Click on the `Create` button on the home page.

---
### GET /users/create

- **Description:** Renders a form for creating a new user.
- **Response Status Code:**
    - (200) Successfully rendered the user creation form.
- **Instructions:** Click on the `Create` button on the home page.

---
### POST /users/create

- **Description:** Creates a new user.
- **Request Body:** User data in JSON format.
- **Response Status Code:**
    - (201) User successfully created.
    - (400) Validation error occurred. Details in the response body.
    - (500) Server error. Probably reading the dataset file.
- **Instructions:** Fill form fields and click the `Submit` button.

---
### GET /users/edit/:userId

- **Description:** Renders a form for editing details of a specific user.
- **Response Status Code:**
    - (200) Successfully rendered the user edit form.
    - (404) User with the specified ID not found.
    - (500) Server error. Probably reading the dataset file.
- **Instructions:** On the row of the user you want to edit, click on `Edit` in the **Actions** column.

---
### PUT /users/edit/:userId

- **Description:** Updates details of a specific user.
- **Request Body:** Updated user data in JSON format.
- **Response Status Code:**
    - (201) User details successfully updated.
    - (400) Validation error occurred. Details in the response body.
    - (404) User with the specified ID not found.
    - (500) Server error. Probably reading the dataset file.
- **Instructions:** Change the fields you want and click the `Submit` button. ID field is *readonly* and cannot be changed.

---
### DELETE /users/delete/:userId

- **Description:** Deletes a specific user.
- **Response Status Code:**
    - (200) User successfully deleted.
    - (404) User with the specified ID not found.
    - (500) Server error. Probably reading the dataset file.
- **Instructions:** On the row of the user you want to delete, click on `Delete` in the **Actions** column.

---
### GET /users/:userId

- **Description:** Retrieves details of a specific user.
- **Response Status Code:**
    - (200) Successfully retrieved user details.
    - (404) User with the specified ID not found.
    - (500) Server error. Probably reading the dataset file.
- **Instructions:** Click on a user name on the home page.
