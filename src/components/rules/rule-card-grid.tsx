import { useState, type ReactNode } from "react";
import type { RuleAction } from "#/db/schema";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";

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
	log: { active: "text-white/60", chip: "bg-white/10 text-white/60 border-white/20" },
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
	/** Mark as coming soon - disables interaction */
	comingSoon?: boolean;
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
	comingSoon,
}: RuleCardGridProps) {
	const [configureOpen, setConfigureOpen] = useState(false);

	const handleCardClick = (e: React.MouseEvent) => {
		if (comingSoon) return;
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
				className={`flex flex-col relative rounded-xl gap-3 bg-tw-card border p-3.5 transition-colors ${
					comingSoon
						? "border-tw-border-card cursor-default"
						: enabled
							? "border-tw-accent/40 cursor-pointer hover:bg-tw-hover-light"
							: "border-tw-border-card cursor-pointer hover:bg-tw-hover-light"
				}`}
			>
				{/* Visualization */}
				<div className={`flex justify-center pt-2.5 pb-1 transition-all pointer-events-none ${
					comingSoon ? "opacity-20 grayscale" : enabled ? "opacity-60" : "opacity-30 grayscale"
				}`}>
					{visualization}
				</div>

				{/* Content */}
				<div>
					<div className={`tracking-[-0.3px] font-medium text-[15px] leading-5 ${comingSoon ? "text-tw-text-tertiary" : "text-tw-text-primary"}`}>
						{title}
					</div>
					<div className={`mt-0.5 text-xs leading-4 ${comingSoon ? "text-tw-text-tertiary" : "text-tw-text-secondary"}`}>
						{description}
					</div>
				</div>

				{/* Action badge + numeric chip — only visible when enabled */}
				{enabled && !comingSoon && (
					<div className="flex items-center gap-2">
						<span className={`text-[11px] font-medium ${ACTION_COLORS[action].active}`}>
							{ACTION_LABELS[action]}
						</span>
						{numericConfig && (
							<span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-tw-surface text-tw-text-secondary">
								{numericConfig.value}
							</span>
						)}
					</div>
				)}

				{/* Coming soon badge */}
				{comingSoon ? (
					<span className="absolute right-3 top-3 h-6 px-2.5 rounded-md text-[11px] font-medium bg-tw-surface text-tw-text-tertiary flex items-center">
						Coming soon
					</span>
				) : enabled ? (
					<Button
						variant="ghost"
						size="xs"
						onClick={(e) => { e.stopPropagation(); setConfigureOpen(true); }}
						className="absolute right-3 top-3 h-6 px-2.5 text-[11px] bg-tw-button-muted text-white hover:bg-tw-button-muted-hover"
					>
						Configure
					</Button>
				) : (
					<Button
						variant="ghost"
						size="xs"
						onClick={(e) => { e.stopPropagation(); onToggle(true); }}
						className="absolute right-3 top-3 h-6 px-2.5 text-[11px] bg-tw-button-muted text-white hover:bg-tw-button-muted-hover"
					>
						Install
					</Button>
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
										<Button
											key={a}
											variant="ghost"
											size="xs"
											onClick={() => onActionChange(a)}
											className={`
												px-3 py-1.5 text-[12px] border whitespace-nowrap
												${action === a
													? ACTION_COLORS[a].chip
													: "bg-transparent text-tw-text-tertiary border-tw-border hover:border-tw-text-tertiary hover:text-tw-text-secondary"
												}
											`}
										>
											{ACTION_LABELS[a]}
										</Button>
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
						<Button
							variant="ghost"
							size="xs"
							onClick={() => {
								onToggle(false);
								setConfigureOpen(false);
							}}
							className="mt-2 text-[12px] text-tw-text-tertiary hover:text-red-400 self-start"
						>
							Uninstall rule
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
