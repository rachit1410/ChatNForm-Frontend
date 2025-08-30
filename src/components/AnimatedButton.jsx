const AnimatedButton = ({ onClick, icon: Icon, label, color }) => {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center justify-center overflow-hidden
        w-10 hover:w-24 h-10
        rounded-full transition-all duration-300
        ${color ? `bg-${color}-200 text-${color}-700 hover:bg-${color}-300` : `text-gray-100`}
      `}
    >
      {/* Icon stays centered, then nudges slightly left */}
      <span
        className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 group-hover:left-2"
      >
        <Icon size={20} />
      </span>

      {/* Label appears with less spacing */}
      <span
        className="ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm"
      >
        {label}
      </span>
    </button>
  );
};


export default AnimatedButton;