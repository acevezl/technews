async function upvoteClickHandler(event) {
  event.preventDefault();

  const id = event.target.getAttribute('post-id');

  const response = await fetch('/api/posts/upvote', {
    method: 'PUT',
    body: JSON.stringify({
      post_id: id
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    document.location.reload();
  } else {
    console.log(response);
  }
}

Array.from(document.querySelectorAll('.upvote-btn')).forEach(function(element) {
  element.addEventListener('click', upvoteClickHandler);
});
