import { useState } from "react";
import { HeartPulse, HeartPulseFill } from "react-bootstrap-icons";

interface LikeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  liked: boolean;
}

export function LikeButton({ liked, ...props }: LikeButtonProps): JSX.Element {
  const [hovered, setHovered] = useState<boolean>(false);

  function getLikeIcon() {
    if (hovered || liked) {
      return <HeartPulseFill className="like-icon" />;
    } else {
      return <HeartPulse className="like-icon" />;
    }
  }

  return (
    <button
      className="like-button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {getLikeIcon()}
    </button>
  );
}
