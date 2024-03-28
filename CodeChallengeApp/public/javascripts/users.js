// creates a DELETE request
function deleteUser(userId) {
    fetch(`/users/delete/${userId}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            window.location.href = '/'
        } else {
            response.text().then(errorMessage => {
                document.body.innerHTML = errorMessage
            })
        }
    }).catch(error => {
        console.error('Error:', error)
    })
}

// catches editForm submit to turn it into a PUT request, since HTML forms do not support PUT requests
const editForm = document.getElementById('editForm')
if (editForm) {
    editForm.addEventListener('submit', async function (event) {
        event.preventDefault()

        const formData = new FormData(this)
        const userId = formData.get('id')
        const userData = {}
        formData.forEach((value, key) => {
            userData[key] = value
        })

        try {
            const response = await fetch(`/users/edit/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            if (response.ok) {
                window.location.href = '/'
            } else {
                response.text().then(errorMessage => {
                    document.body.innerHTML = errorMessage
                })
            }
        } catch (error) {
            console.error('Error:', error)
        }
    })
}
