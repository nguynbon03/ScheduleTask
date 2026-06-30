# Schedule Task — Daily Planner

Trình quản lý lịch, nhiệm vụ và thói quen cá nhân. Xây dựng với **Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui**.

> 📖 **Tham khảo**: Thiết kế được tổng hợp từ 4 repo nguồn — [habit](https://github.com/zackha/habit), [will-be-done](https://github.com/will-be-done/will-be-done), [DeyWeaver](https://github.com/Deyweaver/DeyWeaver), [DooTask](https://github.com/kuaifan/dootask)

---

## ✨ Tính năng

| View | Mô tả |
|------|-------|
| **Hôm nay** | Timeline dọc 6h–23h với nhiệm vụ đã lên lịch + danh sách chưa lên lịch |
| **Tuần này** | Lưới 7 cột hiển thị nhiệm vụ theo ngày, có thể điều hướng tuần |
| **Thói quen** | Card grid với weekly tracker, streak counter, check-in hàng ngày |
| **Dự án** | Quản lý dự án với màu sắc, progress bar, task count |
| **Cài đặt** | Dark mode, accent color picker, xóa dữ liệu |

- 🌏 **Responsive**: Desktop (sidebar + week view), Tablet, Mobile (bottom nav + day view)
- 🌙 **Dark mode**: Tự động theo hệ thống hoặc toggle thủ công
- ⌨️ **Phím tắt**: `Cmd+K` thêm task, `Cmd+D` ngày, `Cmd+W` tuần, `Cmd+H` thói quen
- 📑 **localStorage**: Dữ liệu lưu local cho MVP (dễ dàng nâng cấp lên MongoDB)

---

## 🚀 Deploy lên Vercel

### Bước 1: Chuẩn bị MongoDB Atlas

1. Truy cập [mongodb.com/atlas](https://www.mongodb.com/atlas) → Tạo cluster miễn phí
2. Vào **Database Access** → Tạo user mới (ví dụ: `schedule-user`)
3. Vào **Network Access** → Add IP Address → `0.0.0.0/0` (cho phép tất cả) hoặc IP Vercel
4. Vào **Clusters** → Connect → Drivers → Node.js → Copy connection string

Connection string sẽ có dạng:
```
mongodb+srv://schedule-user:password@cluster0.xxxxx.mongodb.net/schedule-task?retryWrites=true&w=majority
```

### Bước 2: Deploy trên Vercel

**Cách 1: CLI**

```bash
# Cài Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy từ thư mục web/
cd web
vercel --prod
```

**Cách 2: GitHub + Vercel Dashboard**

1. Push code lên GitHub (thư mục `web/` ở root repo hoặc repo riêng)
2. Vào [vercel.com](https://vercel.com) → Add New Project → Import GitHub repo
3. Cấu hình:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web` (nếu repo có thư mục con)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Bước 3: Thêm Environment Variables

Vào **Project Settings > Environment Variables** hoặc khi deploy CLI sẽ hỏi:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://...` (connection string từ Atlas) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` (tạo secret) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |

Sau khi thêm env vars, **redeploy** để áp dụng.

---

## 🚀 Chạy local

```bash
cd web
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Nâng cấp lên MongoDB (backend API)

Hiện tại app dùng **localStorage** cho MVP. Để nâng cấp lên MongoDB:

1. Tạo API routes trong `app/api/`
2. Kết nối Mongoose với MongoDB Atlas
3. Thay `useAppStore` (localStorage) bằng fetch API

Ví dụ cấu trúc API:
```
app/api/
  auth/[...nextauth]/route.ts    # NextAuth
  tasks/route.ts                # GET / POST
  tasks/[id]/route.ts           # PATCH / DELETE
  habits/route.ts               # GET / POST
  habits/[id]/check/route.ts    # POST check-in
  projects/route.ts             # GET / POST
```

---

## 📁 Cấu trúc project

```
web/
├── app/                        # Next.js App Router
│   ├── globals.css             # Tailwind + custom CSS variables
│   ├── layout.tsx              # Root layout + ThemeProvider
│   └── page.tsx                # Main app shell
├── components/
│   ├── sidebar.tsx             # Desktop + mobile sidebar
│   ├── day-view.tsx            # Timeline 6h-23h
│   ├── week-view.tsx           # 7-column week grid
│   ├── habits-view.tsx         # Habit cards + streaks
│   ├── projects-view.tsx       # Project management
│   ├── settings-view.tsx       # Theme, colors, data
│   ├── task-modal.tsx          # Task CRUD modal
│   └── theme-provider.tsx      # next-themes wrapper
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── store.ts                # localStorage state management
│   ├── icons.tsx               # Lucide icon map
│   └── utils.ts                # cn() helper
├── components/ui/              # shadcn/ui components
├── public/                     # Static assets
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## 🎨 Design System

| Token | Light | Dark |
|-------|-------|------|
| Background | `#F5F5F7` | `#000000` |
| Surface | `#FFFFFF` | `#1C1C1E` |
| Text Primary | `#1D1D1F` | `#F5F5F7` |
| Text Secondary | `#86868B` | `#8E8E93` |
| Border | `#D2D2D7` | `#38383A` |
| Accent (default) | `#007AFF` | `#0A84FF` |

**Typography**: SF Pro Display / -apple-system / Segoe UI
**Border radius**: 12px cards, 8px buttons, 0.75rem default
**Animations**: Framer Motion (300ms spring cho check, 200ms ease cho view switch)

---

## 📝 Phím tắt

| Phím | Hành động |
|------|-----------|
| `Cmd/Ctrl + K` | Thêm nhiệm vụ nhanh |
| `Cmd/Ctrl + D` | Chuyển sang xem ngày |
| `Cmd/Ctrl + W` | Chuyển sang xem tuần |
| `Cmd/Ctrl + H` | Chuyển sang thói quen |
| `ESC` | Đóng modal / drawer |
| `?` | Hiện phím tắt |

---

## 📘 License

MIT — tự do sử dụng và chỉnh sửa.
