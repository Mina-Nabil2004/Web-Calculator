import { useState,useEffect } from "react";
import axios from "axios";

function Buttons(props){
    
    const binaryOperators = "+%−×÷";

    let result;

    const [expression, setExpression] = useState("0");
    
    const evaluate = async (operation) => {
        operation = operation.replaceAll("−", "-");
        operation = operation.replaceAll("×", "*");
        operation = operation.replaceAll("÷", "/");
        console.log(operation);
        /*return eval(operation).toString().replaceAll("-", "−");*/
        const response = await axios.post("http://localhost:8080/calculator/evaluate", { expression: operation });
        result = response.data.toString();
        console.log(result);
        result = result.replaceAll("-", "−");
        return result;
    }
    

    const clearAll = () => {
        props.setUpper("");
        setExpression("0");
        props.setLower("0");
    }

    const clearLower = () => {
        props.setLower("0");
        if(props.upper.charAt(props.upper.length-1) == "="){
            clearAll();
        }
        else if(props.upper == ""){
            setExpression("0");
        }
        else if(!binaryOperators.includes(expression.charAt(expression.length-1))){
            setExpression(expression.slice(0, expression.lastIndexOf(" ")));
        }
    }

    const backSpace = () => {
        if(props.lower =="Cannot divide by zero" || props.lower =="Invalid input"){
            clearAll();
        }
        else if(props.upper.charAt(props.upper.length-1) == "="){
            setExpression(props.lower);
            props.setUpper("");
        }
        else if(binaryOperators.includes(expression.charAt(expression.length-1)) || expression.charAt(expression.length-1) == "="){}
        else if(expression.length == 1 ){
            props.setLower("0");
            setExpression("0");
        }
        else if(props.lower.length == 1 || props.lower == "0."){
            props.setLower("0");
            setExpression(expression.slice(0,expression.length-2));
        }
        else if(props.lower.length == 2 && props.lower.charAt(0) == "−" && expression.length == 2){
            props.setLower("0");
            setExpression("0");
        }
        else if(props.lower.length == 2 && props.lower.charAt(0) == "−"){
            props.setLower("0");
            setExpression(expression.slice(0,expression.length-3));
        }
        else{
            props.setLower(props.lower.slice(0,-1));
            setExpression(expression.slice(0,-1));
        }
    }

    const solve = async () => {
        if(props.lower =="Cannot divide by zero" || props.lower =="Invalid input"){}
        else if(props.upper.charAt(props.upper.indexOf(" ")+1) == "÷" && Number(props.lower) == 0.0){
                props.setLower("Cannot divide by zero");
                props.setUpper(props.upper + " 0")
                setExpression("0");
            }
        else if(props.upper.charAt(props.upper.length-1) == "="){
            let operation = expression + props.upper.slice(props.upper.indexOf(" "), props.upper.length-2);
            result = await evaluate(operation);
            props.setUpper(operation+" "+ "=");
            props.setLower(result);
            setExpression(result);
        }
        else if(props.upper.match(/ /g).length == 2){
            result = await evaluate(props.upper);
            props.setUpper(props.upper+" =")
            props.setLower(result);
            setExpression(result);
        }
        else{
            result = await evaluate(props.upper+" "+props.lower);
            props.setUpper(props.upper+" "+props.lower+" =")
            props.setLower(result);
            setExpression(result);
        }
    }
    
    const handleNumber = (number) => {
        if(props.lower =="Cannot divide by zero" || props.lower =="Invalid input"){
            if(number == "."){
                setExpression("0"+number);
                props.setLower("0"+number);
            }
            else{
                setExpression(number);
                props.setLower(number);
            }
            props.setUpper("");
        }
        else if(binaryOperators.includes(expression.charAt(expression.length-1))){
            if(number == "."){
                setExpression(expression+" "+"0"+number);
                props.setLower("0"+number);
            }
            else{
                setExpression(expression+" "+number);
                props.setLower(number);
            }
        }
        else if(props.upper.charAt(props.upper.length-1) == "="){
            props.setUpper("");
            if(number == "."){
                setExpression("0"+number);
                props.setLower("0"+number);
            }
            else{
                setExpression(number);
                props.setLower(number);
            }
        }
        else if(number == "." && (props.lower.includes("."))){}
        else if(number == "0" && props.lower == "0"){}
        else if(number != "0" && number != "." && props.lower == "0"){
            setExpression(number);
            props.setLower(number);
        }
        else{
            props.setLower(props.lower+number);
            setExpression(expression+number);
        }
    }

    const handleBinaryOperation = async (operand) => {
        if(props.lower == "Cannot divide by zero" || props.lower == "Invalid input"){}
        else if(!expression.includes(" ")){
            setExpression(expression+" "+operand);
            props.setUpper(expression+" "+operand);
        }
        else if(expression.match(/ /g).length == 1){
            setExpression(expression.slice(0,-1)+ operand);
            props.setUpper(expression.slice(0,-1)+ operand);
        }
        else{
            if(expression.charAt(expression.indexOf(" ")+1) == "÷" && Number(expression.slice(expression.lastIndexOf(" ")+1, expression.length)) == 0.0){
                props.setLower("Cannot divide by zero");
                props.setUpper(props.upper + " 0")
                setExpression("0");
            }
            else{
                result = await evaluate(expression);
                props.setUpper(result+" "+operand);
                props.setLower(result);
                setExpression(result+" "+operand);
            }
        }
    }

    const handleUnaryOperation = async (operation) => {
        if(Number(props.lower) == 0.0){
            if(operation == "1 ÷ "+props.lower){
                props.setLower("Cannot divide by zero");
                props.setUpper(props.upper +"1 ÷ "+ " 0")
                setExpression("0");
            }
        }
        else if(Number(props.lower.replaceAll("−","-")) < 0.0 && operation == "sqrt("+props.lower+")"){
            props.setLower("Invalid input");
            props.setUpper(props.upper +"sqrt("+ props.lower +")")
            setExpression("0");
        }
        else if(props.lower != "Cannot divide by zero" && props.lower != "Invalid input"){
            if(operation.charAt(0) == "−" && operation.charAt(1) == "−"){
                operation = operation.slice(2,operation.length);
            }
            result = await evaluate(operation);
            props.setLower(result);
            if(!expression.includes(" ")){
                setExpression(result);
            }
            else if(expression.match(/ /g).length == 1){
                setExpression(expression + " " + result);
            }
            else{
                setExpression(expression.slice(0,expression.lastIndexOf(" ")) + " " + result);
            }
        }
    }

    const handlepersentage = async () => {
        if(props.upper == "" || props.upper == "0"){
            props.setUpper("0");
            props.setLower("0");
            setExpression("0");
        }
        else{
            result = await evaluate(props.upper.slice(0,props.upper.length-1)+"× "+props.lower+" ÷ 100");
            setExpression(props.upper+" "+result);
            props.setLower(result);
            props.setUpper(props.upper+" "+result);
        }
    }

    const handleKeyDown = (event) => {
        switch(event.key){
            case "1":document.getElementById('num1').click();break;
            case "2":document.getElementById('num2').click();break;
            case "3":document.getElementById('num3').click();break;
            case "4":document.getElementById('num4').click();break;
            case "5":document.getElementById('num5').click();break;
            case "6":document.getElementById('num6').click();break;
            case "7":document.getElementById('num7').click();break;
            case "8":document.getElementById('num8').click();break;
            case "9":document.getElementById('num9').click();break;
            case "0":document.getElementById('num0').click();break;
            case ".":document.getElementById('num.').click();break;
            case "+":document.getElementById('op+').click();break;
            case "-":document.getElementById('op-').click();break;
            case "/":document.getElementById('op/').click();break;
            case "*":document.getElementById('op*').click();break;
            case "%":document.getElementById('op%').click();break;
            case "Enter":document.getElementById('solve').click();break;
            case "Backspace":document.getElementById('bs').click();break;
        }
    }
    
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

    return(
        <div id="enteries">
            <button id="op%" className="operator" onClick={()=>handlepersentage("%")}>%</button>
            <button className="operator" onClick={()=>clearLower()}>CE</button>
            <button className="operator" onClick={()=>clearAll()}>C</button>
            <button id="bs" className="operator" onClick={()=>backSpace()}>&#9003;</button>

            <button className="operator" onClick={()=>handleUnaryOperation("1 ÷ "+props.lower)}>⅟x</button>
            <button className="operator" onClick={()=>handleUnaryOperation(props.lower+" × "+props.lower)}>x&#178;</button>
            <button className="operator" onClick={()=>handleUnaryOperation("sqrt("+props.lower+")")}>&#8730;x</button>
            <button id="op/" className="operator" onClick={()=>handleBinaryOperation("÷")}>÷</button>

            <button id="num7" className="number" onClick={()=>handleNumber("7")}>7</button>
            <button id="num8" className="number" onClick={()=>handleNumber("8")}>8</button>
            <button id="num9" className="number" onClick={()=>handleNumber("9")}>9</button>
            <button id="op*" className="operator" onClick={()=>handleBinaryOperation("×")}>×</button>

            <button id="num4" className="number" onClick={()=>handleNumber("4")}>4</button>
            <button id="num5" className="number" onClick={()=>handleNumber("5")}>5</button>
            <button id="num6" className="number" onClick={()=>handleNumber("6")}>6</button>
            <button id="op-" className="operator" onClick={()=>handleBinaryOperation("−")}>−</button>
            
            <button id="num1" className="number" onClick={()=>handleNumber("1")}>1</button>
            <button id="num2" className="number" onClick={()=>handleNumber("2")}>2</button>
            <button id="num3" className="number" onClick={()=>handleNumber("3")}>3</button>
            <button id="op+" className="operator" onClick={()=>handleBinaryOperation("+")}>+</button>

            <button className="operator" onClick={()=>handleUnaryOperation("−"+props.lower)}>&#177;</button>
            <button id="num0" className="number" onClick={()=>handleNumber("0")}>0</button>
            <button id="num." className="number" onClick={()=>handleNumber(".")}>.</button>
            <button id="solve" className="solve" onClick={()=>solve("=")}>=</button>
        </div>
    );
}

export default Buttons