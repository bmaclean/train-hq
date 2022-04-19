import classNames from "classnames";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div
      style={{ minHeight: "inherit" }}
      className={classNames(className, "flex")}
      {...props}
    >
      {children}
    </div>
  );
}
