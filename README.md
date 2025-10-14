# MediNet - Documentación Web

Documentación web completa para MediNet, la plataforma de aprendizaje federado diseñada específicamente para el sector sanitario.

## 🌐 Ver la Documentación Online

La documentación está diseñada para ser desplegada en GitHub Pages. Una vez configurado, estará disponible en:

```
https://[tu-usuario].github.io/[nombre-repositorio]/
```

## 📁 Estructura del Proyecto

```
mednet-docs/
├── index.html              # Main page - MediNet presentation
├── features.html            # Detailed platform features
├── installation.html        # Complete installation guide step by step
├── security.html            # Security measures and implementation status
├── user-guide.html          # Complete user guide step by step
├── use-cases.html           # Real medical use cases
├── assets/
│   ├── css/
│   │   └── style.css        # Custom styles with animations
│   └── js/
│       └── main.js          # Advanced JavaScript for interactivity
├── images/
│   ├── README.md            # Complete list of required images
│   └── [images.png]         # Screenshots and diagrams
├── _config.yml              # GitHub Pages configuration
├── .gitignore               # Files to ignore
└── README.md                # This file
```

## 🚀 Despliegue en GitHub Pages

### Opción 1: Automático (Recomendado)

1. Haz push de todos los archivos a tu repositorio de GitHub
2. Ve a Settings → Pages en tu repositorio
3. Selecciona "Deploy from a branch"
4. Selecciona la rama `main` y `/root`
5. Haz clic en "Save"

GitHub Pages automáticamente detectará los archivos HTML y desplegará el sitio.

### Opción 2: GitHub Actions

Si quieres más control, puedes usar GitHub Actions creando `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 📸 Configuración de Imágenes

La documentación requiere imágenes específicas para ser completamente funcional. Ver `images/README.md` para la lista completa de imágenes requeridas.

### Añadir Imágenes:

1. Navega a la carpeta `images/`
2. Lee el archivo `README.md` para ver la lista completa
3. Añade cada imagen con el nombre exacto especificado
4. Las imágenes aparecerán automáticamente en la documentación

**Formato recomendado**: PNG o JPG, mínimo 1200px de ancho, optimizadas para web (<500KB)

## 🎨 Características de la Documentación

### Diseño Responsivo
- Compatible con dispositivos móviles, tablets y desktop
- Navegación adaptativa con menú hamburguesa en móvil

### Tecnologías Utilizadas
- **HTML5** semántico y accesible
- **CSS3** con variables CSS y Grid/Flexbox
- **JavaScript** moderno (ES6+) para interactividad
- **Google Material Icons** para iconografía consistente
- **Google Fonts** (Inter) para tipografía profesional

### Compatibilidad
- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ GitHub Pages (sitios estáticos)
- ✅ Responsive design (móvil, tablet, desktop)
- ✅ Accesibilidad web básica

## 📖 Contenido de la Documentación

### 🏠 [index.html] - Página Principal
- Presentación de MediNet y su propósito
- Problemas que resuelve en el sector sanitario
- Solución de aprendizaje federado
- Tecnologías utilizadas
- Vista previa de características principales

### ⚡ [features.html] - Características
- Funcionalidades principales detalladas
- Características técnicas avanzadas
- Estado de implementación actual
- Roadmap de desarrollo futuro

### 🛠️ [installation.html] - Installation
- Complete step-by-step installation guide
- System requirements and configuration
- Django server installation
- Federated client configuration
- Troubleshooting and problem solving
- Production considerations

### 🔒 [security.html] - Security Measures
- Comprehensive security framework overview
- Implementation status table for all features
- Certifications and compliance roadmap (ISO 27001, ISO 13485, GDPR, HIPAA)
- Security architecture and technical details
- Progress tracking for security development

### 📚 [user-guide.html] - User Guide
- Complete step-by-step tutorial
- Explanation of each view and functionality
- Best practices and tips
- Common troubleshooting

### 🏥 [use-cases.html] - Casos de Uso
- 5 casos de uso médicos reales detallados:
  - Diagnóstico cardiovascular colaborativo
  - Detección precoz de diabetes tipo 2
  - Análisis de imágenes radiológicas
  - Predicción de readmisión hospitalaria
  - Medicina personalizada en oncología
- Beneficios transversales del aprendizaje federado

## 🛠️ Personalización

### Colores y Tema
Los colores principales se definen en variables CSS en `assets/css/style.css`:

```css
:root {
    --primary-color: #1976d2;      /* Azul principal */
    --secondary-color: #2e7d32;    /* Verde secundario */
    --success-color: #4caf50;      /* Verde éxito */
    --warning-color: #ff9800;      /* Naranja advertencia */
    --error-color: #f44336;        /* Rojo error */
}
```

### Contenido
- Todos los textos están en español y pueden ser editados directamente en los archivos HTML
- Las imágenes se referencian mediante rutas relativas desde `images/`
- Los estilos están modularizados y comentados para fácil modificación

### Funcionalidad JavaScript
El archivo `assets/js/main.js` incluye:
- Navegación móvil responsive
- Scroll suave para enlaces internos
- Animaciones de entrada
- Botón "volver arriba"
- Sistema de tooltips
- Funcionalidad de formularios

## 📱 Navegación

The documentation includes consistent navigation between pages:

- **Home**: General presentation of MediNet
- **Features**: Detailed technical functionalities
- **Installation**: Complete installation and configuration guide
- **Security**: Security measures and implementation status
- **User Guide**: Step-by-step tutorial
- **Use Cases**: Real medical applications
- **GitHub**: Link to code repository

## 🚨 Troubleshooting

### La página no se ve correctamente
1. Verifica que todas las imágenes estén en la carpeta `images/` con los nombres exactos
2. Asegúrate de que GitHub Pages esté habilitado en la configuración del repositorio
3. Comprueba que los archivos CSS y JS se carguen correctamente

### Las imágenes no aparecen
1. Revisa `images/README.md` para los nombres exactos requeridos
2. Verifica que las imágenes estén en formato PNG o JPG
3. Asegúrate de que no hay errores de mayúsculas/minúsculas en los nombres

### Problemas de despliegue
1. Verifica que el repositorio sea público o tengas GitHub Pro/Team
2. Comprueba la configuración en Settings → Pages
3. Revisa los Actions/Workflows si usas GitHub Actions

## 📄 Licencia

Esta documentación está diseñada para ser usada con el proyecto MediNet. Sigue las mismas licencias y términos que el proyecto principal.

## 🤝 Contribuciones

Para contribuir a la documentación:

1. Fork el repositorio
2. Crea una rama para tus cambios (`git checkout -b feature/mejora-docs`)
3. Realiza tus cambios
4. Haz commit (`git commit -am 'Mejora documentación X'`)
5. Push a la rama (`git push origin feature/mejora-docs`)
6. Crea un Pull Request

---