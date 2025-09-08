-- Dummy data for Akaki Full Gospel Church Management System
-- This will populate the database with sample members and tithing records

-- Insert sample members
INSERT INTO members (member_id, first_name, last_name, email, phone, address, date_of_birth, gender, marital_status, occupation, monthly_income, membership_date, created_by) VALUES
('AFGC001', 'Abebe', 'Kebede', 'abebe.kebede@email.com', '+251911123456', 'Addis Ababa, Bole', '1985-03-15', 'male', 'married', 'Teacher', 8000.00, '2020-01-15', 1),
('AFGC002', 'Almaz', 'Tesfaye', 'almaz.tesfaye@email.com', '+251922234567', 'Addis Ababa, Kirkos', '1990-07-22', 'female', 'single', 'Nurse', 12000.00, '2020-02-10', 1),
('AFGC003', 'Dawit', 'Haile', 'dawit.haile@email.com', '+251933345678', 'Addis Ababa, Yeka', '1982-11-08', 'male', 'married', 'Engineer', 25000.00, '2020-03-05', 1),
('AFGC004', 'Hanan', 'Girma', 'hanan.girma@email.com', '+251944456789', 'Addis Ababa, Arada', '1988-05-12', 'female', 'married', 'Accountant', 15000.00, '2020-04-20', 1),
('AFGC005', 'Mulugeta', 'Assefa', 'mulugeta.assefa@email.com', '+251955567890', 'Addis Ababa, Gulele', '1975-09-30', 'male', 'married', 'Business Owner', 35000.00, '2020-05-15', 1),
('AFGC006', 'Selamawit', 'Bekele', 'selamawit.bekele@email.com', '+251966678901', 'Addis Ababa, Nifas Silk', '1992-12-03', 'female', 'single', 'Doctor', 28000.00, '2020-06-10', 1),
('AFGC007', 'Tekle', 'Mekonen', 'tekle.mekonen@email.com', '+251977789012', 'Addis Ababa, Kolfe', '1980-04-18', 'male', 'married', 'Lawyer', 22000.00, '2020-07-25', 1),
('AFGC008', 'Meron', 'Tadesse', 'meron.tadesse@email.com', '+251988890123', 'Addis Ababa, Akaky', '1987-08-14', 'female', 'divorced', 'Marketing Manager', 18000.00, '2020-08-12', 1),
('AFGC009', 'Yohannes', 'Wolde', 'yohannes.wolde@email.com', '+251999901234', 'Addis Ababa, Lideta', '1983-01-27', 'male', 'married', 'IT Specialist', 20000.00, '2020-09-08', 1),
('AFGC010', 'Rahel', 'Desta', 'rahel.desta@email.com', '+251900012345', 'Addis Ababa, Addis Ketema', '1991-06-09', 'female', 'single', 'Pharmacist', 16000.00, '2020-10-15', 1),
('AFGC011', 'Getachew', 'Alemu', 'getachew.alemu@email.com', '+251911234567', 'Addis Ababa, Bole', '1978-02-14', 'male', 'married', 'Bank Manager', 30000.00, '2021-01-20', 1),
('AFGC012', 'Tigist', 'Worku', 'tigist.worku@email.com', '+251922345678', 'Addis Ababa, Kirkos', '1989-10-05', 'female', 'married', 'Social Worker', 10000.00, '2021-02-18', 1),
('AFGC013', 'Solomon', 'Gebre', 'solomon.gebre@email.com', '+251933456789', 'Addis Ababa, Yeka', '1984-07-21', 'male', 'single', 'Pilot', 45000.00, '2021-03-12', 1),
('AFGC014', 'Bethlehem', 'Negash', 'bethlehem.negash@email.com', '+251944567890', 'Addis Ababa, Arada', '1986-12-16', 'female', 'married', 'University Lecturer', 19000.00, '2021-04-08', 1),
('AFGC015', 'Ermias', 'Teshome', 'ermias.teshome@email.com', '+251955678901', 'Addis Ababa, Gulele', '1981-03-29', 'male', 'married', 'Construction Manager', 24000.00, '2021-05-22', 1)
ON CONFLICT (member_id) DO NOTHING;

