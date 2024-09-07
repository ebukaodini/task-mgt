import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { connectDb } from "../services/db";
import { PrismaClient } from "@prisma/client";

type PropertyType = {
  entity: string;
  field?: string;
  transform?: (v: ValidationArguments["value"]) => any;
};

@ValidatorConstraint({ async: true, name: "IsUnique" })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
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
        if (result) return false;
        return true;
      });
  }

  defaultMessage(args: ValidationArguments): string {
    const { entity, field } = args.constraints[0] as PropertyType;
    return `${entity} ${[field ?? args.property]} already exists`;
  }
}

export function IsUnique(
  property: PropertyType,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: new IsUniqueConstraint(connectDb()),
    });
  };
}
