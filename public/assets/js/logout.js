 async function logout() {
  const response = await fetch('/api/users/logout', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  });
  if (response.ok) {
    document.location.replace('/');
  } else {
    console.log(response.statusText);
  }
}

let idleTime = 0; // minute counter
let lastCounter = 60; // last seconds before logout
var idleInterval;
var lastInterval;
document.addEventListener("DOMContentLoaded", function(event) { 

    // Increment the idle time counter every minute.
    idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    // Zero the idle timer on user actions (mouse movement key press).
    document.addEventListener('mousemove', function (e) {
        idleTime = 0;
    });

    document.addEventListener('keypress', function (e) {
        idleTime = 0;
    });
});

function timerIncrement() {
    if (idleTime > 2) { // three minutes
      clearInterval(idleInterval);
      let logoutModal = document.createElement('div');
      logoutModal.innerHTML =
      `
      <!-- The Modal -->
      <div id="logoutModal" class="modal">

        <!-- Modal content -->
        <div class="modal-content">
          <h5>Are you still there?</h5>
          <p>It seems you've been inactive for a while. Do you need more time?</p>
          <p>You will be logged out in <span id="logoff-counter"></span> seconds</p>
          <button class="button" id="keep-logged-in">Yes, I need more time.</button>
        </div>

      </div>
      `;
      document.querySelector(`body`).appendChild(logoutModal);
      document.querySelector(`#keep-logged-in`).addEventListener('click', function(e){
        idleInterval = setInterval(timerIncrement, 60000); // 1 minute
        document.querySelector('#logoutModal').remove();
        clearInterval(lastInterval);
        lastCounter = 60;
      });
      lastInterval = setInterval(lastSeconds, 1000); // 1 second
    }
    idleTime++;
}

function lastSeconds() {
  if (lastCounter <= 0) {
    logout();
  } else {
    document.querySelector('#logoff-counter').innerHTML = lastCounter;
  }
  lastCounter--;
}

document.querySelector('#logout').addEventListener('click', logout);