-- Insert sample monthly payments for 2024 (current year)
-- January 2024
INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
(1, 1, 2024, 800.00, 200.00, 100.00, 1100.00, '2024-01-15', 'bank_transfer', 1),
(2, 1, 2024, 1200.00, 300.00, 0.00, 1500.00, '2024-01-16', 'cash', 1),
(3, 1, 2024, 2500.00, 500.00, 200.00, 3200.00, '2024-01-17', 'bank_transfer', 1),
(4, 1, 2024, 1500.00, 400.00, 150.00, 2050.00, '2024-01-18', 'mobile_money', 1),
(5, 1, 2024, 3500.00, 800.00, 300.00, 4600.00, '2024-01-19', 'bank_transfer', 1)
ON CONFLICT (member_id, payment_month, payment_year) DO NOTHING;

INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
(6, 1, 2024, 2800.00, 600.00, 250.00, 3650.00, '2024-01-20', 'bank_transfer', 1),
(7, 1, 2024, 2200.00, 500.00, 200.00, 2900.00, '2024-01-21', 'cash', 1),
(8, 1, 2024, 1800.00, 400.00, 100.00, 2300.00, '2024-01-22', 'mobile_money', 1),
(9, 1, 2024, 2000.00, 450.00, 150.00, 2600.00, '2024-01-23', 'bank_transfer', 1),
(10, 1, 2024, 1600.00, 350.00, 100.00, 2050.00, '2024-01-24', 'cash', 1);

-- February 2024
INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
(1, 2, 2024, 800.00, 250.00, 0.00, 1050.00, '2024-02-15', 'bank_transfer', 1),
(2, 2, 2024, 1200.00, 350.00, 100.00, 1650.00, '2024-02-16', 'cash', 1),
(3, 2, 2024, 2500.00, 600.00, 300.00, 3400.00, '2024-02-17', 'bank_transfer', 1),
(4, 2, 2024, 1500.00, 450.00, 200.00, 2150.00, '2024-02-18', 'mobile_money', 1),
(5, 2, 2024, 3500.00, 900.00, 400.00, 4800.00, '2024-02-19', 'bank_transfer', 1),
(11, 2, 2024, 3000.00, 700.00, 250.00, 3950.00, '2024-02-20', 'bank_transfer', 1),
(12, 2, 2024, 1000.00, 250.00, 50.00, 1300.00, '2024-02-21', 'cash', 1),
(13, 2, 2024, 4500.00, 1000.00, 500.00, 6000.00, '2024-02-22', 'bank_transfer', 1),
(14, 2, 2024, 1900.00, 400.00, 150.00, 2450.00, '2024-02-23', 'mobile_money', 1),
(15, 2, 2024, 2400.00, 550.00, 200.00, 3150.00, '2024-02-24', 'bank_transfer', 1);

-- March 2024
INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
(1, 3, 2024, 800.00, 300.00, 150.00, 1250.00, '2024-03-15', 'bank_transfer', 1),
(2, 3, 2024, 1200.00, 400.00, 200.00, 1800.00, '2024-03-16', 'cash', 1),
(3, 3, 2024, 2500.00, 700.00, 400.00, 3600.00, '2024-03-17', 'bank_transfer', 1),
(6, 3, 2024, 2800.00, 650.00, 300.00, 3750.00, '2024-03-18', 'bank_transfer', 1),
(7, 3, 2024, 2200.00, 550.00, 250.00, 3000.00, '2024-03-19', 'cash', 1),
(8, 3, 2024, 1800.00, 450.00, 150.00, 2400.00, '2024-03-20', 'mobile_money', 1),
(9, 3, 2024, 2000.00, 500.00, 200.00, 2700.00, '2024-03-21', 'bank_transfer', 1),
(10, 3, 2024, 1600.00, 400.00, 150.00, 2150.00, '2024-03-22', 'cash', 1),
(11, 3, 2024, 3000.00, 750.00, 300.00, 4050.00, '2024-03-23', 'bank_transfer', 1),
(12, 3, 2024, 1000.00, 300.00, 100.00, 1400.00, '2024-03-24', 'cash', 1);

