import { metadata as openidConnectMetadata } from "./openid-connect/metadata";
import { metadata as mcpMetadata } from "./mcp/metadata";

export const courses = {
  "openid-connect": openidConnectMetadata,
  mcp: mcpMetadata,
};

export type CourseMetadata = (typeof courses)[keyof typeof courses];
