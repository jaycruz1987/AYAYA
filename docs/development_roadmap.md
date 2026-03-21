# Citylink MVP: Best Development Roadmap

基于当前已完成的基建（Database Schema, Prisma ORM Models, 核心 Repository & Service 防腐层），项目已经具备了非常扎实的地基。
为了确保第一阶段（食+酒店双核心）能够快速且高质量地落地，我为你制定了以下最优开发路径。

核心策略是：**“环境与规范左移 (Shift-Left) -> 录入后台先行 -> C端与运营后台并跑 -> 平滑上线”**。

---

## 阶段一：Foundation, DevOps & Backend Core (基建左移与后端核心)
**目标**：不仅要打通 API，还要在第一天就把环境规范、健康检查和错误处理立好规矩，避免后期“环境债”。

### 关键任务拆解
1. **DevOps & 环境规范 (Shift-Left)**
   - 确立 `.env.example` 规范，所有环境变量必须有默认示例。
   - 编写 `Dockerfile` 和 `docker-compose.yml`（包含 App + PostgreSQL）。
   - 编写基础启动脚本（`package.json` 中的 build/start/seed 脚本）。
   - 编写 seed 数据一致性检查脚本（确保本地与测试环境数据基线一致）。
2. **API 框架与防御性基建**
   - 引入 Web 框架（Express / NestJS / Fastify）。
   - **实现全局错误处理中间件 (Error Handling Middleware)**：统一拦截 Prisma 错误并转化为标准的 HTTP 状态码与业务错误码。
   - **实现 `/health` 健康检查接口**：检查 DB 连接状态。
3. **认证与授权 (Auth & IAM)**
   - 实现 `users` 表的 C 端 JWT 登录。
   - 实现 `admin_users` 表的 B 端登录与基础 Role 校验。
4. **核心业务 API 暴露**
   - Merchants & Products (商家与商品)。
   - Hotels & Room Types (酒店与房型)。
   - 基础设施接入：对象存储（AWS S3 / 阿里云 OSS）图片上传接口。

### 阶段交付物
- ✅ 标准化的 Docker 运行环境与启动脚本。
- ✅ 包含全局异常处理与健康检查的健壮 API 骨架。
- ✅ 基础 CRUD 与鉴权接口。

---

## 阶段二：Admin Panel - Data Entry (录入型后台先行)
**目标**：让运营团队第一时间能够进入系统录入**真实数据**。没有真实数据，C 端前端的 UI 还原和运营型后台的流转都无法真实测试。

### 关键任务拆解
1. **基础框架与组件**
   - 搭建 Admin SPA 脚手架（如 Ant Design Pro）。
   - 封装全局 HTTP Client、图片上传组件、富文本编辑器组件。
2. **商家与商品录入链路**
   - 商家分类与商家管理（强制包含完整的地址模型录入）。
   - 商品分类与商品管理。
3. **酒店与房型录入链路**
   - 酒店管理（处理 `facilities` JSONB 数组输入）。
   - 房型管理（处理多图上传）。
4. **内容管理**
   - 首页 Banner 与运营位管理。

### 阶段交付物
- ✅ **可用成果**：运营团队可以开始填写几百条真实的商家、菜品和酒店数据。
- ✅ 包含了真实图片、长文本描述的数据库，为下一阶段提供完美的数据源。

---

## 阶段三：Client MVP & Admin Operations (C端产品与运营后台双线并行)
**目标**：在真实数据的支撑下，开发面向终端用户的 Web/PWA 应用，并同步完善后台的“处理”能力。

### 阶段 3A: Client MVP (C端用户产品)
1. **C 端前端脚手架**
   - 采用 Next.js 或 React/Vue 构建响应式 H5/PWA。
2. **导流与浏览模块**
   - 首页大盘、统一地址管理（读取与管理 `user_addresses`）。
3. **Food (食) 业务线闭环**
   - 商家列表（LBS/分类筛选）与详情。
   - 购物车与订单确认页（结合地址快照 `delivery_address_snapshot` 校验）。
   - 订单列表与详情页。
4. **Stay (住) & 合作申请闭环**
   - 酒店列表与详情页。
   - 预订申请表单提交（打通 `service_requests`）。
   - 商家加盟表单提交（打通 `partner_applications`）。

### 阶段 3B: Admin Panel - Operations (运营型后台)
1. **订单履约大屏**
   - 订单全景看板，支持手动推进 `fulfillment_status`。
2. **CRM 闭环工作台 (重中之重)**
   - `service_requests` (服务请求) 处理面板：接单 (`PROCESSING`)、记录跟进、完结 (`CLOSED`)。
   - `partner_applications` (合作申请) 审核面板。

### 阶段交付物
- ✅ C 端 MVP 站点（可真实下单、提需求）。
- ✅ 后台拥有了完整的“接单->跟进->归档”的 CRM 能力。

---

## 阶段四：Testing, Deployment & Launch (系统联调与上线)
**目标**：由于环境和 Docker 已经在 Phase 1 搞定，此阶段专注于业务联调和生产环境切换。

### 关键任务拆解
1. **端到端集成测试 (E2E Testing)**
   - 重点测试金额计算（防篡改）。
   - 重点测试订单状态机流转是否符合契约（PENDING -> UNPAID -> PENDING）。
   - 重点测试软删除（删除商品后，历史订单里的快照依然可见）。
2. **生产环境部署与数据迁移**
   - 执行生产环境的 DB Migration (`npx prisma migrate deploy`)。
   - 部署后端 API 容器与前端静态资源（CDN）。
3. **监控与告警**
   - 接入 Sentry 或 LogRocket 捕获前端异常。

### 阶段交付物
- ✅ **正式发布 Citylink MVP**。
- ✅ 生产环境监控面板。