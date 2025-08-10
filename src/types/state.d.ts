export type State = {
  status?: "success" | "error";
  errors?: {
    [key: string]: string[];
  };
  data?: Record<string, unknown>;
};
