#!/bin/bash

apt-get --quiet --assume-yes update
apt-get --quiet --assume-yes install strongswan xl2tpd

mkdir -p /var/run/xl2tpd
mkdir -p /etc/xl2tpd
mkdir -p /etc/ppp

cp ipsec.conf /etc/ipsec.conf
cp ipsec.secrets /etc/ipsec.secrets
cp xl2tpd.conf /etc/xl2tpd/xl2tpd.conf
cp options.l2tpd.client /etc/ppp/options.l2tpd.client

touch /var/run/xl2tpd/l2tp-control
systemctl restart strongswan-starter xl2tpd ipsec
sleep 8
ipsec up L2TP-PSK
sleep 8
bash -c 'echo "c myVPN" > /var/run/xl2tpd/l2tp-control'
sleep 8
ifconfig

chmod +x route.sh && ./route.sh
