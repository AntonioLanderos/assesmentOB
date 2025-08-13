# 🩺 Plataforma de Bienestar — MVP

## 📌 Descripción General

Este proyecto implementa una **plataforma mínima de bienestar** con dos paneles diferenciados (Paciente y Doctor), control de acceso por suscripción (Free/Premium), manejo seguro de archivos clínicos. 

---

## 🏗️ Arquitectura

![Diagrama de despliegue](/images/diagramaDespliegue_assesment.drawio.png)

**Frontend:**  
- **Next.js 14** + **TypeScript** + **Tailwind CSS** (Vercel)
- UI reactiva: gating de módulos sin recarga y en ≤5s tras cambio de plan

**Backend:**  
- **Node.js + Express** (AWS EC2 t2.micro)
- **MySQL** (MariaDB en la misma instancia EC2)
- **Stripe API + Webhooks**
- **AWS S3** para almacenamiento de archivos con URLs firmadas

**Flujo General:**
1. Paciente se suscribe vía Stripe Checkout (modo prueba).
2. Webhook actualiza estado en BD (`subscriptions.status`).
3. UI se actualiza automáticamente según plan.
4. Archivos clínicos subidos a S3 solo son accesibles por paciente dueño y doctor asignado.
5. Auditoría registra cada acción (`audit_log`).
6. Módulo IA genera borrador de reporte clínico.

---

## 🗄️ Diseño de Datos (MySQL)

- **users** — credenciales y roles (`PATIENT`, `DOCTOR`, `ADMIN`)
- **subscriptions** — estado de plan y datos Stripe
- **patients**, **doctors** — relación 1:1 con `users`
- **doctor_patient** — asignación de pacientes a doctores
- **files** — metadatos de archivos en S3
- **file_access** — permisos extra por usuario
- **webhook_events** — historial y estado de webhooks
- **audit_log** — acciones registradas

![MER base de datos](/images/assesmentBD.png)

---

## 🎯 Historias de Usuario Implementadas

- **HU1 — Suscripción y desbloqueo Premium**
- **HU2 — Panel del paciente**
- **HU3 — Panel del doctor**
- **HU4 — Archivos clínicos seguros**
- **HU6 — Auditoría y manejo de errores** (Tabla de base de datos preparada)

---

## 📸 Evidencias
### Registrar Usuario
![alt](/images/reg_usuario.gif)
### Suscripción premium
![alt](/images/premium.gif)
### Subir archivo a s3
![alt](/images/subir_archivo.gif)
### Panel doctor
![alt](/images/doctor.gif)
### Asignar paciente desde admin
![alt](/images/asignar_paciente.gif)

---

## 🚀 Deploys

- **Frontend (Next.js / Vercel):** [https://assesment-ob.vercel.app/login](https://assesment-ob.vercel.app/login)  
- **Backend (Express / AWS EC2):** `https://assesment.duckdns.org/`

---

## 🔑 Credenciales de Prueba

**Paciente Free**  
- Email: `pt3@demo.com`  
- Password: `Demo123!`  

**Paciente Premium**  
- Email: `pt@demo.com`  
- Password: `Demo123!`  

**Doctor asignado**  
- Email: `dr@demo.com`  
- Password: `Demo123!`  

**Admin asignado**  
- Email: `admin@demo.com`  
- Password: `Demo123!` 

---

## ⚙️ Setup Local

```bash
# Clonar repositorios
git clone https://github.com/AntonioLanderos/assesmentOB.git

# Instalar dependencias
cd assesment-backend && npm install
cd ../assesment-frontend && npm install

# Variables de entorno
# Backend (.env)
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASS=******
DB_NAME=assesment
STRIPE_SECRET_KEY=sk_test_****
STRIPE_WEBHOOK_SECRET=whsec_****
S3_BUCKET=******
AWS_ACCESS_KEY_ID=******
AWS_SECRET_ACCESS_KEY=******
FRONTEND_ORIGIN=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

---

### Notas de desarrollador
- Se configuró un proxy utilizando duckdns para poder lograr la certificación https
- Algunas configuraciones del ec2 y s3 están inseguras, idealmente se toma más tiempo en la configuración pero en este caso se aceler'el proceso.
- Al hacer el llenado con datos dummy de la BD del server se insertaron directamente algunos PDF, por lo que no existen en el s3
- **El server de aws será eliminado en el momento que este proyect cumpla con su función, esto para evitar cargos monetarios**
