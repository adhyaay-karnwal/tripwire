export {
  SIGNALS,
  SIGNAL_REGISTRY,
  SIGNAL_CATEGORIES,
  getSignal,
  getSignalsByCategory,
  getOperatorsForType,
} from "../signals"

export type {
  Signal,
  SignalMeta,
  SignalInput,
  SignalType,
  SignalCategory,
  SignalCategoryInfo,
  SignalOperator,
  NumberOperator,
  BooleanOperator,
  StringOperator,
  EnrichmentData,
  RepoReputationData,
  GitHubUserRaw,
  PrTemporalData,
} from "../signals/types"

export type SignalDefinition = import("../signals/types").SignalMeta
