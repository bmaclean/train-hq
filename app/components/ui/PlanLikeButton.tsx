import { Plan } from "@prisma/client";
import { useEffect } from "react";
import { useFetcher } from "remix";
import { LikeButton, LikeButtonProps } from "./LikeButton";

interface PlanLikeButtonProps extends LikeButtonProps {
  plan: Plan;
}

export function PlanLikeButton({
  plan,
  ...likeButtonProps
}: PlanLikeButtonProps) {
  // submits the form without navigation
  const like = useFetcher();

  useEffect(() => {
    if (like.state === "idle" && like.data?.error) {
      alert(like.data.error);
    }
  }, [like]);

  return (
    <like.Form action="likes" method="post" className="like-button-form">
      {/* TODO: `delete` method if currently liked */}
      <input type="hidden" name="planId" value={plan?.id} />
      <LikeButton type="submit" {...likeButtonProps} />
    </like.Form>
  );
}
