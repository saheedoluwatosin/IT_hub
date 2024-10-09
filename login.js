const API_URL = 'https://it-back.onrender.com';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.accessToken);
            window.location.href = 'add-post.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
    }
});