-- April 2024
INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
(4, 4, 2024, 1500.00, 500.00, 250.00, 2250.00, '2024-04-15', 'mobile_money', 1),
(5, 4, 2024, 3500.00, 1000.00, 500.00, 5000.00, '2024-04-16', 'bank_transfer', 1),
(13, 4, 2024, 4500.00, 1200.00, 600.00, 6300.00, '2024-04-17', 'bank_transfer', 1),
(14, 4, 2024, 1900.00, 450.00, 200.00, 2550.00, '2024-04-18', 'mobile_money', 1),
(15, 4, 2024, 2400.00, 600.00, 250.00, 3250.00, '2024-04-19', 'bank_transfer', 1),
(1, 4, 2024, 800.00, 350.00, 200.00, 1350.00, '2024-04-20', 'bank_transfer', 1),
(2, 4, 2024, 1200.00, 450.00, 250.00, 1900.00, '2024-04-21', 'cash', 1),
(3, 4, 2024, 2500.00, 800.00, 500.00, 3800.00, '2024-04-22', 'bank_transfer', 1),
(6, 4, 2024, 2800.00, 700.00, 350.00, 3850.00, '2024-04-23', 'bank_transfer', 1),
(7, 4, 2024, 2200.00, 600.00, 300.00, 3100.00, '2024-04-24', 'cash', 1);

-- May 2024
INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
(8, 5, 2024, 1800.00, 500.00, 200.00, 2500.00, '2024-05-15', 'mobile_money', 1),
(9, 5, 2024, 2000.00, 550.00, 250.00, 2800.00, '2024-05-16', 'bank_transfer', 1),
(10, 5, 2024, 1600.00, 450.00, 200.00, 2250.00, '2024-05-17', 'cash', 1),
(11, 5, 2024, 3000.00, 800.00, 400.00, 4200.00, '2024-05-18', 'bank_transfer', 1),
(12, 5, 2024, 1000.00, 350.00, 150.00, 1500.00, '2024-05-19', 'cash', 1),
(1, 5, 2024, 800.00, 400.00, 250.00, 1450.00, '2024-05-20', 'bank_transfer', 1),
(2, 5, 2024, 1200.00, 500.00, 300.00, 2000.00, '2024-05-21', 'cash', 1),
(3, 5, 2024, 2500.00, 900.00, 600.00, 4000.00, '2024-05-22', 'bank_transfer', 1),
(4, 5, 2024, 1500.00, 550.00, 300.00, 2350.00, '2024-05-23', 'mobile_money', 1),
(5, 5, 2024, 3500.00, 1100.00, 600.00, 5200.00, '2024-05-24', 'bank_transfer', 1);

-- June 2024
INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
(6, 6, 2024, 2800.00, 750.00, 400.00, 3950.00, '2024-06-15', 'bank_transfer', 1),
(7, 6, 2024, 2200.00, 650.00, 350.00, 3200.00, '2024-06-16', 'cash', 1),
(13, 6, 2024, 4500.00, 1300.00, 700.00, 6500.00, '2024-06-17', 'bank_transfer', 1),
(14, 6, 2024, 1900.00, 500.00, 250.00, 2650.00, '2024-06-18', 'mobile_money', 1),
(15, 6, 2024, 2400.00, 650.00, 300.00, 3350.00, '2024-06-19', 'bank_transfer', 1),
(8, 6, 2024, 1800.00, 550.00, 250.00, 2600.00, '2024-06-20', 'mobile_money', 1),
(9, 6, 2024, 2000.00, 600.00, 300.00, 2900.00, '2024-06-21', 'bank_transfer', 1),
(10, 6, 2024, 1600.00, 500.00, 250.00, 2350.00, '2024-06-22', 'cash', 1),
(11, 6, 2024, 3000.00, 850.00, 450.00, 4300.00, '2024-06-23', 'bank_transfer', 1),
(12, 6, 2024, 1000.00, 400.00, 200.00, 1600.00, '2024-06-24', 'cash', 1);

