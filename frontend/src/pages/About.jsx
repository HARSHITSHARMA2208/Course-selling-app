import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div>
            <div className="about-hero">
                <h1>Building the Future of Online Learning</h1>
                <p>
                    Coursify connects passionate instructors with eager learners worldwide.
                    We believe great education should be accessible, practical, and taught by
                    people who have done the work — not just studied the theory.
                </p>
            </div>

            <div className="about-values">
                <div className="section-header">
                    <p className="section-label">Our Values</p>
                    <h2 className="section-title">What drives us every day</h2>
                </div>

                <div className="values-grid">
                    <div className="value-card">
                        <h3>🎯 Practical First</h3>
                        <p>
                            Every course on Coursify focuses on real-world, applicable skills.
                            No fluff — just the knowledge you need to build, create, and grow
                            in your career.
                        </p>
                    </div>
                    <div className="value-card">
                        <h3>🌍 Accessible to All</h3>
                        <p>
                            We keep our courses affordable and offer lifetime access so you
                            can learn at your own pace, revisit material whenever you need,
                            and never feel rushed.
                        </p>
                    </div>
                    <div className="value-card">
                        <h3>🤝 Community Driven</h3>
                        <p>
                            Our platform is built by learners, for learners. Instructors are
                            active practitioners who share their journey and provide mentorship
                            alongside course content.
                        </p>
                    </div>
                    <div className="value-card">
                        <h3>⚡ Always Improving</h3>
                        <p>
                            We continuously update our platform and course catalog based on
                            learner feedback and industry trends to ensure you're always learning
                            what matters most.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-xl">
                    <Link to="/courses" className="btn btn-primary btn-lg">
                        Explore Courses
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;
