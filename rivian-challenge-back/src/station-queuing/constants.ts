// tweaking these will make the queuing algorighm behave differently.
// I'd love if these weren't static but were made more dynamic in some way.
// (or possibly a combination of static and dynamic factors).
// But dynamic stuff would take more time to develop.

export const QUEUE_ORDER_POINTS_FACTOR = 10;

export const DISTANCE_POINTS_FACTOR = 1;

export const PRIORITY_POINTS = 200;

export const ALREADY_CHARGED_TODAY_POINTS = -200;

export const HIGH_DEMAND_TRESHOLD = 1.5;

export const HIGH_DEMAND_HOURS_LIMIT = 3;

export const END_OF_WORKDAY_HOURS = 18;
