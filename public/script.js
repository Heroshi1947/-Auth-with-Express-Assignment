const form = document.getElementById('signup-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const bioInput = document.getElementById('bio');
  const passwordInput = document.getElementById('password');

  const username = usernameInput.value;
  const email = emailInput.value;
  const bio = bioInput.value;
  const password = passwordInput.value;

  // Perform client-side validation
  if (!email || !password || !username) {
    alert('All fields are required');
    return;
  }

  // Send a request to the backend to store the user data
  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, bio, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Signup successful
      alert(data.message);
      // Perform any other actions you need after successful signup
    } else {
      // Signup failed
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred during signup');
  }
});
