# NextStep — nội dung trao đổi với OISS và Tulane IT

Cập nhật: 14/10/2026. Trạng thái: mã nguồn cho pilot đã chuẩn bị; chưa có kết nối Tulane SSO hay triển khai Vercel thật.

## Gặp ai trước?

| Đầu mối | Cách liên hệ đã xác minh | Điều cần đề nghị |
|---|---|---|
| Kabir Hingorani Punjabi — Assistant Director, Data and Applications, OISS | khingora@tulane.edu | Xem demo; xác nhận nhu cầu, nội dung checklist; giúp tìm người bảo trợ và giới thiệu sang IT. Đây là đầu mối nghiệp vụ phù hợp, không có bằng chứng ông trực tiếp cấp SSO. |
| Tulane IT Service Desk | help@tulane.edu; (504) 988-8888; https://support.tulane.edu/ | Chuyển yêu cầu tới người phụ trách tích hợp SSO/Identity Management và Business Relationship Manager hỗ trợ OISS. |
| Nhóm Enterprise Systems / người phụ trách định danh do IT chỉ định | Qua Service Desk | Xác nhận IdP, giao thức, đăng ký ứng dụng, nhóm pilot, MFA và vòng đời tài khoản. Trang Enterprise Systems liệt kê Identity Management Solutions; chưa xác minh được tên kỹ sư phụ trách NextStep. |
| Người bảo trợ của đơn vị và Business Relationship Manager | Qua OISS/IT | Quyền sở hữu, nguồn lực kỹ thuật, kinh phí, phê duyệt dữ liệu và hỗ trợ sau pilot. |

Quy trình IT Project Proposal công khai của trường yêu cầu phê duyệt Department Head/Dean và xác định nguồn kinh phí, trừ trường hợp cần hỗ trợ xây dựng business case. Vì vậy, nên nhờ OISS cùng chuẩn bị đề xuất thay vì mặc định IT sẽ nhận phát triển miễn phí toàn bộ website.

## Cuộc gặp 30 phút nên đạt được gì?

1. Demo 3 phút: sinh viên mở NextStep, thấy việc tiếp theo, hoàn thành một việc, xem deadline. Nêu rõ bản đang trình diễn là demo.
2. Chốt người bảo trợ, người duyệt nội dung OISS và người chịu trách nhiệm kỹ thuật.
3. Hỏi IT có hỗ trợ ứng dụng do sinh viên khởi xướng không; có thể hỗ trợ tích hợp, review kiến trúc hay cả phát triển/vận hành? Có chương trình student developer hoặc đơn vị IT đối tác nào phù hợp không?
4. Hỏi IT hỗ trợ **OpenID Connect/OAuth qua Microsoft Entra** hay **SAML 2.0** cho ứng dụng này. Việc Tulane dùng Microsoft 365 không tự chứng minh NextStep được cấp Entra/OIDC.
5. Hỏi Vercel và Supabase có được phép dùng cho pilot không, ai sở hữu tài khoản, chọn region nào, kinh phí ở đâu và có nên dùng hạ tầng trường thay thế không.
6. Chốt 5–10 tài khoản thử nghiệm, điều kiện thành công, thời hạn pilot và người xử lý sự cố.

## Thông số cần IT cấp hoặc xác nhận

| Nội dung | Cần chốt |
|---|---|
| Giao thức | OIDC/Entra hoặc SAML; nhà cung cấp danh tính cụ thể |
| Nếu Entra | Tenant ID, Client ID, đăng ký single-tenant, nhóm được gán vào ứng dụng; secret được IT nhập/chia sẻ qua kênh bảo mật |
| Nếu SAML | IdP metadata, issuer, chứng thư ký, định danh người dùng ổn định; provider UUID sau cấu hình Supabase |
| Claims | Định danh bất biến, email và tên nếu được cho phép; cách xác định thành viên nhóm pilot. Không sử dụng email tự khai để cấp quyền |
| URL | Origin staging cố định; callback của Supabase và callback của NextStep — đây là hai điểm khác nhau |
| Bảo mật phiên | MFA, thời hạn phiên, thu hồi quyền, khách/guest accounts, đăng xuất NextStep và giới hạn single logout |
| Dữ liệu | Những trường được lưu, thời gian lưu/xóa/backup, quyền của quản trị viên và đầu mối hỗ trợ |
| Vận hành | Người duy trì, theo dõi lỗi, cập nhật thư viện và gia hạn secret/chứng thư |
| Tên miền | Có thể cấp subdomain thuộc tulane.edu không; đơn vị nào quản lý DNS/TLS? |

