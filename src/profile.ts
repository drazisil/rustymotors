import { PackString } from "./packing/constants.js";

interface Profile {
    customerId: number; // 4 bytes
    profileId: number; // 4 bytes
    isBanned: boolean; // 4 bytes
    isGagged: boolean; // 4 bytes
    profileName: string; // 32 bytes
    shardId: number; // 4 bytes
}

const profiles: Profile[] = [
    {
        customerId: 0,
        profileId: 0,
        isBanned: false,
        isGagged: false,
        profileName: "Test",
        shardId: 0,
    },
];