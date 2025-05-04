# COMPLETE SYSTEM SPECIFICATIONS

## 1. PHYSICAL INFRASTRUCTURE

### 1.1 Rack Equipment
| Component | Specifications | Details |
|-----------|----------------|---------|
| **Rack Enclosure** | Tripp Lite 12U Enclosed Rack | • Mobile design with casters<br>• Enclosed cabinet for protection<br>• 12U mounting capacity |
| **Patch Panels** | Dual 24-port CAT6 (front/back) | • Pass-through configuration<br>• Corresponding ports connected<br>• Facilitates clean cable management |

### 1.2 Power Management
| Component | Specifications | Details |
|-----------|----------------|---------|
| **UPS** | CyberPower CP1500PFCRM2U | • 1500VA/1000W Capacity<br>• PFC Sinewave Output<br>• 8 Outlets with Surge Protection<br>• Automatic Voltage Regulation (AVR)<br>• 2U Rackmount Form Factor<br>• Battery Backup for Critical Equipment |

### 1.3 Rack Layout

#### 1.3.1 Complete Rack Layout (Bottom to Top)
| U Position | Front | Back |
|------------|-------|------|
| **U12** | QNAP TS-464eU-8G-US NAS | QNAP NAS (rear connections) |
| **U11** | media01 (Intel i3-N305) | media01 (rear I/O) |
| **U10** | ai01 (Intel i3-14100F, RTX 4000) | ai01 (rear I/O) |
| **U9** | ai01 (continued) | ai01 (continued) |
| **U8** | CAT6 Patch Panel (24-port) | Patch panel (rear connections) |
| **U7** | Blank Panel | Aumox SG518P Network Switch |
| **U6** | Raspberry Pi Cluster (piserv01-05) | Empty |
| **U5** | Raspberry Pi Cluster (continued) | Empty |
| **U4** | Empty | Empty |
| **U3** | Proxmox Nodes on Rack Tray | Rack Tray with Cable Modem & Philips Hue Bridge |
| **U2** | CyberPower CP1500PFCRM2U UPS | Empty (Cable Management) |
| **U1** | CyberPower UPS (continued) | Empty (Cable Management) |

#### 1.3.2 Proxmox Nodes (U3 Rack Tray)
| Node | Hardware | Function |
|------|----------|----------|
| Node 1 | TRIGKEY S6 Pro Mini PC (AMD Ryzen 9 6900HX) | Proxmox Virtualization Cluster |
| Node 2 | Orange Pi 5 Plus (Rockchip RK3588) | Proxmox Virtualization Cluster |

#### 1.3.3 Raspberry Pi Cluster (U5-U6)
| Node | Status | Hardware |
|------|--------|----------|
| piserv01 | Active | Raspberry Pi 5 (8.4 GB RAM, 4 CPU, 128GB micro SD) |
| piserv02 | Offline | Raspberry Pi 5 (8.4 GB RAM, 4 CPU, 128GB micro SD) |
| piserv03 | Active | Raspberry Pi 5 (8.4 GB RAM, 4 CPU, 128GB micro SD) |
| piserv04 | Offline | Raspberry Pi 5 (8.4 GB RAM, 4 CPU, 128GB micro SD) |
| piserv05 | Active | Raspberry Pi 5 (8.3 GB RAM, 4 CPU, 128GB micro SD) |

## 2. NETWORK INFRASTRUCTURE

### 2.1 Core Networking
| Component | Model | Specifications |
|-----------|-------|----------------|
| **Switch** | Aumox SG518P | • 18-Port Ethernet Gigabit PoE Switch<br>• 16 PoE Ports + 2 Uplink Gigabit Ports<br>• 250W Built-in Power<br>• Metal Casing with 19-inch Rackmount<br>• Unmanaged with Traffic Optimization<br>• Powers Raspberry Pi devices via PoE hats |
| **Router** | TP-Link AX3000 | • WiFi 6 (802.11ax) Technology<br>• Dual Band Operation<br>• Uplink connection to main switch |

### 2.2 Internet & Home Automation
| Component | Purpose |
|-----------|---------|
| **Cable Modem** | Internet connectivity |
| **Philips Hue Bridge** | Smart lighting control |

## 3. COMPUTE INFRASTRUCTURE

### 3.1 Docker Container Environment

#### 3.1.1 Portainer Management
| Detail | Value |
|--------|-------|
| **Version** | 2.13.3 (Community Edition) |
| **Update Available** | 2.27.4 |
| **Management URL** | 192.168.0.220:9000 |

