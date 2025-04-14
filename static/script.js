document.addEventListener('DOMContentLoaded', fetchUsers);

function fetchUsers() {
    fetch('/get_users')
        .then(response => response.json())
        .then(users => {
            const tableBody = document.querySelector('#userTable tbody');
            tableBody.innerHTML = '';
            users.forEach(user => {
                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td contenteditable="true">${user.name}</td>
                        <td contenteditable="true">${user.age}</td>
                        <td contenteditable="true">${user.dep}</td>
                        <td>
                            <button onclick="updateUser(${user.id}, this)">Update</button>
                            <button onclick="deleteUser(${user.id})">Delete</button>
                        </td>
                    </tr>`;
                tableBody.innerHTML += row;
            });
        });
}

function addUser() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const dep = document.getElementById('dep').value;

    fetch('/add_user', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, age, dep})
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchUsers();
    });
}

function updateUser(id, button) {
    const row = button.closest('tr');
    const name = row.children[1].innerText;
    const email = row.children[2].innerText;

    fetch(`/update_user/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, age, dep})
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchUsers();
    });
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/delete_user/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                fetchUsers();
            });
    }
}
