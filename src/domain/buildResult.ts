export type BuildResult<T> = { ok: true; input: T } | { ok: false; error: string };

export const ok = <T>(input: T): BuildResult<T> => ({ ok: true, input });

export const fail = (error: string): BuildResult<never> => ({ ok: false, error });
