import { HTMLAttributes } from "react";

interface BrandLogoProps extends HTMLAttributes<HTMLImageElement> {
  type: "circle" | "text";
}

export function BrandLogo({ type, ...props }: BrandLogoProps) {
  switch (type) {
    case "circle": {
      return <img src="images/train-hq.png" alt="Train HQ Logo" {...props} />;
    }
    case "text": {
      return (
        <img src="images/train-hq-text.png" alt="Train HQ Logo" {...props} />
      );
    }
  }
}
