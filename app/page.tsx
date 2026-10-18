import { ViewportSwitch } from "@/shared/ui";
import { BootScreen } from "@/widgets/boot-screen";
import { Desktop } from "@/widgets/desktop";
import { Dock } from "@/widgets/dock";
import { Menubar } from "@/widgets/menubar";
import { MobileShell } from "@/widgets/mobile-shell";
import { windowBodies } from "@/widgets/windows";

// The app layer is where widgets meet: window contents are built here once and
// handed to whichever shell fits the screen, so no widget has to import another.
export default function Home() {
  return (
    <>
      <BootScreen />
      <ViewportSwitch
        desktop={
          <div className="flex h-dvh flex-col">
            <Menubar />
            <Desktop bodies={windowBodies} />
            <Dock />
          </div>
        }
        mobile={<MobileShell bodies={windowBodies} />}
      />
    </>
  );
}
