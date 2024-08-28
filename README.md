# Setup VPN connection in a GitHUb Actions workflow

This action sets up a VPN connection in a GitHub Actions workflow.

>[!NOTE]
>
> - This action is only supported on Linux runners.
> - This is designed to work with our Unifi VPN. Other VPNs may not work.

Example setup:

```yaml
      - uses: reload/vpn-action@main
        with:
          server: ${{ vars.RELOAD_HQ_IP }}
          psk: ${{ secrets.RELOAD_VPN_PSK }}
          username: ${{ vars.RELOAD_VPN_USERNAME }}
          password: ${{ secrets.RELOAD_VPN_PASSWORD }}
          route: 94.23.123.122  # platform.sh FR-3 pr sites
```
