interface ShardEntry {
  name: string;
  description: string;
  id: number;
  loginServerIp: string;
  loginServerPort: number;
  lobbyServerIp: string;
  lobbyServerPort: number;
  mcotsServerIp: string;
  statusId: number;
  statusReason: string;
  serverGroupName: string;
  population: number;
  maxPersonasPerUser: number;
  diagnosticServerHost: string;
  diagnosticServerPort: number;
}

class Shard implements ShardEntry {
  name: string;
  description: string;
  id: number;
  loginServerIp: string;
  loginServerPort: number;
  lobbyServerIp: string;
  lobbyServerPort: number;
  mcotsServerIp: string;
  statusId: number;
  statusReason: string;
  serverGroupName: string;
  population: number;
  maxPersonasPerUser: number;
  diagnosticServerHost: string;
  diagnosticServerPort: number;
  active: boolean;

  constructor(
    name: string,
    description: string,
    shardId: number,
    address: string,
    active: boolean
  ) {
    this.name = name;
    this.description = description;
    this.id = shardId;
    this.loginServerIp = address;
    this.loginServerPort = 8226;
    this.lobbyServerIp = address;
    this.lobbyServerPort = 7003;
    this.mcotsServerIp = address;
    this.statusId = 0;
    this.statusReason = "";
    this.serverGroupName = "Group-1";
    this.population = 1;
    this.maxPersonasPerUser = 1;
    this.diagnosticServerHost = address;
    this.diagnosticServerPort = 80;
    this.active = active;
  }

  asPlaintext() {
    return `[${this.name}]
    Description=${this.description}
    ShardId=${this.id}
    LoginServerIP=${this.loginServerIp}
    LoginServerPort=${this.loginServerPort}
    LobbyServerIP=${this.lobbyServerIp}
    LobbyServerPort=${this.lobbyServerPort}
    MCOTSServerIP=${this.mcotsServerIp}
    StatusId=${this.statusId}
    Status_Reason=${this.statusReason}
    ServerGroup_Name=${this.serverGroupName}
    Population=${this.population}
    MaxPersonasPerUser=${this.maxPersonasPerUser}
    DiagnosticServerHost=${this.diagnosticServerHost}
    DiagnosticServerPort=${this.diagnosticServerPort}`;
  }
}

const shards: Shard[] = [
  new Shard("MotorCity 1", "Server 1", 44, "mcouniverse.com", true),
  new Shard("MotorCity 2", "Server 2", 88, "mcouniverse.com", false),
];

function getActiveShards() {
  return shards.filter((shard) => shard.active);
}

export function getShardList() {
  return getActiveShards()
    .map((shard) => shard.asPlaintext())
    .join("");
}
