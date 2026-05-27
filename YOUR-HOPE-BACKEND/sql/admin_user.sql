-- Make an existing user an admin.
-- Change the email to your real admin account before running.
USE your_hope_db;

UPDATE users
SET role = 'admin', status = 'active'
WHERE email = 'nysarakseyha@gmail.com';

SELECT user_id, full_name, email, role, status
FROM users
WHERE email = 'nysarakseyha@gmail.com';

UPDATE users
SET role = 'admin', status = 'active'
WHERE email = 'ranyphea94@gmail.com';

SELECT user_id, full_name, email, role, status
FROM users
WHERE email = 'ranyphea94@gmail.com';

UPDATE users
SET role = 'admin', status = 'active'
WHERE email = 'laysokleab55@gmail.com';

SELECT user_id, full_name, email, role, status
FROM users
WHERE email = 'laysokleab55@gmail.com';