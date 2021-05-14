USE emp_trackerDB;

INSERT INTO department (id, name)
VALUES
(000, "CEO"),
(100, "Marketing"),
(200, "Sales"),
(300, "Accounting"),
(400, "IT"),
(500, "HR");

INSERT INTO role (title, salary, id, department_id)
VALUES
("CEO", 350000, 001, 000),
("Marketing Manager", 100000, 101, 100),
("Marketing Assistant", 50000, 102, 100),
("Sales Manager", 150000, 201, 200),
("Sales Representative", 80000, 202, 200),
("Account Manager", 85000, 301, 300),
("Account Assistant", 45000, 302, 300),
("IT Manager", 90000, 401, 400),
("Tech Support", 55000, 402, 400),
("Developer", 110000, 403, 400),
("Human Resources", 96000, 501, 500);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
("Anastasia", "Sorkin", 001, Null),
("Sky", "Tyler", 102, 2),
("Sam", "Edwards", 202, 4),
("Olivia", "Moore", 101, 2),
("Adrian", "Marshal", 201, 4),
("Maria", "Stark", 302, 5),
("Alexander", "Smith", 403, 8),
("Emmy", "LeBlanc", 401, 8),
("Oliver", "Johnson", 402, 9),
("Amanda", "Mirucci", 501, 10),
("Mathew", "Lewinski", 301, 5);