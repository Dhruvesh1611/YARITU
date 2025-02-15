const header = document.getElementsByClassName('header');
const button = document.getElementById('changeTextBtn');
button.addEventListener('click', function() {
    header.textContent = 'The text has been changed!';
  });