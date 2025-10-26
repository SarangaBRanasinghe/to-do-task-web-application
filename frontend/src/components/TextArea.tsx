interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  return (
    <div>
      <label 
        htmlFor={id} 
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>
      <textarea
        id={id}
        className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all duration-200 resize-none ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};