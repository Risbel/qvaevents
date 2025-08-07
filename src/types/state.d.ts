export type State = {
  message: string | null;
  status?: "success" | "error";
  errors?: {
    [key: string]: string[];
  };
  data?: Record<string, unknown>;
};
