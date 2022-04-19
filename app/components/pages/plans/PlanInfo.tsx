import { Plan } from "@prisma/client";
import { PlanLikeButton } from "./";

interface PlanInfoProps {
  plan: Plan;
}

export function PlanInfo({ plan }: PlanInfoProps) {
  return (
    <div>
      <h2>
        {plan?.name}
        <PlanLikeButton className="h-6 w-6" plan={plan} liked={false} />
      </h2>
    </div>
  );
}
