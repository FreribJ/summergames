# Verwende einen offiziellen Node.js-Image als Basis
FROM node:18-alpine

# Lege das Arbeitsverzeichnis innerhalb des Containers fest
WORKDIR /usr/src/app

# Kopiere den Rest der Anwendung in das Arbeitsverzeichnis
COPY . .

# Der Standard-Port für die Anwendung
EXPOSE 1234

# Starte die Anwendung
CMD ["node", "main.js"]
