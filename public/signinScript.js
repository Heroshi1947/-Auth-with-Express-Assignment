const form = document.getElementById('signin-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');

  const email = emailInput.value;
  const password = passwordInput.value;

  // Perform client-side validation
  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }

  // Send a request to the backend to verify user credentials
  try {
    const response = await fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Signin successful
      alert(data.message);
      // Perform any other actions you need after successful signin
      
    } else {
      // Signin failed
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred during signin');
  }
});