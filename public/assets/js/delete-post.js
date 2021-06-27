async function deleteFormHandler(event) {
  event.preventDefault();

  const id = event.target.getAttribute('post-id');
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    document.location.replace('/dashboard/');
  } else {
    alert(response.statusText);
  }
}

function confirmDelete(event) {

  const id = event.target.getAttribute('post-id');

  let confirmDeleteModal = document.createElement('div');
  confirmDeleteModal.innerHTML =
`
<!-- The Modal -->
<div id="deleteModal" class="modal">

  <!-- Modal content -->
  <div class="modal-content">
    <h5>Are you sure you want to delete this post?</h5>
    <p>This wil be a final action and cannot be undone</p>
    <button class="button-primary" id="delete-${id}" post-id="${id}" class="confirmed-delete">Yes, I'm sure</button>
    <button class="button" id="do-not-delete-${id}" post-id="${id}" class="cancel-delete">No, keep my post</button>
  </div>

</div>
`;
  document.querySelector(`#post-${id}`).appendChild(confirmDeleteModal);
  document.querySelector(`#delete-${id}`).addEventListener('click',deleteFormHandler);
  document.querySelector(`#do-not-delete-${id}`).addEventListener('click', destroyModal);
}

function destroyModal(event){
  document.querySelector('#deleteModal').remove();
}

Array.from(document.querySelectorAll('.delete-post-btn')).forEach(function(element) {
  element.addEventListener('click', confirmDelete);
});
