---
name: GetX Localization Standard
description: "Standards for GetX-based multi-language (locale_key + lang_*.dart). Invoke when generating a new page/feature or adding any user-facing text."
---

# GetX Localization Standard

## **Priority: P1 (HIGH)**

All user-facing text MUST be localized via **GetX Translations** using `locale_key.dart` + `lang_*.dart`.

## Core Rules (When generating a page)

### 1) locale_key.dart MUST be updated
- Add every new key used by the new page.
- Keys MUST be stable and semantic.
- Key naming format: `<feature>_<screen>_<element>` in `snake_case` (e.g. `customer_detail_title`).

### 2) ALL language files MUST be updated
Whenever a new key is added, you MUST update:
- `lang_en.dart`
- `lang_ja.dart`
- Any existing `lang_*.dart` languages in the project

No language is allowed to miss keys.

### 3) UI MUST use `.tr` (no raw strings)
- Always write: `LocaleKey.someKey.tr`
- Never hardcode labels like `'Home'`, `'ホーム'`, `'Trang chủ'` in widgets.

## Project Implementation (Source of Truth)

- Keys: `lib/src/core/localization/locale_key.dart`
- Translations:
  - `lib/src/core/localization/lang_en.dart`
  - `lib/src/core/localization/lang_ja.dart`
- Registry: `lib/src/core/localization/app_translations.dart`
- App wiring: `lib/main.dart` uses `GetMaterialApp(...)` with `translations`, `supportedLocales`, `fallbackLocale`, and Flutter `localizationsDelegates`.

## Conflict-Free Workflow (Recommended)
- **Modularize per Feature**: Split translations by feature to avoid PR conflicts:
  - `lib/src/core/localization/en/<feature>.dart`
  - `lib/src/core/localization/ja/<feature>.dart`
- **Aggregate Maps**: Keep `lang_en.dart` and `lang_ja.dart` as aggregators that merge feature maps:
  ```dart
  // lang_en.dart
  import 'en/home.dart' as en_home;
  import 'en/customer.dart' as en_customer;
  final Map<String, String> enUs = {
    ...en_home.map,
    ...en_customer.map,
    // ...
  };
  ```
  ```dart
  // en/home.dart
  final map = <String, String>{
    LocaleKey.home_title: 'Home',
    // ...
  };
  ```
- **Key Namespacing**: Prefix keys by feature (`customer_detail_title`), keep `snake_case`.
- **Sorting & Lint**: Sort keys alphabetically; reject PRs with duplicate keys or missing locales.
- **Append-Only**: Do not rename/remove keys in active release branches; add new keys and deprecate old ones separately.
- **CI Check (Optional)**: Script to validate:
  - All keys in `locale_key.dart` exist in every `lang_*.dart`.
  - No duplicate keys across feature maps.
  - Aggregators compile successfully.

## Integration with TranslationManager
- **Existing Manager**: `lib/src/locale/translation_manager.dart` expects `enUs` and `jaJp` maps from `lang_en.dart` and `lang_ja.dart`.
- **Do NOT rename** exported variables `enUs` / `jaJp`. Keep aggregator files exporting exactly these names.
- **Wiring remains**: `TranslationManager.keys` continues to return `{'en_US': enUs, 'ja_JP': jaJp}` — modularization happens inside aggregators.
- **Adding Languages**: When adding a new language, update:
  - Aggregator `lang_<code>.dart` to export `<code>_<COUNTRY>` map variable.
  - `TranslationManager.appLocales` and `.keys` to include the new locale.

## Common Keys & Reuse Policy
- **Purpose**: Reduce duplicate text using shared keys for app-wide phrases.
- **Common Module**:
  - Create `lib/src/core/localization/en/common.dart` and `ja/common.dart` for common phrases (Save, Cancel, OK, Back, Next, Loading, Error, Retry…).
  - Aggregators include `...common.map` before feature maps.
- **Key Naming**: Use `common_` prefix (e.g., `common_save`, `common_cancel`, `common_error_network`).
- **Feature Usage**: When a screen uses text that matches common, **reuse** `LocaleKey.common_*` instead of creating a feature key.
- **Screen-Specific**: Create new keys only for context-specific texts (e.g., `customer_detail_no_records_found`).
- **CI De-dup (Optional)**:
  - Script detects repeated values within a language and suggests moving to `common_*`.
  - Reject PRs if a common phrase appears under multiple different keys across features.

## Adding a New Language

1. Create `lang_<code>.dart` (e.g. `lang_ko.dart`) as `Map<String, String>`.
2. Register it in `AppTranslations.keys` using `<lang>_<COUNTRY>` (e.g. `ko_KR`).
3. Add the corresponding `Locale('<lang>', '<COUNTRY>')` to `supportedLocales`.
4. Ensure every key in `locale_key.dart` exists in the new language map.

## Quality Gates (Reject if violated)

- Any new page introduces raw strings in UI.
- `locale_key.dart` is changed but any `lang_*.dart` misses the same keys.
- Key names are generic or unstable (e.g. `title1`, `text_2`, random ids).
