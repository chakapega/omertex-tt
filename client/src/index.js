const signupForm = document.querySelector('.signup-form');

signupForm.addEventListener('submit', event => {
  event.preventDefault();

  const { value: email } = event.target.email;
  const { value: password } = event.target.password;
  console.log(email, password);

  fetch('http://localhost:5000/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });
});