#### 3.1.2 Server Node: piserv01 (local)
| Attribute | Specification |
|-----------|---------------|
| **Hardware** | Raspberry Pi 5 |
| **Status** | Up |
| **Docker Version** | Standalone 26.1.4 |
| **Connection** | /var/run/docker.sock |
| **Resources** | 8.4 GB RAM, 4 CPU |
| **Storage** | 128GB micro SD |
| **Containers** | 4 running |
| **Active Containers** | • homebridge (homebridge/homebridge:ubuntu)<br>• kanboard-kanboard-1 (kanboard/kanboard:latest)<br>• portainer (portainer/portainer-ce:latest)<br>• service-dashboard-dashboard-1 (service-dashboard-dashboard) |
| **Stacks/Volumes/Images** | 3 stacks, 5 volumes, 6 images |

#### 3.1.3 Server Node: piserv03
| Attribute | Specification |
|-----------|---------------|
| **Hardware** | Raspberry Pi 5 |
| **Status** | Up |
| **Docker Version** | Standalone 26.1.4 |
| **Connection** | 192.168.0.222:9001 |
| **Resources** | 8.4 GB RAM, 4 CPU |
| **Storage** | 128GB micro SD |
| **Containers** | 6 running |
| **Active Containers** | • nginxproxy-app-1 (jc21/nginx-proxy-manager:latest)<br>• open-webui (ghcr.io/open-webui/open-webui:main)<br>• portainer_agent (portainer/agent:2.21.3)<br>• property-management-client-prod<br>• property-management-db-prod (postgres:16)<br>• property-management-server-prod (unhealthy) |
| **Stacks/Volumes/Images** | 2 stacks, 2 volumes, 6 images |

#### 3.1.4 Server Node: piserv05
| Attribute | Specification |
|-----------|---------------|
| **Hardware** | Raspberry Pi 5 |
| **Status** | Up |
| **Docker Version** | Standalone 28.1.1 |
| **Connection** | 192.168.0.235:9001 |
| **Resources** | 8.3 GB RAM, 4 CPU |
| **Storage** | 128GB micro SD |
| **Containers** | 2 running |
| **Active Containers** | • portainer_agent<br>• postgres |
| **Stacks/Volumes/Images** | 1 stack, 1 volume, 2 images |

#### 3.1.5 Server Node: media01
| Attribute | Specification |
|-----------|---------------|
| **Status** | Up (Connected) |
| **Docker Version** | Standalone 28.1.1 |
| **Connection** | 192.168.0.81:9001 |
| **Resources** | 33.4 GB RAM, 8 CPU |
| **Containers** | 3 running |
| **Active Containers** | • plex (lscr.io/linuxserver/plex:latest)<br>• portainer_agent (portainer/agent:2.21.3)<br>• transmission-openvpn (haugene/transmission-openvpn:latest) |
| **Stacks/Volumes/Images** | 2 stacks, 2 volumes, 15 images |

#### 3.1.6 Server Node: ai01
| Attribute | Specification |
|-----------|---------------|
| **Status** | Up |
| **Docker Version** | Standalone 27.5.1 |
| **Connection** | 192.168.0.84:9001 |
| **Resources** | 67.3 GB RAM, 8 CPU |
| **Containers** | 4 running |
| **Active Containers** | • jessedwyatt-web-1 (jessedwyatt-web)<br>• movie_finder-main-streamlit-app (movie_finder-main-streamlit-app)<br>• open-webui (ghcr.io/open-webui/open-webui:cuda)<br>• portainer_agent (portainer/agent:2.21.3) |
| **Stacks/Volumes/Images** | 2 stacks, 1 volume, 4 images |

#### 3.1.7 Offline Nodes
| Node | Status | Hardware | Resources | Storage |
|------|--------|----------|-----------|---------|
| **piserv02** | Offline | Raspberry Pi 5 | 8.4 GB RAM, 4 CPU | 128GB micro SD |
| **piserv04** | Offline | Raspberry Pi 5 | 8.4 GB RAM, 4 CPU | 128GB micro SD |

### 3.2 Proxmox Virtualization Cluster

#### 3.2.1 Node: TRIGKEY S6 Pro Mini PC
| Component | Specification |
|-----------|---------------|
| **Processor** | AMD Ryzen 9 6900HX (8 Cores / 16 Threads) |
| **Clock Speed** | Up to 4.9 GHz |
| **Memory** | 16GB DDR5 |
| **Storage** | 500GB SSD |
| **Graphics** | Integrated Radeon Graphics |
| **Display** | Triple Display Support (DisplayPort + HDMI + USB4) |
| **Networking** | 2.5G LAN, WiFi-6, Bluetooth 5.2 |
| **Function** | Part of 2-node Proxmox cluster |

