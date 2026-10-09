USE StarwarsAcademy;
DROP PROCEDURE IF EXISTS Jedi_Search;
DELIMITER //
CREATE PROCEDURE Jedi_Search(IN p_SearchTerm VARCHAR(100), IN p_PageIndex INT, IN p_PageSize INT) SQL SECURITY INVOKER
BEGIN
 DECLARE v_offset BIGINT UNSIGNED;
 IF p_PageIndex IS NULL OR p_PageIndex < 0 OR p_PageIndex > 1000000 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='invalid pageIndex'; END IF;
 IF p_PageSize IS NULL OR p_PageSize < 1 OR p_PageSize > 100 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='invalid pageSize'; END IF;
 SET v_offset=CAST(p_PageIndex AS UNSIGNED)*CAST(p_PageSize AS UNSIGNED);
 SELECT JediId,Name,JediTypeId FROM Jedi WHERE (p_SearchTerm IS NULL OR TRIM(p_SearchTerm)='' OR LOCATE(TRIM(p_SearchTerm),Name)>0) ORDER BY JediId ASC LIMIT p_PageSize OFFSET v_offset;
END//
DELIMITER ;
