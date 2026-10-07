const Loader = ({ text = 'Loading...' }) => {
    return (
        <div className="page-loader">
            <span className="spinner"></span>
            <p>{text}</p>
        </div>
    );
};

export default Loader;
