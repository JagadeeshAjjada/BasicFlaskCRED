document.addEventListener('DOMContentLoaded', fetchUsers);

let editModal;

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
                        <td>${user.name}</td>
                        <td>${user.age}</td>
                        <td>${user.dep}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="openEditModal(${user.id}, '${user.name}', ${user.age}, '${user.dep}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                        </td>
                    </tr>`;
                tableBody.innerHTML += row;
            });
        });
}

function addUser() {
    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);
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
        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
        document.getElementById('dep').value = '';
    });
}

function openEditModal(id, name, age, dep) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editAge').value = age;
    document.getElementById('editDep').value = dep;

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
    editModal = modal;
}

function confirmEdit() {
    const id = document.getElementById('editUserId').value;
    const name = document.getElementById('editName').value;
    const age = parseInt(document.getElementById('editAge').value);
    const dep = document.getElementById('editDep').value;

    if (confirm(`Update user to:\nName: ${name}\nAge: ${age}\nDepartment: ${dep}?`)) {
        fetch(`/update_user/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, age, dep})
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchUsers();
            editModal.hide();
        });
    }
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
