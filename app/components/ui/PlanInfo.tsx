import { Plan } from "@prisma/client";
import { PlanLikeButton } from "./PlanLikeButton";

interface PlanInfoProps {
  plan: Plan;
}

export default function PlanInfo({ plan }: PlanInfoProps) {
  return (
    <div>
      <h2>
        {plan?.name}
        <PlanLikeButton plan={plan} liked={false} />
      </h2>
    </div>
  );
}
