"use strict";

const csatGoalA = document.getElementById('csatGoalA');
const csatGoalB = document.getElementById('csatGoalB');
const csatGoalC = document.getElementById('csatGoalC');
const irGoalA = document.getElementById('irGoalA');
const irGoalB = document.getElementById('irGoalB');
const irGoalC = document.getElementById('irGoalC');
const surveyCountInput = document.getElementById('surveyCount');
const currentCSATInput = document.getElementById('currentCSAT');
const currentIRInput= document.getElementById('currentIR')
const hiddenMsg = document.getElementById('hiddenMsg');


//Getting both table
const csatTable = document.getElementById('csatTable');
const irTable = document.getElementById('irTable');

const calcBtt = document.getElementById('calculateBtt');


calcBtt.addEventListener('click', function(){

    console.log(typeof surveyCountInput.value)

    if(surveyCountInput.value != "" && currentCSATInput.value != "" && currentIRInput.value != ""){
        let csat = parseFloat(currentCSATInput.value);
        let ir = parseFloat(currentIRInput.value);
        let results = new Array();

        if(!((csat > 100 || csat < 0) || (ir > 100 || ir < 0))){
            let totalSurveys= parseInt(surveyCountInput.value);

            //Calculate CSAT and Adding the results to the CSAT table
            results = calculateSurveyNeeded(1, totalSurveys, csat)
            generateTableBody(csatTable, 1, results);

            //Calculate IR Adding the results to the IR table
            results = calculateSurveyNeeded(0, totalSurveys, ir)
            generateTableBody(irTable, 0, results)
        }
        else{
            hiddenMsg.innerText = 'CSAT or IR out of the limit';
        }
    }
    else{
        hiddenMsg.innerText = 'Please fill all the field first!';
    }

})


function calculateSurveyNeeded(calcType, totalSurveys, percInput){

    let msgType = "";
    let foundA = false;
    let foundB = false;
    let foundC = false;
    let result = new Array(0, 0, 0);

    // If calcType == 1 we need calculate surveys needed to get on goal on CSAT.
    // In case we get calcType == 0 we calculate the IR one.
    if(calcType === 1){
        var goalA = csatGoalA.value;
        var goalB = csatGoalB.value;
        var goalC = csatGoalC.value;

        msgType = 'CSAT';

    } else if(calcType === 0){
        var goalA = irGoalA.value;
        var goalB = irGoalB.value;
        var goalC = irGoalC.value;
        
        msgType = 'IR';
    }

    let goodSurveys = getGoodSurveys(totalSurveys, percInput)
    
    let currentCalc = percInput;
    let counter = 0;

    while(currentCalc < goalA){

        if(currentCalc >= goalC && !foundC){
            foundC = true;
            result[0] = counter;
            console.log('Reach Category C')
        }

        if(currentCalc >= goalB && !foundB){
            foundB = true;
            result[1] = counter;
            console.log('Reach Category B ')
        }

        counter += 1;
        goodSurveys += 1;
        totalSurveys += 1;

        currentCalc = (goodSurveys / totalSurveys) * 100;

        console.log((currentCalc).toFixed(2));
    }

    if(currentCalc >= goalA && !foundA){
        foundA = true;
        result[2] = counter;
        console.log('Reach Category A ')
    }

    

    return result;
}

function getGoodSurveys(surveys, perc){
    return Math.round((surveys * perc) / 100);
}

function generateTableBody(tb, tbType, results){
    var tbName = tbType == 1 ? "CSAT" : "IR";

    let tableOutput = '<thead><tr><th colspan="3" class="tableName"> '+ tbName+  ' Surveys needed</th></tr>';
    tableOutput += '<tr><th>Category C</th><th>Category B</th><th>Category A</th></tr></thead>'

    tableOutput += "<tbody>"
    tableOutput += '<tr>';
    for(var i = 0; i < results.length; i++){

        tableOutput += '<td class="tableData">';
        if(results[i] == 0){
            tableOutput += 'Reached'
        } else {
            tableOutput += results[i];
        }
        
        tableOutput += "</td>";

    }
    tableOutput += "</tr>";
    tableOutput += "</tbody>"
    tb.innerHTML = tableOutput;
}


