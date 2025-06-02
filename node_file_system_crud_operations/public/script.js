const firstname = document.getElementById('firstname');
const age = document.getElementById('age');
const desg = document.getElementById('desg');
const submitButton = document.getElementById('submit');
const p = document.getElementById('deleteMsg');
const timer = document.getElementById('timer');
let userID = '';
let lastUsersCount = 0;
const usersDB = {
  users: [],
  setUsers(data) {
    this.users = data;
  },
};
let updatedUserData = {};

async function fetchData() {
  try {
    const data = await fetch('http://localhost:3500/read-data');
    const users = await data.json();

    lastUsersCount = users.data.length;

    const tableBody = document.querySelector('#userTable tbody');
    users.data.forEach((user, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
  <td>${index + 1}</td>
  <td>${user.id}</td>
  <td>${user.name}</td>
  <td>${user.age}</td>
  <td>${user.desg}</td>
  <td><span><button 
  onclick ="editUser('${user.id}','${user.name}',${user.age},'${user.desg}')" 
      
      
      >Edit</button></span></td>
      
  <td><span><button onclick ="deleteUser('${
    user.id
  }')" >Delete</button></span></td>
`;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.log(error);
  }
}

async function submit() {
  if (userID === '') {
    try {
      data = {
        name: firstname.value,
        age: +age.value,
        desg: desg.value,
      };

      const res = await fetch('http://localhost:3500/write-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const users = await res.json();
      const presentUsersCount = users.data.length;

      if (presentUsersCount > lastUsersCount) {
        users.data
          .slice(lastUsersCount)
          .forEach((user, index) => addUserToTable(user, users.data.length));
        lastUsersCount = users.data.length;
      }

      firstname.value = '';
      age.value = '';
      desg.value = '';
    } catch (error) {
      console.log(error);
    }
  } else {
    updatedUserData = {
      name: firstname.value,
      age: +age.value,
      desg: desg.value,
    };

    const res = await fetch(`http://localhost:3500/update-data/${userID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUserData),
    });
    const updatedUser = await res.json();

    firstname.value = '';
    age.value = '';
    desg.value = '';
    submitButton.innerHTML = 'Submit';

    const rows = document.querySelectorAll('#userTable tbody tr');

    rows.forEach((row) => {
      if (row.cells[1].innerText === String(userID)) {
        row.cells[2].innerText = updatedUserData.name;
        row.cells[3].innerText = updatedUserData.age;
        row.cells[4].innerText = updatedUserData.desg;

        const editButton = row.cells[5].querySelector('button');

        editButton.addEventListener('click', () => {
          editUser(
            userID,
            updatedUserData.name,
            +updatedUserData.age,
            updatedUserData.desg
          );
        });
      }
    });
    userID = '';
  }
}

const addUserToTable = (user, length) => {
  const tableBody = document.querySelector('#userTable tbody');
  const row = document.createElement('tr');

  row.innerHTML = `
   <td>${length}</td>
<td>${user.id}</td>
<td>${user.name}</td>
<td>${user.age}</td>
<td>${user.desg}</td>
<td><span><button onclick ="editUser('${user.id}','${user.name}',${user.age},'${user.desg}')" >Edit</button></span></td>
<td><span><button onclick ="deleteUser('${user.id}')" >Delete</button></span></td>
`;
  tableBody.appendChild(row);
};

const editUser = (id, Name, Age, Desg) => {
  firstname.value = Name;
  age.value = +Age;
  desg.value = Desg;

  userID = id;

  submitButton.innerHTML = 'Update';
};

const deleteUser = async (id) => {
  const rows = document.querySelectorAll('#userTable tbody tr');
  console.log(typeof id);

  rows.forEach((row) => {
    console.log(row.cells[1]);

    // if (row.cells[1].innerHTML === id) {
    //   row.cells[0].innerHTML = '';
    //   row.cells[1].innerHTML = '';
    //   row.cells[2].innerHTML = '';
    //   row.cells[3].innerHTML = '';
    //   row.cells[4].innerHTML = '';
    //   row.cells[5].innerHTML = '';
    //   row.cells[6].innerHTML = '';
    //   row.remove();
    // }
  });

  // const res = await fetch(`http://localhost:3500/${id}`, {
  //   method: 'DELETE',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });
  // const result = await res.json();

  // p.textContent = result.msg;
  // lastUsersCount = result.data.length;

  // removeDeleteMsg();
};

let countDown = 10;
let timerID = null;

const updateTimerDisplay = () => {
  timer.textContent = countDown;
};

const removeDeleteMsg = () => {
  setTimeout(() => {
    p.textContent = '';
  }, 1630);

  // timerID = setInterval(() => {
  //   if (countDown > 0) {
  //     countDown--;
  //     // updateTimerDisplay();
  //     // setTimeout(() => {
  //     //   p.textContent = '';
  //     // }, 2000);
  //   } else {
  //     clearInterval(timerID);
  //     timerID = null;
  //     timer.remove();
  //     if (countDown === 0) {
  //       p.textContent = '';
  //     }
  //   }
  // }, 1000);
};

fetchData();
