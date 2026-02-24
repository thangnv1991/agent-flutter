---
alwaysApply: false
---
# UI Development Rules & Workflow

## **1. Core Principles (Priority P1)**

### **0. Design Tokens (STRICT)**
- **Typography**: 1–1 mapping from Figma. Use `AppStyles`; `height = lineHeight / fontSize`. Bundle the exact font family/weight as in Figma.
- **Colors**: Use `AppColors`. Do not use hex/raw colors (`Color(0xFF...)`, `Colors.red`).
- **Spacing**: Use `int_extensions` and `AppDimensions`. Do not use arbitrary numeric padding/margin outside tokens.
- **Numeric Tokens**: Preserve numeric values from Figma for all properties (radius, spacing, border width, shadow blur/spread, font size, line-height, letter-spacing…). Do not round or force presets. If defaults differ, override locally or update tokens per design.
- **Icon Size**: Icon 24×24; container 44×44 when required by Figma; use `AppAssets`.
- **Shadows**: Normalize `BoxShadow` closest to CSS box-shadow; do not change blur/spread arbitrarily.
- **Backgrounds**: Use `DecorationImage` + appropriate `BoxFit` (cover/contain) and correct alignment.

### **Overrides (Per-Component)**
- App* widgets must allow overriding tokens: `size`, `radius`, `padding/margin`, `backgroundColor`, `textStyle`, `iconSize`, `constraints`.
- Defaults must come from tokens (`AppStyles`, `AppColors`, `AppDimensions`) and act only as fallbacks; do not hardcode.
- When overriding numeric tokens, preserve Figma values (radius/spacing/border/shadow/typography); do not round or force presets.

### **Icon Consistency & Deduplication**
- **Single Source**: Each icon has one SVG file and one constant in `AppAssets`.
- **No Duplicates**: Do not add different filenames with identical graphics.
- **Workflow**:
  - Normalize SVG (remove metadata, sort attributes, flatten stroke→fill, remove masks/filters if unnecessary).
  - Compute content hash after normalization; if duplicates → consolidate to one file and update references.
  - Variants (color/size/solid/outline) must be clearly named and considered different when geometry/semantics differ.
- **CI/Pre-commit**: Recommended duplicate check for `assets/images/icons/`; fail on duplicates.

### **Temporary Policy (Icons)**
- Current phase: **each screen adds its own icons**, do not reuse icons across screens. Name by screen to avoid confusion. Policy will be updated when moving to project-wide reuse.

### **SVG Color Handling**
- **Default**: Do not use `color`/`colorFilter` when the SVG already has correct Figma colors.
- **Allowed**: Only apply `color`/`colorFilter` when design requires recolor (active/inactive…) and the icon is flattened stroke→fill.
- **Prohibited**: Avoid `colorFilter` for multi-color SVGs; it easily causes color shifts on render.
### **A. Widget Standardization (App* Prefix)**
- **Rule**: ALWAYS check `lib/src/ui/widgets/` first.
- **Convention**: Shared widgets MUST use the `App` prefix.
- **Usage**:
  - `AppInput` instead of `TextField`.
  - `AppButtonBar` instead of `IconButton` (for back/actions).
  - `AppButton` instead of `ElevatedButton`.
  - `AppTextGradient` instead of `Text` (when gradient needed).
  - `AppCardSection` for container groupings.

### **B. Styling Source of Truth**
- **Colors**: NEVER hardcode hex codes or `Colors.red`. Use `AppColors` from `lib/src/utils/app_colors.dart`.
- **Typography**: Use `AppStyles` from `lib/src/utils/app_styles.dart`.
- **Example**:
  ```dart
  // ✅ Correct
  Text('Title', style: AppStyles.h1.copyWith(color: AppColors.primary));
  
  // ❌ Incorrect
  Text('Title', style: TextStyle(fontSize: 20, color: Colors.blue));
  ```

### **C. Localization (Priority P1)**
- **No Raw Strings**: All user-facing text MUST be localized.
- **Implementation**:
  - Add keys to `lib/src/locale/locale_key.dart` (snake_case: `feature_screen_element`).
  - Update **ALL** translation files (`lib/src/locale/lang_en.dart`, `lib/src/locale/lang_ja.dart`). Optional modularization by feature:
    - `lib/src/locale/en/<feature>.dart`
    - `lib/src/locale/ja/<feature>.dart`
    - Aggregators `lang_en.dart` / `lang_ja.dart` merge feature maps to reduce conflicts when multiple tasks add keys while keeping `enUs` / `jaJp`.
  - **Usage**: Use `.tr` extension.
 - **Integration**: `lib/src/locale/translation_manager.dart` consumes `enUs` and `jaJp`. **Do not rename** these variables in aggregators.
 - **Common Keys**:
   - Create common modules: `lib/src/core/localization/en/common.dart` and `ja/common.dart`.
   - Use `common_*` keys for widespread phrases (Save/Cancel/OK/Back/Next/Loading/Error/Retry…).
   - When text matches common, **reuse** the common key instead of creating a feature key.
    ```dart
    // ✅ Correct
    Text(LocaleKey.home_title.tr);
    
    // ❌ Incorrect
    Text('Home');
    ```

