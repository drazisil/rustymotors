import { PackString } from "./constants.js";


// Versioned header
export const VERSIONED_GAME_HEADER: PackString = [
  "BE",
  "SHORT",
  "SHORT",
  "SHORT",
  "SHORT",
  "LONG",
];

// Login inbound
export const login_inbound: PackString = [
  "BE",
  "VERSIONED_GAME_HEADER",
  "LENGTH_SHORT",
  "STRING_VAR",
  "SHORT",
  "LENGTH_SHORT",
  "STRING_VAR",
  "LENGTH_SHORT",
  "STRING_VAR",
  "END",
];
