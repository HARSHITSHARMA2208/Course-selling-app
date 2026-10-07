import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import CourseCard from '../components/CourseCard';
import Button from '../components/Button';
import Loader from '../components/Loader';

const MyPurchases = ({ userToken }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userToken) {
            navigate('/signin');
            return;
        }

        const fetchPurchases = async () => {
            setLoading(true);
            try {
                const res = await API.get('/user/purchases', {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });
                
                // Map the populated courses returned from backend
                setCourses(res.data.courses || []);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch your purchased courses.');
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [userToken, navigate]);

    if (loading) {
        return <Loader text="Loading your courses..." />;
    }

    return (
        <div className="courses-page">
            <div className="page-header" style={{ padding: '0', border: 'none', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <h1 className="page-title">My Learning</h1>
                    <p className="page-subtitle">Your enrolled courses — keep learning!</p>
                </div>
                <Button variant="secondary" onClick={() => navigate('/courses')}>
                    Browse More Courses
                </Button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {courses.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <p className="empty-state-title">No courses purchased yet</p>
                    <p className="empty-state-desc">You haven't enrolled in any courses yet. Browse our selection and start learning today!</p>
                    <Button onClick={() => navigate('/courses')}>
                        Browse Courses
                    </Button>
                </div>
            ) : (
                <>
                    <p className="courses-count">{courses.length} course{courses.length !== 1 ? 's' : ''} enrolled</p>
                    <div className="grid">
                        {courses.map((course) => (
                            <CourseCard
                                key={course._id}
                                course={course}
                                isPurchased={true}
                                onAction={() => {}}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default MyPurchases;
