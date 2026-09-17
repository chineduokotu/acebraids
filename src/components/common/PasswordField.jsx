import React, { useId, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const PasswordField = ({ label, id, error, descriptionId, disabled = false, ...inputProps }) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [visible, setVisible] = useState(false);
  const errorId = `${inputId}-error`;
  const describedBy = [descriptionId, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label htmlFor={inputId} className="block text-xs font-semibold text-neutral-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          {...inputProps}
          id={inputId}
          type={visible ? 'text' : 'password'}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`w-full min-h-11 bg-neutral-950 border text-white rounded-xl pl-10 pr-20 py-2.5 text-xs focus:outline-none focus:border-ace-pink disabled:opacity-60 ${error ? 'border-rose-600' : 'border-neutral-800'}`}
        />
        <Lock aria-hidden="true" className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
        <button
          type="button"
          onClick={() => setVisible((wasVisible) => !wasVisible)}
          disabled={disabled}
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
          aria-controls={inputId}
          aria-pressed={visible}
          className="absolute right-0 top-0 h-full min-h-11 px-3 rounded-r-xl flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ace-pink disabled:opacity-60"
        >
          {visible ? <EyeOff aria-hidden="true" className="w-4 h-4" /> : <Eye aria-hidden="true" className="w-4 h-4" />}
          <span aria-hidden="true">{visible ? 'Hide' : 'Show'}</span>
        </button>
      </div>
      {error && <p id={errorId} className="mt-1.5 text-xs text-rose-300">{error}</p>}
    </div>
  );
};
