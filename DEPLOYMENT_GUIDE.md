# 🚀 Guía de Despliegue - TAMV MD-X4™

## 📋 Pre-requisitos

- Node.js 18+
- npm o bun
- Cuenta Lovable (proyecto ya configurado)
- Acceso a Supabase via Lovable Cloud

---

## 🔧 Configuración Inicial

### 1. Variables de Entorno

El archivo `.env` ya está configurado automáticamente por Lovable Cloud:

```env
VITE_SUPABASE_PROJECT_ID="myuudyojzguahuerqwmc"
VITE_SUPABASE_PUBLISHABLE_KEY="[key ya configurada]"
VITE_SUPABASE_URL="https://myuudyojzguahuerqwmc.supabase.co"
```

### 2. Secretos Configurados

En Lovable Cloud → Secrets:
- ✅ SUPABASE_URL
- ✅ SUPABASE_PUBLISHABLE_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ SUPABASE_DB_URL
- ✅ STRIPE_APIKEY (para marketplace)

---

## 📦 Instalación

```bash
# Clonar o acceder al proyecto en Lovable
# Las dependencias se instalan automáticamente

# Si necesitas instalar localmente:
npm install
```

---

## 🏃 Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# El proyecto estará disponible en:
# http://localhost:8080
```

---

## 🧪 Testing

```bash
# Lint
npm run lint

# Tests (cuando estén implementados)
npm run test

# Build de prueba
npm run build
```

---

## 🌐 Despliegue a Producción

### Opción 1: Lovable Deploy (Recomendado)

1. **Desde la interfaz de Lovable:**
   - Click en botón "Publish" (esquina superior derecha)
   - Lovable despliega automáticamente
   - URL generada: `[tu-proyecto].lovable.app`

2. **Configurar dominio personalizado (opcional):**
   - Lovable Dashboard → Settings → Domains
   - Agregar tu dominio
   - Configurar DNS según instrucciones
   - Requiere plan de pago

### Opción 2: Exportar y Desplegar Externamente

```bash
# Build optimizado
npm run build

# La carpeta dist/ contiene archivos estáticos
# Puedes desplegar en:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - Google Cloud Storage
# - Cualquier hosting estático
```

---

## 🗄️ Base de Datos

### Migraciones Aplicadas

Todas las migraciones están en `supabase/migrations/`:
- Tablas principales (profiles, posts, comments, etc.)
- RLS policies
- Storage buckets
- Triggers y funciones

### Aplicar Migraciones (si es necesario)

Las migraciones se aplican automáticamente en Lovable Cloud.

Si necesitas aplicarlas manualmente:
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link al proyecto
supabase link --project-ref myuudyojzguahuerqwmc

# Aplicar migraciones
supabase db push
```

---

## 🔐 Seguridad Pre-Deploy Checklist

### Auth Configuration
- ✅ Email auto-confirm habilitado (para testing)
- ⚠️ **IMPORTANTE:** Deshabilitar auto-confirm en producción
- ✅ Site URL configurada
- ✅ Redirect URLs configuradas

### RLS Policies
- ✅ Todas las tablas tienen RLS habilitado
- ✅ Policies de lectura pública donde corresponde
- ✅ Policies de escritura solo para usuarios autenticados
- ✅ Policies de admin para tablas sensibles

### Storage
- ✅ Buckets públicos solo para contenido público
- ✅ Políticas de upload configuradas
- ✅ Límites de tamaño implementados

### API
- ✅ Rate limiting configurado
- ✅ CORS configurado correctamente
- ✅ Headers de seguridad
- ✅ Input validation

---

## 📊 Monitoreo Post-Deploy

### Métricas a Vigilar

1. **Performance**
   - Tiempo de carga inicial < 3s
   - Time to Interactive < 5s
   - Lighthouse score > 90

2. **Errores**
   - Error rate < 0.1%
   - Revisar Supabase logs
   - Revisar console de navegador

3. **Uso**
   - DAU/MAU
   - API calls
   - Storage usage
   - Database connections

### Herramientas

- Lovable Cloud Dashboard
- Supabase Dashboard (via Lovable Cloud)
- Browser DevTools
- Google Analytics (si implementado)

---

## 🔄 Actualizaciones

### Despliegue de Cambios

1. **En Lovable:**
   - Los cambios se despliegan automáticamente
   - Preview disponible antes de publicar
   - Rollback disponible en Settings

2. **Workflow recomendado:**
   ```
   Desarrollo → Preview → Test → Publish
   ```

### Versionado

Usa tags semánticos:
- `v1.0.0` - Major release
- `v1.1.0` - Minor features
- `v1.1.1` - Patches

---

## 🆘 Troubleshooting

### Problema: Auth no funciona

```bash
# Verificar configuración
1. Lovable Cloud → Users & Auth
2. Verificar Site URL
3. Verificar Redirect URLs
4. Revisar auto-confirm setting
```

### Problema: RLS bloquea operaciones

```bash
# Verificar policies
1. Lovable Cloud → Database → Tables
2. Revisar RLS policies de la tabla
3. Verificar que auth.uid() esté disponible
4. Comprobar que usuario esté logueado
```

### Problema: Storage upload falla

```bash
# Verificar bucket policies
1. Lovable Cloud → Storage
2. Revisar políticas del bucket
3. Verificar formato y tamaño de archivo
4. Comprobar autenticación
```

### Problema: Build falla

```bash
# Limpiar y rebuildar
npm run clean
npm install
npm run build

# Verificar errores TypeScript
npm run type-check
```

---

## 🎯 Checklist Final Pre-Launch

### Funcionalidad
- [ ] Auth (login/signup) funciona
- [ ] Posts se pueden crear/editar/eliminar
- [ ] Comentarios funcionan
- [ ] Resonances (likes) funcionan
- [ ] Upload de imágenes funciona
- [ ] Perfil se puede editar
- [ ] Navegación fluida
- [ ] ISABELLA AI responde

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 5s
- [ ] No errores en consola
- [ ] Imágenes optimizadas

### Seguridad
- [ ] HTTPS activo
- [ ] RLS policies activas
- [ ] Sanitización de inputs
- [ ] Rate limiting activo
- [ ] Headers de seguridad
- [ ] Secrets protegidos

### UX/UI
- [ ] Responsive en móvil/tablet/desktop
- [ ] Dark mode funciona
- [ ] Animaciones suaves
- [ ] Carga sin parpadeos
- [ ] Accesibilidad (a11y) básica

### Legal
- [ ] Términos y condiciones
- [ ] Política de privacidad
- [ ] GDPR compliance
- [ ] Cookies notice
- [ ] Contact info

---

## 📞 Soporte

**Lovable Support:**
- Discord: [Lovable Community]
- Docs: https://docs.lovable.dev/

**TAMV Support:**
- Email: Ttamvonlinenetwork@outlook.es
- GitHub Issues: [repo-url]

---

## 🎉 Post-Launch

### Día 1
- [ ] Monitorear métricas cada hora
- [ ] Responder feedback usuarios
- [ ] Hot-fix bugs críticos

### Semana 1
- [ ] Análisis de uso
- [ ] Identificar pain points
- [ ] Priorizar mejoras

### Mes 1
- [ ] Review de métricas
- [ ] Planificación v1.1
- [ ] Contenido y marketing

---

*¡Feliz despliegue! 🚀*
