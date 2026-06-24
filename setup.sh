#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# VideoBot — Script de instalación completa
# Compatible con Ubuntu 20.04+ / Debian 11+
# ──────────────────────────────────────────────────────────────────────────────
set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

banner() { echo -e "\n${CYAN}${BOLD}▶ $1${NC}\n"; }
ok()     { echo -e "${GREEN}✅ $1${NC}"; }
warn()   { echo -e "${YELLOW}⚠️  $1${NC}"; }

banner "VideoBot — Instalación"

# ── 1. Node.js 20+ ───────────────────────────────────────────────────────────
banner "1/6 Verificando Node.js"
if ! command -v node &>/dev/null || [[ $(node -e "process.exit(parseInt(process.version.slice(1))<18?1:0)" ; echo $?) -eq 1 ]]; then
  warn "Node.js no encontrado o versión < 18. Instalando Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
ok "Node.js $(node --version)"

# ── 2. FFmpeg ─────────────────────────────────────────────────────────────────
banner "2/6 Verificando FFmpeg"
if ! command -v ffmpeg &>/dev/null; then
  warn "FFmpeg no encontrado. Instalando..."
  sudo apt-get update -qq && sudo apt-get install -y ffmpeg
fi
ok "FFmpeg $(ffmpeg -version 2>&1 | head -1 | cut -d' ' -f3)"

# ── 3. Dependencias del sistema para Playwright ───────────────────────────────
banner "3/6 Instalando dependencias del sistema"
sudo apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 \
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 \
  libpangocairo-1.0-0 libgtk-3-0 libdrm2 wget ca-certificates fonts-liberation \
  2>/dev/null || warn "Algunos paquetes no se instalaron (pueden no ser necesarios)"
ok "Dependencias del sistema listas"

# ── 4. npm install ────────────────────────────────────────────────────────────
banner "4/6 Instalando paquetes npm"
npm install
ok "npm install completado"

# ── 5. Playwright browser ─────────────────────────────────────────────────────
banner "5/6 Instalando Chromium para Playwright"
npx playwright install chromium --with-deps
ok "Chromium instalado"

# ── 6. Configuración ──────────────────────────────────────────────────────────
banner "6/6 Configuración inicial"
if [ ! -f .env ]; then
  cp .env.example .env
  ok ".env creado desde .env.example"
else
  ok ".env ya existe — no se sobreescribe"
fi

mkdir -p sessions uploads/processed data logs
ok "Directorios creados"

# ── PM2 (opcional) ───────────────────────────────────────────────────────────
echo ""
if ! command -v pm2 &>/dev/null; then
  read -r -p "¿Instalar PM2 para ejecución 24/7? [S/n] " resp
  if [[ "$resp" =~ ^[Ss]$ ]] || [[ -z "$resp" ]]; then
    sudo npm install -g pm2
    ok "PM2 instalado"
  fi
fi

# ── Resumen final ─────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}✅  Instalación completada${NC}"
echo -e "${BOLD}════════════════════════════════════════${NC}"
echo ""
echo "Próximos pasos:"
echo ""
echo -e "  ${CYAN}1. Guardar sesión de TikTok:${NC}"
echo "     node scripts/save-session.js tiktok"
echo ""
echo -e "  ${CYAN}2. Guardar sesión de Instagram:${NC}"
echo "     node scripts/save-session.js instagram"
echo ""
echo -e "  ${CYAN}3. Guardar sesión de YouTube:${NC}"
echo "     node scripts/save-session.js youtube"
echo ""
echo -e "  ${CYAN}4. Iniciar el servidor:${NC}"
echo "     npm start"
echo ""
echo -e "  ${CYAN}5. (Opcional) Iniciar con PM2 (24/7):${NC}"
echo "     pm2 start ecosystem.config.js"
echo "     pm2 save && pm2 startup"
echo ""
echo -e "  ${CYAN}Abre desde el móvil:${NC}  http://TU_IP:3001"
echo ""
