// scripts/detect-sim.mjs
// Detects and manages iOS simulators for React Native builds
// Usage: node scripts/detect-sim.mjs [--print-udid] [--boot]

import { execSync } from "node:child_process";
import { argv, env, exit } from "node:process";

const PREFERRED_DEVICES = [
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16 Plus",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15 Plus",
  "iPhone 15",
];

const BOOT_TIMEOUT_MS = 30000; // 30 seconds
const POLL_INTERVAL_MS = 1000; // 1 second

function getSimulators() {
  try {
    const output = execSync("xcrun simctl list devices --json", { encoding: "utf8" });
    return JSON.parse(output);
  } catch (error) {
    console.error("Failed to list simulators:", error.message);
    exit(1);
  }
}

function findBestSimulator(simData) {
  // Check for env overrides first
  if (env.IOS_SIM_UDID) {
    console.error(`Using simulator from IOS_SIM_UDID: ${env.IOS_SIM_UDID}`);
    return { udid: env.IOS_SIM_UDID, name: "User-specified", needsBoot: false };
  }

  const allDevices = [];

  // Flatten all devices with runtime info
  for (const [runtime, devices] of Object.entries(simData.devices)) {
    if (!runtime.includes("iOS")) continue;

    const versionMatch = runtime.match(/iOS-(\d+)-(\d+)/);
    const majorVersion = versionMatch ? parseInt(versionMatch[1]) : 0;
    const minorVersion = versionMatch ? parseInt(versionMatch[2]) : 0;

    for (const device of devices) {
      if (device.isAvailable && device.deviceTypeIdentifier?.includes("iPhone")) {
        allDevices.push({
          ...device,
          runtime,
          majorVersion,
          minorVersion,
          isBooted: device.state === "Booted",
        });
      }
    }
  }

  if (allDevices.length === 0) {
    console.error("No available iPhone simulators found");
    exit(1);
  }

  // If IOS_SIM_NAME is set, prefer that
  if (env.IOS_SIM_NAME) {
    const named = allDevices.find(d => d.name === env.IOS_SIM_NAME);
    if (named) {
      console.error(`Using simulator from IOS_SIM_NAME: ${named.name}`);
      return { udid: named.udid, name: named.name, needsBoot: !named.isBooted };
    }
  }

  // Look for preferred devices
  for (const preferredName of PREFERRED_DEVICES) {
    const device = allDevices.find(d => d.name === preferredName);
    if (device) {
      console.error(`Found preferred device: ${device.name} (${device.runtime})`);
      return { udid: device.udid, name: device.name, needsBoot: !device.isBooted };
    }
  }

  // Fallback: pick the newest iOS version, prefer already booted
  allDevices.sort((a, b) => {
    // Sort by iOS version (descending)
    if (a.majorVersion !== b.majorVersion) return b.majorVersion - a.majorVersion;
    if (a.minorVersion !== b.minorVersion) return b.minorVersion - a.minorVersion;
    // Prefer already booted devices
    if (a.isBooted !== b.isBooted) return a.isBooted ? -1 : 1;
    return 0;
  });

  const best = allDevices[0];
  console.error(`Using fallback device: ${best.name} (${best.runtime})`);
  return { udid: best.udid, name: best.name, needsBoot: !best.isBooted };
}

function bootSimulator(udid, name) {
  console.error(`Booting simulator ${name}...`);
  try {
    execSync(`xcrun simctl boot ${udid}`, { stdio: "ignore" });
  } catch (error) {
    // It might already be booting or booted
    if (!error.message.includes("Unable to boot device in current state")) {
      console.error("Warning: boot command failed:", error.message);
    }
  }

  // Wait for boot
  const startTime = Date.now();
  while (Date.now() - startTime < BOOT_TIMEOUT_MS) {
    const simData = getSimulators();
    for (const devices of Object.values(simData.devices)) {
      const device = devices.find(d => d.udid === udid);
      if (device && device.state === "Booted") {
        console.error(`✅ Simulator ${name} is booted`);
        return;
      }
    }
    // Brief sleep before polling again
    execSync(`sleep ${POLL_INTERVAL_MS / 1000}`);
  }

  console.error(`Warning: Simulator may not be fully booted after ${BOOT_TIMEOUT_MS}ms`);
}

export function detectAndBootSimulator() {
  const simData = getSimulators();
  const best = findBestSimulator(simData);

  if (best.needsBoot) {
    bootSimulator(best.udid, best.name);
  }

  return best;
}

// CLI mode
if (import.meta.url === `file://${process.argv[1]}`) {
  const shouldBoot = argv.includes("--boot");
  const printUdidOnly = argv.includes("--print-udid");

  const sim = shouldBoot ? detectAndBootSimulator() : findBestSimulator(getSimulators());

  if (printUdidOnly) {
    console.log(sim.udid); // stdout for command substitution
  } else {
    console.error(`Selected: ${sim.name} (${sim.udid})`);
  }
}