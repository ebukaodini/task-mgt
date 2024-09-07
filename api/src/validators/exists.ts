import { PrismaClient } from "@prisma/client";
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { connectDb } from "../services/db";

type PropertyType = {
  entity: string;
  field?: string;
  transform?: (v: ValidationArguments["value"]) => any;
};

@ValidatorConstraint({ async: true, name: "Exists" })
export class ExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly db: PrismaClient) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const { entity, field, transform } = args.constraints[0] as PropertyType;

    return await this.db[entity]
      .findFirst({
        where: {
          [field ?? args.property]: transform ? transform(value) : value,
        },
      })
      .then((result: any) => {
        if (!result) return false;
        return true;
      });
  }

  defaultMessage(args: ValidationArguments): string {
    const { entity, field } = args.constraints[0] as PropertyType;
    return `${entity} ${[field ?? args.property]} does not exist`;
  }
}

export function Exists(
  property: PropertyType,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: new ExistsConstraint(connectDb()),
    });
  };
}
