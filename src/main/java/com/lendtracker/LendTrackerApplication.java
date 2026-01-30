package com.lendtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class LendTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(LendTrackerApplication.class, args);
    }
}



















