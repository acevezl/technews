async function commentFormHandler(event) {
  event.preventDefault();

  const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();
  const post_id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];
  if (comment_text) {
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        post_id,
        comment_text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }
}

function showCommentForm(event) {
  event.preventDefault();
  
  let commentForm = document.querySelector('#new-comment-form-holder');
  commentForm.className = 'twelve columns new-comment';

  let commentBtn = document.querySelector('#comment-btn');
  commentBtn.className = 'button-primary hide';
}

function hideCommentForm(event) {
  event.preventDefault();

  let commentForm = document.querySelector('#new-comment-form-holder');
  commentForm.className = 'twelve columns new-comment hide';

  let commentBtn = document.querySelector('#comment-btn');
  commentBtn.className = 'button-primary';
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);
document.querySelector('#comment-btn').addEventListener('click', showCommentForm);
document.querySelector('#cancel-btn').addEventListener('click', hideCommentForm);