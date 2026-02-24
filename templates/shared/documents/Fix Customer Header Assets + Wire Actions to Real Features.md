## **Vấn Đề Hiện Tại (đối chiếu Figma 399_25193)**
- Icon “3 lines” trong Figma là `ml7hi4xn-n6v30em.svg`, nhưng code đang dùng `AppAssets.iconsCheckListSvg` (asset này còn được dùng ở nhiều màn khác), nên nếu “đổi nội dung file check_list.svg” sẽ làm lệch icon ở các màn khác.
- Một số nút đang chưa trỏ tới chức năng thật (sort/add/menu dots chỉ stub/coming-soon hoặc chưa áp dụng filter/sort vào state).
- Filter bottom sheet có text hardcode/thiếu LocaleKey và thiếu bản dịch đồng bộ giữa các map.

## **Kế Hoạch Sửa (không phá các màn khác)**
### 1) Sửa đúng asset theo Figma (không ảnh hưởng global)
- Giữ nguyên `assets/images/icons/check_list.svg` nếu nó đang phục vụ màn khác.
- Thêm **icon mới** đúng Figma cho “3 lines” (ví dụ: `assets/images/icons/proicons_filter.svg` hoặc tên snake_case theo layer).
- Thêm constant mới trong `AppAssets` (ví dụ `iconsProiconsFilterSvg`) và **chỉ thay CustomerHeader** dùng icon này cho nút “sort/filter lines”.

### 2) Trỏ nút về đúng chức năng đã mô tả
- `onFilterTap`: giữ mở filter bottom sheet, nhưng bổ sung bước **apply filter** vào `CustomerBloc` (thêm event/state) thay vì chỉ `debugPrint`.
- `onSortTap`: tạo **sort bottom sheet** (UI giống style app), có 2–3 option sort (ví dụ: mới nhất/cũ nhất/theo tên). Khi chọn → dispatch `CustomerSortChanged` vào bloc.
- `onAddTap`: tạo route/page `CustomerCreatePage` theo chuẩn `ui.md` (`binding/ interactor/ components/`) và điều hướng tới page này. Nếu chưa có design form chi tiết, page sẽ là scaffold + các field tối thiểu và nút lưu “coming soon” (nhưng navigation là thật).
- `onMenuTap` (3 dots trên item): mở bottom sheet menu đúng pattern; implement:
  - “Xem chi tiết” → mở `CustomerDetailPage` (binding).
  - “Gọi” → dùng `url_launcher` với `tel:`.
  - “Email” → dùng `mailto:`.
  - Nếu thiếu dữ liệu phone/email hợp lệ → show toast lỗi.

### 3) Chuẩn hóa đa ngữ theo `ui.md` + GetX Localization
- Dọn toàn bộ text trong `getCustomerFilterMenu()` và các bottom sheet labels → dùng `LocaleKey.*.tr`.
- Bổ sung key còn thiếu vào `lib/src/core/localization/locale_key.dart` và cập nhật đồng bộ `lang_ja.dart` + `lang_en.dart`.
- Chuẩn hóa import trong module Customer sang `lib/src/core/localization/locale_key.dart` để tránh “2 nguồn LocaleKey”.

### 4) Verify
- Chạy `flutter analyze`.
- Rà lại preview Customer (header/tabs/list item) để confirm icon và interactions.

## **Danh Sách File Dự Kiến Sẽ Chạm**
- `assets/images/icons/…` (add icon mới theo Figma)
- `lib/src/utils/app_assets.dart`
- `lib/src/ui/customer/components/customer_header.dart`
- `lib/src/ui/customer/customer_page.dart`
- `lib/src/ui/customer/components/customer_filter_data.dart` (+ các LocaleKey cần thiết)
- `lib/src/ui/customer/interactor/*` (thêm event/state cho filter/sort)
- `lib/src/core/localization/locale_key.dart`, `lang_ja.dart`, `lang_en.dart`
- (mới) `lib/src/ui/customer_create/...` nếu cần create page

Nếu bạn xác nhận kế hoạch này, mình sẽ bắt đầu implement ngay theo thứ tự 1→4.