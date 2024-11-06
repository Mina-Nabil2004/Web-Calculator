
function Display(props){
    return(
        <div id="display">
            <div id="upper">{props.upper}</div>
            <div id="lower">{props.lower}</div>
        </div>
    );
}

export default Display