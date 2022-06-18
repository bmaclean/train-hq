import classNames from "classnames";
import { Button } from "../ui";
import type { ButtonProps } from "../ui/Button";

interface SubmitProps extends ButtonProps {
  formError?: string;
}

export function Submit({ formError, className, ...props }: SubmitProps) {
  return (
    <div>
      {formError ? (
        <p className="m-0 mt-1 text-red-500 text-xs" role="alert">
          {formError}
        </p>
      ) : null}
      <Button className={classNames(className)} type="submit" {...props} />
    </div>
  );
}
