USE emp_trackerDB;

INSERT INTO department (name)
VALUES
("Marketing"),
("Sales"),
("Accounting"),
("IT"),
("HR")

INSERT INTO role (title, salary, department_id)
VALUES
("CEO", 350000, Null),
("Marketing Manager", 100000, 1),
("Marketing Assistant", 50000, 1),
("Sales Manager", 150000, 2),
("Sales Representative", 80000, 2),
("Account Manager", 85000, 3),
("Account Assistant", 45000, 3),
("IT Manager", 90000, 4),
("Tech Support", 55000, 4),
("Developer", 110000, 4),
("Human Resources", 96000, 5)

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
("Anastasia", "Sorkin", 1, Null),
("Sky", "Tyler", 1, 2),
("Sam", "Edwards", 2, 4),
("Olivia", "Moore", 1, 2),
("Adrian", "Marshal", 2, 4),
("Maria", "Stark", 3, 5),
("Alexander", "Smith", 4, 8),
("Emmy", "LeBlanc", 4, 8),
("Oliver", "Johnson", 4, 9),
("Amanda", "Mirucci", 5, 10),
("Mathew", "Lewinski", 3, 5)