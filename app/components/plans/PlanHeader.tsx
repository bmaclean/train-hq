import { Plan } from "@prisma/client";
import { PlanLikeButton } from "./PlanLikeButton";

interface PlanHeaderProps {
  plan: Plan;
  isLiked: boolean;
}

export function PlanHeader({ plan, isLiked }: PlanHeaderProps) {
  return (
    <div>
      <h2>
        {plan?.name}
        <PlanLikeButton className="h-6 w-6" plan={plan} isLiked={isLiked} />
      </h2>
    </div>
  );
}
