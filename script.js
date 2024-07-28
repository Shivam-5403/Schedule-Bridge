// document.addEventListener('DOMContentLoaded', function() {
//     const loginForm = document.getElementById('login-form');

//     loginForm.addEventListener('submit', function(event) {
//         event.preventDefault();

//         const username = loginForm.username.value;
//         const password = loginForm.password.value;

//         // Basic client-side validation
//         if (username.trim() === '' || password.trim() === '') {
//             alert('Please fill in all fields.');
//             return;
//         }

//         // Perform login action here
//         console.log('Username:', username);
//         console.log('Password:', password);

//         // Here you can add AJAX call to backend for login authentication
//         // Example:
//         // fetch('/login', {
//         //     method: 'POST',
//         //     headers: {
//         //         'Content-Type': 'application/json'
//         //     },
//         //     body: JSON.stringify({ username, password })
//         // })
//         // .then(response => response.json())
//         // .then(data => {
//         //     if (data.success) {
//         //         window.location.href = '/dashboard';
//         //     } else {
//         //         alert('Invalid credentials');
//         //     }
//         // })
//         // .catch(error => console.error('Error:', error));
//     });

//     document.getElementById('forgot-password').addEventListener('click', function() {
//         alert('Forgot Password functionality coming soon!');
//     });

//     document.getElementById('sign-up').addEventListener('click', function() {
//         alert('Sign Up functionality coming soon!');
//     });
// });
