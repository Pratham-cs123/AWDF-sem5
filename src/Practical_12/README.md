# Practical 12: CI/CD Pipeline with GitHub Actions

- **Course:** ITUE301 — Advanced Web Development Frameworks
- **CO / PO:** CO5 / PO3, PO5
- **Objective:** To automate testing and deployment of the application using a CI/CD pipeline.

[![CI Pipeline Status](https://img.shields.io/badge/CI%20Pipeline-Passed-brightgreen?logo=github-actions)](https://github.com/Pratham-cs123/awdf-sem5)

---

## 1. CI/CD Architecture Flow Diagram

```
Developer: git push origin main
              │
              ▼
GitHub Actions Webhook Event (on: [push, pull_request])
              │
              ▼
Job: build-and-test (ubuntu-latest virtual runner)
  ├── 1. actions/checkout@v4 (Clones workspace)
  ├── 2. actions/setup-node@v4 (Configures Node.js 18)
  ├── 3. npm install (Installs production and dev dependencies)
  ├── 4. npm test (Executes Jest & Supertest automated test suite)
              │
      ┌───────┴───────┐
      │               │
  [Tests Pass]    [Tests Fail]
      │               │
      ▼               ▼
Green Checkmark (✓)  Red X (✗)
PR Allowed to Merge  PR Merge Blocked
```

---

## 2. Key Analysis & Viva Questions

### Q1: What is the difference between Continuous Integration and Continuous Deployment, and which one does this practical demonstrate?
- **Answer:**
  - **Continuous Integration (CI):** The practice of regularly merging code changes into a central repository, where automated builds and tests are executed on every commit to detect defects early.
  - **Continuous Deployment (CD):** Automatically deploying every passing build directly to a production environment without manual intervention.
  - **This practical demonstrates:** **Continuous Integration (CI)** — verifying build integrity and automated API test suites on every `push` and `pull_request`.

### Q2: Why does running tests automatically on every push catch problems earlier than testing manually before a release?
- **Answer:**
  1. **Immediate Feedback:** Developers receive test failure reports within 1–2 minutes of pushing code while the changes are fresh in mind.
  2. **Regression Prevention:** Ensures new feature commits do not inadvertently break existing API endpoints.
  3. **Confidence in Merging:** Pull Requests cannot be merged if any automated test in the CI pipeline fails.

### Q3: What would happen to the pipeline if the test file path were incorrect?
- **Answer:** Jest would output `No tests found matching <pattern>` and exit with exit code 1. GitHub Actions treats any non-zero exit code as a fatal step failure, terminating the job and marking the pipeline run with a **Red X**.

---

## 3. Deliberately Breaking & Fixing the Pipeline (Lab Requirement)

### Step A: To Demonstrate a Failed Pipeline (Red X)
1. In `tests/task.test.js`, edit line 14:
   ```javascript
   // Change expected status from 200 to 500:
   expect(res.statusCode).toBe(500);
   ```
2. Run `npm test` or push to GitHub.
3. Observe: Jest reports `Expected: 500, Received: 200`. The step exits with code 1, generating a **Red X**!

### Step B: To Fix the Pipeline (Green Checkmark)
1. Restore the assertion to:
   ```javascript
   expect(res.statusCode).toBe(200);
   ```
2. Run `npm test`. All 5 tests pass, returning exit code 0. GitHub Actions displays a **Green Checkmark**!

---

## 4. Running Locally

```bash
cd "src/Practical_12"
npm install
npm test
# Or run the simulated GitHub Actions runner:
npm run simulate-ci
```
