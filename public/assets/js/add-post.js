async function newFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value;
  const post_url = document.querySelector('input[name="post-url"]').value;
  const post_text = document.querySelector('textarea[name="post-text"]').value;
  
  if (title && post_url && post_text ) {
    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        post_url,
        post_text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  } else {
    if (!title) {
      let message = document.querySelector('label[for="post-title"] span');
      message.innerText = '- This is a mandatory field';
      message.className = 'error';
    }
    if (!post_url) {
      let message = document.querySelector('label[for="post-url"] span');
      message.innerText = '- This is a mandatory field';
      message.className = 'error';
    }
    if (!post_text) {
      let message = document.querySelector('label[for="post-text"] span');
      message.innerText = '- This is a mandatory field';
      message.className = 'error';
    }
  }
}

function showPostFormHandler(event) {
  event.preventDefault();
  let postForm = document.querySelector('#new-post');
  postForm.className = 'post';

  document.querySelector('#new-post-btn').className = 'button-primary hide';
}

function hidePostFormHandler(event) {
  event.preventDefault();
  let postForm = document.querySelector('#new-post');
  postForm.className = 'post hide';

  document.querySelector('#new-post-btn').className = 'button-primary';
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
document.querySelector('#new-post-btn').addEventListener('click', showPostFormHandler);
document.querySelector('#cancel-btn').addEventListener('click', hidePostFormHandler);