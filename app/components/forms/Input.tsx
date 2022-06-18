import classNames from "classnames";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <div>
      <input className={classNames("rounded p-2", className)} {...props} />
      {error ? (
        <p
          className="m-0 mt-1 text-red-500 text-xs"
          role="alert"
          id="name-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
