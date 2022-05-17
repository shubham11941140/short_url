DROP PROCEDURE IF EXISTS insertRowsTostudent_data;
DELIMITER //
CREATE PROCEDURE insertRowsTostudent_data()
BEGIN
DECLARE i INT DEFAULT 0;
DECLARE j INT DEFAULT 0;
WHILE (i <= 9) DO
	SET j = 0;
    WHILE (j <= 9) DO
		INSERT INTO mapper (url, shortenedurl) values
        (concat("http://google.com/", cast(j as char), "_", cast(i as char)), concat(cast(i as char), "_", cast(j as char)));
        SET j = j + 1;
	END WHILE;
    SET i = i+1;
END WHILE;
END //

DELIMITER ;
call insertRowsTostudent_data;