# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v0.5] - 2025-11-05 _(Upcoming)_

### Added

- Introduced global **Loaders and Loading States** across the app for smoother UX.
  - Added visual feedback for CRUD operations in Profile, Accounts, and Expenses.
  - Improved perceived performance for Dashboard metrics.

### Improved

- Polished UI spacing and responsiveness for dashboard components.

### Planned Next

- Loaders for key dashboard sections.

---

## [v0.1] - 2025-11-04

### Overview

Initial MVP / Proof of Concept release to validate architecture and data flows.

### Added

- **Profile Management:** Create, update, delete user profile.
- **Accounts:** Full CRUD with basic input validation.
- **Expenses:** CRUD functionality with linked Accounts and Categories.
- **Dashboard:** Displays key summary metrics (total balance, total expenses, etc.).

### Notes

- Implemented basic form validation.
- API integration with `expenseService` and `accountService`.
- Local toast-based feedback for all CRUD operations.

---

## [Unreleased]

_No unreleased changes at this time._
