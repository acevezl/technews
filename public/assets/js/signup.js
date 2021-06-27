async function signupFormHandler(event) {
    event.preventDefault();

    const first_name = document.querySelector('#first-name').value.trim();
    const last_name = document.querySelector('#last-name').value.trim();
    const email = document.querySelector('#email-signup').value.trim(); 
    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
  
    if (username && email && password && first_name && last_name) {
      const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
          first_name,
          last_name,
          username,
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
    }
  }
  
async function loginFormHandler(event) {
  event.preventDefault();
  document.location.replace("/login");
}

async function checkUsername(event) {
  event.preventDefault();
  console.log(event);
  const username = document.querySelector('#username-signup').value.trim();

  const response = await fetch('/api/users/username/' + username, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  });

  let messageBox = document.querySelector('.validation-messages');

  if (response.ok) {
    let message = document.createElement('p');
    message.innerText = 'Username already exists, please enter a different one.';
    messageBox.appendChild(message);
    let userValidation = document.querySelector('#user-validation');
    userValidation.className = 'error oi oi-circle-x';
  } else {
    messageBox.innerHTML = '';
    let userValidation = document.querySelector('#user-validation');
    userValidation.className = 'ok oi oi-circle-check';
  }
}

function checkPassword(event) {
  event.preventDefault();
  const paswdregex =  /^(?=.*[0-9])[a-zA-Z0-9]{8,16}$/;
  let password = document.querySelector('#password-signup').value;
  let password2 = document.querySelector('#password-signup-2').value;

  let messageBox = document.querySelector('.validation-messages');
  let oldPwdMessages = document.querySelectorAll('.pwd-validation-msg');  
  oldPwdMessages.forEach( element => {
    messageBox.removeChild(element);
  });

  let passwordValidation = document.querySelector('#password-validation');

  if (!password.match(paswdregex)) {
    let message = document.createElement('p');
    message.setAttribute('class','pwd-validation-msg');
    message.innerText = 'Your password must contain at least one number, and it should be between 8 and 16 characters.'
    messageBox.appendChild(message);

    passwordValidation.className = 'error oi oi-circle-x';
  }

  if (password !== password2) {
    let message = document.createElement('p');
    message.setAttribute('class','pwd-validation-msg');
    message.innerText = 'Passwords do not match.'
    messageBox.appendChild(message);

    passwordValidation.className = 'error oi oi-circle-x';
  }

  if (password === password2 && password.match(paswdregex)){
    passwordValidation.className = 'ok oi oi-circle-check';
  }

}

document
  .querySelector(".login-form")
  .addEventListener("submit", loginFormHandler);

document
  .querySelector(".signup-form")
  .addEventListener("submit", signupFormHandler);

document
  .querySelector("#username-signup")
  .addEventListener("blur", checkUsername);

document
  .querySelector("#password-signup")
  .addEventListener("blur", checkPassword);

  document
  .querySelector("#password-signup-2")
  .addEventListener("blur", checkPassword);