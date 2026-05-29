-- ============================================
-- 妄想山海宠物变异攻略 — 数据库完整安装脚本
-- 适用于宝塔面板一键导入
-- 数据库名：wxsh
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS wxsh DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE wxsh;

-- ============================================
-- 建表
-- ============================================
DROP TABLE IF EXISTS pet_mutate;
CREATE TABLE pet_mutate (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    pet_name VARCHAR(50) NOT NULL COMMENT '宠物名称',
    mutate_part VARCHAR(30) NOT NULL COMMENT '变异部位',
    attack_value INT NOT NULL COMMENT '攻击数值',
    penetrate_value INT NOT NULL COMMENT '穿透数值',
    pet_year TINYINT NOT NULL COMMENT '宠物年份：1-百年 2-千年 3-万年 4-三/四万年 5-五/六/七/八万年',
    tier VARCHAR(5) NOT NULL DEFAULT 'T1' COMMENT '档位：T1/T2/T3',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='宠物变异属性表';

-- 索引
ALTER TABLE pet_mutate ADD INDEX idx_part (mutate_part);
ALTER TABLE pet_mutate ADD INDEX idx_year (pet_year);
ALTER TABLE pet_mutate ADD INDEX idx_tier (tier);
ALTER TABLE pet_mutate ADD INDEX idx_attack (attack_value);

-- ============================================
-- 演示数据（共计 60+ 条，覆盖各部位/年份/档位）
-- ============================================

-- === 百年 (pet_year=1) ===
INSERT INTO pet_mutate (pet_name, mutate_part, attack_value, penetrate_value, pet_year, tier) VALUES
('丘狐', '尾巴', 372, 0, 1, 'T1'),
('龙马', '头', 372, 0, 1, 'T2'),
('蠵', '头', 302, 0, 1, 'T1'),
('驳', '角', 346, 0, 1, 'T2'),
('当康', '背部', 318, 0, 1, 'T1'),
('毕方', '翅膀', 389, 15, 1, 'T3'),
('虎头怪', '手臂', 295, 0, 1, 'T1'),
('鹿蜀', '脖子', 312, 0, 1, 'T2'),
('朱獳', '尾巴', 335, 8, 1, 'T1'),
('狰', '角', 358, 0, 1, 'T2');

-- === 千年 (pet_year=2) ===
INSERT INTO pet_mutate (pet_name, mutate_part, attack_value, penetrate_value, pet_year, tier) VALUES
('穷奇', '尾巴', 579, 0, 2, 'T2'),
('饕餮', '头', 579, 0, 2, 'T2'),
('比翼鸟', '翅膀', 579, 0, 2, 'T1'),
('混沌', '角', 612, 22, 2, 'T3'),
('梼杌', '背部', 548, 0, 2, 'T2'),
('九尾狐', '尾巴', 635, 18, 2, 'T3'),
('应龙', '头', 592, 0, 2, 'T2'),
('蠪侄', '手臂', 515, 0, 2, 'T1'),
('朱厌', '脖子', 502, 0, 2, 'T1'),
('精卫', '翅膀', 566, 12, 2, 'T2'),
('天狗', '角', 555, 0, 2, 'T1'),
('夫诸', '背部', 528, 0, 2, 'T2');

-- === 万年 (pet_year=3) ===
INSERT INTO pet_mutate (pet_name, mutate_part, attack_value, penetrate_value, pet_year, tier) VALUES
('莽苍·穷奇', '尾巴', 762, 0, 3, 'T2'),
('莽苍·饕餮', '头', 762, 0, 3, 'T2'),
('莽苍·比翼鸟', '翅膀', 762, 0, 3, 'T2'),
('飒踏·鷏', '角', 689, 0, 3, 'T1'),
('飞廉·蛊雕', '背部', 735, 25, 3, 'T3'),
('冲炎·海星', '手臂', 692, 0, 3, 'T1'),
('凌铄·寄居鳌蟹', '脖子', 698, 0, 3, 'T1'),
('魅煌·九尾狐', '尾巴', 856, 30, 3, 'T3'),
('忱心·比翼鸟', '翅膀', 724, 0, 3, 'T2'),
('青荧·毕方', '角', 711, 16, 3, 'T2'),
('迷蛊·朱獳', '背', 672, 0, 3, 'T1'),
('霹煞·应龙', '头', 745, 0, 3, 'T2');

-- === 三/四万年 (pet_year=4) ===
INSERT INTO pet_mutate (pet_name, mutate_part, attack_value, penetrate_value, pet_year, tier) VALUES
('魅煌·穷奇', '尾巴', 912, 0, 4, 'T2'),
('魅煌·饕餮', '头', 912, 0, 4, 'T2'),
('飒踏·穷奇', '尾巴', 856, 0, 4, 'T1'),
('飒踏·饕餮', '头', 856, 0, 4, 'T1'),
('莽苍·混沌', '角', 978, 42, 4, 'T3'),
('忱心·九尾狐', '尾巴', 935, 28, 4, 'T3'),
('飞廉·比翼鸟', '翅膀', 885, 0, 4, 'T2'),
('冲炎·蛊雕', '背部', 862, 18, 4, 'T2'),
('凌铄·天狗', '角', 845, 0, 4, 'T1'),
('青荧·朱厌', '脖子', 832, 12, 4, 'T1'),
('霹煞·蠪侄', '手臂', 878, 0, 4, 'T2'),
('雳煞·精卫', '翅膀', 895, 22, 4, 'T3');

-- === 五/六/七/八万年 (pet_year=5) ===
INSERT INTO pet_mutate (pet_name, mutate_part, attack_value, penetrate_value, pet_year, tier) VALUES
('魅煌·穷奇', '尾巴', 1156, 0, 5, 'T2'),
('魅煌·饕餮', '头', 1156, 0, 5, 'T2'),
('帝江·穷奇', '尾巴', 1235, 52, 5, 'T3'),
('帝江·饕餮', '头', 1235, 52, 5, 'T3'),
('玄煞·混沌', '角', 1189, 45, 5, 'T3'),
('乘黄·比翼鸟', '翅膀', 1098, 0, 5, 'T2'),
('绵寿·九尾狐', '尾巴', 1278, 58, 5, 'T3'),
('并封·蛊雕', '背部', 1067, 32, 5, 'T2'),
('睚眦·应龙', '头', 1123, 0, 5, 'T2'),
('螭吻·夫诸', '背部', 1045, 28, 5, 'T1'),
('嘲风·天狗', '角', 1056, 0, 5, 'T1'),
('狻猊·朱厌', '脖子', 1032, 18, 5, 'T1'),
('飒踏·穷奇', '尾巴', 1023, 0, 5, 'T1'),
('飒踏·饕餮', '头', 1023, 0, 5, 'T1'),
('莽苍·应龙', '头', 1089, 35, 5, 'T2'),
('凌铄·精卫', '翅膀', 1078, 0, 5, 'T2'),
('冲炎·蠪侄', '手臂', 998, 0, 5, 'T1'),
('青荧·鹿蜀', '脖子', 965, 0, 5, 'T1'),
('霹煞·狰', '角', 1012, 22, 5, 'T1'),
('雳煞·毕方', '翅膀', 1045, 0, 5, 'T2');

-- ============================================
-- 导入完成
-- ============================================
SELECT COUNT(*) AS total_records FROM pet_mutate;
SELECT mutate_part AS '部位', COUNT(*) AS '数量' FROM pet_mutate GROUP BY mutate_part ORDER BY COUNT(*) DESC;
SELECT pet_year AS '年份', COUNT(*) AS '数量' FROM pet_mutate GROUP BY pet_year ORDER BY pet_year;
SELECT tier AS '档位', COUNT(*) AS '数量' FROM pet_mutate GROUP BY tier ORDER BY tier;
