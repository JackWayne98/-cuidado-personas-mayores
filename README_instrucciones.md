
# 🚀 Instrucciones para Clonar y Usar el Repositorio

Repositorio oficial del proyecto: **Aplicación de Gestión del Cuidado de Personas Mayores**

🔗 **URL del repositorio:**
```
https://github.com/JackWayne98/-cuidado-personas-mayores.git
```

---

## ✅ Requisitos Previos

Asegúrate de tener instalado:

- [Git](https://git-scm.com/downloads)
- [Node.js y npm](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli) → `npm install -g @angular/cli`

---

## 📥 Pasos para Clonar el Repositorio

1. Abre tu terminal (Git Bash, CMD, PowerShell o terminal de VS Code).
2. Navega a la carpeta donde quieres guardar el proyecto:

```bash
cd ruta/donde/quieras/guardar
```

3. Clona el repositorio:

```bash
git clone https://github.com/JackWayne98/-cuidado-personas-mayores.git
```

4. Entra al proyecto:

```bash
cd -cuidado-personas-mayores
```

---

## 🧪 Inicializar Backend

```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tu configuración de base de datos
npm run dev
```

---

## 🖼️ Inicializar Frontend

```bash
cd ../frontend
npm install
ng serve
```

---

## 🧩 Buenas Prácticas con Git

- Crear una nueva rama:
```bash
git checkout -b feature/nombre-tarea
```

- Hacer pull antes de trabajar:
```bash
git pull origin main
```

- Subir tus cambios:
```bash
git add .
git commit -m "feat: agrega nombre de la funcionalidad"
git push origin feature/nombre-tarea
```

---

## 📄 Estructura del Proyecto

```
cuidado-personas-mayores/
├── frontend/        → Angular
├── backend/         → Express.js
├── docs/            → Documentación técnica
└── README.md
```

---

## 📅 Entrega Final

🗓️ **Fecha límite:** 6 de julio, 2025 – 23:59

---

¡Cualquier duda, consulta con tu equipo o PM!
