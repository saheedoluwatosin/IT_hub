const API_URL = 'https://it-back.onrender.com';
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('addPostForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
        const response = await fetch(`${API_URL}/addpost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title, content }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Post added successfully');
            // Redirect to index.html and refresh the article list
            window.location.href = 'index.html?refresh=true';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error adding post:', error);
        alert('An error occurred while adding the post. Please try again.');
    }
});