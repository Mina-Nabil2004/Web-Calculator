package com.calculator.Calculator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/calculator")
@CrossOrigin(origins = "http://localhost:5173/")
class CalculatorController {
    CalculatorService service;

    @Autowired
    public CalculatorController(CalculatorService service){
        this.service =  service;
    }

    @PostMapping(path = "/evaluate")
    public String evaluate(@RequestBody Expression expression){
        System.out.println("Received expression: " + expression.getExpression());
        return service.calculate(expression.getExpression());
    }
}