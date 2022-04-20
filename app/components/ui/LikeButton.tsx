import { useState } from "react";
import { HeartPulseFill } from "react-bootstrap-icons";

export interface LikeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLiked: boolean;
}

export function LikeButton({
  isLiked,
  ...props
}: LikeButtonProps): JSX.Element {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <button
      onMouseOverCapture={() => setHovered(true)}
      onMouseOutCapture={() => setHovered(false)}
      {...props}
    >
      <HeartPulseFill
        className={`${
          hovered ? "text-red-400" : isLiked ? "text-red-500" : "text-gray-300"
        } transition duration-200 active:scale-95 w-full h-full`}
      />
    </button>
  );
}
