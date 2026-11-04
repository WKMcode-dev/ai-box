export type UpdateState = {
  status:
    | "idle"
    | "unsupported"
    | "checking"
    | "current"
    | "available"
    | "downloading"
    | "ready"
    | "installing"
    | "error";
  currentVersion: string;
  version?: string;
  progress?: number;
  message?: string;
};
interface DesktopUpdates {
  getState(): Promise<UpdateState>;
  check(): Promise<UpdateState>;
  download(): Promise<UpdateState>;
  install(): Promise<UpdateState>;
  subscribe(callback: (state: UpdateState) => void): () => void;
}
declare global {
  interface Window {
    desktopUpdates?: DesktopUpdates;
  }
}
