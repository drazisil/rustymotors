import { PackString } from "./constants.js";

// Basic header
export const BASIC_HEADER: PackString = ["BE", "SHORT", "SHORT"];

// Versioned header
export const VERSIONED_GAME_HEADER: PackString = [
  "BE",
  "SHORT",
  "SHORT",
  "SHORT",
  "SHORT",
  "LONG",
];

// Server header
export const SERVER_HEADER: PackString = [
  "LE",
  "SHORT", // Length
  "STRING_FIXED_4", // "TMOC"
  "LONG", // sequence number
  "BYTE" // Flags
];

export const SERVER_MESSAGE: PackString = [
  "LE",
  "SERVER_HEADER",
  "LE",
  "HEX_STRING_FIXED_2", // message code
  "REST"
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

// Get profiles inbound
export const get_profiles_inbound: PackString = [
  "BE",
  "VERSIONED_GAME_HEADER",
  "LONG",
  "END",
];

// Check profile name inbound
export const check_profile_name_inbound: PackString = [
  "BE",
  "VERSIONED_GAME_HEADER",
  "LONG",
  "LENGTH_SHORT",
  "STRING_VAR",
  "LENGTH_SHORT",
  "STRING_VAR",
  "END",
];

// Check plate name inbound
export const check_plate_name_inbound: PackString = [
  "BE",
  "VERSIONED_GAME_HEADER",
  "LONG",  // No idea what this is
  "LENGTH_SHORT",
  "STRING_VAR",
  "END",
];

export const packStrings:Map<string, PackString> = new Map([
  ["BASIC_HEADER", BASIC_HEADER],
  ["VERSIONED_GAME_HEADER", VERSIONED_GAME_HEADER],
  ["SERVER_HEADER", SERVER_HEADER],
  ["login_inbound", login_inbound],
  ["get_profiles_inbound", get_profiles_inbound],
  ["check_profile_name_inbound", check_profile_name_inbound],
  ["check_plate_name_inbound", check_plate_name_inbound],
]);