### **D. Data Model Layer (Priority P1)**
- **Separation of Concerns**: Request and Response models MUST be separated.
- **Folder Structure**:
  - `lib/src/core/model/request/`: Models sent **TO** the API (e.g., `LoginRequest`).
  - `lib/src/core/model/response/`: Models received **FROM** the API (e.g., `LoginResponse`).
  - `lib/src/core/model/`: UI/domain models (e.g., `NotificationModel`, `CalendarEventModel`, `WorkDetailRecord`).
- **Implementation**:
  - Do NOT mix UI logic in models.
  - Use `factory .fromJson` and `Map toJson` when applicable.
  - **No dynamic data in UI**: Pages/components MUST receive typed models via constructor/BLoC state; do not hardcode demo lists in widgets.
  - **Demo/Mock Data Location**: Keep all demo/sample data in `lib/src/utils/app_demo_data.dart` only. Import from there when previewing or testing UI.
- **Reuse-first**: Before creating a new model, check the [Model Registry](../../spec/model-registry.md) and follow [Dart Model Reuse Skill](../skills/dart-model-reuse/SKILL.md). Prefer extending existing models (optional fields) or composition over duplication.

### **E. Composition & State**
- **State**: Default to `StatelessWidget`. Use `StatefulWidget` only for local UI logic (animations, focus).
- **Encapsulation**: "Smart Components" should handle their own internal state (e.g., `AppInput` handles password visibility toggle).
- **Layout**: Use `Flex` (Column/Row) + int extensions (`n.height`/`n.width`) for spacing. Avoid `Padding` for simple gaps.

### **F. Assets Management (Priority P1)**
- **Rule**: Follow the [Assets Management Skill](../skills/flutter-assets-management/SKILL.md) strictly.
- **Naming**: MUST match Figma layer names in `snake_case`.
- **Registry**: All assets MUST be defined in `lib/src/utils/app_assets.dart`.
- **Usage**:
  ```dart
  // ✅ Correct
  SvgPicture.asset(AppAssets.icons_home_active_svg);
  
  // ❌ Incorrect
  SvgPicture.asset('assets/images/icons/home_active.svg');
  ```
- **Workflow**:
  1. Rename layer in Figma to `snake_case`.
  2. Export to `assets/images/` or `assets/icons/`.
  3. Register path in `AppAssets`.
  4. Use `AppAssets.name` in code.
 - **SVG Hygiene (Priority P1)**:
   - Flatten stroke → fill để tint/recolor an toàn.
   - Remove mask/clip/filter phức tạp; đảm bảo `viewBox` 24×24 cho icon.
   - Kiểm tra render qua `SvgPicture.asset` trong container 44×44, icon 24×24.

---

## **2. Standard Page Architecture**

Every page must follow this folder structure under `lib/src/ui/`:

```text
lib/src/ui/<page_name>/
├── binding/
│   └── <page_name>_binding.dart  # Dependency Injection
├── interactor/
│   └── <page_name>_bloc.dart     # Logic & State (GetX Controller or Bloc)
├── components/
│   ├── <page_name>_header.dart   # Local UI parts
│   └── <page_name>_form.dart
└── <page_name>_page.dart         # Main Entry Point
```

---

## **3. New Page Creation Workflow**

Follow these steps when creating a new UI screen:

### **Step 1: Preparation**
- Check Figma/Design.
- Identify reusable components -> Are they in `lib/src/ui/widgets`?
- Identify unique components -> Plan to put them in `components/`.

### **Step 2: Scaffolding**
- Create the folder structure (See [Lib Src Architecture Skill](../skills/flutter-standard-lib-src-architecture/SKILL.md)):
  ```bash
  mkdir -p lib/src/ui/my_new_feature/{binding,interactor,components}
  ```

### **Step 3: Data Modeling (If API involved)**
- Create Request model in `lib/src/core/model/request/`.
- Create Response model in `lib/src/core/model/response/`.

### **Step 4: Logic & Binding**
- Create the Controller/Bloc in `interactor/` (See [Bloc Skill](../skills/flutter-bloc-state-management/SKILL.md)).
- Create the Binding in `binding/` to inject the controller.

### **Step 5: Localization**
- **Identify Strings**: List all text in the new UI (See [GetX Localization Skill](../skills/getx-localization-standard/SKILL.md)).
- **Update Keys**: Add entries to `locale_key.dart` (e.g., `my_feature_title`).
- **Update Translations**: Add translations to `lang_en.dart`, `lang_ja.dart`.

