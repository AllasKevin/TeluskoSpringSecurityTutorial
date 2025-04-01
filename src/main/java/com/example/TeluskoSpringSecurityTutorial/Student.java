package com.example.TeluskoSpringSecurityTutorial;

public class Student {
    private int id;
    private String name;
    private String grades;

    public Student(int id, String name, String grades) {
        this.id = id;
        this.name = name;
        this.grades = grades;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", grades='" + grades + '\'' +
                '}';
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGrades() {
        return grades;
    }

    public void setGrades(String grades) {
        this.grades = grades;
    }
}
