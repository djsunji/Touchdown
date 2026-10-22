import type { LibraryCity } from "./shared";
import { IBERIA } from "./iberia";
import { CENTRAL } from "./central";
import { ITALY } from "./italy";
import { EAST } from "./east";

/** All hand-drawn destinations from the library, by IATA code */
export const LIBRARY: Record<string, LibraryCity> = {
  ...IBERIA,
  ...CENTRAL,
  ...ITALY,
  ...EAST,
};
