let activeTab = 'incident-report';
let selectedDepartment = '';

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const departmentRadios = document.querySelectorAll('.input[name="department"]');
    const selectedDepartmentLabel = document.getElementById('selected-department');
    const loadingOverlay = document.getElementById('loading-overlay');

    function showLoadingOverlay(duration) {
        loadingOverlay.classList.add('show');
        setTimeout(() => {
            loadingOverlay.classList.remove('show');
        }, duration);
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            setActiveTab(targetTab);
        });
    });

    departmentRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            selectedDepartment = event.target.value;
            selectedDepartmentLabel.textContent = `Selected Department: ${selectedDepartment}`;
        });
    });

    function setActiveTab(tab) {
        showLoadingOverlay(1000);
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tab).classList.add('active');
        activeTab = tab;
    }

    setActiveTab(activeTab); // Initialize the default active tab

    document.getElementById('submit').addEventListener('click', () => {
        const formData = getFormData();
        if (!formData) {
            console.error('One or more form inputs are missing');
            return;
        }

        console.log("Submitting form data", formData);

        fetch(`https://${GetParentResourceName()}/submitForm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            console.log('Server response status:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            console.log('Received response:', result);
            if (result.success) {
               
                closeLawEnforcementReport();
            } else {
             
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    document.getElementById('close-btn').addEventListener('click', () => {
        console.log("Closing Law Enforcement Report NUI");
        closeLawEnforcementReport();
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            closeLawEnforcementReport();
        }
    });

    // Listen for messages from the client script to open/close the NUI
    window.addEventListener('message', (event) => {
        const item = event.data;
        if (item.action === 'openLawEnforcementReport') {
            showLoadingOverlay(3000);
            document.querySelector('.container').style.display = 'flex';
        } else if (item.action === 'closeLawEnforcementReport') {
            document.querySelector('.container').style.display = 'none';
        }
    });
});

function getFormData() {
    let data = { 
        tab: activeTab,
        department: selectedDepartment 
    };

    switch (activeTab) {
        case 'incident-report':
            data.reportType = 'Officer Incident Report';
            data.date = document.getElementById('incident-date').value;
            data.officer = document.getElementById('incident-officer').value;
            data.details = document.getElementById('incident-details').value;
            break;
        case 'vehicle-report':
            data.reportType = 'Vehicle Damage / Accident Report';
            data.date = document.getElementById('vehicle-date').value;
            data.officer = document.getElementById('vehicle-officer').value;
            data.description = document.getElementById('vehicle-description').value;
            data.damage = document.getElementById('vehicle-damage').value;
            data.cause = document.getElementById('vehicle-cause').value;
            break;
        case 'scene-report':
            data.reportType = 'Scene Report';
            data.date = document.getElementById('scene-date').value;
            data.officer = document.getElementById('scene-officer').value;
            data.location = document.getElementById('scene-location').value;
            data.description = document.getElementById('scene-description').value;
            break;
        case 'warrant-request':
            data.reportType = 'Warrant Request';
            data.date = document.getElementById('warrant-date').value;
            data.officer = document.getElementById('warrant-officer').value;
            data.suspect = document.getElementById('warrant-suspect').value;
            data.reason = document.getElementById('warrant-reason').value;
            break;
        default:
            return null;
    }

    console.log("Form Data Collected: ", JSON.stringify(data, null, 2));
    return data;
}

function closeLawEnforcementReport() {
    fetch(`https://${GetParentResourceName()}/closeReport`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(() => {
        document.querySelector('.container').style.display = 'none';
        fetch(`https://${GetParentResourceName()}/releaseFocus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }).catch(error => {
        console.error('Error:', error);
    });
}
