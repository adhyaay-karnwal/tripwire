import { useState, type ReactNode } from "react";
import type { RuleAction } from "#/db/schema";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";

export {
	AiSlopViz,
	ProfilePictureViz,
	LanguageViz,
	MergedPrsViz,
	AccountAgeViz,
	MaxPrsPerDayViz,
	MaxFilesChangedViz,
	RepoActivityViz,
	ProfileReadmeViz,
	CryptoViz,
} from "../landing/visuals";

const ACTION_LABELS: Record<RuleAction, string> = {
	block: "Block",
	warn: "Warn",
	log: "Log only",
	threshold: "Threshold",
};

const ACTION_COLORS: Record<RuleAction, { active: string; chip: string }> = {
	block: { active: "text-red-400", chip: "bg-red-500/15 text-red-400 border-red-500/30" },
	warn: { active: "text-amber-400", chip: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
	log: { active: "text-[#FFFFFF99]", chip: "bg-white/10 text-[#FFFFFF99] border-white/20" },
	threshold: { active: "text-tw-accent", chip: "bg-tw-accent/15 text-tw-accent border-tw-accent/30" },
};

interface NumericConfig {
	value: number;
	label: string;
	onChange: (value: number) => void;
}

interface RuleCardGridProps {
	title: ReactNode;
	/** Plain title for the modal header (no dropdowns) */
	modalTitle?: string;
	description: string;
	enabled: boolean;
	action?: RuleAction;
	onToggle: (enabled: boolean) => void;
	onActionChange?: (action: RuleAction) => void;
	visualization: ReactNode;
	numericConfig?: NumericConfig;
}

export function RuleCardGrid({
	title,
	modalTitle,
	description,
	enabled,
	action = "block",
	onToggle,
	onActionChange,
	visualization,
	numericConfig,
}: RuleCardGridProps) {
	const [configureOpen, setConfigureOpen] = useState(false);

	const handleCardClick = (e: React.MouseEvent) => {
		// Don't toggle if clicking on interactive elements (dropdowns, buttons inside title)
		const target = e.target as HTMLElement;
		if (target.closest('[data-dropdown]') || target.closest('[data-action-select]') || target.closest('button:not([data-card-toggle])')) {
			return;
		}
		onToggle(!enabled);
	};

	return (
		<>
			<div
				onClick={handleCardClick}
				className={`flex flex-col relative rounded-xl gap-3 bg-tw-card border p-3.5 transition-colors cursor-pointer hover:bg-tw-hover-light ${
					enabled ? "border-tw-accent/40" : "border-tw-border-card"
				}`}
			>
				{/* Visualization */}
				<div className={`flex justify-center pt-2.5 pb-1 transition-all pointer-events-none ${
					enabled ? "opacity-60" : "opacity-30 grayscale"
				}`}>
					{visualization}
				</div>

				{/* Content */}
				<div>
					<div className="tracking-[-0.3px] text-tw-text-primary font-medium text-[15px] leading-5">
						{title}
					</div>
					<div className="mt-0.5 text-tw-text-secondary text-xs leading-4">
						{description}
					</div>
				</div>

				{/* Action badge — only visible when enabled */}
				{enabled && (
					<div className="flex items-center">
						<span className={`text-[11px] font-medium ${ACTION_COLORS[action].active}`}>
							{ACTION_LABELS[action]}
						</span>
					</div>
				)}

				{/* Install / Configure button */}
				{enabled ? (
					<button
						type="button"
						onClick={(e) => { e.stopPropagation(); setConfigureOpen(true); }}
						className="absolute right-3 top-3 h-6 px-2.5 rounded-md text-[11px] font-medium transition-colors bg-white text-black hover:bg-white/90"
					>
						Configure
					</button>
				) : (
					<button
						type="button"
						onClick={(e) => { e.stopPropagation(); onToggle(true); }}
						className="absolute right-3 top-3 h-6 px-2.5 rounded-md text-[11px] font-medium transition-colors bg-[#ffffff14] text-white hover:bg-[#ffffff22]"
					>
						Install
					</button>
				)}
			</div>

			{/* Configure Modal */}
			<Dialog open={configureOpen} onOpenChange={setConfigureOpen}>
				<DialogContent
					showCloseButton
					className="w-full max-w-[400px] border-tw-border bg-tw-card p-0"
				>
					<DialogHeader className="px-5 pt-5 pb-4">
						<DialogTitle className="text-[15px] leading-5 font-medium text-tw-text-primary">
							{modalTitle ?? (typeof title === "string" ? title : "Configure rule")}
						</DialogTitle>
					</DialogHeader>

					<div className="px-5 pb-5 flex flex-col gap-5">
						{/* Action level selector */}
						{onActionChange && (
							<div className="flex flex-col gap-2">
								<label className="text-[12px] font-medium text-tw-text-secondary">
									Action level
								</label>
								<div className="flex flex-wrap items-center gap-1.5">
									{(["block", "warn", "log"] as const).map((a) => (
										<button
											key={a}
											type="button"
											onClick={() => onActionChange(a)}
											className={`
												px-3 py-1.5 rounded-lg text-[12px] font-medium border cursor-pointer transition-all whitespace-nowrap
												${action === a
													? ACTION_COLORS[a].chip
													: "bg-transparent text-tw-text-tertiary border-tw-border hover:border-tw-text-tertiary hover:text-tw-text-secondary"
												}
											`}
										>
											{ACTION_LABELS[a]}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Numeric config input */}
						{numericConfig && (
							<div className="flex flex-col gap-2">
								<label className="text-[12px] font-medium text-tw-text-secondary">
									{numericConfig.label}
								</label>
								<div className="flex items-center gap-2">
									<div className="relative">
										<input
											type="number"
											value={numericConfig.value}
											onChange={(e) => {
												const val = Number.parseInt(e.target.value, 10);
												if (!Number.isNaN(val) && val > 0) {
													numericConfig.onChange(val);
												}
											}}
											className="w-20 h-9 px-3 rounded-lg bg-tw-surface border border-tw-border text-[13px] text-tw-text-primary text-center outline-none focus:border-tw-accent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
										/>
									</div>
								</div>
							</div>
						)}

						{/* Uninstall button */}
						<button
							type="button"
							onClick={() => {
								onToggle(false);
								setConfigureOpen(false);
							}}
							className="mt-2 text-[12px] text-tw-text-tertiary hover:text-red-400 transition-colors self-start"
						>
							Uninstall rule
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
