# Standard Prompt Templates

Copy and paste these templates when assigning tasks to ensure the AI follows all project rules (Architecture, Localization, Widgets).

---

## **1. Create New Page (Tạo màn hình mới)**

Use this prompt to trigger the **7-Step UI Workflow**:

```text
Create a new page:
- **Feature Name**: [e.g. work_report]
- **Route Type**: [Fullscreen (AppPages) OR Nested (HomeRouter/CustomerRouter) OR Common (CommonRouter)]
- **Key UI Components**: [List existing widgets or describe new ones, e.g. AppInput, DatePicker]
- **Logic**: [Brief description of what the page does]
```

**What the AI will do:**
1.  Scaffold `lib/src/ui/work_report/{binding,interactor,components}`.
2.  Create `LocaleKey` & update `lang_*.dart` (Localization).
3.  Implement UI using `App*` widgets & `AppColors`.
4.  Register the route in the correct file (`app_pages.dart` or `*_router.dart` or `common_router.dart`).

---

## **2. Create New Widget (Tạo Widget chung)**

Use this when you need a reusable component in `lib/src/ui/widgets/`:

```text
Create a shared widget:
- **Name**: App[Name] (e.g. AppRatingBar)
- **Usage**: [Where will it be used?]
- **Style**: [Reference AppColors/AppStyles]
```

**What the AI will do:**
1.  Create `lib/src/ui/widgets/app_[name].dart`.
2.  Use `StatelessWidget` and `const` constructor.
3.  Apply `AppColors`/`AppStyles`.

---

## **3. Refactor UI (Clean Code)**

Use this when a file is getting too long:

```text
Refactor this page: [Path to file]
- Extract sub-widgets to `components/` folder.
- Replace raw widgets with `App*` widgets.
- Fix hardcoded strings/colors.
```

---

## **4. Finalize Feature (Commit + Push + PR)**

Use this after completing UI/API work to trigger CI/CD rule and PR creation:

```text
Finalize this feature:
- Branch name: [e.g. feat/login-session-timeout]
- Commit message: [e.g. feat(auth): handle session timeout]
- Base branch: [e.g. dev]
- PR title: [e.g. feat(auth): handle session timeout]
- Feature summary: [...]
- UI summary: [...]
- Reviewer notes: [...]
- Screenshot evidence: [No UI OR before/after]
- Paired with: [Solo OR name]
```
