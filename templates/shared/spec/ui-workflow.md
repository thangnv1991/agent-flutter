# UI Workflow (AUTO-GENERATED)

> Do not edit manually. Run: dart run tool/generate_ui_workflow_spec.dart

## home
**Path**: lib/src/ui/home

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - HomePage — lib/src/ui/home/home_page.dart
- Components:
  - KPITarget — lib/src/ui/home/components/kpi_target.dart
  - SectionHeader — lib/src/ui/home/components/schedule.dart
  - SummaryCard — lib/src/ui/home/components/summary_card.dart
  - Header — lib/src/ui/home/components/header.dart
  - Summary — lib/src/ui/home/components/summary.dart
  - ScheduleCard — lib/src/ui/home/components/schedule_card.dart
  - ToDoCard — lib/src/ui/home/components/todo_card.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- binding/*

### 5. Notes & Known Issues
- 

## splash
**Path**: lib/src/ui/splash

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - SplashPage — lib/src/ui/splash/splash_page.dart
- Components:

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- (none)

### 5. Notes & Known Issues
- 

## calendar
**Path**: lib/src/ui/calendar

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - CalendarPage — lib/src/ui/calendar/calendar_page.dart
- Components:
  - CalendarTabView — lib/src/ui/calendar/components/calendar_tab_view.dart
  - CommonCalendarConfig — lib/src/ui/calendar/components/calendar/common_calendar_config.dart
  - MonthCalendar — lib/src/ui/calendar/components/calendar/month_canlendar.dart
  - WeekCalendar — lib/src/ui/calendar/components/calendar/week_calendar.dart
  - SectionSecond — lib/src/ui/calendar/components/section_second/section_second.dart
  - SearchCalendar — lib/src/ui/calendar/components/search_calendar.dart
  - SectionFirst — lib/src/ui/calendar/components/section_first/section_first.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- binding/*

### 5. Notes & Known Issues
- 

## create_plan
**Path**: lib/src/ui/create_plan

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - CreatePlanPage — lib/src/ui/create_plan/create_plan_page.dart
- Components:

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- (none)

### 5. Notes & Known Issues
- 

## customer_create_new_project
**Path**: lib/src/ui/customer_create_new_project

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - CustomerCreateNewProjectPage — lib/src/ui/customer_create_new_project/customer_create_new_project_page.dart
- Components:
  - CustomerCreateNewProjectForm — lib/src/ui/customer_create_new_project/components/customer_create_new_project_form.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- interactor/*
  - lib/src/ui/customer_create_new_project/interactor/customer_create_new_project_event.dart
  - lib/src/ui/customer_create_new_project/interactor/customer_create_new_project_bloc.dart
  - lib/src/ui/customer_create_new_project/interactor/customer_create_new_project_state.dart
  - lib/src/ui/customer_create_new_project/interactor/customer_create_new_project_command.dart
  - lib/src/ui/customer_create_new_project/interactor/customer_create_new_project_visit_type.dart
- binding/*

### 5. Notes & Known Issues
- 

## auth
**Path**: lib/src/ui/auth

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - VerifyOtpPage — lib/src/ui/auth/verify_otp/verify_otp_page.dart
  - SuccessPage — lib/src/ui/auth/success/success_page.dart
  - ForgotPasswordPage — lib/src/ui/auth/forgot_password/forgot_password_page.dart
  - EditProfilePage — lib/src/ui/auth/edit_profile/edit_profile_page.dart
  - ChangePasswordPage — lib/src/ui/auth/change_password/change_password_page.dart
  - ProfilePage — lib/src/ui/auth/profile/profile_page.dart
  - LoginPage — lib/src/ui/auth/login/login_page.dart
- Components:
  - RulePassword — lib/src/ui/auth/change_password/components/rule_password.dart
  - ProfileHeader — lib/src/ui/auth/profile/components/profile_header.dart
  - MenuItem — lib/src/ui/auth/profile/components/menu_item.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- (none)

### 5. Notes & Known Issues
- 

## search_result
**Path**: lib/src/ui/search_result

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - SearchResultPage — lib/src/ui/search_result/search_result_page.dart
- Components:

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- (none)

### 5. Notes & Known Issues
- 

## notification
**Path**: lib/src/ui/notification

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - NotificationPage — lib/src/ui/notification/notification_page.dart
- Components:
  - NotificationCard — lib/src/ui/notification/components/notification_card.dart
  - NotificationTabContent — lib/src/ui/notification/components/notification_tab_content.dart
  - BadgeCountNotification — lib/src/ui/notification/components/badge_count_notification.dart
  - NotificationTabBar — lib/src/ui/notification/components/notification_tab_bar.dart
  - NotificationFilterBar — lib/src/ui/notification/components/notification_filter_bar.dart
  - NotificationFilterButton — lib/src/ui/notification/components/notification_filter_button.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- interactor/*
  - lib/src/ui/notification/interactor/notification_state.dart
  - lib/src/ui/notification/interactor/notification_event.dart
  - lib/src/ui/notification/interactor/notification_bloc.dart
- binding/*

### 5. Notes & Known Issues
- 

## activity
**Path**: lib/src/ui/activity

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - ActivityLogsPage — lib/src/ui/activity/activity_logs_page.dart
- Components:
  - ActivityLogItem — lib/src/ui/activity/components/activity_log_item.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- (none)

### 5. Notes & Known Issues
- 

## target
**Path**: lib/src/ui/target

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - TargetPage — lib/src/ui/target/target_page.dart
- Components:
  - TargetOverviewTab — lib/src/ui/target/components/target_overview_tab.dart
  - TargetProgressCard — lib/src/ui/target/components/target_progress_card.dart
  - TargetCategoryBar — lib/src/ui/target/components/target_category_bar.dart
  - TargetProgressCardAppointment — lib/src/ui/target/components/target_progress_card_appointment.dart
  - TargetPersonalTab — lib/src/ui/target/components/target_personal_tab.dart
  - TargetStatsCard — lib/src/ui/target/components/target_stats_card.dart
  - TargetTabSelector — lib/src/ui/target/components/target_tab_selector.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- interactor/*
  - lib/src/ui/target/interactor/target_bloc.dart
- binding/*

### 5. Notes & Known Issues
- 

## edit_customer_information
**Path**: lib/src/ui/edit_customer_information

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - EditCustomerInformationPage — lib/src/ui/edit_customer_information/edit_customer_information_page.dart
- Components:
  - EditCustomerInformationMemberCard — lib/src/ui/edit_customer_information/components/edit_customer_information_member_card.dart
  - EditCustomerInformationContractAirConditionerContent — lib/src/ui/edit_customer_information/components/edit_customer_information_contract_air_conditioner_content.dart
  - EditCustomerInformationContractEquipmentSection — lib/src/ui/edit_customer_information/components/edit_customer_information_contract_equipment_section.dart
  - EditCustomerInformationContractWaterHeaterContent — lib/src/ui/edit_customer_information/components/edit_customer_information_contract_water_heater_content.dart
  - EditCustomerInformationHistoryTab — lib/src/ui/edit_customer_information/components/edit_customer_information_history_tab.dart
  - EditCustomerInformationContractSolarContent — lib/src/ui/edit_customer_information/components/edit_customer_information_contract_solar_content.dart
  - EditCustomerInformationContractEquipmentItemCard — lib/src/ui/edit_customer_information/components/edit_customer_information_contract_equipment_item_card.dart
  - EditCustomerInformationContractTab — lib/src/ui/edit_customer_information/components/edit_customer_information_contract_tab.dart
  - EditCustomerInformationContractBasicInfoSection — lib/src/ui/edit_customer_information/components/edit_customer_information_contract_basic_info_section.dart
  - EditCustomerInformationPersonalTab — lib/src/ui/edit_customer_information/components/edit_customer_information_personal_tab.dart
  - EditCustomerInformationTabs — lib/src/ui/edit_customer_information/components/edit_customer_information_tabs.dart
  - EditCustomerInformationContractWaterSystemContent — lib/src/ui/edit_customer_information/components/edit_customer_information_contract_water_system_content.dart
  - EditCustomerInformationHeader — lib/src/ui/edit_customer_information/components/edit_customer_information_header.dart
  - EditCustomerInformationContractBatteryContent — lib/src/ui/edit_customer_information/components/edit_customer_information_contract_battery_content.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- interactor/*
  - lib/src/ui/edit_customer_information/interactor/edit_customer_information_bloc.dart
  - lib/src/ui/edit_customer_information/interactor/edit_customer_information_state.dart
  - lib/src/ui/edit_customer_information/interactor/edit_customer_information_event.dart
- binding/*

### 5. Notes & Known Issues
- 

## visit_record
**Path**: lib/src/ui/visit_record

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - VisitRecordPage — lib/src/ui/visit_record/visit_record_page.dart
- Components:
  - VisitRecordStep2Content — lib/src/ui/visit_record/components/visit_record_step2_content.dart
  - VisitRecordBasicInfo — lib/src/ui/visit_record/components/visit_record_basic_info.dart
  - VisitRecordCustomerInfo — lib/src/ui/visit_record/components/visit_record_customer_info.dart
  - VisitRecordStep1Content — lib/src/ui/visit_record/components/visit_record_step1_content.dart
  - VisitRecordProjectInfo — lib/src/ui/visit_record/components/visit_record_project_info.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- interactor/*
  - lib/src/ui/visit_record/interactor/visit_record_bloc.dart
  - lib/src/ui/visit_record/interactor/visit_record_event.dart
  - lib/src/ui/visit_record/interactor/visit_record_state.dart
- binding/*

### 5. Notes & Known Issues
- 

## customer_select
**Path**: lib/src/ui/customer_select

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - CustomerSelectPage — lib/src/ui/customer_select/customer_select_page.dart
- Components:
  - CustomerSelectCard — lib/src/ui/customer_select/components/customer_select_card.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- interactor/*
  - lib/src/ui/customer_select/interactor/customer_select_bloc.dart
  - lib/src/ui/customer_select/interactor/customer_select_event.dart
  - lib/src/ui/customer_select/interactor/customer_select_state.dart
- binding/*

### 5. Notes & Known Issues
- 

## common
**Path**: lib/src/ui/common

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - NotFoundPage — lib/src/ui/common/not_found_page.dart
  - CommonPage — lib/src/ui/common/common_page.dart
- Components:

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- (none)

### 5. Notes & Known Issues
- 

## map
**Path**: lib/src/ui/map

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
- Components:
  - SearchResultItem — lib/src/ui/map/components/map_search_text.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- (none)

### 5. Notes & Known Issues
- 

## appointment_detail
**Path**: lib/src/ui/appointment_detail

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - AppointmentDetailPage — lib/src/ui/appointment_detail/appointment_detail_page.dart
- Components:

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- (none)

### 5. Notes & Known Issues
- 

## routing
**Path**: lib/src/ui/routing

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
- Components:

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- (none)

### 5. Notes & Known Issues
- 

## setting
**Path**: lib/src/ui/setting

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - SettingPage — lib/src/ui/setting/setting_page.dart
- Components:

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- binding/*

### 5. Notes & Known Issues
- 

## customer_detail
**Path**: lib/src/ui/customer_detail

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - CustomerDetailPage — lib/src/ui/customer_detail/customer_detail_page.dart
- Components:
  - CustomerDetailInspectionTab — lib/src/ui/customer_detail/components/customer_detail_inspection_tab.dart
  - CustomerDetailFamilyInfo — lib/src/ui/customer_detail/components/customer_detail_family_info.dart
  - CustomerDetailGeneralTab — lib/src/ui/customer_detail/components/customer_detail_general_tab.dart
  - CustomerDetailHeader — lib/src/ui/customer_detail/components/customer_detail_header.dart
  - CustomerDetailHouseInfo — lib/src/ui/customer_detail/components/customer_detail_house_info.dart
  - CustomerDetailEquipmentInfo — lib/src/ui/customer_detail/components/customer_detail_equipment_info.dart
  - CustomerDetailCasesTab — lib/src/ui/customer_detail/components/customer_detail_cases_tab.dart
  - CustomerDetailConstructionHistory — lib/src/ui/customer_detail/components/customer_detail_construction_history.dart
  - CustomerDetailTabBar — lib/src/ui/customer_detail/components/customer_detail_tab_bar.dart
  - CustomerDetailPersonalInfo — lib/src/ui/customer_detail/components/customer_detail_personal_info.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- interactor/*
  - lib/src/ui/customer_detail/interactor/customer_detail_state.dart
  - lib/src/ui/customer_detail/interactor/customer_detail_event.dart
  - lib/src/ui/customer_detail/interactor/customer_detail_bloc.dart
- binding/*

### 5. Notes & Known Issues
- 

## main
**Path**: lib/src/ui/main

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - MainPage — lib/src/ui/main/main_page.dart
- Components:
  - AppBottomNavigationBar — lib/src/ui/main/components/app_bottom_navigation_bar.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- binding/*

### 5. Notes & Known Issues
- 

## customer_project_list
**Path**: lib/src/ui/customer_project_list

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - CustomerProjectListPage — lib/src/ui/customer_project_list/customer_project_list_page.dart
- Components:
  - ProjectTypeBadge — lib/src/ui/customer_project_list/components/project_badges.dart
    - Project type badge widget
  - ProjectIconWidget — lib/src/ui/customer_project_list/components/project_icon_widget.dart
    - Project icon widget with circular background
  - ActivityItemCard — lib/src/ui/customer_project_list/components/activity_item_card.dart
    - Activity item card widget
  - ProjectListHeader — lib/src/ui/customer_project_list/components/project_list_header.dart
    - Project list header component

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- interactor/*
  - lib/src/ui/customer_project_list/interactor/customer_project_list_state.dart
  - lib/src/ui/customer_project_list/interactor/customer_project_list_bloc.dart
  - lib/src/ui/customer_project_list/interactor/customer_project_list_event.dart
- binding/*

### 5. Notes & Known Issues
- 

## base
**Path**: lib/src/ui/base

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - BasePage — lib/src/ui/base/base_page.dart
- Components:

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- interactor/*
  - lib/src/ui/base/interactor/base_usecase.dart
  - lib/src/ui/base/interactor/page_states.dart
  - lib/src/ui/base/interactor/dialog_listener.dart
  - lib/src/ui/base/interactor/base_state_mapper.dart
  - lib/src/ui/base/interactor/page_command.dart
  - lib/src/ui/base/interactor/page_error.dart
- (none)

### 5. Notes & Known Issues
- 

## work_detail
**Path**: lib/src/ui/work_detail

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
- Components:
  - SectionResultAbsent — lib/src/ui/work_detail/components/section_result_absent.dart
  - SectionResultTalkFaceProcessed — lib/src/ui/work_detail/components/section_result_talk_face_processed.dart
  - StaticMap — lib/src/ui/work_detail/components/map/static_map.dart
  - SectionSecond — lib/src/ui/work_detail/components/section_second.dart
  - RadioSectionForm — lib/src/ui/work_detail/components/radio_section_form.dart
  - SectionResultAppointment — lib/src/ui/work_detail/components/section_result_appointment.dart
  - SectionResultNew — lib/src/ui/work_detail/components/section_result_new.dart
  - SectionFirst — lib/src/ui/work_detail/components/section_first.dart
  - SectionResultPostLetter — lib/src/ui/work_detail/components/section_result_post_letter.dart
  - SectionThird — lib/src/ui/work_detail/components/section_third.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- (none)

### 5. Notes & Known Issues
- 

## widgets
**Path**: lib/src/ui/widgets

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
- Components:

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- (none)
- (none)

### 5. Notes & Known Issues
- 

## customer
**Path**: lib/src/ui/customer

### 1. Description
Goal: 
Features:
- 

### 2. UI Structure
- Screens:
  - CustomerPage — lib/src/ui/customer/customer_page.dart
- Components:
  - customer_filter_data — lib/src/ui/customer/components/customer_filter_data.dart
  - CustomerTabItem — lib/src/ui/customer/components/customer_filter_tabs.dart
  - CustomerSortSheet — lib/src/ui/customer/components/customer_sort_sheet.dart
  - CustomerListItem — lib/src/ui/customer/components/customer_list_item.dart
  - CustomerHeader — lib/src/ui/customer/components/customer_header.dart
  - NestedInput — lib/src/ui/customer/components/nested_input.dart
  - CustomerItemMenuSheet — lib/src/ui/customer/components/customer_item_menu_sheet.dart
  - customer_components_preview — lib/src/ui/customer/components/customer_components_preview.dart

### 3. User Flow & Logic
1) 
2) 

### 4. Key Dependencies
- interactor/*
  - lib/src/ui/customer/interactor/customer_event.dart
  - lib/src/ui/customer/interactor/customer_state.dart
  - lib/src/ui/customer/interactor/customer_bloc.dart
  - lib/src/ui/customer/interactor/customer_sort_option.dart
- binding/*

### 5. Notes & Known Issues
- 

