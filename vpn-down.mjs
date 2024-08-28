// -*- javascript -*-
// Config based on https://github.com/jabas06/l2tp-ipsec-vpn-client

import { fileURLToPath } from "url";
import path from "path";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

spawn("sudo", [`${__dirname}/vpn-down.sh`], { stdio: "inherit" });
