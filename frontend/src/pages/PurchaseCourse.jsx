import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Award, ChevronRight, AlertCircle } from 'lucide-react';
import API from '../api';
import { useToast } from '../components/Toast';
import Loader from '../components/Loader';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60';

const PurchaseCourse = ({ userToken }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        if (!userToken) {
            navigate('/signin');
            return;
        }

        const fetchCourseDetails = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch course directly from backend by ID
                const res = await API.get(`/course/${courseId}`);
                setCourse(res.data.course);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to fetch course details.');
                showToast(err.response?.data?.message || 'Course details could not be loaded.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId, userToken, navigate]);

    const handleConfirmPurchase = async () => {
        setPurchaseLoading(true);

        try {
            await API.post('/course/purchase', { courseId });

            showToast('You have successfully enrolled! Happy learning.', 'success');
            navigate('/purchases');
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.message || 'Checkout failed. Please try again.';
            showToast(errMsg, 'error');
        } finally {
            setPurchaseLoading(false);
        }
    };

    if (loading) {
        return <Loader text="Retrieving secure checkout details..." />;
    }

    if (error || !course) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
                <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center gap-4">
                    <AlertCircle className="w-12 h-12 text-rose-500" />
                    <h2 className="text-xl font-bold text-white">Checkout Error</h2>
                    <p className="text-sm text-slate-400">{error || 'This course is currently unavailable.'}</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="mt-2 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
                    >
                        Browse Courses
                    </button>
                </div>
            </div>
        );
    }

    const imageSrc = course.imageUrl || FALLBACK_IMAGE;
    const instructorName = course.creatorId 
        ? `${course.creatorId.firstName} ${course.creatorId.lastName}` 
        : 'Expert Instructor';

    return (
        <div className="min-h-[85vh] py-12 px-6 bg-[#0f1117] relative">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#6c5ce7]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6c5ce7]">Secure Checkout</span>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">Confirm Enrollment</h1>
                    <p className="text-sm text-slate-400 mt-2">Review your order details below to enroll in this course</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
                    {/* Course Summary Card - 3 columns on desktop */}
                    <div className="md:col-span-3 flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="aspect-video relative overflow-hidden">
                            <img
                                src={imageSrc}
                                alt={course.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                            />
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-950 border border-slate-850 text-[#00cec9] rounded-md">
                                    {course.category || "Development"}
                                </span>
                                <h2 className="text-xl font-bold text-white mt-3 leading-snug">{course.title}</h2>
                                <p className="text-xs text-slate-450 mt-1">Syllabus drafted by {instructorName}</p>
                            </div>
                            
                            <p className="text-sm text-slate-400 leading-relaxed border-t border-slate-850 pt-4">
                                {course.description}
                            </p>
                        </div>
                    </div>

                    {/* Order Details Panel - 2 columns on desktop */}
                    <div className="md:col-span-2 flex flex-col gap-6 p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl">
                        <h3 className="text-base font-bold text-white pb-3 border-b border-slate-850">Included Perks</h3>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3 text-sm text-slate-350">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-200">Lifetime Access</p>
                                    <p className="text-xs text-slate-500">Access updates forever</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-slate-350">
                                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-200">Self-Paced Labs</p>
                                    <p className="text-xs text-slate-500">Learn at your convenience</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-slate-350">
                                <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-200">Completion Certificate</p>
                                    <p className="text-xs text-slate-500">Add to LinkedIn or portfolio</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-850"></div>

                        {/* Pricing section */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-400">Total Price:</span>
                            <span className="text-3xl font-extrabold text-white">${course.price}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleConfirmPurchase}
                                disabled={purchaseLoading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] hover:from-[#5a4bd1] hover:to-[#4b3ec0] text-white py-3.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-indigo-500/10 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {purchaseLoading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Authorizing checkout...
                                    </>
                                ) : (
                                    <>
                                        Complete Enrollment
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/courses')}
                                disabled={purchaseLoading}
                                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                                Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCourse;
