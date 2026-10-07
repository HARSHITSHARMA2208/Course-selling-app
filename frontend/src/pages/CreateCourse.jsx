import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Input from '../components/Input';
import Button from '../components/Button';

const CreateCourse = ({ adminToken }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Redirect back to admin login if they aren't authenticated
    useEffect(() => {
        if (!adminToken) {
            navigate('/admin/signin');
        }
    }, [adminToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await API.post(
                '/admin/course',
                {
                    title,
                    description,
                    price: Number(price),
                    imageUrl
                },
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`
                    }
                }
            );

            setSuccess('Course created successfully!');
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 1500);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create course. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
            <div className="form-container wide">
                <div className="form-header">
                    <div className="form-icon">📚</div>
                    <h1 className="form-title">Create New Course</h1>
                    <p className="form-subtitle">Add details to publish a new learning course</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Course Title"
                        id="title"
                        placeholder="e.g. Master React in 30 Days"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    
                    <Input
                        label="Course Description"
                        id="description"
                        placeholder="Provide a comprehensive syllabus or summary of the course..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                    />

                    <Input
                        label="Price ($ USD)"
                        id="price"
                        type="number"
                        min="0"
                        placeholder="e.g. 49"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />

                    <Input
                        label="Course Cover Image URL"
                        id="imageUrl"
                        placeholder="e.g. https://images.unsplash.com/... or leave blank"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />

                    {imageUrl && (
                        <div className="image-preview" style={{ marginBottom: 'var(--space-md)' }}>
                            <img 
                                src={imageUrl} 
                                alt="Course cover preview" 
                                onError={(e) => { e.target.style.display = 'none'; }} 
                            />
                        </div>
                    )}

                    <div className="form-actions">
                        <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={() => navigate('/admin/dashboard')} 
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            loading={loading} 
                            style={{ flex: 2 }}
                        >
                            Create Course
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
