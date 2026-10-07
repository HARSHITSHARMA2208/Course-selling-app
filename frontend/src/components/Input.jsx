const Input = ({
    label,
    id,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    rows,
    ...props
}) => {
    const isTextarea = rows || type === 'textarea';

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                </label>
            )}
            {isTextarea ? (
                <textarea
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    rows={rows || 4}
                    className="form-input"
                    {...props}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="form-input"
                    {...props}
                />
            )}
        </div>
    );
};

export default Input;
