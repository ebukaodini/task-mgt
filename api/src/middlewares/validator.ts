import { ValidationError, validate } from "class-validator";
import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";

type ValidatorInput = "body" | "params" | "query" | "headers" | "cookies";

export function validator(
  Dto: any,
  group: string,
  input: ValidatorInput = "body"
): any {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inputData = req[input];
      const dtoData = Dto.fromJson(inputData!);

      const errors = await validate(dtoData, {
        groups: [group],
        strictGroups: true,
        validationError: {
          target: false,
          value: false,
        },
      });

      // Handle validation error
      if (errors.length > 0) {
        const validationErrors = mapErrors(errors);
        return res.error(
          "Validation failed",
          validationErrors,
          HttpStatusCode.UnprocessableEntity
        );
      }

      req.updateContext({ validData: dtoData });
      next();
    } catch (error: any) {
      return res.error(
        "Internal server error",
        error.message,
        HttpStatusCode.InternalServerError
      );
    }
  };
}

const mapErrors = (errors: ValidationError[]) => {
  const mappedErrors: any = {};

  for (const error of errors) {
    const { property, children, constraints } = error;

    if (constraints) {
      mappedErrors[property] = Object.values(constraints)[0];
    } else if (children?.length! > 0) {
      mappedErrors[property] = mapErrors(children!);
    }
  }

  return mappedErrors;
};
