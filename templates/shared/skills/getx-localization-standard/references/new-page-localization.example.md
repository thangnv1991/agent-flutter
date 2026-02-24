# New Page Localization Template (GetX)

This template matches the current project structure (TranslationManager uses `enUs` / `jaJp`).

## 1) Add keys (locale_key.dart)

Example for `customer_detail` page:

```dart
// lib/src/locale/locale_key.dart
class LocaleKey {
  // ...
  static const String customerDetailTitle = 'customerDetailTitle';
  static const String customerDetailSave = 'customerDetailSave';
  static const String customerDetailDelete = 'customerDetailDelete';
}
```

## 2) Add translations (ALL languages)

`lang_en.dart`
```dart
// lib/src/locale/lang_en.dart
import 'package:link_home/src/locale/locale_key.dart';

Map<String, String> enUs = {
  // ...
  LocaleKey.customerDetailTitle: 'Customer Detail',
  LocaleKey.customerDetailSave: 'Save',   // Prefer reuse: LocaleKey.ok if suitable
  LocaleKey.customerDetailDelete: 'Delete',
};
```

`lang_ja.dart`
```dart
// lib/src/locale/lang_ja.dart
import 'package:link_home/src/locale/locale_key.dart';

Map<String, String> jaJp = {
  // ...
  LocaleKey.customerDetailTitle: '顧客詳細',
  LocaleKey.customerDetailSave: '保存',
  LocaleKey.customerDetailDelete: '削除',
};
```

## 3) Use in UI

```dart
Text(LocaleKey.customerDetailTitle.tr)
```

## 4) Common Keys & Reuse (Recommended)

- Reuse common keys when the text is generic:
  - `LocaleKey.ok`, `LocaleKey.cancel`, `LocaleKey.success`, `LocaleKey.error`, `LocaleKey.next`...
- Only create feature-specific keys for context-specific texts that differ from common meanings.

## 5) Optional: Modularization to avoid conflicts

- If needed, split translations by feature (`en/<feature>.dart`, `ja/<feature>.dart`) and merge them in `lang_en.dart` / `lang_ja.dart` to keep `enUs` / `jaJp` for `TranslationManager`.
