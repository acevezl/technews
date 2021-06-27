async function editFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value;
  const post_url = document.querySelector('input[name="post-url"]').value;
  const post_text = document.querySelector('textarea[name="post-text"]').value;
  
  if (title && post_url && post_text ) {
    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
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
      document.location.replace('/dashboard/');
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

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);
