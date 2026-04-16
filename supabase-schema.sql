-- AITuition Supabase Schema
-- Copy and paste this into Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro')),
  trial_start_date DATE,
  trial_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Syllabus structures
CREATE TABLE syllabus_structures (
  id BIGSERIAL PRIMARY KEY,
  board VARCHAR(50) NOT NULL,
  class_level VARCHAR(10) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  structure_name VARCHAR(255) NOT NULL,
  chapters_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_syllabus_bcs ON syllabus_structures(board, class_level, subject);

-- Study plans
CREATE TABLE study_plans (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  board VARCHAR(50) NOT NULL,
  class_level VARCHAR(10) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  child_name VARCHAR(255) NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  chapters_json JSONB NOT NULL,
  plan_data JSONB NOT NULL,
  trial_start_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily sessions
CREATE TABLE daily_sessions (
  id BIGSERIAL PRIMARY KEY,
  plan_id BIGINT NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_number SMALLINT NOT NULL,
  topic VARCHAR(500) NOT NULL,
  lecture_content TEXT,
  quiz_questions JSONB,
  quiz_answers JSONB,
  quiz_score SMALLINT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_id, day_number)
);

-- Quiz results
CREATE TABLE quiz_results (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT NOT NULL REFERENCES daily_sessions(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id BIGINT NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
  score SMALLINT NOT NULL,
  total SMALLINT DEFAULT 5,
  chapter VARCHAR(255) NOT NULL,
  weak_topics JSONB,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quiz_user ON quiz_results(user_id, taken_at);

-- Payments
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  razorpay_order_id VARCHAR(100) NOT NULL UNIQUE,
  razorpay_payment_id VARCHAR(100),
  amount_paise INTEGER NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'quarterly', 'yearly')),
  class_tier VARCHAR(20) NOT NULL,
  board VARCHAR(50) NOT NULL,
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress
CREATE TABLE user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_streak SMALLINT DEFAULT 0,
  longest_streak SMALLINT DEFAULT 0,
  total_sessions SMALLINT DEFAULT 0,
  avg_quiz_score DECIMAL(4,2),
  weekly_study_mins SMALLINT DEFAULT 0,
  last_study_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample syllabi
INSERT INTO syllabus_structures (board, class_level, subject, structure_name, chapters_json) VALUES
('CBSE', '10', 'Mathematics', 'CBSE Class 10 Maths', '["Real Numbers","Polynomials","Linear Equations in Two Variables","Quadratic Equations","Arithmetic Progressions","Triangles","Coordinate Geometry","Introduction to Trigonometry","Some Applications of Trigonometry","Circles","Areas Related to Circles","Surface Areas and Volumes","Statistics","Probability"]'),
('CBSE', '10', 'Science', 'CBSE Class 10 Science', '["Chemical Reactions and Equations","Acids Bases and Salts","Metals and Non-metals","Carbon and its Compounds","Life Processes","Control and Coordination","How do Organisms Reproduce","Heredity","Light – Reflection and Refraction","Human Eye and Colourful World","Electricity","Magnetic Effects of Electric Current","Our Environment"]'),
('CBSE', '6', 'Science', 'CBSE Class 6 Science', '["Food: Where Does It Come From?","Components of Food","Fibre to Fabric","Sorting Materials into Groups","Separation of Substances","Changes Around Us","Getting to Know Plants","Body Movements","The Living Organisms and Their Surroundings","Motion and Measurement of Distances","Light Shadows and Reflections","Electricity and Circuits","Fun with Magnets","Water","Air Around Us"]'),
('CBSE', '12', 'Physics', 'CBSE Class 12 Physics', '["Electric Charges and Fields","Electrostatic Potential and Capacitance","Current Electricity","Moving Charges and Magnetism","Magnetism and Matter","Electromagnetic Induction","Alternating Current","Electromagnetic Waves","Ray Optics and Optical Instruments","Wave Optics","Dual Nature of Radiation and Matter","Atoms","Nuclei","Semiconductor Electronics"]'),
('CBSE', '5', 'English', 'CBSE Class 5 Marigold', '["Ice-Cream Man / Wonderful Waste","Teamwork / Flying Together","My Shadow / Robinson Crusoe","Crying / My Elder Brother","The Lazy Frog / Rip Van Winkle","Class Discussion / The Talkative Barber","Topsy-Turvy Land / Gulliver''s Travels","Nobody''s Friend / The Little Bully","Sing a Song of People / Around the World","Malu Bhalu / Who Will Be Nina''s Friend"]'),
('CBSE', '9', 'Social Science', 'CBSE Class 9 SST', '["The French Revolution","Socialism in Europe and the Russian Revolution","Nazism and the Rise of Hitler","Forest Society and Colonialism","India – Size and Location","Physical Features of India","Drainage","Climate","Natural Vegetation and Wildlife","Population","What is Democracy? Why Democracy?","Constitutional Design","Electoral Politics","Working of Institutions","Democratic Rights","The Story of Village Palampur","People as Resource","Poverty as a Challenge","Food Security in India"]'),
('ICSE', '10', 'Mathematics', 'ICSE Class 10 Maths', '["Commercial Mathematics (GST Banking)","Ratio and Proportion","Factorization","Matrices","Quadratic Equations","Arithmetic Progressions","Coordinate Geometry","Similarity","Loci","Circles","Constructions","Mensuration","Trigonometry","Statistics","Probability"]'),
('CBSE', '8', 'Science', 'CBSE Class 8 Science', '["Crop Production and Management","Microorganisms","Coal and Petroleum","Combustion and Flame","Conservation of Plants and Animals","Reproduction in Animals","Reaching the Age of Adolescence","Force and Pressure","Friction","Sound","Chemical Effects of Electric Current","Some Natural Phenomena","Light"]');