-- July 2024
INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
(1, 7, 2024, 800.00, 450.00, 300.00, 1550.00, '2024-07-15', 'bank_transfer', 1),
(2, 7, 2024, 1200.00, 550.00, 350.00, 2100.00, '2024-07-16', 'cash', 1),
(3, 7, 2024, 2500.00, 1000.00, 700.00, 4200.00, '2024-07-17', 'bank_transfer', 1),
(4, 7, 2024, 1500.00, 600.00, 350.00, 2450.00, '2024-07-18', 'mobile_money', 1),
(5, 7, 2024, 3500.00, 1200.00, 700.00, 5400.00, '2024-07-19', 'bank_transfer', 1),
(6, 7, 2024, 2800.00, 800.00, 450.00, 4050.00, '2024-07-20', 'bank_transfer', 1),
(7, 7, 2024, 2200.00, 700.00, 400.00, 3300.00, '2024-07-21', 'cash', 1),
(13, 7, 2024, 4500.00, 1400.00, 800.00, 6700.00, '2024-07-22', 'bank_transfer', 1),
(14, 7, 2024, 1900.00, 550.00, 300.00, 2750.00, '2024-07-23', 'mobile_money', 1),
(15, 7, 2024, 2400.00, 700.00, 350.00, 3450.00, '2024-07-24', 'bank_transfer', 1);

-- August 2024
INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
(8, 8, 2024, 1800.00, 600.00, 300.00, 2700.00, '2024-08-15', 'mobile_money', 1),
(9, 8, 2024, 2000.00, 650.00, 350.00, 3000.00, '2024-08-16', 'bank_transfer', 1),
(10, 8, 2024, 1600.00, 550.00, 300.00, 2450.00, '2024-08-17', 'cash', 1),
(11, 8, 2024, 3000.00, 900.00, 500.00, 4400.00, '2024-08-18', 'bank_transfer', 1),
(12, 8, 2024, 1000.00, 450.00, 250.00, 1700.00, '2024-08-19', 'cash', 1),
(1, 8, 2024, 800.00, 500.00, 350.00, 1650.00, '2024-08-20', 'bank_transfer', 1),
(2, 8, 2024, 1200.00, 600.00, 400.00, 2200.00, '2024-08-21', 'cash', 1),
(3, 8, 2024, 2500.00, 1100.00, 800.00, 4400.00, '2024-08-22', 'bank_transfer', 1),
(4, 8, 2024, 1500.00, 650.00, 400.00, 2550.00, '2024-08-23', 'mobile_money', 1),
(5, 8, 2024, 3500.00, 1300.00, 800.00, 5600.00, '2024-08-24', 'bank_transfer', 1);

-- September 2024 (current month)
INSERT INTO monthly_payments (member_id, payment_month, payment_year, tithe_amount, offering_amount, special_offering, total_amount, payment_date, payment_method, recorded_by) VALUES
(6, 9, 2024, 2800.00, 850.00, 500.00, 4150.00, '2024-09-01', 'bank_transfer', 1),
(7, 9, 2024, 2200.00, 750.00, 450.00, 3400.00, '2024-09-02', 'cash', 1),
(13, 9, 2024, 4500.00, 1500.00, 900.00, 6900.00, '2024-09-03', 'bank_transfer', 1),
(14, 9, 2024, 1900.00, 600.00, 350.00, 2850.00, '2024-09-04', 'mobile_money', 1),
(15, 9, 2024, 2400.00, 750.00, 400.00, 3550.00, '2024-09-05', 'bank_transfer', 1),
(8, 9, 2024, 1800.00, 650.00, 350.00, 2800.00, '2024-09-06', 'mobile_money', 1),
(9, 9, 2024, 2000.00, 700.00, 400.00, 3100.00, '2024-09-07', 'bank_transfer', 1),
(1, 9, 2024, 800.00, 550.00, 400.00, 1750.00, '2024-09-08', 'bank_transfer', 1)
ON CONFLICT (member_id, payment_month, payment_year) DO NOTHING;