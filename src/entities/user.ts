import { defineEntity, p, type InferEntity } from "@mikro-orm/core";
import { BaseEntity } from "./base.js";

export const UserSchema = defineEntity({
  name: "User",
  extends: BaseEntity,
  properties: {
    firstName: p.string(),
    lastName: p.string(),
  },
});

export type IUser = InferEntity<typeof UserSchema>;