#### 3.2.2 Node: Orange Pi 5 Plus
| Component | Specification |
|-----------|---------------|
| **Processor** | Rockchip RK3588 (8 Core 64-bit) |
| **Memory** | 32GB |
| **Storage** | 256GB eMMC |
| **Networking** | WiFi, Bluetooth |
| **Additional** | Case, R6 expansion board, Power supply |
| **OS Compatibility** | Orange Pi OS, Android, Debian, Ubuntu |
| **Function** | Part of 2-node Proxmox cluster |

### 3.3 Network Attached Storage

#### 3.3.1 QNAP TS-464eU-8G-US NAS
| Category | Specifications |
|----------|----------------|
| **Model** | QNAP TS-464eU-8G-US |
| **Form Factor** | 1U Rackmount |
| **BIOS** | American Megatrends International, Version Q093AR02 (12/06/2021) |
| **Memory** | 8 GB RAM |
| **Storage Configuration** | • System: 4 GB MMC<br>• Cache: 2× 2 TB NVMe SSDs<br>• Main Storage: 4× 18 TB HDDs (72 TB raw)<br>• Total Usable: 48.7 TB (28.4 TB used, 20.3 TB available) |
| **Data Protection** | Multiple snapshot configurations |
| **File System** | • Standard QNAP volume management with snapshot support<br>• Multiple logical volumes and device mappings<br>• Main storage at /share/CACHEDEV1_DATA |
| **Operating System** | QTS (QNAP Turbo System) |
| **Network ID** | gimpnas01 |
| **Primary Function** | Centralized storage for media and system backups |

## 4. DETAILED HARDWARE SPECIFICATIONS

### 4.1 media01 (Intel i3-N305)
| Component | Specification |
|-----------|---------------|
| **CPU** | Intel Core i3-N305<br>• Architecture: x86_64<br>• Cores: 8 cores (8 threads, no hyperthreading)<br>• Clock Speed: 800 MHz - 3.8 GHz<br>• Cache: L1: 256 KiB (data) + 512 KiB (instruction)<br>• L2: 4 MiB<br>• L3: 6 MiB |
| **Memory** | 32 GB SODIMM Synchronous 5600 MHz |
| **Storage** | • Primary: Crucial CT500P310SSD8 (500 GB NVMe)<br>• Secondary: Samsung SSD 990 EVO Plus 2TB (1.8 TB NVMe)<br>• External Media: BD-MLT UJ260 (optical drive)<br>• Network Storage: 49 TB NAS mount at /mnt/media |
| **Network** | 3 Ethernet controllers:<br>• 2x Intel I226-V<br>• 1x Aquantia AQC113C NBase-T/IEEE 802.3an Ethernet |
| **Graphics** | Intel UHD Graphics (Alder Lake-N) |
| **Operating System** | Ubuntu Linux with LVM |

### 4.2 ai01 (Intel i3-14100F)
| Component | Specification |
|-----------|---------------|
| **CPU** | Intel Core i3-14100F<br>• Architecture: x86_64<br>• Cores: 4 cores, 8 threads (2 threads per core)<br>• Clock Speed: 800 MHz - 4.7 GHz<br>• Cache: L1: 192 KiB (data) + 128 KiB (instruction)<br>• L2: 5 MiB<br>• L3: 12 MiB |
| **Memory** | 64 GB (4x 16GB DIMM DDR4 Synchronous 2133 MHz) |
| **Motherboard** | MSI PRO B760M-P DDR4 (MS-7E02) |
| **Storage** | • Primary: Samsung SSD 990 PRO 4TB (3.6 TB NVMe)<br>• Secondary: Samsung SSD 870 (1.8 TB SATA) |
| **Graphics** | NVIDIA RTX 4000 Ada Generation<br>• VRAM: 20 GB<br>• Driver: 570.86.15<br>• CUDA Version: 12.8 |
| **Network** | Realtek RTL8111/8168/8211/8411 PCI Express Gigabit Ethernet |
| **Operating System** | Ubuntu Linux with LVM |

