const API_URL = 'https://it-back.onrender.com';
let token = localStorage.getItem('token');
let allArticles = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchArticles();
    
    document.getElementById('addPostBtn').addEventListener('click', () => {
        if (token) {
            window.location.href = 'add-post.html';
        } else {
            window.location.href = 'login.html';
        }
    });

    document.getElementById('loginBtn').addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Check if we need to refresh the article list
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('refresh') === 'true') {
        fetchArticles();
    }
});

async function fetchArticles() {
    try {
        let response = await fetch(`${API_URL}/allarticle`);
        
        if (!response.ok) {
            console.log('Original endpoint failed, trying alternative...');
            response = await fetch(`${API_URL}/getall`);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Oops, we haven't got JSON!");
        }

        const data = await response.json();
        console.log('API response:', data);

        if (data.article && Array.isArray(data.article)) {
            allArticles = data.article;
        } else if (data.message === "all articles" && Array.isArray(data)) {
            allArticles = data;
        } else {
            throw new Error('Unexpected API response format');
        }

        displayArticles(allArticles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        document.getElementById('articleList').innerHTML = `<p>Error loading articles: ${error.message}</p>`;
    }
}

function displayArticles(articles) {
    const articleList = document.getElementById('articleList');
    articleList.innerHTML = '';
    if (articles.length === 0) {
        articleList.innerHTML = '<p>No articles found.</p>';
        return;
    }
    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('article');
        articleElement.innerHTML = `
            <h2>${escapeHtml(article.title)}</h2>
            <p>${escapeHtml(article.content)}</p>
        `;
        articleList.appendChild(articleElement);
    });
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredArticles = allArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm) || 
        article.content.toLowerCase().includes(searchTerm)
    );
    displayArticles(filteredArticles);
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}