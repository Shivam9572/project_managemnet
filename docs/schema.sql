CREATE DATABASE IF NOT EXISTS project_management;
USE project_management;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'member') NOT NULL DEFAULT 'member',
  createdat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  ownerid INT UNSIGNED NOT NULL,
  createdat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_owner FOREIGN KEY (ownerid) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_projects_ownerid (ownerid),
  INDEX idx_projects_name (name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS projectmembers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  projectid INT UNSIGNED NOT NULL,
  userid INT UNSIGNED NOT NULL,
  role ENUM('admin', 'member') NOT NULL DEFAULT 'member',
  createdat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projectmembers_project FOREIGN KEY (projectid) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_projectmembers_user FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_projectmembers_project_user (projectid, userid),
  INDEX idx_projectmembers_userid (userid)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  projectid INT UNSIGNED NOT NULL,
  assignedto INT UNSIGNED NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  status ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  duedate DATE NULL,
  createdat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_project FOREIGN KEY (projectid) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_tasks_assignee FOREIGN KEY (assignedto) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tasks_projectid (projectid),
  INDEX idx_tasks_assignedto (assignedto),
  INDEX idx_tasks_status (status),
  INDEX idx_tasks_duedate (duedate)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS taskcomments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  taskid INT UNSIGNED NOT NULL,
  userid INT UNSIGNED NOT NULL,
  comment TEXT NOT NULL,
  createdat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_taskcomments_task FOREIGN KEY (taskid) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_taskcomments_user FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_taskcomments_taskid (taskid),
  INDEX idx_taskcomments_userid (userid)
) ENGINE=InnoDB;
