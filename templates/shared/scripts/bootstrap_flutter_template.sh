#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Bootstrap a new Flutter template project (script-first workflow).

Usage:
  bootstrap_flutter_template.sh [options]

Options:
  -n, --name <project_name>        Project folder name (required if --non-interactive)
  -o, --org <org_id>               Reverse-domain org id (default: com.example)
  -f, --flutter-version <version>  Flutter version for FVM (default: stable)
  -d, --dir <parent_dir>           Parent directory (default: current dir)
      --force                      Allow create/overwrite in non-empty existing directory
      --non-interactive            Do not prompt for missing values
  -h, --help                       Show this help

Examples:
  ./bootstrap_flutter_template.sh
  ./bootstrap_flutter_template.sh --name my_app --org com.company --flutter-version 3.38.5
  ./bootstrap_flutter_template.sh --name crm_mobile --dir ~/workspace --force
EOF
}

PROJECT_NAME=""
ORG_ID="com.example"
FLUTTER_VERSION="stable"
PARENT_DIR="$(pwd)"
FORCE=0
NON_INTERACTIVE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    -n|--name)
      PROJECT_NAME="${2:-}"
      shift 2
      ;;
    -o|--org)
      ORG_ID="${2:-}"
      shift 2
      ;;
    -f|--flutter-version)
      FLUTTER_VERSION="${2:-}"
      shift 2
      ;;
    -d|--dir)
      PARENT_DIR="${2:-}"
      shift 2
      ;;
    --force)
      FORCE=1
      shift
      ;;
    --non-interactive)
      NON_INTERACTIVE=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

prompt_required() {
  local current="$1"
  local message="$2"
  if [[ -n "$current" ]]; then
    printf '%s' "$current"
    return
  fi
  if [[ "$NON_INTERACTIVE" -eq 1 ]]; then
    printf '%s' ""
    return
  fi
  read -r -p "$message" current
  printf '%s' "$current"
}

prompt_with_default() {
  local current="$1"
  local message="$2"
  local fallback="$3"
  local input=""

  if [[ "$NON_INTERACTIVE" -eq 1 ]]; then
    if [[ -n "$current" ]]; then
      printf '%s' "$current"
    else
      printf '%s' "$fallback"
    fi
    return
  fi

  read -r -p "$message" input
  if [[ -n "$input" ]]; then
    printf '%s' "$input"
    return
  fi

  if [[ -n "$current" ]]; then
    printf '%s' "$current"
  else
    printf '%s' "$fallback"
  fi
}

normalize_project_name() {
  local value="$1"
  value="$(printf '%s' "$value" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9_]+/_/g; s/_+/_/g; s/^_+|_+$//g')"
  if [[ -z "$value" ]]; then
    value="flutter_app"
  fi
  if [[ "$value" =~ ^[0-9] ]]; then
    value="app_$value"
  fi
  printf '%s' "$value"
}

ensure_fvm() {
  if [[ -d "$HOME/.pub-cache/bin" ]]; then
    export PATH="$HOME/.pub-cache/bin:$PATH"
  fi
  if command -v fvm >/dev/null 2>&1; then
    return
  fi
  if ! command -v dart >/dev/null 2>&1; then
    echo "Error: fvm not found and dart not available to install fvm." >&2
    exit 1
  fi
  echo "Installing FVM..."
  dart pub global activate fvm >/dev/null
  export PATH="$PATH:$HOME/.pub-cache/bin"
  if ! command -v fvm >/dev/null 2>&1; then
    echo "Error: fvm installation failed." >&2
    exit 1
  fi
}

ensure_line_in_file() {
  local file="$1"
  local line="$2"
  touch "$file"
  if ! grep -Fxq "$line" "$file"; then
    printf '%s\n' "$line" >>"$file"
  fi
}

PROJECT_NAME="$(prompt_required "$PROJECT_NAME" "Project name: ")"
if [[ -z "$PROJECT_NAME" ]]; then
  echo "Error: project name is required." >&2
  exit 1
fi

ORG_ID="$(prompt_with_default "$ORG_ID" "Org id (default: $ORG_ID): " "com.example")"
FLUTTER_VERSION="$(prompt_with_default "$FLUTTER_VERSION" "Flutter version (default: $FLUTTER_VERSION): " "stable")"

