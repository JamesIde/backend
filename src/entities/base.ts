import { defineEntity, p, type InferEntity } from "@mikro-orm/core";
import { v4 } from "uuid";

export const BaseEntity = defineEntity({
  name: "Base",
  abstract: true,
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => v4()),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
    lastUpdatedBy: p.string().onCreate(() => "SYSTEM"),
  },
});

export type IBaseEntity = InferEntity<typeof BaseEntity>;
