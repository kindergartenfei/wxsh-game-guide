-- 数据库：wxsh
-- CREATE DATABASE wxsh DEFAULT CHARSET utf8mb4;
-- USE wxsh;

CREATE TABLE IF NOT EXISTS pet_mutate (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    pet_name VARCHAR(50) NOT NULL COMMENT '宠物名称',
    mutate_part VARCHAR(30) NOT NULL COMMENT '变异部位',
    attack_value INT NOT NULL COMMENT '攻击数值',
    penetrate_value INT NOT NULL COMMENT '穿透数值',
    pet_year TINYINT NOT NULL COMMENT '宠物年份',
    tier VARCHAR(5) NOT NULL DEFAULT 'T1' COMMENT '档位 T1/T2/T3'
) DEFAULT CHARSET=utf8mb4;
