# Backlog MVP - Launcher Minecraft (Tauri)

## Fase 0 - Bootstrap

- [ ] Crear proyecto Tauri (React + TS).
- [ ] Definir contrato JSON de instancias.
- [ ] Pantalla base: Login / Instancias / Settings / Logs.

## Fase 1 - Login Microsoft + perfil Minecraft

- [ ] Integrar `minecraft-msa-auth`.
- [ ] Persistir tokens de forma segura (keyring/secure storage).
- [ ] Resolver UUID, username y ownership del juego.
- [ ] Logout + refresh token.

## Fase 2 - Instancias y restricciones

- [ ] Cargar manifiesto remoto firmado.
- [ ] Soporte de instancia pública/privada/whitelist.
- [ ] Validación de acceso por usuario UUID.
- [ ] Mostrar estado de acceso en UI.

## Fase 3 - Configuración local del launcher

- [ ] Selector RAM mínimo/máximo.
- [ ] Selector Java path.
- [ ] Java args personalizadas (con validaciones).
- [ ] Carpeta de juego por instancia.

## Fase 4 - Ejecución

- [ ] Resolver versión de Minecraft + loader (Forge/Fabric/NeoForge).
- [ ] Descargar/verificar dependencias.
- [ ] Lanzar proceso Java y streaming de logs.
- [ ] Códigos de error amigables en UI.

## Fase 5 - Hardening y producto

- [ ] Firma de manifiestos y paquetes.
- [ ] Ofuscación básica de componentes sensibles.
- [ ] Telemetría mínima (crash/startup) sin datos sensibles.
- [ ] Auto-update seguro del launcher.
