import React, { useState, useEffect } from 'react';
import { useAuthToken } from "../AuthTokenContext.js"; 
import '../style/posts.css';

function PostTweet() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const token = useAuthToken();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const response = await fetch('http://localhost:8000/posts', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const fetchedPosts = await response.json();
            setPosts(fetchedPosts);
        } else {
            console.error('Failed to fetch posts');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const postData = { title, content };

        const response = await fetch('http://localhost:8000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
        });

        if (response.ok) {
            const post = await response.json();
            setPosts([...posts, post]); 
            setTitle('');
            setContent('');
        } else {
            alert('Failed to create post');
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:8000/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            setPosts(posts.filter(post => post.id !== id)); 
        } else {
            alert('Failed to delete post');
        }
    };

    return (
        <div className="post-container">
            <h1 className='blog'>Funtime Blog</h1>
            <form onSubmit={handleSubmit} className="post-form">
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit">Post</button>
            </form>
            <div className="posts-list">
                {posts.map(post => (
                    <div key={post.id} className="post-item">
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <p>{post.createdAt}</p>
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PostTweet;