### **Step 6: Main Page Implementation**
- Create `<page_name>_page.dart` (See [UI Widgets Skill](../skills/flutter-ui-widgets/SKILL.md)).
- Use `AppScaffold` (if available) or standard `Scaffold`.
- **Import Rules**:
  - Use `AppColors` / `AppStyles`.
  - Use `App*` widgets.
  - Use `LocaleKey.my_key.tr` for text.
- **Radius & Icon**:
  - If Figma requires radius = 14, **must** use `BorderRadius.circular(14)` at the corresponding component.
  - Icon 24×24; if framed, use container 40×40/44×44 per Figma.
 - **Documentation Comments (STRICT)**:
   - Add top-of-class `///` description for every Page and Component, summarizing its purpose and main actions.
   - Generator reads these docs to build `spec/ui-workflow.md` (run `dart run tool/generate_ui_workflow_spec.dart`).
   - Example:
     ```dart
     /// CustomerDetailPage: Shows overview, cases, and inspection history for a customer.
     class CustomerDetailPage extends StatelessWidget { ... }
     
     /// CustomerDetailHeader: Displays customer status badges and next schedule.
     class CustomerDetailHeader extends StatelessWidget { ... }
     ```

### **Step 7: Component Extraction**
- **Rule**: If a widget block is > 50 lines or reused twice, extract it to `components/` (See [Idiomatic Flutter Skill](../skills/idiomatic-flutter/SKILL.md)).
- Keep the main `build()` method clean and readable.

### **Step 8: Route Registration (Choose One)**
- See [Navigation Manager Skill](../skills/flutter-navigation-manager/SKILL.md).
- **Scenario A: Full Screen Page (Hides Bottom Bar)**
  - Register in `lib/src/utils/app_pages.dart`.
  - Use `Get.toNamed(AppPages.myFeature)`.
- **Scenario B: Nested Page (Keeps Bottom Bar Visible)**
  - Register in `lib/src/ui/routing/<feature>_router.dart` (e.g., `home_router.dart`).
  - Corresponds to the active tab (Home, Customer, etc.).
- **Scenario C: Common Shared Page (Accessible from ANY Tab)**
  - Register in `lib/src/ui/routing/common_router.dart`.
  - Used for shared screens like Notification, Privacy Policy, etc. that keep the Bottom Bar visible.

### **Step 9: Widget Preview (Priority P1)**
- **Requirement**: Every page and complex component MUST have a `@Preview` annotation for quick iteration.
- **Setup**:
  1. Import `package:flutter/widget_previews.dart`.
  2. Create a helper class `PreviewTranslations` to map localization keys.
  3. Create a public top-level function annotated with `@Preview`.
  4. Wrap the widget in `GetMaterialApp` to provide context, localization, and DI.
- **Template**:
  ```dart
  import 'package:flutter/widget_previews.dart';
  import 'package:link_home/src/locale/lang_en.dart';
  import 'package:link_home/src/locale/lang_ja.dart';

  // ... (Page Code) ...

  class PreviewTranslations extends Translations {
    @override
    Map<String, Map<String, String>> get keys => {
          'en_US': enUs,
          'ja_JP': jaJp,
        };
  }

  @Preview(
    size: Size(390, 844), // iPhone 12 Standard
  )
  Widget previewPageName() {
    // Inject Dependencies if needed
    if (!Get.isRegistered<PageBloc>()) {
      Get.put(PageBloc());
    }
    
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      useInheritedMediaQuery: true, // MUST be true for correct sizing
      translations: PreviewTranslations(),
      locale: const Locale('ja', 'JP'), // Default Preview Locale
      fallbackLocale: const Locale('en', 'US'),
      home: const PageName(),
    );
  }
  ```

---

## **4. Checklist Before PR**
- [ ] No hardcoded colors/styles?
- [ ] No raw strings? (Localization used)
- [ ] Used `App*` widgets where possible?
- [ ] Page broken down into `components/`?
- [ ] Logic separated into `interactor/`?
- [ ] **Data Models Separated?** (Request/Response in `core/model/`)
- [ ] File naming matches `<feature>_<type>.dart`?
- [ ] **Route Registered?**
  - [ ] If Full Screen: Added to `AppPages`?
  - [ ] If Nested: Added to `ui/routing/<tab>_router.dart`?
  - [ ] If Shared: Added to `ui/routing/common_router.dart`?
- [ ] **Widget Preview Added?** (`@Preview` with correct `Size` and `GetMaterialApp` wrapper)
 - [ ] **Design Tokens Applied?** (Typography/Colors/Spacing match Figma)
 - [ ] **Radius preserved from Figma?** (e.g., r14 at relevant components)
 - [ ] **SVG Hygiene OK?** (viewBox 24×24, tintable, no complex masks/filters)
