import type { LibraryCity } from "./shared";
import { IBERIA } from "./iberia";
import { CENTRAL } from "./central";
import { ITALY } from "./italy";
import { EAST } from "./east";
import { FRANCE } from "./france";
import { WEST } from "./west";
import { GERMANY } from "./germany";
import { ALPINE } from "./alpine";
import { ITALY2 } from "./italy2";
import { ATLANTIC } from "./atlantic";
import { NORDIC } from "./nordic";
import { EASTERN } from "./eastern";
import { BALKAN } from "./balkan";
import { MORE } from "./more";

/** All hand-drawn destinations from the library, by IATA code */
export const LIBRARY: Record<string, LibraryCity> = {
  ...IBERIA,
  ...CENTRAL,
  ...ITALY,
  ...EAST,
  ...FRANCE,
  ...WEST,
  ...GERMANY,
  ...ALPINE,
  ...ITALY2,
  ...ATLANTIC,
  ...NORDIC,
  ...EASTERN,
  ...BALKAN,
  ...MORE,
};
