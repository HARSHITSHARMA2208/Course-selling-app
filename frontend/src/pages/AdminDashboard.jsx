import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import CourseCard from '../components/CourseCard';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';

const AdminDashboard = ({ adminToken }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // State for editing course
    const [editingCourse, setEditingCourse] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editImageUrl, setEditImageUrl] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    const fetchAdminCourses = async () => {
        if (!adminToken) return;
        setLoading(true);
        try {
            const res = await API.get('/admin/course', {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });
            setCourses(res.data.courses || []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch your courses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!adminToken) {
            navigate('/admin/signin');
        } else {
            fetchAdminCourses();
        }
    }, [adminToken, navigate]);

    const handleEditClick = (course) => {
        setEditingCourse(course);
        setEditTitle(course.title);
        setEditDescription(course.description);
        setEditPrice(course.price);
        setEditImageUrl(course.imageUrl);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setError('');
        setSuccess('');

        try {
            await API.put(
                '/admin/course',
                {
                    courseId: editingCourse._id,
                    title: editTitle,
                    description: editDescription,
                    price: Number(editPrice),
                    imageUrl: editImageUrl
                },
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`
                    }
                }
            );

            setSuccess('Course updated successfully!');
            setEditingCourse(null);
            fetchAdminCourses();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update course.');
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) {
        return <Loader text="Loading your dashboard..." />;
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
            <div className="page-header" style={{ padding: '0', border: 'none', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <h1 className="page-title">Creator Dashboard</h1>
                    <p className="page-subtitle">Manage and track your published courses</p>
                </div>
                <Button onClick={() => navigate('/admin/create-course')}>
                    + Create Course
                </Button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Stats Overview */}
            {courses.length > 0 && (
                <div className="dashboard-stats" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-label">Total Courses</div>
                        <div className="dashboard-stat-value">{courses.length}</div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-label">Average Price</div>
                        <div className="dashboard-stat-value">
                            ${(courses.reduce((acc, c) => acc + c.price, 0) / courses.length).toFixed(2)}
                        </div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="dashboard-stat-label">Total Catalog Value</div>
                        <div className="dashboard-stat-value">
                            ${courses.reduce((acc, c) => acc + c.price, 0)}
                        </div>
                    </div>
                </div>
            )}

            {courses.length === 0 ? (
                <div className="empty-state" style={{ marginTop: 'var(--space-xl)' }}>
                    <div className="empty-state-icon">🎓</div>
                    <p className="empty-state-title">You haven't created any courses yet</p>
                    <p className="empty-state-desc">Get started by creating your first online course now!</p>
                    <Button onClick={() => navigate('/admin/create-course')}>
                        Create First Course
                    </Button>
                </div>
            ) : (
                <div className="grid">
                    {courses.map((course) => (
                        <CourseCard
                            key={course._id}
                            course={course}
                            isAdmin={true}
                            onAction={handleEditClick}
                        />
                    ))}
                </div>
            )}

            {/* Modal for editing course */}
            {editingCourse && (
                <div className="modal-overlay" onClick={() => setEditingCourse(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="form-header" style={{ marginBottom: 'var(--space-lg)' }}>
                            <h2 className="form-title">Edit Course</h2>
                            <p className="form-subtitle">Update course outline or price details</p>
                        </div>

                        <form onSubmit={handleEditSubmit}>
                            <Input
                                label="Course Title"
                                id="editTitle"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                required
                            />
                            <Input
                                label="Description"
                                id="editDescription"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                required
                                rows={4}
                            />
                            <Input
                                label="Price ($ USD)"
                                id="editPrice"
                                type="number"
                                min="0"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                required
                            />
                            <Input
                                label="Cover Image URL"
                                id="editImageUrl"
                                value={editImageUrl}
                                onChange={(e) => setEditImageUrl(e.target.value)}
                            />

                            {editImageUrl && (
                                <div className="image-preview" style={{ marginBottom: 'var(--space-md)' }}>
                                    <img 
                                        src={editImageUrl} 
                                        alt="Course preview" 
                                        onError={(e) => { e.target.style.display = 'none'; }} 
                                    />
                                </div>
                            )}

                            <div className="form-actions" style={{ marginTop: 'var(--space-lg)' }}>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setEditingCourse(null)}
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={editLoading}
                                    style={{ flex: 1 }}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
