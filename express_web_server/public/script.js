const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const designation = document.getElementById('desgn');
const form = document.getElementById('userForm');
const btn = document.getElementById('addUserBtn');
const container = document.getElementById('container');
const span = document.createElement('span');

const table = document.querySelector('.tableContainer');
const thead = document.querySelector('.tableContainer thead');
const tbody = document.querySelector('.tableContainer tbody');

const img = document.getElementById('image_preview');
const newInputImage = document.getElementById('user_profile_image');
const defaultImagePath = '../assets/images/default_image.avif';

let isUpdateMode = false;
let userId = '';
let usersList = [];
let userImageBase64 = '';
const API_URL = 'http://localhost:3500/api/users';

const addRowToTable = (
  personId,
  firstname,
  lastname,
  desgn,
  userImage,
  usersList
) => {
  let row = document.createElement('tr');

  if (usersList.length === 1) {
    row.innerHTML = `<th>Firstname</th>
      <th>Lastname</th>
      <th>Designation</th>
      <th>User profile image</th>
      <th colspan="2">Actions</th>
      `;
    thead.appendChild(row);
  }
  row.setAttribute('id', personId);
  row.style = 'text-align:center';
  row.innerHTML = `<td>${firstname}</td>
                     <td>${lastname}</td>
                     <td>${desgn}</td>
                     <td>
            
                     <img src=${
                       userImage
                         ? userImage || `../assets/images/`
                         : '../assets/images/default_image.avif'
                     } alt='${firstname} image' width='80' height='80'
                     style="border-radius: 50%;object-fit:cover;object-position:center top;"
                     />
                     </td>

                     <td><button onclick=editUser(${personId})>Update</button></td>
                     <td><button onclick="deleteUser(${personId})">Delete</button></td>
    `;
  tbody.appendChild(row);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!isUpdateMode) {
    try {
      const firstname = fname.value;
      const lastname = lname.value;
      const desgn = designation.value;
      const id = Math.floor(Math.random() * 201);
      const userImage = userImageBase64;

      const usersData = {
        id,
        firstname,
        lastname,
        desgn,
        userImage,
      };
      const isEmpty = Object.values(usersData).every((data) => {
        return data;
      });

      if (!isEmpty) {
        span.textContent = 'Pls enter fields';
        container.appendChild(span);

        return;
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usersData),
      });

      const { data } = await response?.json();
      addRowToTable(id, firstname, lastname, desgn, userImage, data);
      span.textContent = '';

      const row = document.createElement('tr');
      if (!data.length || tbody.childNodes.length === 1) {
        row.innerHTML = `<th>Firstname</th>
        <th>Lastname</th>
        <th>Designation</th>
        <th>User profile image</th>
        <th colspan="2">Actions</th>
        `;

        thead.appendChild(row);
      } else {
        row.innerHTML = '';
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  } else {
    const id = userId;

    const updatedUserData = {
      firstname: fname.value,
      lastname: lname.value,
      desgn: designation.value,
    };

    const row = document.getElementById(id);

    Object.values(updatedUserData)?.forEach((userCellData, i) => {
      if (row.cells[3].children[0].tagName === 'IMG') {
        row.cells[3].children[0].src = img.src;
      }

      row.cells[i].innerHTML = userCellData;
    });

    btn.innerText = 'Submit';

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedUserData,
          updatedUserProfileImage: img.src,
        }),
      });

      const result = await res.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  fname.value = '';
  lname.value = '';
  designation.value = '';
  img.src = defaultImagePath;
};

const fetchUserData = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const result = await response.json();
  const users = result?.data;
  usersList = [...users];

  const row = document.createElement('tr');

  if (!usersList.length && tbody.childNodes.length === 0) {
    const tr = document.querySelector('.tableContainer thead tr');
    !tr ? null : thead.removeChild(tr);
  } else {
    row.innerHTML = `<th>Firstname</th>
    <th>Lastname</th>
    <th>Designation</th>
    <th>User profile image</th>
    <th colspan="2">Actions</th>
    `;
    thead.appendChild(row);

    users?.forEach((person) => {
      const persondId = person.id;
      addRowToTable(
        persondId,
        person.firstname,
        person.lastname,
        person.desgn,
        person.userProfileImage
          ? `http://localhost:3500/${person.userProfileImage}`
          : undefined,
        usersList
      );
    });
  }
};

const deleteUser = async (id) => {
  const userId = id.toString();
  const row = document.getElementById(`${userId}`);

  if (tbody.childNodes.length === 1) {
    const th = document.querySelector('.tableContainer thead tr');
    th.remove();
    span.textContent = 'No Data Present';
    span.style.textAlign = 'center';
    container.appendChild(span);
  }
  row.remove();

  const res = await fetch(`${API_URL}/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  console.log(result);
};

const editUser = (id) => {
  isUpdateMode = true;
  userId = id.toString();

  // NOTE loop used for multiple cells if the table cells/td are very large and manually difficult to access them
  /* 
  const updateRow = document.getElementById(id).children;
   const rowData = [...updateRow].map((data) => data.textContent).slice(0, 3);
   console.log({ rowData });
 */

  // NOTE manually can access the cell data only when limited amount of table cells/td are present
  const row = document.getElementById(id);
  const fName = row.cells[0].textContent;
  const lName = row.cells[1].textContent;
  const desgn = row.cells[2].textContent;
  const userImage = row.cells[3].children[0].currentSrc;

  fname.value = fName;
  lname.value = lName;
  designation.value = desgn;
  img.src = userImage;
  btn.innerText = 'Update';
};

const previewImageFileHandler = () => {
  const userImage = newInputImage.files[0];

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    userImageBase64 = reader.result;
    img.src = reader.result;
  });

  reader.readAsDataURL(userImage);
};

newInputImage.addEventListener('change', previewImageFileHandler);

const imageClickHandler = () => {
  newInputImage.click();
};

img.addEventListener('click', imageClickHandler);

form.addEventListener('submit', handleSubmit);

window.addEventListener('DOMContentLoaded', fetchUserData);
