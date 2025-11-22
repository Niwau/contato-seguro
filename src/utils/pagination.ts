const MAX_LIMIT = 100;

export interface PaginationParams {
  limit?: number | string;
  page?: number | string;
}

const validateNumber = (value: number | string | undefined, defaultValue: number): number => {
  if (!value) {
    return defaultValue;
  }

  const parsedValue = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(parsedValue) || parsedValue < 1) {
    return defaultValue;
  }

  return parsedValue;
};

export const paginate = (params?: PaginationParams): { limit: number; skip: number } => {
  const page = validateNumber(params?.page, 1);
  let limit = validateNumber(params?.limit, 10);

  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  const skip = (page - 1) * limit;

  return { limit, skip };
};
