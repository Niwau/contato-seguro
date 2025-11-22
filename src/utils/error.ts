export class APIError extends Error {
  public readonly code: number;

  constructor(message: string, code = 400) {
    super(message);
    this.code = code;
  }

  public static alreadyExists(entity = "Resource") {
    return new APIError(`${entity} already exists`, 409);
  }

  public static notFound(entity = "Resource") {
    return new APIError(`${entity} not found`, 404);
  }

  public static objectId() {
    return new APIError("Invalid ObjectId", 400);
  }
}
