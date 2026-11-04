const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => { const p = clamp(value); return p * p * (3 - 2 * p); };

export const partSpread = (progress: number, index: number) => smooth((progress - .08 - index * .018) / .38);
export const partVisibility = (progress: number, index: number) => smooth((progress - .10 - index * .012) / .13);
export const assembledVisibility = (progress: number) => 1 - smooth((progress - .06) / .20);
export const componentLabelProgress = (progress: number, index: number) => smooth((progress - .55 - index * .055) / .10);
