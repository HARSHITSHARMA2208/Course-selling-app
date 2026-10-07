import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, GraduationCap, CheckCircle, Code, PenTool, BarChart, Database, Terminal, Shield } from 'lucide-react';
import API from '../api';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';

const CATEGORIES = [
    { name: 'Development', icon: Code, count: 12, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { name: 'Design', icon: PenTool, count: 8, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { name: 'Marketing', icon: BarChart, count: 6, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Data Science', icon: Database, count: 5, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { name: 'DevOps', icon: Terminal, count: 4, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { name: 'Security', icon: Shield, count: 3, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
];

const Home = ({ userToken }) => {
    const [courses, setCourses] = useState([]);
    const [purchasedCourseIds, setPurchasedCourseIds] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const featuredCourses = courses.slice(0, 6);

    return (
        <div className="relative overflow-hidden bg-[#0f1117] text-[#f0f0f5]">
            {/* ─── Hero Section ─── */}
            <section className="relative pt-12 pb-24 md:py-32 overflow-hidden">
                {/* Background glowing blobs */}
                <div className="absolute top-10 left-10 w-96 h-96 bg-[#6c5ce7]/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute top-40 right-10 w-80 h-80 bg-[#00cec9]/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 w-fit">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] animate-pulse"></span>
                            Trusted by 10,000+ developers globally
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                            Master new skills with{' '}
                            <span className="bg-gradient-to-r from-[#6c5ce7] via-[#a29bfe] to-[#00cec9] bg-clip-text text-transparent">
                                expert-led courses
                            </span>
                        </h1>
                        
                        <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
                            Practical, project-based courses curated by industry professionals. Learn real coding skills, deploy live applications, and accelerate your career.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Link 
                                to="/courses" 
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] hover:from-[#5a4bd1] hover:to-[#4b3ec0] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Browse Courses
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link 
                                to="/about" 
                                className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white font-semibold px-6 py-3.5 rounded-xl transition-all"
                            >
                                How it Works
                            </Link>
                        </div>

                        {/* Social proof trust layer */}
                        <div className="flex items-center gap-4 pt-6 border-t border-slate-900 mt-4">
                            <div className="flex -space-x-3">
                                <div className="w-9 h-9 rounded-full border-2 border-[#0f1117] bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">AK</div>
                                <div className="w-9 h-9 rounded-full border-2 border-[#0f1117] bg-teal-600 flex items-center justify-center text-[10px] font-bold text-white">SP</div>
                                <div className="w-9 h-9 rounded-full border-2 border-[#0f1117] bg-rose-600 flex items-center justify-center text-[10px] font-bold text-white">RV</div>
                                <div className="w-9 h-9 rounded-full border-2 border-[#0f1117] bg-amber-600 flex items-center justify-center text-[10px] font-bold text-white">MK</div>
                            </div>
                            <div className="text-xs text-slate-400">
                                Join <span className="text-white font-bold">10,000+</span> learners building their dream portfolios
                            </div>
                        </div>
                    </motion.div>

                    {/* Right column vector illustration mockup */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative hidden lg:flex items-center justify-center"
                    >
                        {/* Abstract glow card mock */}
                        <div className="w-[500px] h-[360px] bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative backdrop-blur-sm overflow-hidden flex flex-col justify-between">
                            <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                </div>
                                <span className="text-xs text-slate-500 font-mono">coursify.sh --live</span>
                            </div>
                            
                            <div className="flex-1 font-mono text-xs text-indigo-400 space-y-2 select-none leading-relaxed">
                                <p className="text-slate-500">// Initialize your learning path</p>
                                <p><span className="text-teal-400">const</span> coursify = <span className="text-amber-400">require</span>(<span className="text-emerald-400">'coursify'</span>);</p>
                                <p><span className="text-teal-400">const</span> user = coursify.<span className="text-white">getCurrentUser</span>();</p>
                                <p className="text-slate-300">user.<span className="text-amber-400">startLearning</span>({'{'}</p>
                                <p className="pl-4">courseId: <span className="text-emerald-400">'react-nextjs-micro-services'</span>,</p>
                                <p className="pl-4">mode: <span className="text-emerald-400">'project-based'</span>,</p>
                                <p className="pl-4">access: <span className="text-emerald-400">'lifetime'</span></p>
                                <p className="text-slate-350">{'}'});</p>
                                <p className="text-emerald-400 mt-4">&gt;&gt; Compiling knowledge assets... SUCCESS</p>
                                <p className="text-slate-200">&gt;&gt; Ready to code! 🚀</p>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-850 mt-4 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00cec9]"></span>React 19</span>
                                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#6c5ce7]"></span>Next.js 15</span>
                                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500"></span>Tailwind v4</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── Stats Banner ─── */}
            <section className="bg-slate-950 border-y border-slate-900 py-10 relative z-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { number: '60+', label: 'Premium Courses' },
                        { number: '15K+', label: 'Active Learners' },
                        { number: '30+', label: 'Expert Mentors' },
                        { number: '4.9★', label: 'Average rating' },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center justify-center text-center">
                            <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{stat.number}</span>
                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Categories Section ─── */}
            <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6c5ce7]">Explore Categories</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-2">What do you want to learn?</h2>
                    <p className="text-sm text-slate-400 max-w-lg mx-auto mt-3">Discover custom curated pathways aligned with production expectations in standard design, coding, and analytics roles.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                    {CATEGORIES.map((cat, i) => {
                        const Icon = cat.icon;
                        return (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.15)' }}
                                className="flex flex-col items-center justify-center text-center p-6 bg-slate-900/30 border border-slate-850 rounded-xl cursor-pointer hover:bg-slate-900/50 transition-all duration-300"
                            >
                                <span className={`p-3 rounded-lg border mb-3 ${cat.color}`}>
                                    <Icon className="w-5 h-5" />
                                </span>
                                <h4 className="text-sm font-bold text-white truncate w-full">{cat.name}</h4>
                                <span className="text-[10px] text-slate-500 mt-1">{cat.count} Courses</span>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ─── Trending Courses Section ─── */}
            <section className="py-24 bg-slate-950/40 border-y border-slate-900 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#00cec9]">Trending Courses</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-2">Popular online classes</h2>
                            <p className="text-sm text-slate-400 mt-3 max-w-lg">Engage with student favorites covering frontend architectures, backend APIs, and distributed hosting systems.</p>
                        </div>
                        {courses.length > 6 && (
                            <Link 
                                to="/courses" 
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6c5ce7] hover:text-[#5a4bd1] transition-colors"
                            >
                                View All Catalog
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>

                    {loading ? (
                        <Loader text="Loading live catalog..." />
                    ) : featuredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredCourses.map((course) => (
                                <CourseCard
                                    key={course._id}
                                    course={course}
                                    isPurchased={purchasedCourseIds.includes(course._id)}
                                    onAction={handleCourseAction}
                                    actionLabel={userToken ? 'Enroll Now' : 'Sign In to Enroll'}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-900/20 border border-slate-850 rounded-2xl max-w-lg mx-auto">
                            <span className="text-4xl mb-4">📚</span>
                            <h4 className="text-lg font-bold text-white">No courses created yet</h4>
                            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                                Our instructors are uploading content. Log in as an administrator to publish the first course!
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ─── Why Choose Us ─── */}
            <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6c5ce7]">Why Choose Us</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-2">Engineered for real learning</h2>
                    <p className="text-sm text-slate-400 max-w-lg mx-auto mt-3">We discard passive learning models and focus entirely on engineering live portfolios.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: GraduationCap, title: 'Expert-led curriculum', desc: 'Courses engineered directly by senior engineers bringing real tech stack experiences.' },
                        { icon: CheckCircle, title: 'Project-focused labs', desc: 'Build and deploy databases, API servers, and UI components instead of clicking multiple-choice checks.' },
                        { icon: Star, title: 'Lifetime access updates', desc: 'Acquire once, access forever. Review revised syllabus releases and notes without paying extra renewal subscriptions.' },
                    ].map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div key={i} className="flex flex-col gap-4 p-8 bg-slate-900/30 border border-slate-850 rounded-2xl hover:border-slate-800 transition-all duration-300">
                                <span className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[#6c5ce7] border border-indigo-500/20">
                                    <Icon className="w-5 h-5" />
                                </span>
                                <h3 className="text-lg font-bold text-white mt-2">{feature.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ─── Testimonials ─── */}
            <section className="py-24 bg-slate-950/40 border-y border-slate-900 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#00cec9]">Success Stories</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-2">What our learners say</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Arjun Kumar', role: 'Frontend Engineer', text: 'The microservices and React architectures taught on Coursify helped me crack my full-stack coding rounds easily. Very structured!' },
                            { name: 'Sneha Patel', role: 'SDE-2 at Startup', text: 'Practical, clear walkthroughs. I went from raw Node APIs to configuring containerized deployments in production within a month.' },
                            { name: 'Rahul Verma', role: 'DevOps Architect', text: 'I valued the lifetime updates. Returning to review updated framework changes in Next.js was extremely helpful.' }
                        ].map((test, i) => (
                            <div key={i} className="flex flex-col justify-between p-8 bg-slate-900/30 border border-slate-850 rounded-2xl relative h-full">
                                <p className="text-sm italic text-slate-350 leading-relaxed">"{test.text}"</p>
                                <div className="flex items-center gap-3 mt-6 border-t border-slate-850/60 pt-4">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-xs font-bold text-white">
                                        {test.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{test.name}</h4>
                                        <p className="text-[11px] text-slate-500">{test.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Call to Action ─── */}
            <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
                <div className="relative rounded-3xl overflow-hidden p-8 md:p-16 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center gap-6">
                    {/* Glowing effect inside CTA */}
                    <div className="absolute inset-0 bg-[#6c5ce7]/5 blur-[80px] pointer-events-none rounded-3xl"></div>
                    
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-2xl relative z-10">
                        Ready to accelerate your engineering career?
                    </h2>
                    
                    <p className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed relative z-10">
                        Join our learning platform today. Sign up for a free student profile and get instant access to previews, code files, and study modules.
                    </p>

                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-bold px-7 py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] mt-2 relative z-10"
                    >
                        Create Free Account
                        <ArrowRight className="w-4.5 h-4.5 text-slate-950" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
