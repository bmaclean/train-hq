import { Plan } from "@prisma/client";
import { useEffect } from "react";
import { useFetcher } from "remix";

import { LikeButton, LikeButtonProps } from "~/components/ui";

interface PlanLikeButtonProps extends LikeButtonProps {
  plan: Plan;
}

export function PlanLikeButton({
  plan,
  isLiked,
  ...likeButtonProps
}: PlanLikeButtonProps) {
  // submits the form without navigation
  const like = useFetcher();

  useEffect(() => {
    if (like.type === "done" && like.data?.error) {
      alert(like.data.error);
    }
  }, [like.type, like.data?.error]);

  return (
    <like.Form
      action={"likes"}
      method={isLiked ? "delete" : "post"}
      className="w-auto inline-flex"
    >
      {/* TODO: `delete` method if currently liked */}
      <input type="hidden" name="planId" value={plan?.id} />
      <LikeButton type="submit" isLiked={isLiked} {...likeButtonProps} />
    </like.Form>
  );
}
