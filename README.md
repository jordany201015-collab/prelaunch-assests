# Prelaunch Assets - Minecraft Launcher (Tauri)

Este repositorio inicia la base de un launcher de Minecraft con **Tauri**.

## Objetivo del MVP (fase 1)

1. Login de Microsoft/Xbox para Minecraft usando `minecraft-msa-auth` (Kernel).
2. Lista de instancias (públicas, privadas, con whitelist).
3. Configuración por instancia (RAM mínima/máxima, versión, Java args).
4. Botón **Jugar** con validaciones mínimas.
5. Base para futuras opciones tipo Feather/Lunar (settings, logs, cuentas, etc.).

## Arquitectura inicial recomendada

- **Frontend (Tauri Web UI):** React + TypeScript.
- **Backend (Rust en Tauri):**
  - Gestión de perfiles.
  - Lanzamiento del proceso de Java.
  - Integración con auth MSA.
  - Validación de configuración local.
- **Assets remotos (opcional):**
  - Manifiesto de instancias firmado.
  - URLs de mods/resource packs.

## Estructura creada en este repo

- `docs/mvp-backlog.md`: backlog por fases.
- `docs/seguridad-contenido.md`: límites reales para "esconder" mods/config/resourcepacks.
- `launcher/instance.schema.json`: esquema JSON para definir instancias.
- `launcher/profiles/default.json`: ejemplo de instancia local.

## Próximos pasos técnicos

1. Crear app con `npm create tauri-app@latest`.
2. Copiar el esquema `launcher/instance.schema.json` al módulo de configuración.
3. Implementar comandos de Tauri:
   - `login_microsoft()`
   - `fetch_instances()`
   - `save_instance_settings()`
   - `launch_instance()`
4. Añadir firma/verificación del manifiesto remoto.
5. Añadir auto-update del launcher.

## Nota importante sobre “ocultar” mods

No existe ocultación 100% segura en cliente si los archivos deben ejecutarse localmente.
La estrategia realista es:
- ofuscación,
- validación remota,
- firma de artefactos,
- controles en servidor,
- y asumir que un cliente avanzado puede inspeccionar archivos.

Revisa `docs/seguridad-contenido.md` para detalles.
