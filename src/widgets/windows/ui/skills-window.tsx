import { skills } from "@/shared/content";
import { TagList } from "@/shared/ui";
import { WindowSection } from "./window-section";

export function SkillsWindow() {
  return (
    <div className="space-y-6 p-5">
      {skills.map((group) => (
        <WindowSection key={group.label} label={group.label}>
          <TagList items={group.items} />
        </WindowSection>
      ))}
    </div>
  );
}
