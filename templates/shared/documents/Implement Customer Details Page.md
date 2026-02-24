I have successfully created the **Customer Details** page as requested.

### 1. New Folder Structure & Components
- Created `lib/src/ui/customer_detail/` with `binding`, `interactor`, and `components`.
- **Components**:
  - `CustomerDetailHeader`: Displays customer name, status, and contact info.
  - `CustomerDetailPersonalInfo`: Personal info form (Name, Birth Year, Address).
  - `CustomerDetailFamilyInfo`: Family members list.
  - `CustomerDetailHouseInfo`: House details (Type, Built Year, Area, Materials).
  - `CustomerDetailEquipmentInfo`: Equipment details (Solar, Battery).
  - `CustomerDetailConstructionHistory`: Construction history cards.

### 2. Logic & State Management
- Implemented `CustomerDetailBloc` with `Initialized` and `Save` events.
- Created `CustomerDetailState` to manage page state.
- Set up `CustomerDetailBinding` for dependency injection.

### 3. Localization & Assets
- Added new icons to `AppAssets` (map_location, phone, person, family, house, solar, etc.).
- Added localization keys to `LocaleKey` for all labels.

### 4. Navigation
- Registered `AppPages.customerDetail` in `AppPages`.
- Added `CustomerDetailPage` to `CommonRouter` for navigation from any tab.

The page is now ready to be navigated to using `Get.toNamed(AppPages.customerDetail)`. The UI follows the provided screenshots with a scrolling layout and sectioned components.