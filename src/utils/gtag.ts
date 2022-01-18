export enum GTAG_EVENTS {
  completedRound = 'completed_round',
  sharedResult = 'shared_result',
  openGithub = 'open_github',
  openLinkedin = 'open_linkedin',
  openDictionary = 'open_dictionary',
  openDonate = 'open_donate',
}

export const sendPageViewEvent = (url: string): void => {
  (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const sendEvent = (action: string): void => {
  (window as any).gtag('event', action, {
    send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  });
};
