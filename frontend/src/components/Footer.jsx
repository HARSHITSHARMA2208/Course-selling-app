import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 text-slate-400">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                {/* Brand Column */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <div className="flex items-center gap-2 text-white text-xl font-bold tracking-tight">
                        <span className="w-7 h-7 rounded bg-gradient-to-tr from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-sm">
                            ◆
                        </span>
                        Coursify
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
                        Coursify is a leading EdTech platform offering high-quality, practical, expert-led courses. Level up your career with industry-relevant skills.
                    </p>
                    {/* Newsletter */}
                    <div className="flex flex-col gap-2 max-w-sm">
                        <h5 className="text-xs uppercase font-bold tracking-wider text-slate-300">Subscribe to our newsletter</h5>
                        <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-slate-900 border border-slate-800 focus:border-[#6c5ce7] focus:outline-none rounded-lg py-2.5 pl-3 pr-10 text-sm text-white placeholder-slate-500 transition-colors"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 p-1.5 rounded-md bg-[#6c5ce7] hover:bg-[#5a4bd1] text-white transition-colors"
                                aria-label="Subscribe"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Platform Column */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-semibold text-white tracking-wider">Platform</h4>
                    <ul className="flex flex-col gap-2.5 text-sm">
                        <li><Link to="/courses" className="hover:text-white transition-colors">Browse Courses</Link></li>
                        <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><a href="#" className="hover:text-white transition-colors">Syllabus</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                    </ul>
                </div>

                {/* Instructor Column */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-semibold text-white tracking-wider">Instructors</h4>
                    <ul className="flex flex-col gap-2.5 text-sm">
                        <li><Link to="/admin/signup" className="hover:text-white transition-colors">Become a Creator</Link></li>
                        <li><Link to="/admin/signin" className="hover:text-white transition-colors">Creator Portal</Link></li>
                        <li><Link to="/admin/create-course" className="hover:text-white transition-colors">Publish a Course</Link></li>
                        <li><a href="#" className="hover:text-white transition-colors">Creator Resources</a></li>
                    </ul>
                </div>

                {/* Support Column */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-semibold text-white tracking-wider">Support</h4>
                    <ul className="flex flex-col gap-2.5 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-7xl mx-auto px-6 border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div>
                    © {currentYear} Coursify. All rights reserved. Built with precision for premium education.
                </div>
                <div className="flex items-center gap-4">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors" aria-label="Twitter">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </a>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors" aria-label="GitHub">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors" aria-label="LinkedIn">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors" aria-label="YouTube">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
