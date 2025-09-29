import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page).toHaveTitle(/Smart Student Hub/);
    await expect(page.getByText('Welcome to Smart Student Hub')).toBeVisible();
    await expect(page.getByText('Sign in to access your digital student identity')).toBeVisible();
    
    // Check for login form elements
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /Send Magic Link/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
  });

  test('should display signup page', async ({ page }) => {
    await page.goto('/signup');
    
    await expect(page.getByText('Join Smart Student Hub')).toBeVisible();
    await expect(page.getByText('Create your verified digital student identity')).toBeVisible();
    
    // Check for signup form elements
    await expect(page.getByPlaceholder('Your full name')).toBeVisible();
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    await expect(page.getByText('Select your role')).toBeVisible();
  });

  test('should validate email input', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty email
    await page.getByRole('button', { name: /Send Magic Link/i }).click();
    
    // Should show validation error
    await expect(page.getByText('Please enter your email address')).toBeVisible();
    
    // Enter invalid email
    await page.getByPlaceholder('name@example.com').fill('invalid-email');
    await page.getByRole('button', { name: /Send Magic Link/i }).click();
    
    // Should show validation error for invalid email format
    // Note: This assumes client-side validation is implemented
  });

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/login');
    
    // Click signup link
    await page.getByRole('link', { name: /Sign up/i }).click();
    await expect(page).toHaveURL('/signup');
    
    // Click login link from signup page
    await page.getByRole('link', { name: /Sign in/i }).click();
    await expect(page).toHaveURL('/login');
  });
});

