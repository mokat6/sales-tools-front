import { Operation } from "./SwaggerSdk";

export function dtoToJsonPatch<T extends object>(dto: T): Operation[] {
  const operations: Operation[] = [];

  for (const key in dto) {
    if (dto[key] !== undefined) {
      operations.push(
        Operation.fromJS({
          op: "replace",
          path: `/${key}`,
          value: dto[key],
        })
      );
    }
  }

  return operations;
}
