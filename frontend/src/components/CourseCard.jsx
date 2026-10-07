import { motion } from 'framer-motion';
import { Star, Users, Edit2, ArrowRight } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60';

const CourseCard = ({
    course,
    onAction,
    actionLabel,
    actionLoading = false,
    isPurchased = false,
    isAdmin = false
}) => {
    const imageSrc = course.imageUrl || FALLBACK_IMAGE;
    const category = course.category || "Development";
    const rating = course.rating || 4.8;
    const ratingsCount = course.ratingsCount || 120;
    const enrolledCount = ratingsCount * 7 + 12; // Simulated enrollment count based on ratings

    const instructorName = course.creatorId
        ? typeof course.creatorId === 'object'
            ? `${course.creatorId.firstName} ${course.creatorId.lastName}`
            : 'Expert Instructor'
        : 'Expert Instructor';

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-slate-700/80 transition-all duration-300 relative group h-full"
        >
            {/* Card Image and badges */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={imageSrc}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
                {/* Glow layer overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
                
                {/* Tags */}
                <span className="absolute top-3.5 left-3.5 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-[#00cec9] rounded-md border border-slate-850">
                    {category}
                </span>
                <span className="absolute top-3.5 right-3.5 text-xs font-extrabold px-3 py-1 bg-[#6c5ce7] text-white rounded-md shadow-md">
                    ${course.price}
                </span>
            </div>

            {/* Card Content */}
            <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-semibold text-slate-450">by {instructorName}</p>
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-1 group-hover:text-[#6c5ce7] transition-colors">
                        {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[36px]">
                        {course.description}
                    </p>
                </div>

                {/* Rating and Enrolled count row */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-3.5 mt-auto">
                    <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-200">{rating.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-500">({ratingsCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>{enrolledCount.toLocaleString()} learners</span>
                    </div>
                </div>

                {/* Button container */}
                <div className="pt-2">
                    {isPurchased ? (
                        <button 
                            disabled
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-950/30 border border-emerald-900/60 text-emerald-400 cursor-default"
                        >
                            <span className="text-sm">✓</span>
                            Enrolled
                        </button>
                    ) : isAdmin ? (
                        <button
                            onClick={() => onAction(course)}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit details
                        </button>
                    ) : (
                        <button
                            onClick={() => onAction(course)}
                            disabled={actionLoading}
                            className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-[#6c5ce7] to-[#5a4bd1] hover:from-[#5a4bd1] hover:to-[#4b3ec0] text-white py-2.5 rounded-xl text-xs font-bold shadow-lg hover:shadow-indigo-500/10 active:scale-[0.98] transition-all cursor-pointer"
                        >
                            {actionLabel || 'Enroll Now'}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
