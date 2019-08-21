import { RpcRequest } from "..";
export declare enum Priority {
    HIGHEST = 9000,
    NORMAL = 600,
    LOWEST = 300
}
export declare const rpcRequest: (body: (import("..").Assertion | import("..").Execute | import("..").If | import("..").Calibrate | import("..").ChangeOwnership | import("..").CheckUpdates | import("..").DumpInfo | import("..").EmergencyLock | import("..").EmergencyUnlock | import("..").ExecuteScript | import("..").FactoryReset | import("..").FindHome | import("..").FlashFirmware | import("..").Home | import("..").InstallFarmware | import("..").InstallFirstPartyFarmware | import("..").MoveRelative | import("..").PowerOff | import("..").ReadStatus | import("..").Reboot | import("..").RemoveFarmware | import("..").MoveAbsolute | import("..").ReadPin | import("..").ResourceUpdate | import("..").SendMessage | import("..").SetServoAngle | import("..").SetUserEnv | import("..").Sync | import("..").TakePhoto | import("..").TogglePin | import("..").UpdateFarmware | import("..").Wait | import("..").WritePin | import("..").Zero)[], legacy: boolean, priority?: Priority) => RpcRequest;
