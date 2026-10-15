# Triển khai NextStep: từ bản demo đến pilot có tài khoản thật

Ngày cập nhật: 14/10/2026. Mục tiêu trước mắt: một pilot nhỏ được OISS/Tulane IT đồng ý.
Các lựa chọn Supabase/Vercel dưới đây là phương án kỹ thuật đề xuất, chưa phải dịch vụ được Tulane phê duyệt.

## 1. GitHub — giữ mã nguồn private

Tạo repository tên `nextstep-tulane`, chọn **Private**. Không cần công khai mã nguồn
để người khác truy cập bản demo. Nếu trường nhận bảo trợ, hỏi nên đặt repository
trong tổ chức GitHub của trường hay tài khoản cá nhân của bạn.

Đưa toàn bộ mã nguồn trong thư mục dự án lên repository, gồm `.github`,
`supabase`, `public`, `pnpm-lock.yaml` và `.env.example`. Không tải `node_modules`,
`.next`, `.env.local`, cookie, khóa bí mật, dữ liệu sinh viên hay thư mục `work`.
File `.gitignore` đã loại các mục này. Không tự chọn các repository công khai có tên gần giống để ghi đè. Tài khoản GitHub đã kết nối trong lượt kiểm tra là `baminh231208`; chưa có repository NextStep được xác định. Tạo một repository **private**, cấp kết nối GitHub quyền truy cập đúng repository đó, rồi cung cấp URL.

Nếu dùng GitHub Desktop: Add local repository → Create repository tại thư mục
đã giải nén → commit → Publish repository, bật **Keep this code private**.
Nếu dùng dòng lệnh, tạo repository trống trước rồi chạy trong thư mục dự án:

```sh
git init -b main
git add .
git commit -m "Prepare NextStep SSO pilot"
git remote add origin https://github.com/YOUR-ACCOUNT/nextstep-tulane.git
git push -u origin main
```

`YOUR-ACCOUNT` là chỗ điền, không phải một repository đã được tạo. GitHub Actions
trong `.github/workflows/ci.yml` sẽ kiểm tra mỗi lần push hoặc mở pull request.

## 2. Supabase — tạo database staging

1. Tạo một project staging riêng. Chọn region, chủ sở hữu và gói dịch vụ sau khi
   trao đổi với IT; không chọn gói có phí chỉ để thử demo.
   Kết nối hiện tại thấy organization tên **ISAB**, chưa có project. Cần xác nhận
   đây là organization bạn muốn sử dụng trước khi tạo và xem chi phí. Tên
   organization không thay thế sự phê duyệt chính thức của OISS/Tulane IT.
2. Mở SQL Editor, chạy lần lượt hai file trong `supabase/migrations`.
   Hai migration này dành cho database mới. Không chạy lại trên database đã có
   schema; dùng migration nâng cấp nếu đã áp dụng bản trước.
3. Kiểm tra bốn bảng public: `task_catalog`, `user_checklists`, `user_tasks`,
   `information_reports`; tất cả có RLS. Danh sách cấp quyền nằm ở
   `private.pilot_members`, không phải bảng công khai.
4. Lấy Project URL và **publishable key** từ mục API của project. Không lấy
   `service_role` hoặc secret key đưa vào website. Hai biến được dùng phía server.
5. Trong Authentication, tắt các phương thức đăng nhập không dùng và không mở
   đăng ký công khai bằng mật khẩu. Cấu hình IdP theo mục 4 bên dưới.
6. Trong URL Configuration, Site URL là địa chỉ staging ổn định. Chỉ cho phép
   callback chính xác `https://YOUR-STAGING-HOST/auth/callback`. Tránh wildcard
   cho tất cả các preview deployment khi dùng tài khoản trường.

## 3. Vercel — đưa ứng dụng lên Internet

1. Đăng nhập Vercel bằng GitHub. Add New → Project → Import repository private.
2. Framework: **Next.js**. Root directory: thư mục có `package.json`.
   File `vercel.json` đã cấu hình build/install; không dùng thiết lập Cloudflare.
3. Bản demo có thể deploy khi chưa có Supabase: trang chủ thông báo SSO chờ cấu hình,
   nút Try the demo mở `/demo`. Các API dữ liệu thật từ chối truy cập.
4. Để mở online pilot, nhập các biến sau vào Project Settings → Environment Variables:

| Biến | Giá trị |
|---|---|
| `NEXTSTEP_APP_ORIGIN` | `https://YOUR-STAGING-HOST` — chỉ scheme + host, không thêm đường dẫn |
| `SUPABASE_URL` | URL thực tế từ project staging |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key của project staging |
| `NEXTSTEP_SSO_MODE` | `saml` hoặc `azure`, theo Tulane IT xác nhận |
| `NEXTSTEP_SAML_PROVIDER_ID` | UUID SSO provider từ Supabase; chỉ cần với SAML |

5. Redeploy sau khi đổi cấu hình. Với demo công khai, kiểm tra Vercel Deployment
   Protection để người nhận không bị yêu cầu đăng nhập Vercel. Với staging có
   dữ liệu thật, thống nhất mức bảo vệ với IT.
6. Chưa dùng dữ liệu thật khi chỉ mới có trang deploy thành công. Chạy các kiểm tra
   thực tế trong `TEST-RESULTS.md` trước.

Kết nối Vercel hiện chưa hoàn tất. Kết nối tài khoản của bạn để triển khai;
không gửi access token hoặc mật khẩu trong chat.

Vercel cấp URL dạng `TEN-DU-AN.vercel.app` theo tên còn khả dụng. Nó không chứa
"chatgpt" và đủ để trình demo; chưa cần mua tên miền. Đây là dạng URL minh họa,
không phải link đã triển khai.