### 4.3 gimpnas01 (QNAP NAS)
| Component | Specification |
|-----------|---------------|
| **Model** | QNAP TS-464eU-8G-US |
| **BIOS** | American Megatrends International, Version Q093AR02 (12/06/2021) |
| **Storage** | • System Storage: 4 GB MMC<br>• Cache Drives: 2x 2 TB NVMe SSDs<br>• Main Storage: 4x 18 TB HDDs<br>• Total Usable Storage: 48.7 TB (28.4 TB used, 20.3 TB available)<br>• Multiple snapshots configured |
| **Network** | Multiple network interfaces (detailed information unavailable) |
| **File Systems** | • Custom volume management with snapshots<br>• Multiple logical volumes and device mappings<br>• Main storage mounted at /share/CACHEDEV1_DATA |
| **Operating System** | Custom Linux-based NAS OS |

## 5. NETWORK TOPOLOGY

```
Internet ──┐
           │
           ▼
      Cable Modem
           │
           ▼
    TP-Link AX3000 Router ───┐
           │                 │
           ▼                 ▼
   Aumox SG518P Switch    Philips Hue Bridge
           │
           ├─────────────┬─────────────┬─────────────┬─────────────┐
           │             │             │             │             │
           ▼             ▼             ▼             ▼             ▼
      piserv01       piserv03      piserv05       media01        ai01
    (Raspberry Pi)  (Raspberry Pi) (Raspberry Pi) (Intel i3-N305) (Intel i3-14100F)
                                                       │             │
                                                       │             │
                                                       ▼             ▼
                                                  gimpnas01     RTX 4000 GPU
                                                   (QNAP)
```

## 6. SYSTEM POWER CONSUMPTION

| Component | Configuration | Estimated Idle Watts |
|-----------|---------------|---------------------|
| **QNAP TS-464eU-8G-US** | 4× 18TB HDDs, 2× 2TB NVMe SSDs, 8GB RAM | 40-55W |
| **media01** | Intel i3-N305, 32GB RAM, 2 SSDs | 25-35W |
| **ai01** | Intel i3-14100F, RTX 4000 Ada GPU, 64GB RAM | 45-70W |
| **Raspberry Pi Cluster** | 5× Raspberry Pi 5 (3 active, 2 offline) | 20-25W |
| **Aumox SG518P Switch** | 18-port PoE switch | 15-25W |
| **Proxmox Nodes** | TRIGKEY S6 Pro + Orange Pi 5 Plus | 25-40W |
| **Networking Equipment** | Cable modem, router, Hue Bridge | 10-15W |
| **UPS Overhead** | CyberPower CP1500PFCRM2U | 10-20W |
| **TOTAL SYSTEM IDLE** | **All components** | **190-285W** |

## 7. TOTAL SYSTEM RESOURCES

### 7.1 Combined Storage
| Storage Type | Capacity | Notes |
|--------------|----------|-------|
| **Primary NAS Storage** | 48.7 TB usable (72 TB raw) | QNAP TS-464eU with 4× 18TB HDDs |
| **NAS Cache** | 4 TB | 2× 2TB NVMe SSDs in QNAP |
| **SSD Storage** | 8.46 TB | Combined across all systems |
| **Boot/OS Storage** | 1.4 TB | Combined microSD, eMMC, and system SSDs |
| **TOTAL STORAGE** | **62.56 TB** | All storage combined |

### 7.2 Compute Resources
| Resource | Quantity | Notes |
|----------|----------|-------|
| **CPU Cores** | 48 cores | - 5× Raspberry Pi 5 (20 cores)<br>- TRIGKEY S6 Pro (8 cores)<br>- Orange Pi 5 Plus (8 cores)<br>- media01 Intel i3-N305 (8 cores)<br>- ai01 Intel i3-14100F (4 cores) |
| **CPU Threads** | 60 threads | Additional threads from i3-14100F and Ryzen 9 6900HX |
| **Total RAM** | 194 GB | - QNAP NAS: 8GB<br>- media01: 32GB<br>- ai01: 64GB<br>- Raspberry Pi cluster: 42GB<br>- Proxmox nodes: 48GB |
| **GPU** | 1 × RTX 4000 Ada | 20GB VRAM, CUDA 12.8 capability |

### 7.3 Network Capacity
| Connection Point | Speed | Notes |
|------------------|-------|-------|
| **External Internet** | 1 Gbps | Cable modem connection |
| **Internal Network** | 1 Gbps | Standard connections |
| **High-Performance Links** | 2.5 Gbps | Specialized connections (media01) |
| **PoE Delivery** | 250W | For powering Raspberry Pi cluster |