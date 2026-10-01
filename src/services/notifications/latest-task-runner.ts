type Waiter = { resolve: () => void; reject: (error: unknown) => void };

export type LatestTaskRunner<T> = { run: (input: T) => Promise<void> };

export function createLatestTaskRunner<T>(task: (input: T) => Promise<void>): LatestTaskRunner<T> {
  let latestInput: T;
  let queued = false;
  let draining = false;
  let waiters: Waiter[] = [];

  const drain = async () => {
    let failed = false;
    let lastError: unknown;
    while (queued) {
      queued = false;
      try {
        await task(latestInput);
        failed = false;
        lastError = undefined;
      } catch (error) {
        failed = true;
        lastError = error;
      }
    }
    const settled = waiters;
    waiters = [];
    draining = false;
    for (const waiter of settled) {
      if (failed) waiter.reject(lastError);
      else waiter.resolve();
    }
  };

  return {
    run(input) {
      latestInput = input;
      queued = true;
      const completion = new Promise<void>((resolve, reject) => { waiters.push({ resolve, reject }); });
      if (!draining) {
        draining = true;
        void drain();
      }
      return completion;
    },
  };
}
