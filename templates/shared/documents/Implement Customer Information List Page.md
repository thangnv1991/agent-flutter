I have implemented the **Customer Information List** page (`CustomerPage`) with the requested UI components and logic.

### 1. New Components Created
- **CustomerHeader**: Displays the title "顧客情報一覧", search bar, and action buttons (Filter, Sort, Add).
- **CustomerFilterTabs**: Displays the "要対応 (Todo)" and "連絡待ち (Waiting)" tabs with counts.
- **CustomerListItem**: Displays individual customer cards with status badge, details, and action status.
- **CustomerFilterData**: Defines the nested menu structure for the "Filter" bottom sheet (Member Status, Region, Response Status).
- **CustomerUIModel**: Data model for the UI.

### 2. Logic Implemented (CustomerBloc)
- **State Management**: Added `customers` list, `selectedTabIndex`, `searchQuery`, `todoCount`, and `waitingCount` to `CustomerState`.
- **Mock Data**: Implemented `_generateMockData` to create 20 sample customers with varying statuses.
- **Filtering**: Implemented `_applyFilter` to filter the list based on the selected tab and search query.
- **Events**: Added `CustomerTabChanged` and `CustomerSearch` events.

### 3. Key UI Components Integration
- **AppListView**: Used for the main customer list with pull-to-refresh and load more support (via the widget).
- **AppNestedMenu**: Integrated into the "Filter" bottom sheet to support hierarchical filtering (e.g., Member Status -> HappyLink).
- **showAppInfoBottomSheet**: Used to display the filter menu.

### 4. Updates to Existing Files
- **AppInput**: Enhanced to support `onChanged`, `fillColor`, and `borderColor` for the search bar styling.
- **LocaleKey**: Added necessary localization keys.
- **CustomerPage**: Replaced the placeholder content with the new layout using `Column`, `CustomerHeader`, `CustomerFilterTabs`, and `Expanded` `AppListView`.

The page now matches the provided requirements and screenshots structure.