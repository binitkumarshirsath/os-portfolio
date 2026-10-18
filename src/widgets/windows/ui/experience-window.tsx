import { ExperienceItem } from "@/entities/experience";
import { experience } from "@/shared/content";

export function ExperienceWindow() {
  return (
    <div className="p-5">
      {experience.map((role) => (
        <ExperienceItem key={role.id} experience={role} />
      ))}
    </div>
  );
}
