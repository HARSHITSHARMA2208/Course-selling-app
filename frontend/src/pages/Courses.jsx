import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, BookOpen } from 'lucide-react';
import API from '../api';
import CourseCard from '../components/CourseCard';


const CATEGORIES = ['All', 'Development', 'Design', 'Marketing', 'Data Science', 'DevOps', 'Security'];

const Courses = ({ userToken }) => {
    const [courses, setCourses] = useState([]);
    const [purchasedCourseIds, setPurchasedCourseIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await API.get('/course/preview');
                setCourses(res.data.courses || []);

                if (userToken) {
                    const purchaseRes = await API.get('/user/purchases');
                    const purchasedList = purchaseRes.data.purchases || [];
                    const ids = purchasedList.map(item =>
                        typeof item.courseId === 'object' ? item.courseId._id : item.courseId
                    );
                    setPurchasedCourseIds(ids);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userToken]);

    const handleCourseAction = (course) => {
        if (!userToken) {
            navigate('/signin');
        } else {
            navigate(`/purchase/${course._id}`);
        }
    };

    // Filter courses by category AND search query
    const filteredCourses = courses.filter(course => {
        const matchesSearch = 
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = 
            selectedCategory === 'All' || 
            (course.category && course.category.toLowerCase() === selectedCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Header section */}
            <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Explore Courses</h1>
                    <p className="text-sm text-slate-400 mt-2">Enhance your skillset with our expert-crafted curriculum</p>
                </div>
            </div>

            {/* Filter and Search Bar Container */}
            <div className="flex flex-col lg:flex-row gap-5 mb-10">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                    <input
                        type="text"
                        placeholder="Search courses by title, instructor, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-850 hover:border-slate-800 focus:border-[#6c5ce7] focus:outline-none rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 transition-colors"
                    />
                </div>
                
                {/* Category tab lists */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                                selectedCategory === category
                                    ? 'bg-[#6c5ce7] text-white border-[#6c5ce7]'
                                    : 'bg-slate-900/40 text-slate-450 border-slate-850 hover:border-slate-800 hover:text-white'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-400 text-sm mb-6">{error}</div>}

            {/* Skeleton Loading States */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="flex flex-col bg-slate-900/20 border border-slate-850 rounded-2xl overflow-hidden h-[380px] animate-pulse">
                            <div className="aspect-video bg-slate-800/30"></div>
                            <div className="p-5 flex-1 flex flex-col gap-4">
                                <div className="w-1/3 h-3 bg-slate-800/30 rounded-md"></div>
                                <div className="w-full h-5 bg-slate-800/30 rounded-md"></div>
                                <div className="w-5/6 h-3 bg-slate-800/30 rounded-md"></div>
                                <div className="mt-auto flex justify-between">
                                    <div className="w-1/4 h-4 bg-slate-800/30 rounded-md"></div>
                                    <div className="w-1/3 h-8 bg-slate-800/30 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-16 bg-slate-900/20 border border-slate-850 rounded-2xl max-w-lg mx-auto mt-10">
                    <span className="text-4xl mb-4">🔍</span>
                    <h3 className="text-lg font-bold text-white">No courses match your search</h3>
                    <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                        We couldn't find any courses matching "{searchQuery || selectedCategory}". Try adjusting your filters or search keywords.
                    </p>
                    {(searchQuery || selectedCategory !== 'All') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                            className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredCourses.map((course) => (
                            <motion.div
                                key={course._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CourseCard
                                    course={course}
                                    isPurchased={purchasedCourseIds.includes(course._id)}
                                    onAction={handleCourseAction}
                                    actionLabel={userToken ? 'Enroll Now' : 'Sign In to Enroll'}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default Courses;
