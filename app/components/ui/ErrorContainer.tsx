import classNames from "classnames";
import { ContainerProps } from "../layout/Container";

export function ErrorContainer({
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={classNames(className, "bg-red-50 text-red-500 rounded-md p-4")}
    ></div>
  );
}
