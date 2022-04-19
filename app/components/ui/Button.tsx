export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      className={`${className} bg-primary-400 hover:bg-primary-500 transition text-primary-50 p-2 rounded-md `}
      {...props}
    >
      {children}
    </button>
  );
}
