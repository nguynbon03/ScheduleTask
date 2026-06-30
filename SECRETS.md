# 🔐 Secrets & Configuration

> ⚠️ **File này CHỈ lưu local** — không push lên GitHub. Xem `.gitignore` để confirm.

---

## Environment Variables (Vercel + Local)

| Key | Giá trị thực | Mục đích | Vercel Status |
|-----|-------------|----------|---------------|
| `MONGODB_URI` | `mongodb+srv://nguyenptit2003ne_db_user:nguyen123@anhduc.nnetdn5.mongodb.net/schedule-task?retryWrites=true&w=majority&appName=AnhDuc` | Kết nối MongoDB Atlas | ✅ Đã thêm |
| `NEXTAUTH_SECRET` | `Oaj3nTmpuYhlXYimSkX7wn4hXc9Dwhb2YCGuGy8V1tE=` | Secret cho NextAuth (JWT) | ✅ Đã thêm |
| `NEXTAUTH_URL` | `https://schedule-task.vercel.app` | URL app production | ✅ Đã thêm |

---

## MongoDB Atlas Config

- **Cluster**: `AnhDuc`
- **Provider**: Google Cloud (asia-east1 / Taiwan)
- **Tier**: M0 Shared (Free)
- **Username**: `nguyenptit2003ne_db_user`
- **Password**: `nguyen123`
- **Database**: `schedule-task`
- **Network Access**: `0.0.0.0/0` (Allow from Anywhere — cho Vercel)

---

## Vercel Project

- **Project Name**: `schedule-task`
- **GitHub Repo**: `nguynbon03/ScheduleTask`
- **Branch**: `main`
- **Domains**:
  - `schedule-task-git-main-nguynbon03s-projects.vercel.app`
  - `schedule-task-i4v94vq7r-nguynbon03s-projects.vercel.app`
- **Framework**: Next.js 14.2.35

---

## Cách tạo lại secret mới

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Vercel CLI deploy với env vars
npx vercel --prod \
  --env MONGODB_URI="mongodb+srv://..." \
  --env NEXTAUTH_SECRET="$(openssl rand -base64 32)" \
  --env NEXTAUTH_URL="https://your-domain.vercel.app"
```

---

## Lưu ý bảo mật

- Không bao giờ push `.env` hoặc file này lên GitHub
- Nếu leak password MongoDB: đổi ngay trong Atlas → Database Access → Edit User
- NEXTAUTH_SECRET chỉ cần đổi nếu nghi session bị compromise