Các URL kỹ thuật và từng bước cấu hình nằm trong `DEPLOYMENT.md`. Không gửi password Tulane, Client Secret hoặc service-role key qua chat/email thường hay GitHub.

## Kiến trúc đã chuẩn bị

Next.js trên Vercel phục vụ giao diện và API. Supabase Auth xử lý kết nối với IdP được Tulane chấp thuận. PostgreSQL lưu tiến độ; RLS giới hạn mỗi sinh viên ở các dòng có user_id của mình và yêu cầu quyền pilot còn hiệu lực.

Người dùng bấm **Sign in with Tulane**, được chuyển đến trang đăng nhập của nhà cung cấp danh tính trường, rồi quay lại NextStep. NextStep không nhận mật khẩu trường. `/demo` vẫn độc lập, chỉ dùng dữ liệu mẫu và lưu trong trình duyệt.

| Bảng | Dữ liệu / quyền |
|---|---|
| `task_catalog` | Danh mục 32 việc; tài khoản pilot chỉ được đọc |
| `user_checklists` | Hồ sơ checklist, ngày và số phiên bản; chỉ chủ dữ liệu |
| `user_tasks` | Trạng thái, mục tiêu ngày của từng việc; chỉ chủ dữ liệu |
| `information_reports` | Báo nội dung lỗi thời; chỉ chủ dữ liệu, chưa tự gửi OISS |
| `private.pilot_members` | Quyền pilot, bật/tắt và hạn dùng; quản trị viên quản lý |

Không lưu hộ chiếu, I-20, SSN, SEVIS ID, hồ sơ y tế hoặc tài liệu tài chính. Quản trị viên hạ tầng vẫn có quyền vận hành database; không tuyên bố rằng không ai ngoài sinh viên có thể truy cập ở mọi cấp hệ thống. Hoàn thành task là tự đánh dấu, không xác nhận đã hoàn tất thủ tục với trường.

## Email đề xuất gửi Kabir (bản nháp, chưa gửi)

**Subject: NextStep pilot — OISS review and Tulane SSO guidance**

Dear Kabir,

I'm developing NextStep, a checklist website for first-year international students, and have discussed the idea with Justin and ISAB. I have a working demo and am preparing the backend so students can save their progress securely.

Could we meet for 30 minutes to review the demo and discuss whether OISS could support a small pilot? I would also appreciate an introduction to the Tulane IT contact responsible for SSO integration and guidance on approved hosting and student-data requirements.

The intended login would use Tulane's official sign-in page; NextStep would not collect university passwords.

Thank you,
Minh

## Nội dung ticket IT (bản nháp, chưa gửi)

**Subject: SSO integration consultation for NextStep student pilot**

Hello,

I'm a Tulane student developing NextStep, a checklist website for first-year international students. I would like to discuss a small pilot with OISS and connect university sign-in using an approved SAML or OpenID Connect integration.

Could you route this request to the team responsible for Identity Management/SSO and the Business Relationship Manager supporting OISS? I need guidance on departmental sponsorship, application registration, approved hosting/database services, and test-account access. The proposed stack is Next.js, Vercel and Supabase, subject to Tulane's approval.

A demo and technical handoff are available. Please also let me know whether to submit an IT Project Proposal with a departmental sponsor.

Thank you,
Minh

## Nguồn chính thức kiểm tra ngày 14/10/2026

- Kabir: https://oiss.tulane.edu/about/meet-our-team/kabir-hingorani-punjabi
- Service Desk: https://it.tulane.edu/
- Enterprise Systems: https://it.tulane.edu/enterprise-systems
- Đề xuất dự án: https://it.tulane.edu/it-project-proposal-requests
- Supabase Azure: https://supabase.com/docs/guides/auth/social-login/auth-azure
- Supabase SAML: https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml

SAML cho ứng dụng Supabase yêu cầu gói Pro trở lên theo tài liệu hiện tại. Chưa có khoản phí nào được chấp thuận hay kích hoạt trong lượt này.
