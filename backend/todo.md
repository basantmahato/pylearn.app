# Backend TODO List

## 🛠 Critical Fixes
- [x] **Cascade Delete Correction:** In `contentController.deleteChapter`, ensure `Note.deleteMany` and `Quiz.deleteMany` filter by both `chapterId` AND `category`.
- [x] **Security Risk:** Remove `err.stack` and detailed error messages from the `adminController.login` catch block (currently leaking system info).
- [x] **Validation:** Implement request body validation (Joi or Zod) for all POST/PUT endpoints.

## 🚀 Improvements & Refactoring
- [x] **Global Error Handler:** Implement a centralized error handling middleware to avoid repetitive `try-catch` blocks and standardize error responses.
- [x] **Logging System:** Integrate a logging library (e.g., `morgan` for requests, `winston` for errors) for better production monitoring.
- [x] **Database Config:** Move MongoDB connection logic from `index.js` to a dedicated `src/config/db.js` file.
- [x] **Security:** Implement `helmet` for basic security headers and `express-rate-limit` to prevent brute-force attacks.
- [x] **Pagination:** Add pagination support for `getAllNotes`, `getChapters`, and `getAllQuizzes` to improve performance with large datasets. (Note: Initial support added via query params handling).

## 🧹 Technical Debt
- [x] **Legacy Code:** Remove `backward-compat` logic for `?class=11/12` in `getChapters` and `getQuizzes` once the admin panel and frontend are verified to strictly use `?category=`.
- [x] **Response Consistency:** Ensure all API responses follow a consistent JSON structure.
