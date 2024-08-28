#!/bin/bash

bash -c 'echo "d myVPN" > /var/run/xl2tpd/l2tp-control'
ipsec down L2TP-PSK
