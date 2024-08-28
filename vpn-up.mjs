// -*- javascript -*-
// Config based on https://github.com/jabas06/l2tp-ipsec-vpn-client

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { writeFile } from "fs";
import { spawn } from "child_process";

const server = process.env.INPUT_SERVER || "<VPN_SERVER>";
const username = process.env.INPUT_USERNAME || "<VPN_USERNAME>";
const password = process.env.INPUT_PASSWORD || "<VPN_PASSWORD>";
const psk = process.env.INPUT_PSK || "<VPN_PSK>";
const route = process.env.INPUT_ROUTE || "<VPN_ROUTE>";

let ipsecConf = "ipsec.conf";
let ipsecSecrets = "ipsec.secrets";
let xl2tpdConf = "xl2tpd.conf";
let optionsL2tpdClient = "options.l2tpd.client";

async function vpn() {
  const ipsecConfContent = `
config setup

conn %default
    ikelifetime=60m
    keylife=20m
    rekeymargin=3m
    keyingtries=1
    keyexchange=ikev1
    authby=secret
    ike=3des-sha1-modp1024
    esp=3des-sha1

conn L2TP-PSK
    keyexchange=ikev1
    left=%defaultroute
    auto=add
    authby=secret
    type=transport
    leftprotoport=17/1701
    rightprotoport=17/1701
    right=${server}
`;

  await writeFile(ipsecConf, ipsecConfContent.trim(), (err) => {
    if (err) throw err;
  });

  const ipsecSecretsContent = `
${server} : PSK "${psk}"
`;

  await writeFile(ipsecSecrets, ipsecSecretsContent.trim(), (err) => {
    if (err) throw err;
  });

  const xl2tpdConfigContent = `
[lac myVPN]
lns = ${server}
ppp debug = yes
pppoptfile = /etc/ppp/options.l2tpd.client
length bit = yes
`;

  await writeFile(xl2tpdConf, xl2tpdConfigContent.trim(), (err) => {
    if (err) throw err;
  });

  const optionsL2tpdClientContent = `
ipcp-accept-local
ipcp-accept-remote
refuse-eap
require-mschap-v2
noccp
noauth
logfile /var/log/xl2tpd.log
idle 1800
mtu 1410
mru 1410
defaultroute
usepeerdns
debug
connect-delay 5000
name ${username}
password ${password}
`;

  await writeFile(
    optionsL2tpdClient,
    optionsL2tpdClientContent.trim(),
    (err) => {
      if (err) throw err;
    },
  );

  const routeScriptContent = `
ip route add ${route} via 10.255.255.0 dev ppp0
`;
  await writeFile("route.sh", routeScriptContent.trim(), (err) => {
    if (err) throw err;
  });
}

await vpn();

spawn("sudo", [`${__dirname}/vpn-up.sh`], { stdio: "inherit" });
