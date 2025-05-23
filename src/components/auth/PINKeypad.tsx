
interface PINKeypadProps {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

export const PINKeypad = ({ onKeyPress, disabled }: PINKeypadProps) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'enter']
  ];

  const getKeyContent = (key: string) => {
    switch (key) {
      case 'clear': return 'Clear';
      case 'enter': return 'Enter';
      default: return key;
    }
  };

  const getKeyStyle = (key: string) => {
    if (key === 'enter') {
      return 'bg-green-500 hover:bg-green-600 text-white';
    }
    if (key === 'clear') {
      return 'bg-red-500 hover:bg-red-600 text-white';
    }
    return 'bg-gray-700 hover:bg-gray-600 text-white';
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {keys.flat().map((key) => (
        <button
          key={key}
          onClick={() => onKeyPress(key)}
          disabled={disabled}
          className={`
            h-16 rounded-lg font-bold text-lg transition-all duration-150
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 shadow-lg'}
            ${getKeyStyle(key)}
          `}
        >
          {getKeyContent(key)}
        </button>
      ))}
    </div>
  );
};
