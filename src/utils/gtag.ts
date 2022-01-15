export enum GTAG_EVENTS {
  completedRound = 'completed_round',
  sharedResult = 'shared_result',
}

export const sendPageViewEvent = (url: string): void => {
  (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const sendEvent = (action: GTAG_EVENTS): void => {
  (window as any).gtag('event', action, {
    send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  });
};
