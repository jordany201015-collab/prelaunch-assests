# Seguridad de mods/config/resourcepacks en launchers

## Realidad técnica

Si un archivo debe existir y ejecutarse en el cliente, eventualmente puede ser extraído.
No hay mecanismo perfecto para hacer "mods privados imposibles de copiar" en el lado cliente.

## Estrategia recomendada (defensa en capas)

1. **Firmas y hashes**
   - Firmar manifiestos y artefactos.
   - Verificar hash antes de arrancar.

2. **Control de acceso remoto**
   - Entregar assets sólo a usuarios autorizados.
   - URLs con expiración (signed URLs).

3. **Validación en servidor**
   - El servidor valida versión/modpack/hash esperados.
   - Rechaza clientes alterados.

4. **Ofuscación**
   - Útil para elevar costo de ingeniería inversa.
   - No debe considerarse seguridad fuerte.

5. **Contenido sensible fuera del cliente**
   - Mover lógica crítica al backend cuando sea posible.

## Qué sí puedes prometer a nivel producto

- "Dificultar copia no autorizada" ✅
- "Controlar acceso por cuenta/whitelist" ✅
- "Bloquear 100% extracción de archivos locales" ❌
