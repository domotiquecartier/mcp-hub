#!/usr/bin/env bash
set -e

echo "🚀 MCP Hub – Installation"

# Vérification Node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js n'est pas installé"
  exit 1
fi

echo "✅ Node.js détecté: $(node -v)"

# Installer dépendances
echo "📦 Installation des dépendances npm..."
npm install

# Créer .env si absent
if [ ! -f ".env" ]; then
  echo "🧩 Création du fichier .env"
  cp .env.example .env
  echo "⚠️ Pense à éditer .env"
fi

echo "✅ Installation terminée"