APP_PACKAGE_NAME="$(normalize_project_name "$PROJECT_NAME")"
if [[ ! -d "$PARENT_DIR" ]]; then
  echo "Error: parent directory does not exist: $PARENT_DIR" >&2
  exit 1
fi
PARENT_DIR="$(cd "$PARENT_DIR" && pwd)"
PROJECT_DIR="$PARENT_DIR/$PROJECT_NAME"

if [[ -d "$PROJECT_DIR" ]] && [[ -n "$(ls -A "$PROJECT_DIR" 2>/dev/null || true)" ]] && [[ "$FORCE" -ne 1 ]]; then
  echo "Error: '$PROJECT_DIR' exists and is not empty. Use --force to continue." >&2
  exit 1
fi

echo "Bootstrapping project:"
echo "- Directory: $PROJECT_DIR"
echo "- App package name: $APP_PACKAGE_NAME"
echo "- Org: $ORG_ID"
echo "- Flutter version: $FLUTTER_VERSION"

ensure_fvm

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

fvm use "$FLUTTER_VERSION" --force

create_args=(fvm flutter create . --org "$ORG_ID" --project-name "$APP_PACKAGE_NAME")
if [[ "$FORCE" -eq 1 ]]; then
  create_args+=(--overwrite)
fi
"${create_args[@]}"

mkdir -p .vscode
cat >.vscode/settings.json <<'JSON'
{
  "dart.flutterSdkPath": ".fvm/flutter_sdk",
  "search.exclude": {
    "**/.fvm": true
  },
  "files.watcherExclude": {
    "**/.fvm": true
  }
}
JSON

fvm flutter pub add get flutter_bloc equatable dio retrofit json_annotation flutter_dotenv flutter_svg intl
fvm flutter pub add --dev build_runner retrofit_generator json_serializable

mkdir -p \
  lib/src/api \
  lib/src/core/managers \
  lib/src/core/model/request \
  lib/src/core/model/response \
  lib/src/core/repository \
  lib/src/di \
  lib/src/enums \
  lib/src/extensions \
  lib/src/helper \
  lib/src/locale \
  lib/src/ui/base \
  lib/src/ui/main \
  lib/src/ui/home/binding \
  lib/src/ui/home/bloc \
  lib/src/ui/routing \
  lib/src/ui/widgets \
  lib/src/utils

cat >lib/main.dart <<EOF
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:$APP_PACKAGE_NAME/src/di/di_graph_setup.dart';
import 'package:$APP_PACKAGE_NAME/src/locale/translation_manager.dart';
import 'package:$APP_PACKAGE_NAME/src/utils/app_pages.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await setupDependenciesGraph();
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: AppPages.main,
      getPages: AppPages.pages,
      translations: TranslationManager(),
      locale: TranslationManager.defaultLocale,
      fallbackLocale: TranslationManager.fallbackLocale,
    );
  }
}
EOF

cat >lib/src/di/di_graph_setup.dart <<'EOF'
import 'environment_module.dart';
import 'register_core_module.dart';
import 'register_manager_module.dart';

Future<void> setupDependenciesGraph() async {
  await registerEnvironmentModule();
  await registerCoreModule();
  await registerManagerModule();
}
EOF

cat >lib/src/di/environment_module.dart <<'EOF'
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> registerEnvironmentModule() async {
  if (dotenv.isInitialized) return;
  await dotenv.load(fileName: '.env');
}
EOF

cat >lib/src/di/register_core_module.dart <<'EOF'
Future<void> registerCoreModule() async {
  // Register core services/repositories here.
}
EOF

cat >lib/src/di/register_manager_module.dart <<'EOF'
Future<void> registerManagerModule() async {
  // Register app-wide managers here.
}
EOF

cat >lib/src/utils/app_colors.dart <<'EOF'
import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  static const Color primary = Color(0xFF1F6FEB);
  static const Color textPrimary = Color(0xFF1F2937);
  static const Color white = Color(0xFFFFFFFF);
}
EOF

cat >lib/src/utils/app_styles.dart <<'EOF'
import 'package:flutter/material.dart';

import 'app_colors.dart';

class AppStyles {
  AppStyles._();

  static const TextStyle h1 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
  );
}
EOF

cat >lib/src/utils/app_assets.dart <<'EOF'
class AppAssets {
  AppAssets._();

  // Define image/icon paths here.
}
EOF

