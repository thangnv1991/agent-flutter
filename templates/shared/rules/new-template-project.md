---
alwaysApply: false
---
# Template Project Creation Workflow

This workflow describes the step-by-step process to generate a new Flutter project that matches the architecture and standards of the current codebase.

## 1. Project Initialization (FVM)

### 1.1 FVM Setup & Create Project
Use FVM (Flutter Version Management) to ensure consistent Flutter versions.

1.  **Install FVM** (if needed):
    ```bash
    dart pub global activate fvm
    ```

2.  **Initialize & Create Project**:
    ```bash
    mkdir project_name
    cd project_name
    
    # Initialize FVM with specific version (e.g., 3.38.5)
    fvm use 3.38.5 --force
    
    # Create project using FVM version
    fvm flutter create . --org com.example
    ```

### 1.2 IDE Configuration (VS Code)
Create/Update `.vscode/settings.json` to use the FVM version:
```json
{
  "dart.flutterSdkPath": ".fvm/flutter_sdk",
  "search.exclude": {
    "**/.fvm": true
  },
  "files.watcherExclude": {
    "**/.fvm": true
  }
}
```

### 1.3 Update `pubspec.yaml`
Add the standard dependencies required for the project architecture.

**Core Dependencies:**
- `get`: ^4.6.x (Routing & DI)
- `flutter_bloc`: ^8.x.x (State Management)
- `equatable`: ^2.x.x
- `dio`: ^5.x.x (Network)
- `retrofit`: ^4.x.x (API Client)
- `json_annotation`: ^4.x.x
- `flutter_dotenv`: (Environment variables)
- `flutter_svg`: (SVG support)
- `intl`: (Formatting)

**Dev Dependencies:**
- `build_runner`: (Code generation)
- `retrofit_generator`:
- `json_serializable`:

## 2. Directory Structure Scaffolding

Remove the default `lib/main.dart` and create the following directory structure under `lib/src/`:

```
lib/
  main.dart
  src/
    api/              # Retrofit API clients & interceptors
    core/
      managers/       # System managers (Permission, Connectivity)
      model/          # Data models (Request/Response)
      repository/     # Data repositories
    di/               # Dependency Injection setup
    enums/            # App-wide enums
    extensions/       # Dart extensions (Theme, Color, String)
    helper/           # Utils helpers (Validation, Logger)
    locale/           # Localization (TranslationManager)
    ui/               # Feature modules
      base/           # Base classes (BasePage, BaseViewModel)
      main/           # Root/Shell Page (BottomNav)
      home/           # Home Feature
      widgets/        # Shared UI components (AppInput, AppButton)
      routing/        # Per-tab Routers
    utils/            # Constants, Colors, Styles, Assets
```

## 3. Core Module Setup

### 3.1 Dependency Injection (`lib/src/di/`)
Create `di_graph_setup.dart` to initialize core services before the app starts.
- **Components**:
    - `EnvironmentModule`: Load `.env` config.
    - `NetworkModule`: Setup Dio client.
    - `RepositoryModule`: Register Repositories.
    - `ManagerModule`: Register Global Managers.

### 3.2 Utilities (`lib/src/utils/`)
Create placeholder files for design system constants:
- `app_colors.dart`: Define `AppColors` class.
- `app_styles.dart`: Define `AppStyles` class.
- `app_assets.dart`: Define `AppAssets` class.
- `app_pages.dart`: Define `AppPages` (GetX Route definition).

### 3.3 Localization (`lib/src/locale/`)
Implement `TranslationManager` extending `Translations` from GetX.

## 4. App Entry Point (`main.dart`)

Configure `main.dart` to:
1. Load Environment variables (`dotenv`).
2. Initialize Dependencies (`setupDependenciesGraph()`).
3. Run `GetMaterialApp` with:
   - `initialRoute`: `AppPages.main`
   - `getPages`: `AppPages.pages`
   - `theme`: Custom Theme.

## 5. Main Shell Implementation (Bottom Navigation)

Follow the guide in `create-bottombar.md` to implement the root navigation shell.

1.  **Enums**: Create `BottomNavigationPage` enum in `lib/src/enums/`.
2.  **Bloc**: Create `MainBloc` in `lib/src/ui/main/bloc/` to manage tab state.
3.  **UI**: Create `MainPage` using `IndexedStack` and `CupertinoTabView` for nested navigation.
4.  **Widget**: Create `AppBottomNavigationBar`.

## 6. Base Feature Creation (Home)

Create a standard "Home" feature to verify the setup:
1.  **Folder**: `lib/src/ui/home/`.
2.  **Files**:
    - `home_page.dart`: The UI.
    - `bloc/home_bloc.dart`: The Logic.
    - `binding/home_binding.dart`: DI for the module.
3.  **Routing**:
    - Add `HomeRouter` in `lib/src/ui/routing/`.
    - Register in `AppPages`.

## 7. Environment Setup

Create root-level environment files:
- `.env`
- `.env.staging`
- `.env.prod`

Add `.env*` to `.gitignore`.
