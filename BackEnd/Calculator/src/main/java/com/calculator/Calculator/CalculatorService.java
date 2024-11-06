package com.calculator.Calculator;

import net.objecthunter.exp4j.ExpressionBuilder;
import org.springframework.stereotype.Service;

@Service
public class CalculatorService {
    public String calculate(String expression){
        return String.valueOf(new ExpressionBuilder(expression).build().evaluate());
    }
}