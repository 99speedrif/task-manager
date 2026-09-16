import { test, expect } from '@playwright/test';

test('User can log in and view the task manager', async ({ page }) => {
  // 1. Go to the login page
  await page.goto('http://localhost:4200/login');

  // 2. Fill in the required assessment credentials
  await page.fill('input[type="email"]', 'admin@taskflow.com');
  await page.fill('input[type="password"]', 'Admin@123');

  // 3. Click the login button
  await page.click('button[type="submit"]');

  // 4. Verify that the app redirected us to the /tasks page
  await expect(page).toHaveURL('http://localhost:4200/tasks');

  // 5. Verify the main "Task Manager" heading is visible on the screen
  await expect(page.locator('h1', { hasText: 'Task Manager' })).toBeVisible();
  
  // 6. Verify the "Logout" button loaded successfully
  await expect(page.locator('button', { hasText: 'Logout' })).toBeVisible();
});

test('User can Create, Read, Update, and Delete a task (CRUD)', async ({ page }) => {
  // 1. Log in first (Prerequisite)
  await page.goto('http://localhost:4200/login');
  await page.fill('input[type="email"]', 'admin@taskflow.com');
  await page.fill('input[type="password"]', 'Admin@123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:4200/tasks');

  // We use a unique name with a timestamp so tests don't confuse old tasks
  const uniqueTaskName = `Automated Playwright Task ${Date.now()}`;

  // 2. CREATE
  await page.fill('input[placeholder="Add a new task..."]', uniqueTaskName);
  // We click the button that specifically has the text "Add"
  await page.click('button:has-text("Add")');

  // 3. READ (Verify it appears in the list)
  // Find the specific list item (li) that contains our unique task name
  const taskRow = page.locator('li', { hasText: uniqueTaskName });
  await expect(taskRow).toBeVisible();

  // 4. UPDATE (Mark as Done)
  // Find the 'Done' button *inside* our specific task row and click it
  const doneButton = taskRow.locator('button', { hasText: 'Done' });
  await doneButton.click();
  
  // Verify the button text changes to 'Undo' (meaning the status updated successfully)
  await expect(taskRow.locator('button', { hasText: 'Undo' })).toBeVisible();

  // 5. DELETE
  const deleteButton = taskRow.locator('button', { hasText: 'Delete' });
  await deleteButton.click();
  
  // Verify the task completely disappears from the screen
  await expect(taskRow).not.toBeVisible();
});