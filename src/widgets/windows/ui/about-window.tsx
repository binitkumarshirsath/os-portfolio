import { education, profile } from "@/shared/content";
import { TagList } from "@/shared/ui";
import { WindowSection } from "./window-section";

export function AboutWindow() {
  return (
    <div className="space-y-6 p-5">
      <p className="text-sm leading-relaxed">{profile.summary}</p>

      <WindowSection label="Currently learning">
        <TagList items={profile.currentlyLearning} />
      </WindowSection>

      <WindowSection label="Education">
        <ul className="space-y-4">
          {education.map((entry) => (
            <li key={entry.id} className="space-y-0.5">
              <p className="font-mono text-[11px] text-fg-muted">
                {entry.period} · {entry.grade}
              </p>
              <p className="text-sm font-medium">{entry.degree}</p>
              <p className="text-sm text-fg-muted">{entry.school}</p>
            </li>
          ))}
        </ul>
      </WindowSection>
    </div>
  );
}
