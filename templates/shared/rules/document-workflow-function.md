---
alwaysApply: false
---
# AI Documentation Workflow (Function)

## **Goal**
To automatically generate and maintain detailed functional documentation in `spec/function-workflow.md`. This documentation bridges the gap between the high-level UI flow (from `ui-workflow.md`) and the technical implementation, focusing on **API integrations, Data Transformations, and State Management logic**.

## **Trigger**
This workflow is triggered when:
1.  The `spec/ui-workflow.md` has been updated (Prerequisite).
2.  Backend integration (API) is implemented for a feature.
3.  Complex business logic is added (e.g., data validation, caching, error handling).
4.  The user requests: "Update function workflow for [feature]".

## **Workflow Steps**

### **Step 1: Analyze the Implementation**
- **Input**: The feature folder (`lib/src/ui/<feature>`) and `spec/ui-workflow.md`.
- **Action**: Deep dive into the following files:
    - `bloc/*_bloc.dart`: Identify Events, States, and Side Effects.
    - `repository/*_repository.dart`: Identify API endpoints, Request/Response models.
    - `model/*`: Analyze data structures.
    - `core/managers/*`: Check for global state usage (e.g., Auth, Permission).

### **Step 2: Format the Documentation**
- **Output File**: `spec/function-workflow.md`
- **Format**: Append (or Update) a section for EACH feature using the following template:

```markdown
## [Feature Name] (e.g., Login)
**Ref UI**: [Link to UI Spec Section]

### **1. Data Model**
**Request**: `LoginRequest`
- `email` (String): Required, valid email format.
- `password` (String): Required, min 6 chars.

**Response**: `LoginResponse`
- `token` (String): JWT Token.
- `user` (UserDto): User profile info.

### **2. State Management (BLoC)**
**Events**:
- `LoginEvent(email, password)`: Triggers the login process.
- `LoginReset()`: Resets state to initial.

**States**:
- `LoginInitial`: Form inputs enabled.
- `LoginLoading`: Inputs disabled, loading spinner active.
- `LoginSuccess(user)`: Navigation trigger.
- `LoginFailure(error)`: Error message display.

### **3. Functional Logic**
1.  **Validation**:
    - Check `email` via Regex.
    - Check `password.length >= 6`.
    - *If invalid*: Emit `LoginFailure(ValidationError)`.

2.  **API Call**:
    - Call `AuthRepository.login(request)`.
    - **Endpoint**: `POST /api/v1/auth/login`
    - **Headers**: `Content-Type: application/json`

3.  **Error Handling**:
    - **401 Unauthorized**: "Incorrect credentials".
    - **500 Server Error**: "System error, try again".
    - **Network Error**: "Check connection".

4.  **Post-Process**:
    - Save `token` to `SecureStorage`.
    - Update `UserManager.currentUser`.
    - Emit `LoginSuccess`.

### **4. Dependencies & Services**
- `AuthRepository`: API communication.
- `SecureStorage`: Token persistence.
- `UserManager`: Global user state.

### **5. Technical Debt / Optimization**
- [ ] Add rate limiting on login attempts.
- [ ] Cache last used email for convenience.
```

### **Step 3: Verification**
- **Consistency Check**: Ensure the "Functional Logic" aligns with the "User Flow" in `spec/ui-workflow.md`.
- **API Check**: Verify that the documented Endpoint and Request/Response models match the actual code in `Repository` and `Retrofit` clients.
- **Edge Cases**: Ensure error handling (Network, Validation, Server) is documented.

---

## **Prompt for AI**

### **Case 1: Single Feature**
> "Analyze `lib/src/ui/<feature>` and update `spec/function-workflow.md` based on the UI spec."

### **Case 2: Sync with UI Spec**
> "Read `spec/ui-workflow.md` and generate the corresponding functional specs in `spec/function-workflow.md`."
