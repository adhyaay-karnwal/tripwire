import { Link } from "@tanstack/react-router";
import type { AuthClientSession } from "@tripwire/auth/client";
import { TripwireLogo } from "#/components/icons/tripwire-logo";

// The terminal's barrel curvature makes the top edge of the visible screen bow
// upward in the middle (corners recede). Both side groups translate slightly
// down to sit where the curved screen edge actually is at the corners, and
// rotate outward so each group's baseline aligns with the curve tangent at its
// position. Contents stay crisp because we never touch pixels — only layout.
const SIDE_DROP_PX = 4;
const SIDE_TILT_DEG = 1.6;

export function LandingHeader({ session }: { session: AuthClientSession }) {
    return (
        <div className="flex items-center justify-between p-4">
            <div
                className="flex items-center gap-2"
                style={{
                    transform: `translateY(${SIDE_DROP_PX}px) rotate(-${SIDE_TILT_DEG}deg)`,
                    transformOrigin: "right center",
                }}
            >
                <TripwireLogo className="w-5 h-5 text-white" />
                <span className="text-md font-medium text-tw-text-secondary font-['Geist',system-ui,sans-serif]">
                    tripwire
                </span>
            </div>
            <div
                className="flex items-center gap-3.5"
                style={{
                    transform: `translateY(${SIDE_DROP_PX}px) rotate(${SIDE_TILT_DEG}deg)`,
                    transformOrigin: "left center",
                }}
            >
                {session ? (
                    <>
                        <span className="text-[14px] text-tw-text-secondary">
                            Welcome back
                        </span>
                        <Link
                            to="/home"
                            className="flex items-center h-7 px-2.5 rounded-lg text-[14px] font-medium text-black bg-white shadow-sm hover:bg-white/90 transition-colors"
                        >
                            dashboard
                        </Link>
                    </>
                ) : (
                    <>
                        <span className="text-[14px] text-tw-text-secondary">
                            Already have access?
                        </span>
                        <Link
                            to="/login"
                            className="flex items-center h-7 px-2.5 rounded-lg text-[14px] font-medium text-black bg-white shadow-sm hover:bg-white/90 transition-colors"
                        >
                            login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
