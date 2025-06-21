const addPatientButton = document.getElementById('addPatient');
const report = document.getElementById('report');
const btnSearch = document.getElementById('btnSearch');
const patients = []

function addPatient() {
    this.name = document.getElementById('name').value;
    this.gender = document.querySelector('input[name="gender"]:checked');
    this.age = document.getElementById('age').value;
    this.condition = document.getElementById('condition').value;

    if(this.name && this.gender && this.age && this.condition) {
        patients.push({
            name: this.name,
            gender: this.gender.value,
            age: this.age,
            condition: this.condition
        });

        resetForm();

        generateReport();
    }
}

function resetForm() {
    document.getElementById('name').value = ''
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById('age').value = ''
    document.getElementById('condition').value = ''
}

function generateReport() {
    const numPatients = patients.length;
    const conditionsCount = {
        Diabetes: 0,
        Thyroid:0,
        'High Blood Pressure':  0
    };

    const genderConditionCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            'High Blood Pressure': 0,
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            'High Blood Pressure': 0
        }
    };

    for (const patient of patients) {
        conditionsCount[patient.condition]++;
        genderConditionCount[patient.gender][patient.condition]++;
    };

    report.innerHTML = `Number of Patients: ${numPatients}<br><br>`;
    report.innerHTML = `Conditions Breakdown:<br>`;
    for(const condition in conditionsCount) {
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    for(const gender in genderConditionCount) {
        report.innerHTML += `${gender}:<br>`;
        for(const condition in genderConditionCount[gender]) {
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionCount[gender][condition]}<br>`;
        }
    }
}

addPatientButton.addEventListener('click', addPatient);

function searchCondition() {
    const input = document.getElementById('conditionInput').value;
    const resultDiv = document.getElementById('result');

    resultDiv.innerHTML = '';

    fetch('health_analysis.json')
        .then(res => res.json())
        .then(data => {
            const condition = data.conditions.find(i => i.name.toLowerCase() === input.toLowerCase());

            if(condition) {
                const symptoms = condition.symptoms.join(', ');
                const preventions = condition.prevention.join(', ');
                const treatment = condition.treatment;

                resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
                resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="${condition.name}" />`;

                resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}.</p>`;
                resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${preventions}.</p>`;
                resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}.</p>`;
            } else {
                resultDiv.innerHTML = `<h1>Condition with name ${input} not found!</h1>`;
            }
        }).catch(error => {
            console.error(error);
            resultDiv.innerHTML = `<h1>An error was encountered while fetching condition with name ${input}!</h1>`;
        })
}

btnSearch.addEventListener('click', searchCondition);