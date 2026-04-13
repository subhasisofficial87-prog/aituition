-- AITuition.in MySQL Schema
-- Run in Hostinger phpMyAdmin on database: u803669722_u803669722_qzn
-- Character set: utf8mb4 (supports all Indian scripts + emojis)

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email              VARCHAR(255) NOT NULL UNIQUE,
  name               VARCHAR(255) NOT NULL,
  password_hash      VARCHAR(255) NOT NULL,
  subscription_tier  ENUM('free','basic','pro') NOT NULL DEFAULT 'free',
  subscription_ends  DATE NULL,
  trial_start_date   DATE NULL,
  trial_used         TINYINT(1) NOT NULL DEFAULT 0,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- SYLLABUS STRUCTURES (pre-defined chapter lists by board/class/subject)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS syllabus_structures (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  board           ENUM('CBSE','ICSE','Odia Medium') NOT NULL,
  class_level     VARCHAR(10) NOT NULL,
  subject         VARCHAR(100) NOT NULL,
  structure_name  VARCHAR(255) NOT NULL,
  chapters_json   JSON NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_bcs (board, class_level, subject)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- STUDY PLANS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_plans (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id           INT UNSIGNED NOT NULL,
  board             VARCHAR(50) NOT NULL,
  class_level       VARCHAR(10) NOT NULL,
  subject           VARCHAR(100) NOT NULL,
  child_name        VARCHAR(255) NOT NULL,
  language          VARCHAR(10) NOT NULL DEFAULT 'en',
  chapters_json     JSON NOT NULL,
  plan_data         LONGTEXT NOT NULL,
  trial_start_date  DATE NOT NULL,
  status            ENUM('active','paused','expired') NOT NULL DEFAULT 'active',
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- DAILY SESSIONS (lecture + quiz cache)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_sessions (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id          INT UNSIGNED NOT NULL,
  user_id          INT UNSIGNED NOT NULL,
  day_number       SMALLINT UNSIGNED NOT NULL,
  topic            VARCHAR(500) NOT NULL,
  lecture_content  LONGTEXT NULL,
  quiz_questions   JSON NULL,
  quiz_answers     JSON NULL,
  quiz_score       TINYINT UNSIGNED NULL,
  completed        TINYINT(1) NOT NULL DEFAULT 0,
  completed_at     DATETIME NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_plan_day (plan_id, day_number),
  FOREIGN KEY (plan_id) REFERENCES study_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_plan (user_id, plan_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- QUIZ RESULTS (for dashboard weak areas)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_results (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id  INT UNSIGNED NOT NULL,
  user_id     INT UNSIGNED NOT NULL,
  plan_id     INT UNSIGNED NOT NULL,
  score       TINYINT UNSIGNED NOT NULL,
  total       TINYINT UNSIGNED NOT NULL DEFAULT 5,
  chapter     VARCHAR(255) NOT NULL,
  weak_topics JSON NULL,
  taken_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES daily_sessions(id) ON DELETE CASCADE,
  INDEX idx_user_quiz (user_id, taken_at)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- PAYMENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id              INT UNSIGNED NOT NULL,
  razorpay_order_id    VARCHAR(100) NOT NULL UNIQUE,
  razorpay_payment_id  VARCHAR(100) NULL,
  amount_paise         INT UNSIGNED NOT NULL,
  plan_type            VARCHAR(50) NOT NULL,
  billing_period       ENUM('monthly','quarterly','yearly') NOT NULL,
  class_tier           VARCHAR(20) NOT NULL,
  board                VARCHAR(50) NOT NULL,
  status               ENUM('created','paid','failed') NOT NULL DEFAULT 'created',
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_payments (user_id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- USER PROGRESS (denormalized for fast dashboard reads)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_progress (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id             INT UNSIGNED NOT NULL UNIQUE,
  current_streak      SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  longest_streak      SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  total_sessions      SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  avg_quiz_score      DECIMAL(4,2) NULL,
  weekly_study_mins   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  last_study_date     DATE NULL,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- FULL SYLLABUS DATA
-- class_level uses group ranges: 'LKG-UKG', 'Class 1-5', 'Class 6-8', 'Class 9-12'
-- The API maps individual class selections (e.g. '5') to the correct group range.
-- ─────────────────────────────────────────────
INSERT INTO syllabus_structures (board, class_level, subject, structure_name, chapters_json) VALUES

-- ── CBSE · LKG-UKG ───────────────────────────────────────────────────────────
('CBSE','LKG-UKG','English','NCERT LKG-UKG English',
  '["Alphabet A-Z","Phonics & Sounds","Sight Words","Simple Sentences","Rhymes & Stories","Colors & Shapes"]'),

('CBSE','LKG-UKG','Hindi','NCERT LKG-UKG Hindi',
  '["स्वर & व्यंजन","सरल शब्द","कविता","चित्र पढ़ना"]'),

('CBSE','LKG-UKG','Mathematics','NCERT LKG-UKG Maths',
  '["Numbers 1-20","Pre-Number Concepts","Shapes & Patterns","Counting","Big-Small & More-Less"]'),

('CBSE','LKG-UKG','EVS','NCERT LKG-UKG EVS',
  '["My Body","My Family","Animals & Birds","Plants","Seasons & Weather"]'),

-- ── CBSE · Class 1-5 ─────────────────────────────────────────────────────────
('CBSE','Class 1-5','English','NCERT English (1-5)',
  '["Units 1-10","Grammar & Vocabulary","Comprehension","Writing Skills","Stories & Poems"]'),

('CBSE','Class 1-5','Hindi','NCERT Hindi (1-5)',
  '["पाठ 1-10","व्याकरण","लेखन कौशल","कविता"]'),

('CBSE','Class 1-5','Sanskrit','NCERT Sanskrit (1-5)',
  '["स्वर","शब्द","वाक्य","कहानियाँ"]'),

('CBSE','Class 1-5','Mathematics','NCERT Maths (1-5)',
  '["Numbers","Addition & Subtraction","Multiplication & Division","Fractions","Geometry","Measurement"]'),

('CBSE','Class 1-5','Science','NCERT Science/EVS (1-5)',
  '["Living Things","Plants","Animals","Human Body","Food & Nutrition","Water & Air","Our Earth"]'),

('CBSE','Class 1-5','Social Science','NCERT SST (1-5)',
  '["My Family","Neighbourhood","Our Country","Festivals"]'),

('CBSE','Class 1-5','Computer','Basic Computer (1-5)',
  '["Computer Parts","MS Paint","Keyboard & Mouse"]'),

('CBSE','Class 1-5','General Knowledge','GK (1-5)',
  '["India & World","Animals","Plants","Famous People"]'),

-- ── CBSE · Class 6-8 ─────────────────────────────────────────────────────────
('CBSE','Class 6-8','English','NCERT English (6-8)',
  '["Literature","Grammar","Writing Skills","Comprehension","Poetry"]'),

('CBSE','Class 6-8','Hindi','NCERT Hindi (6-8)',
  '["पाठ्यपुस्तक","व्याकरण","निबंध","कविता"]'),

('CBSE','Class 6-8','Sanskrit','NCERT Sanskrit (6-8)',
  '["श्लोक","व्याकरण","साहित्य"]'),

('CBSE','Class 6-8','Mathematics','NCERT Maths (6-8)',
  '["Integers","Fractions & Decimals","Algebra","Geometry","Mensuration","Data Handling"]'),

('CBSE','Class 6-8','Science','NCERT Science (6-8)',
  '["Food & Nutrition","Materials","Living World","Motion & Force","Light & Sound","Electricity","Environment"]'),

('CBSE','Class 6-8','Social Science','NCERT SST (6-8)',
  '["History - Our Past","Geography - Our Earth","Civics - Social & Political Life"]'),

('CBSE','Class 6-8','Computer Science','NCERT Computer (6-8)',
  '["Computer Fundamentals","MS Office","Internet","Programming Basics"]'),

('CBSE','Class 6-8','History','NCERT History (6-8)',
  '["Ancient India","Medieval India"]'),

('CBSE','Class 6-8','Geography','NCERT Geography (6-8)',
  '["Our Earth","India - Physical Features"]'),

-- ── CBSE · Class 9-12 ────────────────────────────────────────────────────────
('CBSE','Class 9-12','English','NCERT English (9-12)',
  '["Literature","Grammar","Advanced Writing","Comprehension"]'),

('CBSE','Class 9-12','Hindi','NCERT Hindi (9-12)',
  '["साहित्य","व्याकरण","निबंध"]'),

('CBSE','Class 9-12','Mathematics','NCERT Maths (9-12)',
  '["Polynomials","Coordinate Geometry","Trigonometry","Statistics","Probability"]'),

('CBSE','Class 9-12','Physics','NCERT Physics (9-12)',
  '["Motion","Force","Energy","Electricity","Magnetism","Optics"]'),

('CBSE','Class 9-12','Chemistry','NCERT Chemistry (9-12)',
  '["Atoms & Molecules","Chemical Reactions","Acids Bases Salts","Periodic Table","Organic Chemistry"]'),

('CBSE','Class 9-12','Biology','NCERT Biology (9-12)',
  '["Cell","Life Processes","Heredity","Evolution","Ecology"]'),

('CBSE','Class 9-12','History','NCERT History (9-12)',
  '["Modern India","World History","Freedom Struggle"]'),

('CBSE','Class 9-12','Geography','NCERT Geography (9-12)',
  '["Physical Geography","India - Resources & Development"]'),

('CBSE','Class 9-12','Computer Science','NCERT Computer (9-12)',
  '["Python","Data Structures","Networking"]'),

-- ── ICSE · Class 1-5 ─────────────────────────────────────────────────────────
('ICSE','Class 1-5','English','ICSE English (1-5)',
  '["Comprehension","Grammar","Composition","Literature - Stories & Poems"]'),

('ICSE','Class 1-5','Mathematics','ICSE Maths (1-5)',
  '["Numbers","Arithmetic","Geometry","Measurement"]'),

-- ── ICSE · Class 6-8 ─────────────────────────────────────────────────────────
('ICSE','Class 6-8','English','ICSE English (6-8)',
  '["Literature","Grammar","Writing","Comprehension"]'),

('ICSE','Class 6-8','History & Civics','ICSE History & Civics (6-8)',
  '["Ancient & Medieval History","Civics - Our Constitution"]'),

('ICSE','Class 6-8','Geography','ICSE Geography (6-8)',
  '["Physical Geography","India Geography"]'),

-- ── ICSE · Class 9-12 ────────────────────────────────────────────────────────
('ICSE','Class 9-12','Physics','ICSE Physics (9-12)',
  '["Motion","Force","Energy","Light","Electricity","Magnetism"]'),

('ICSE','Class 9-12','Chemistry','ICSE Chemistry (9-12)',
  '["Atomic Structure","Chemical Bonding","Acids Bases Salts","Organic Chemistry"]'),

('ICSE','Class 9-12','Biology','ICSE Biology (9-12)',
  '["Cell","Life Processes","Human Anatomy","Genetics","Ecology"]'),

('ICSE','Class 9-12','Computer Applications','ICSE Computer (9-12)',
  '["Programming","Databases","Networking"]'),

-- ── Odia Medium · LKG-UKG ────────────────────────────────────────────────────
('Odia Medium','LKG-UKG','Odia','SCERT Odisha Odia (LKG-UKG)',
  '["ଅକ୍ଷର ପରିଚୟ","ସରଳ ଶବ୍ଦ","ଛଡ଼ା ଓ ଗୀତ","ଚିତ୍ର କଥା"]'),

-- ── Odia Medium · Class 1-5 ──────────────────────────────────────────────────
('Odia Medium','Class 1-5','Odia','SCERT Odisha Odia (1-5)',
  '["ପାଠ୍ୟପୁସ୍ତକ ଅଧ୍ୟାୟ ୧-୧୦","ବ୍ୟାକରଣ","ଲେଖନ କୌଶଳ","କବିତା"]'),

('Odia Medium','Class 1-5','Hindi','SCERT Odisha Hindi (1-5)',
  '["हिंदी पाठ","व्याकरण","लेखन"]'),

-- ── Odia Medium · Class 6-12 ─────────────────────────────────────────────────
('Odia Medium','Class 6-8','Odia','SCERT Odisha Odia (6-8)',
  '["ସାହିତ୍ୟ","ବ୍ୟାକରଣ","ନିବନ୍ଧ","କବିତା ଓ ଗଳ୍ପ"]'),

('Odia Medium','Class 6-8','History','SCERT Odisha History (6-8)',
  '["ଓଡ଼ିଶା ଇତିହାସ","ଭାରତୀୟ ଇତିହାସ"]'),

('Odia Medium','Class 6-8','Geography','SCERT Odisha Geography (6-8)',
  '["ଭୂଗୋଳ","ଓଡ଼ିଶା ଭୂଗୋଳ","ଭାରତ ଭୂଗୋଳ"]'),

('Odia Medium','Class 6-8','Science','SCERT Odisha Science (6-8)',
  '["ଜୀବନ ପ୍ରକ୍ରିୟା","ପଦାର୍ଥ","ଶକ୍ତି","ପରିବେଶ"]'),

('Odia Medium','Class 6-8','Computer','SCERT Odisha Computer (6-8)',
  '["କମ୍ପ୍ୟୁଟର ମୌଳିକ","ଇଣ୍ଟରନେଟ","ପ୍ରୋଗ୍ରାମିଙ୍ଗ"]'),

('Odia Medium','Class 9-12','Odia','SCERT Odisha Odia (9-12)',
  '["ସାହିତ୍ୟ","ବ୍ୟାକରଣ","ନିବନ୍ଧ","କବିତା ଓ ଗଳ୍ପ"]'),

('Odia Medium','Class 9-12','History','SCERT Odisha History (9-12)',
  '["ଓଡ଼ିଶା ଇତିହାସ","ଭାରତୀୟ ଇତିହାସ","ବିଶ୍ୱ ଇତିହାସ"]'),

('Odia Medium','Class 9-12','Geography','SCERT Odisha Geography (9-12)',
  '["ଭୂଗୋଳ","ଓଡ଼ିଶା ଭୂଗୋଳ","ଭାରତ ଭୂଗୋଳ"]'),

('Odia Medium','Class 9-12','Science','SCERT Odisha Science (9-12)',
  '["ଜୀବନ ପ୍ରକ୍ରିୟା","ପଦାର୍ଥ ବିଜ୍ଞାନ","ରସାୟନ ଶାସ୍ତ୍ର","ଜୀବ ବିଜ୍ଞାନ"]'),

('Odia Medium','Class 9-12','Mathematics','SCERT Odisha Mathematics (9-12)',
  '["ବୀଜଗଣିତ","ଜ୍ୟାମିତି","ତ୍ରିକୋଣମିତି","ପରିସଂଖ୍ୟାନ","ଗଣନ"]'),

('Odia Medium','Class 9-12','Computer','SCERT Odisha Computer (9-12)',
  '["କମ୍ପ୍ୟୁଟର ମୌଳିକ","ଇଣ୍ଟରନେଟ","ପ୍ରୋଗ୍ରାମିଙ୍ଗ","ଡାଟାବେସ"]');