cat >lib/src/utils/app_pages.dart <<EOF
import 'package:get/get.dart';

import 'package:$APP_PACKAGE_NAME/src/ui/home/binding/home_binding.dart';
import 'package:$APP_PACKAGE_NAME/src/ui/home/home_page.dart';
import 'package:$APP_PACKAGE_NAME/src/ui/main/main_page.dart';

class AppPages {
  AppPages._();

  static const String main = '/';
  static const String home = '/home';

  static final List<GetPage<dynamic>> pages = <GetPage<dynamic>>[
    GetPage(
      name: main,
      page: () => const MainPage(),
      binding: HomeBinding(),
    ),
    GetPage(
      name: home,
      page: () => const HomePage(),
      binding: HomeBinding(),
    ),
  ];
}
EOF

cat >lib/src/locale/locale_key.dart <<'EOF'
class LocaleKey {
  LocaleKey._();

  static const String homeTitle = 'home_title';
}
EOF

cat >lib/src/locale/lang_en.dart <<'EOF'
import 'locale_key.dart';

final Map<String, String> enUs = <String, String>{
  LocaleKey.homeTitle: 'Home',
};
EOF

cat >lib/src/locale/lang_ja.dart <<'EOF'
import 'locale_key.dart';

final Map<String, String> jaJp = <String, String>{
  LocaleKey.homeTitle: 'ホーム',
};
EOF

cat >lib/src/locale/translation_manager.dart <<'EOF'
import 'dart:ui';

import 'package:get/get.dart';

import 'lang_en.dart';
import 'lang_ja.dart';

class TranslationManager extends Translations {
  static const Locale defaultLocale = Locale('en', 'US');
  static const Locale fallbackLocale = Locale('en', 'US');
  static const List<Locale> appLocales = <Locale>[
    Locale('en', 'US'),
    Locale('ja', 'JP'),
  ];

  @override
  Map<String, Map<String, String>> get keys => <String, Map<String, String>>{
        'en_US': enUs,
        'ja_JP': jaJp,
      };
}
EOF

cat >lib/src/ui/main/main_page.dart <<EOF
import 'package:flutter/material.dart';

import 'package:$APP_PACKAGE_NAME/src/ui/home/home_page.dart';

class MainPage extends StatelessWidget {
  const MainPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const HomePage();
  }
}
EOF

cat >lib/src/ui/home/home_page.dart <<'EOF'
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../locale/locale_key.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(LocaleKey.homeTitle.tr),
      ),
      body: Center(
        child: Text(LocaleKey.homeTitle.tr),
      ),
    );
  }
}
EOF

cat >lib/src/ui/home/binding/home_binding.dart <<EOF
import 'package:get/get.dart';

import 'package:$APP_PACKAGE_NAME/src/ui/home/bloc/home_bloc.dart';

class HomeBinding extends Bindings {
  @override
  void dependencies() {
    if (!Get.isRegistered<HomeBloc>()) {
      Get.lazyPut<HomeBloc>(HomeBloc.new);
    }
  }
}
EOF

cat >lib/src/ui/home/bloc/home_bloc.dart <<'EOF'
import 'package:flutter_bloc/flutter_bloc.dart';

class HomeBloc extends Cubit<int> {
  HomeBloc() : super(0);
}
EOF

cat >lib/src/ui/routing/home_router.dart <<EOF
import 'package:flutter/material.dart';

import 'package:$APP_PACKAGE_NAME/src/ui/home/home_page.dart';

Route<dynamic> homeRouter(RouteSettings settings) {
  return MaterialPageRoute<void>(
    settings: settings,
    builder: (_) => const HomePage(),
  );
}
EOF

cat >.env <<'EOF'
API_BASE_URL=https://api.example.com
EOF

cat >.env.staging <<'EOF'
API_BASE_URL=https://staging-api.example.com
EOF

cat >.env.prod <<'EOF'
API_BASE_URL=https://api.example.com
EOF

ensure_line_in_file .gitignore ".env"
ensure_line_in_file .gitignore ".env.staging"
ensure_line_in_file .gitignore ".env.prod"

if command -v fvm >/dev/null 2>&1; then
  fvm dart format lib >/dev/null || true
fi

echo ""
echo "Bootstrap completed."
echo "Next steps:"
echo "1) cd \"$PROJECT_DIR\""
echo "2) fvm flutter run"