## 4. Tulane SSO — chọn nhánh sau khi IT trả lời

### Nếu IT chấp thuận Microsoft Entra / Azure OAuth

- IT đăng ký ứng dụng **single tenant trong tenant của Tulane**; không sử dụng
  tenant `common` cho pilot của trường. IT chỉ định nhóm test và yêu cầu MFA.
- Redirect URI tại Entra là:
  `https://PROJECT-REF.supabase.co/auth/v1/callback`.
- IT cung cấp Client ID, Tenant ID và trao đổi Client Secret qua kênh được phê duyệt.
  Nhập secret trực tiếp vào cấu hình Azure provider của Supabase; không gửi trong
  email thường, đưa vào GitHub hoặc frontend.
- Trong Supabase Azure provider đặt tenant URL được IT xác nhận. Theo tài liệu
  Supabase, cấu hình claim `email` và `xms_edov` để xử lý email được xác minh.
- Đặt `NEXTSTEP_SSO_MODE=azure` ở Vercel.

### Nếu IT chấp thuận SAML 2.0

- Supabase SAML dành cho project ứng dụng yêu cầu Pro trở lên theo tài liệu đã xem.
  Xác nhận chi phí và quyền sở hữu trước khi kích hoạt; không tự nâng gói.
- Trao đổi metadata với IT. Các URL mẫu cần thay PROJECT-REF bằng project thật:
  - Entity ID/metadata: `https://PROJECT-REF.supabase.co/auth/v1/sso/saml/metadata`
  - ACS: `https://PROJECT-REF.supabase.co/auth/v1/sso/saml/acs`
- IT gửi IdP metadata/certificate, cấu hình các thuộc tính được phép chia sẻ và
  nhóm được truy cập. Dùng provider UUID của chính kết nối đó.
- Đặt `NEXTSTEP_SSO_MODE=saml` và `NEXTSTEP_SAML_PROVIDER_ID` ở Vercel.
- Không quảng cáo global single logout: đăng xuất NextStep không bảo đảm đăng xuất
  toàn bộ ứng dụng trường; cần thống nhất thời hạn phiên với IT.

Nếu IT dùng giao thức/provider khác, dừng nhánh lựa chọn này để chỉnh adapter theo
thông số họ cấp; đừng suy đoán endpoint đăng nhập từ tên miền `tulane.edu`.

### Cấp quyền pilot

Lần đăng nhập SSO đầu tiên có thể tạo Auth user nhưng ứng dụng vẫn báo chưa có
quyền pilot. Quản trị viên kiểm tra identity do IdP xác thực, lấy UUID trong
Supabase Authentication → Users, rồi cấp quyền có thời hạn qua SQL Editor:

```sql
-- Thay cả UUID và ngày hết hạn bằng giá trị thực đã được duyệt.
insert into private.pilot_members(user_id, expires_at)
values ('VERIFIED-AUTH-USER-UUID', 'APPROVED-EXPIRY-TIMESTAMP'::timestamptz);
```

Không dùng UUID hoặc email do người lạ tự gửi làm căn cứ duy nhất. Không cấp quyền
bằng cách kiểm tra hậu tố email. Khi mở rộng toàn trường, IT cần thiết kế cấp/thu
hồi quyền từ nhóm hoặc lifecycle của trường; mã hiện tại sử dụng danh sách pilot
được duyệt để kiểm soát phạm vi.

Thu hồi ngay: đặt `enabled=false` cho đúng UUID. RLS sẽ chặn dữ liệu kể cả khi
trình duyệt vẫn giữ JWT chưa hết hạn. Database admin có thể xóa Auth user khi quy
trình trường cho phép; khóa ngoại xóa theo các bản ghi ứng dụng.

## 5. Tên miền

- Nếu chỉ demo: dùng URL `vercel.app` được cấp, không mất công mua tên miền trước.
- Nếu trường nhận dự án: đề nghị cấp subdomain phù hợp, ví dụ
  `nextstep.tulane.edu` **chỉ là tên đề xuất, chưa được cấp**.
- Nếu dùng tên miền cá nhân: thêm domain trong Vercel → Settings → Domains, rồi
  nhập đúng DNS mà Vercel hiển thị tại nhà cung cấp tên miền. Không dùng một IP/CNAME
  đoán trước. Đợi xác minh DNS/TLS, chọn canonical domain.
- Đổi `NEXTSTEP_APP_ORIGIN`, Supabase Site URL và callback allowlist về domain cuối;
  redeploy và kiểm tra login/logout lần nữa. Domain trường cần chính trường cấu hình.

## 6. Trước khi thử với sinh viên thật

Chốt chủ sở hữu dự án, thông tin liên hệ hỗ trợ, quyền xem của quản trị viên, thời
hạn lưu/xóa và backup; xác nhận nội dung OISS, khả năng tiếp cận và logo/ảnh. Bắt đầu
với 5–10 tài khoản được phép. Một người ngoài pilot phải bị từ chối dù có tài khoản
Tulane; hai người trong pilot phải không nhìn thấy dữ liệu của nhau. Ghi lỗi và
phản hồi trước khi tăng số người.

## Tài liệu chính thức đã đối chiếu

- GitHub: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
- Vercel/GitHub: https://vercel.com/docs/git/vercel-for-github
- Vercel domains: https://vercel.com/docs/domains/working-with-domains/add-a-domain
- Supabase SSR: https://supabase.com/docs/guides/auth/server-side/creating-a-client
- Supabase Azure: https://supabase.com/docs/guides/auth/social-login/auth-azure
- Supabase SAML: https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
