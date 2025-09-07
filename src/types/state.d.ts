export type State<T = Record<string, unknown>> = {
  status?: "success" | "error";
  errors?: {
    [key: string]: string[];
  };
  data?: T;
};
