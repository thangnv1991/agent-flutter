# Model Registry (AUTO-GENERATED)

> Do not edit manually. Run: dart run tool/generate_model_registry.dart

## UI/Domain Models

- enum CustomerProjectActivityType — lib/src/core/model/customer_project_activity_ui_model.dart
- class CustomerProjectActivityDetailUIModel — lib/src/core/model/customer_project_activity_ui_model.dart
- class CustomerProjectActivityUIModel — lib/src/core/model/customer_project_activity_ui_model.dart
- enum CalendarEventType — lib/src/core/model/calendar.dart
  - Type for calendar events (affects UI colors/icons)
- class CalendarEventModel — lib/src/core/model/calendar.dart
  - Calendar event data consumed by UI scheduling components
- class CalendarEventDataSource — lib/src/core/model/calendar.dart
- class InspectionHistory — lib/src/core/model/inspection_history.dart
- class DetailItem — lib/src/core/model/detail_item.dart
- enum StepStatus — lib/src/core/model/step_progress.dart
- class StepProgress — lib/src/core/model/step_progress.dart
- class CustomerCaseItem — lib/src/core/model/customer_case_item.dart
- enum PlaceStatus — lib/src/core/model/map_working_item.dart
- class PlacePoint — lib/src/core/model/map_working_item.dart
- class TodoItem — lib/src/core/model/todo_item.dart
- enum NotificationStatus — lib/src/core/model/notification.dart
  - Notification read status
- enum NotificationFilter — lib/src/core/model/notification.dart
  - Filter for notifications list
- enum NotificationType — lib/src/core/model/notification.dart
  - Source/type of notification (system-wide or store-specific)
- class NotificationModel — lib/src/core/model/notification.dart
  - Notification item used by UI lists and detail screens
- class NextSchedule — lib/src/core/model/next_schedule.dart
- enum CustomerMemberStatus — lib/src/core/model/customer_ui_model.dart
- enum CustomerActionStatus — lib/src/core/model/customer_ui_model.dart
- class CustomerUIModel — lib/src/core/model/customer_ui_model.dart
- enum WorkDetailResult — lib/src/core/model/work_detail.dart
  - Result/outcome of a work detail visit (drives UI labels and summaries)
- class WorkDetailRecord — lib/src/core/model/work_detail.dart
  - Work detail record shown in work detail UI pages
- class UserInfo — lib/src/core/model/user_info.dart
- class SearchResultItem — lib/src/core/model/map_search_result.dart
- class ImageItem — lib/src/core/model/image_item.dart
- enum LeafNodeType — lib/src/core/model/nested_menu_item.dart
- class NestedMenuItem — lib/src/core/model/nested_menu_item.dart
- class MenuLevelHistory — lib/src/core/model/nested_menu_item.dart


## Request Models

- (none)


## Response Models

- class CustomerProjectInfo — lib/src/core/model/response/customer_project_info.dart
  - Summary info for a customer's project used in list and header UIs
- class ProjectActivity — lib/src/core/model/response/project_activity.dart
- enum ProjectStatus — lib/src/core/model/response/project_activity.dart
  - Project status enum


